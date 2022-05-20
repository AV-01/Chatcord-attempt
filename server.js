const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'Server Bot';

// Run when client connects
io.on('connection', socket => {
    console.log(socket.id + ' has joined the chat.');

    socket.emit('message', formatMessage(botName,'Welcome to ChatCord!'));
    socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'));

    //Runs when client disconnects
    socket.on('disconnect', () => {
        console.log(socket.id + ' has left.')
        io.emit('message', formatMessage(botName,'A user has left the chat'));
    });

    //io.emit() will send a message to everyone

    //Listen for chat message:
    socket.on('chatMessage', (msg) =>{
        io.emit('message', formatMessage('USER', msg));
        console.log("USER: "+msg)
    })

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log('Server running on port '+ PORT));