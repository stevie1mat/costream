/**
 * Co-Watch Signaling Server
 * 
 * Instructions:
 * 1. Initialize a new npm project in a separate folder: `npm init -y`
 * 2. Install dependencies: `npm install express socket.io cors`
 * 3. Copy this content into `index.js`
 * 4. Run: `node index.js`
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev simplicity
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room && room.size >= 2) {
       // Optional: Emit 'room-full' error
       return; 
    }
    
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Notify others in the room
    socket.to(roomId).emit('user-connected', socket.id);
  });

  socket.on('signal', (data) => {
    // Relay signal data (offer, answer, candidate) to the specific room
    // but not to the sender
    socket.to(data.roomId).emit('signal', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});