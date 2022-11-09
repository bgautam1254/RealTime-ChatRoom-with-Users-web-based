
// Import express
const express = require('express')
const app = express()

// static files location eg CSS,logo,script,
app.use(express.static(__dirname + '/public'))

// Chat page setup 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});


// Server
const http = require('http').Server(app);
const PORT = process.env.PORT || 8000;
http.listen(PORT, console.log(`Server started at on port ${PORT}, visit--> http://localhost:${PORT}/`));




const users = {};
// socket
const io = require('socket.io')(http)

// It will look out for every connection
io.on('connection', (socket) => {
    console.log('Connected...')

    // if someone joins chat room then
    socket.on('newUser', (newUser) => {
        socket.broadcast.emit('joinsChat', newUser);
        console.log("User joined: ", newUser)
        users[socket.id] = newUser;

    });

    socket.on('messageToServer', (userTypedMessage) => {
        // it will send message to all connected users
        socket.broadcast.emit('messageToAllClients', userTypedMessage);
    });

    // if someone leaves chat room then
    socket.on('disconnect', (reason) => {
        socket.broadcast.emit('leftChat', users[socket.id]);
        console.log("User left: ", users[socket.id])
        delete users[socket.id]
    });



})




