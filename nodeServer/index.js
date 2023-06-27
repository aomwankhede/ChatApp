const { Socket } = require('socket.io');

//Node Server which will handle socket io connections
const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket => {
    //If any new users joins,let other user connected to the others
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });
    
    //If someone sends a message ,broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    // If someone leaves,let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
});
