var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));

var oldmsg = ''
io.on('connection', function (socket) {
    console.log(io.eio.clientsCount)
    socket.on('join', function (roomID) {
        socket.join(roomID);
        console.log(io.eio.clientsCount)
        console.log(`someone entered room -> #${roomID}`);
    });
    socket.on('disconnect', (reason) => {
        console.log(reason)
        socket.disconnect()
        console.log(io.eio.clientsCount)
      });

    socket.on('message', function (msg) {
            roomID = msg.roomID
            console.log(`msg:${JSON.stringify(msg)} oldmsg:${JSON.stringify(oldmsg)} ${msg!==oldmsg}`)
            io.to(roomID).emit('message', msg.message);
            oldmsg = msg
    });
});

