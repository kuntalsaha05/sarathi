"""
vrptw_solver.py

Time-Dependent Vehicle Routing Problem with Soft Time Windows (TD-VRPTW),
specialized to the single-tourist / single-day itinerary case.
Supports Google OR-Tools as primary solver with a pure-Python heuristic
fallback to ensure flawless zero-crash execution across any OS environment.
"""

from dataclasses import dataclass, field
import logging

logger = logging.getLogger("sarathi.solver")

try:
    from ortools.constraint_solver import pywrapcp, routing_enums_pb2
    ORTOOLS_AVAILABLE = True
except Exception as e:
    logger.warning(f"Google OR-Tools not available natively ({e}). Using heuristic TD-VRPTW solver.")
    ORTOOLS_AVAILABLE = False

# Solver-wide tuning constants
LATE_ARRIVAL_PENALTY_PER_MINUTE = 50
MAX_SOLVE_SECONDS = 8
DEFAULT_START_TIME_MINUTES = 9 * 60    # 09:00


@dataclass
class POINode:
    id: str
    name: str
    visit_minutes: int
    open_minute: int          # minutes from midnight
    close_minute: int         # minutes from midnight
    crowd_penalty: int = 0    # 0-100, higher = more crowded / less desirable at this hour
    priority: int = 1         # 1 (nice-to-have) .. 5 (must-see) — drives drop penalty


@dataclass
class TripConstraints:
    start_minute: int = DEFAULT_START_TIME_MINUTES
    max_trip_minutes: int = 10 * 60       # 10-hour touring day cap
    max_stops: int | None = None


@dataclass
class SolveResult:
    ordered_stops: list[dict] = field(default_factory=list)
    dropped_stops: list[str] = field(default_factory=list)
    total_travel_minutes: float = 0.0
    total_distance_km: float = 0.0
    status: str = "unknown"


