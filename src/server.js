const express = require('express');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Use process.env.PORT provided by Railway, default to 3005 for local testing
const PORT = process.env.PORT || 3005;
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ["http://localhost:3000", "http://localhost:3001"];


// Configure the server with CORS enabled for your React app origins
const io = new Server(server, {
    cors: {
        origin: corsOrigins, 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Listen for a custom event from a client
    socket.on('send_message', (data) => {
        console.log(`Message received from ${socket.id}: ${JSON.stringify(data)}`);
        // Broadcast the message to all other connected clients except the sender
        socket.broadcast.emit('receive_message', data); 
    });
    socket.on('matchDetails', (data) => {
        console.log(`matchDetails received from ${socket.id}: ${JSON.stringify(data)}`);
        // Broadcast the message to all other connected clients except the sender
        socket.broadcast.emit('matchDetails', data); 
    });

    socket.on('matchData', (data) => {
        console.log(`matchData received from ${socket.id}: ${JSON.stringify(data)}`);
        // Broadcast the message to all other connected clients except the sender
        socket.broadcast.emit('matchData', data); 
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 