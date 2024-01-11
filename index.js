const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

/* app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
}); */

app.use(express.static(`${process.cwd()}/evelocore`));

const sendMessage = (socket, data) => {
    io.emit('client-message', data);
}
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for a custom event from the client
    socket.on('server-message', (data) => {
        console.log('Received :', data);
        sendMessage(socket, data);
    })
    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
