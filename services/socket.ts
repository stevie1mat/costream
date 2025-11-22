import { io, Socket } from 'socket.io-client';

// Use environment variable for signaling server URL
// In production (Vercel), set VITE_SIGNALING_SERVER_URL in your environment variables
// For local dev, it defaults to localhost:3001
const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || 'http://localhost:3001';

export const socket: Socket = io(SIGNALING_SERVER_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'], // Ensure WebSocket support
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
