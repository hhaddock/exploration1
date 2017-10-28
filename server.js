var express = require('express');
var app = express();
var server = require('http').Server(app);
var db = require('./app/js/connection');

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/app/css'));
app.use(express.static(__dirname + '/app/js'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/app/index.html'));
});

server.listen(1234, function(){
 console.log("Listening on port 8888");
});

var io = require('socket.io').listen(server);

server.lastUserID = 0; //used to keep track of users

io.on('connection', function(socket){
  console.log("a user has connected!");

  process.on('uncaughtException', function (err) {
    console.log(err);
    socket.emit('kick', "true");
  });

  socket.on('checkUser', function(user){
    var sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [user], function(err, res, fields){
      if (err) return console.log(err);
      if(res[0].username == user){
        socket.emit('checkUser', res[0]);
      }
    });
  });

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
    var sql = 'INSERT INTO chatLogs SET ?';
    var values = {user: user, message: msg};

    db.query(sql, values, function(err, res, fields){
      if (err) return console.log(err);
      console.log(res);
    });
    io.emit('sendMessage', user, msg);
  });

  socket.on('test', function(user){
    console.log("test");
  });

  socket.on('disconnect', function(){
    console.log(socket.user)
    var sql = 'UPDATE users SET auth = 0 WHERE username = ?;';
    db.query(sql, [socket.user.username], function(err, res, fields){
      if (err) return console.log(err);
      console.log(res);
    });
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