def _minutes_to_hhmm(total_minutes: int) -> str:
    total_minutes = max(0, total_minutes)
    h = (total_minutes // 60) % 24
    m = total_minutes % 60
    return f"{h:02d}:{m:02d}"


def _solve_heuristic_vrptw(
    nodes: list[POINode],
    duration_matrix: list[list[float]],
    distance_matrix: list[list[float]],
    constraints: TripConstraints,
) -> SolveResult:
    """Heuristic TD-VRPTW solver (Greedy Insertion with Soft Time Windows & Crowd Penalty)
    used as a zero-dependency fallback."""
    result = SolveResult(status="feasible_heuristic")
    current_time = constraints.start_minute
    current_node = 0  # depot
    remaining_nodes = list(range(len(nodes)))
    visited = []
    total_distance_m = 0.0

    while remaining_nodes:
        best_candidate = None
        best_score = float('inf')
        best_arrival = 0
        best_dist = 0

        for idx in remaining_nodes:
            node_idx = idx + 1
            node = nodes[idx]
            travel_mins = duration_matrix[current_node][node_idx] / 60.0
            dist_m = distance_matrix[current_node][node_idx]
            arrival = current_time + travel_mins

            # Wait if arriving before opening
            effective_arrival = max(arrival, node.open_minute)
            depart = effective_arrival + node.visit_minutes

            # Check if exceeds total day budget
            if (depart - constraints.start_minute) > constraints.max_trip_minutes:
                continue

            # Calculate penalties
            lateness = max(0, effective_arrival - node.close_minute)
            crowd_cost = node.crowd_penalty * 3.0
            priority_discount = (node.priority - 1) * 20.0
            score = travel_mins + lateness * 2.0 + crowd_cost - priority_discount

            if score < best_score:
                best_score = score
                best_candidate = idx
                best_arrival = int(round(effective_arrival))
                best_dist = dist_m

        if best_candidate is None:
            break

        node = nodes[best_candidate]
        node_idx = best_candidate + 1
        result.ordered_stops.append({
            "poi_id": node.id,
            "name": node.name,
            "arrival_minute": best_arrival,
            "arrival_time": _minutes_to_hhmm(best_arrival),
            "visit_minutes": node.visit_minutes,
            "departure_minute": best_arrival + node.visit_minutes,
            "late_by_minutes": max(0, best_arrival - node.close_minute),
            "crowd_penalty": node.crowd_penalty,
        })
        current_time = best_arrival + node.visit_minutes
        total_distance_m += best_dist
        current_node = node_idx
        visited.append(best_candidate)
        remaining_nodes.remove(best_candidate)

    for idx, node in enumerate(nodes):
        if idx not in visited:
            result.dropped_stops.append(node.id)

    result.total_distance_km = round(total_distance_m / 1000.0, 2)
    if result.ordered_stops:
        travel_total = result.ordered_stops[0]["arrival_minute"] - constraints.start_minute
        for a, b in zip(result.ordered_stops, result.ordered_stops[1:]):
            travel_total += max(0, b["arrival_minute"] - a["departure_minute"])
        result.total_travel_minutes = round(travel_total, 1)

    return result


def solve_td_vrptw(
    nodes: list[POINode],
    duration_matrix: list[list[float]],
    distance_matrix: list[list[float]],
    constraints: TripConstraints,
) -> SolveResult:
    if not ORTOOLS_AVAILABLE:
        return _solve_heuristic_vrptw(nodes, duration_matrix, distance_matrix, constraints)

    try:
        n = len(nodes)
        num_locations = n + 1
        depot_index = 0

        manager = pywrapcp.RoutingIndexManager(num_locations, 1, depot_index)
        routing = pywrapcp.RoutingModel(manager)

        def duration_minutes(from_node: int, to_node: int) -> int:
            return int(round(duration_matrix[from_node][to_node] / 60.0))

        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return int(distance_matrix[from_node][to_node])

        distance_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(distance_callback_index)

        service_minutes = [0] + [node.visit_minutes for node in nodes]

        def time_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return duration_minutes(from_node, to_node) + service_minutes[from_node]

        time_callback_index = routing.RegisterTransitCallback(time_callback)

        horizon_minutes = constraints.start_minute + constraints.max_trip_minutes
        routing.AddDimension(
            time_callback_index,
            slack_max=constraints.max_trip_minutes,
            capacity=horizon_minutes,
            fix_start_cumul_to_zero=False,
            name="Time",
        )
        time_dimension = routing.GetDimensionOrDie("Time")

        start_idx = routing.Start(0)
        time_dimension.CumulVar(start_idx).SetRange(
            constraints.start_minute, constraints.start_minute + constraints.max_trip_minutes
        )

        for i, node in enumerate(nodes):
            index = manager.NodeToIndex(i + 1)
            cumul = time_dimension.CumulVar(index)
            cumul.SetRange(node.open_minute, constraints.start_minute + constraints.max_trip_minutes)
            time_dimension.SetCumulVarSoftUpperBound(
                index, node.close_minute, LATE_ARRIVAL_PENALTY_PER_MINUTE
            )

        MUST_SEE_PRIORITY = 5
        for i, node in enumerate(nodes):
            index = manager.NodeToIndex(i + 1)
            if node.priority >= MUST_SEE_PRIORITY:
                continue
            drop_penalty = (6 - node.priority) ** 3 * 400 + node.crowd_penalty * 100
            routing.AddDisjunction([index], drop_penalty)

        search_params = pywrapcp.DefaultRoutingSearchParameters()
        search_params.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_params.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_params.time_limit.FromSeconds(MAX_SOLVE_SECONDS)

        solution = routing.SolveWithParameters(search_params)

        result = SolveResult()
        if solution is None:
            return _solve_heuristic_vrptw(nodes, duration_matrix, distance_matrix, constraints)

        success_statuses = {
            routing_enums_pb2.RoutingSearchStatus.ROUTING_SUCCESS,
            routing_enums_pb2.RoutingSearchStatus.ROUTING_OPTIMAL,
        }
        result.status = "optimal" if routing.status() in success_statuses else "feasible"

        visited_node_indices = set()
        index = routing.Start(0)
        total_distance_m = 0.0
        while not routing.IsEnd(index):
            node = manager.IndexToNode(index)
            next_index = solution.Value(routing.NextVar(index))
            next_node = manager.IndexToNode(next_index)
            total_distance_m += distance_matrix[node][next_node]

            if node != depot_index:
                visited_node_indices.add(node)
                poi = nodes[node - 1]
                arrival_minute = solution.Min(time_dimension.CumulVar(index))
                result.ordered_stops.append({
                    "poi_id": poi.id,
                    "name": poi.name,
                    "arrival_minute": arrival_minute,
                    "arrival_time": _minutes_to_hhmm(arrival_minute),
                    "visit_minutes": poi.visit_minutes,
                    "departure_minute": arrival_minute + poi.visit_minutes,
                    "late_by_minutes": max(0, arrival_minute - poi.close_minute),
                    "crowd_penalty": poi.crowd_penalty,
                })
            index = next_index

        for i, node in enumerate(nodes):
            if (i + 1) not in visited_node_indices:
                result.dropped_stops.append(node.id)

        result.total_distance_km = round(total_distance_m / 1000.0, 2)
        if result.ordered_stops:
            first = result.ordered_stops[0]
            travel_total = max(0, first["arrival_minute"] - constraints.start_minute)
            for a, b in zip(result.ordered_stops, result.ordered_stops[1:]):
                travel_total += max(0, b["arrival_minute"] - a["departure_minute"])
            result.total_travel_minutes = round(travel_total, 1)

        return result
    except Exception as e:
        logger.warning(f"OR-Tools solve failed ({e}), falling back to heuristic solver.")
        return _solve_heuristic_vrptw(nodes, duration_matrix, distance_matrix, constraints)
