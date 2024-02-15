const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));
// Listen for user connection with room ID
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for user input of room ID
  socket.on('join room', (roomID) => {
    socket.join(roomID);
    console.log(`User joined room ${roomID}`);
  });

  // Listen for messages in a specific room
  socket.on('chat message', (data) => {
    const timestamp = new Date().toLocaleTimeString();
    // Broadcast the message to all clients in the same room
    io.to(data.roomID).emit('chat message', { name: data.name, message: data.message, timestamp });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
