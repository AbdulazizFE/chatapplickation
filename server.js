const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for messages
  socket.on('chat message', (data) => {
    // Get the current timestamp
    const timestamp = new Date().toLocaleTimeString();

    // Broadcast the message to all connected clients with name, message, and timestamp
    io.emit('chat message', { name: data.name, message: data.message, timestamp });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
