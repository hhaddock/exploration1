var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/app/css'));
app.use(express.static(__dirname + '/app/js'));

app.get('/', function(req, res){
  console.log(req.query.auth);
  res.sendFile(path.join(__dirname + '/app/index.html'));
});

server.listen(1234, function(){
 console.log("Listening on port 8888");
});

var io = require('socket.io').listen(server);

server.lastUserID = 0; //used to keep track of users

io.on('connection', function(socket){
  console.log("a user has connected!");

  socket.on('newUser', function(user){
    socket.user = {
      id: server.lastUserID++,
      username: user
    };
    //Get all users in the room for new user
    socket.emit('allUsers', getConnectedClients());
    //Give all other users the new user
    socket.broadcast.emit('newUser', socket.user);
  });

  socket.on('sendMessage', function(user, msg){
    io.emit('sendMessage', user, msg);
  });

  socket.on('test', function(user){
    console.log("test");
  });

  socket.on('disconnect', function(){
    console.log(socket.user)
    io.emit('disconnect', socket.user);
  });
});

function getConnectedClients(){
  var users = [];
  Object.keys(io.sockets.sockets).forEach(function(id) {
    var user = io.sockets.connected[id].user;
    if(user) users.push(user);
  });
  console.log(users);
  return users;
}
