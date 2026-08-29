import { Server } from 'socket.io';

export function liveRerouteSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('subscribe_trip', (tripId) => {
      socket.join(`trip:${tripId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  export function emitReroute(tripId, newRoute) {
    io.to(`trip:${tripId}`).emit('AUTO_REROUTE_EVENT', { newRoute, timestamp: Date.now() });
  }
}
