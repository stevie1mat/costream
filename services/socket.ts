import { io, Socket } from 'socket.io-client';

// NOTE: In a real deployment, this URL should point to your backend server.
// For this demo to work 'functionally' with the provided server.js, 
// ensure the server is running on localhost:3001.
// If no server is running, the app will stay in "Connecting..." state.
const SIGNALING_SERVER_URL = 'http://localhost:3001';

export const socket: Socket = io(SIGNALING_SERVER_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
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
