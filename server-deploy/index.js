/**
 * Co-Stream Signaling Server
 * WebRTC signaling server for real-time peer connections
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'CoStream Signaling Server',
    timestamp: new Date().toISOString(),
    connections: io.sockets.sockets.size
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : '*', // In production, set ALLOWED_ORIGINS env variable
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Track active rooms
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    console.log(`🚪 User ${socket.id} attempting to join room ${roomId}`);
    
    const room = io.sockets.adapter.rooms.get(roomId);
    
    // Limit room to 2 users
    if (room && room.size >= 2) {
      socket.emit('room-full', { roomId });
      console.log(`❌ Room ${roomId} is full`);
      return;
    }
    
    socket.join(roomId);
    
    // Track room info
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        created: new Date(),
        users: []
      });
    }
    rooms.get(roomId).users.push(socket.id);
    
    console.log(`✅ User ${socket.id} joined room ${roomId}. Total in room: ${room ? room.size + 1 : 1}`);

    // Notify others in the room
    socket.to(roomId).emit('user-connected', socket.id);
    
    // Send room info back to the user
    socket.emit('joined-room', { 
      roomId, 
      userId: socket.id,
      peersInRoom: room ? room.size : 1
    });
  });

  socket.on('signal', (data) => {
    console.log(`📡 Relaying signal (${data.type}) in room ${data.roomId}`);
    // Relay signal data (offer, answer, candidate) to others in the room
    socket.to(data.roomId).emit('signal', data);
  });

  socket.on('leave-room', (roomId) => {
    console.log(`👋 User ${socket.id} leaving room ${roomId}`);
    socket.leave(roomId);
    socket.to(roomId).emit('user-disconnected', socket.id);
    
    // Cleanup room tracking
    if (rooms.has(roomId)) {
      const roomInfo = rooms.get(roomId);
      roomInfo.users = roomInfo.users.filter(id => id !== socket.id);
      if (roomInfo.users.length === 0) {
        rooms.delete(roomId);
        console.log(`🗑️  Room ${roomId} deleted (empty)`);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    
    // Notify all rooms this user was in
    rooms.forEach((roomInfo, roomId) => {
      if (roomInfo.users.includes(socket.id)) {
        socket.to(roomId).emit('user-disconnected', socket.id);
        roomInfo.users = roomInfo.users.filter(id => id !== socket.id);
        if (roomInfo.users.length === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   🎬 CoStream Signaling Server                      ║
║                                                      ║
║   Status: Running                                    ║
║   Port: ${PORT}                                         ║
║   Time: ${new Date().toLocaleString()}              ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
