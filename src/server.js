const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const debug = require('debug')('app:server');

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

    const roomKey = socket.handshake.query.key;

    if (roomKey) {
        socket.join(roomKey);
        console.log(`Socket ${socket.id} se unió a la sala: ${roomKey}`);
    } else {
        console.log(`Socket ${socket.id} conectado sin una key de sala.`);
    }

    socket.on('send_message', (data) => {
        debug(`Message received from ${socket.id}: ${JSON.stringify(data)}`);
        io.to(roomKey).emit('receive_message', data);
    });
    socket.on('matchDetails', (data) => {
        debug(`matchDetails received from ${socket.id}: ${JSON.stringify(data)}`);
        io.to(roomKey).emit('matchDetails', data);
    });

    socket.on('matchData', (data) => {
        debug(`matchData received from ${socket.id}: ${JSON.stringify(data)}`);
        io.to(roomKey).emit('matchData', data);
    });

    socket.on('updateConfig', (data) => {
        debug(`updateConfig received from ${socket.id}: ${JSON.stringify(data)}`);
        io.to(roomKey).emit('updateConfig', data);
    });

    socket.on('reload', (data) => {
        debug(`reload received from ${socket.id}: ${JSON.stringify(data)}`);
        io.to(roomKey).emit('reload', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 