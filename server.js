const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let count = 0;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar el contador actual al nuevo cliente
    socket.emit('updateCount', count);

    // Escuchar eventos de incremento/decremento/reset
    socket.on('increment', () => {
        count = (count + 1) % 100;
        io.emit('updateCount', count);
    });

    socket.on('decrement', () => {
        count = (count - 1 + 100) % 100;
        io.emit('updateCount', count);
    });

    socket.on('reset', () => {
        count = 0;
        io.emit('updateCount', count);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto ${PORT}');
});
