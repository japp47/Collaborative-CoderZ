'use strict';

var socketIO = require('socket.io');
var ot = require('ot');
var roomList = {};
var Task = require('./models/task');
module.exports = function(server) {
  var str = 'This is a Markdown heading \n\n' +
            'var i = i + 1;';

  var io = socketIO(server);
  io.on('connection', function(socket) {
    socket.on('joinRoom', function(data) {
      if (!roomList[data.room]) {
        var socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, async function(socket, cb) {
          var self = this;
          try {
              await Task.findByIdAndUpdate(data.room, {content: self.document});
              cb(true);
          } catch (err) {
              cb(false);
          }
      });
      
        roomList[data.room] = socketIOServer;
      }
      roomList[data.room].addClient(socket);
      roomList[data.room].setName(socket, data.username);

      socket.room = data.room;
      socket.join(data.room);
    });

    socket.on('chatMessage', function(data) {
      io.to(socket.room).emit('chatMessage', data);
    });

    socket.on('disconnect', function() {
      socket.leave(socket.room);
    });
  })
}
