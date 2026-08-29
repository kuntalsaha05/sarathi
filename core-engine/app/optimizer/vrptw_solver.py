from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import numpy as np


def solve_sarathi_itinerary(time_matrix, crowd_penalties, time_windows=None, service_times=None):
    """
    TD-VRPTW Solver for Project SARATHI.
    Computes optimal multi-day/multi-stop tourist itinerary with crowd mitigation.
    
    Args:
        time_matrix: 2D array of travel times between nodes
        crowd_penalties: 1D array of penalty weights per node
        time_windows: list of (open_min, close_min) per node
        service_times: list of dwell times in minutes per node
    """
    num_nodes = len(time_matrix)
    if time_windows is None:
        time_windows = [(0, 720) for _ in range(num_nodes)]
    if service_times is None:
        service_times = [0] * num_nodes

    manager = pywrapcp.RoutingIndexManager(num_nodes, 1, 0)
    routing = pywrapcp.RoutingModel(manager)

    def time_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        travel_time = int(time_matrix[from_node][to_node])
        dwell_time = int(service_times[from_node])
        penalty = int(crowd_penalties[to_node])
        return travel_time + dwell_time + penalty

    transit_callback_index = routing.RegisterTransitCallback(time_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    time_dimension_name = 'Time'
    routing.AddDimension(
        transit_callback_index,
        60,
        720,
        False,
        time_dimension_name
    )
    time_dimension = routing.GetDimensionOrDie(time_dimension_name)

    for location_idx, time_window in enumerate(time_windows):
        index = manager.NodeToIndex(location_idx)
        time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])

    for node in range(1, num_nodes):
        routing.AddDisjunction([manager.NodeToIndex(node)], 5000)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_parameters.time_limit.FromSeconds(3)

    solution = routing.SolveWithParameters(search_parameters)

    if not solution:
        return {"status": "FAILED", "route": [], "total_time_min": 0, "alerts": ["No feasible route found within time windows"]}

    route = []
    total_time = 0
    index = routing.Start(0)
    while not routing.IsEnd(index):
        node = manager.IndexToNode(index)
        time_var = time_dimension.CumulVar(index)
        arrival = solution.Min(time_var)
        departure = arrival + service_times[node]
        route.append({
            "poi_index": node,
            "arrival_time_min": arrival,
            "departure_time_min": departure
        })
        previous_index = index
        index = solution.Value(routing.NextVar(index))
        total_time += time_matrix[manager.IndexToNode(previous_index)][manager.IndexToNode(index)]

    return {"status": "SUCCESS", "route": route, "total_time_min": total_time, "alerts": []}
