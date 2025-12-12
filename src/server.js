const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const debug = require('debug')('app:server');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3005;
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ["http://localhost:3000", "http://localhost:3001"];

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
    socket.on('handshake', (data) => {
        debug(`handshake received from ${socket.id}: ${JSON.stringify(data)}`);
        io.to(roomKey).emit('handshake', data);
    });
    socket.on('handshake-response', (data) => {
        debug(`handshake-response received from ${socket.id}: ${JSON.stringify(data)}`);
        io.to(roomKey).emit('handshake-response', data);
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