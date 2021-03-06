# Web Socket Chat Room
## Exploration 1
---
#### Server connection using NodeJS
```javascript

//Getting NPM Modules
var express = require('express');
var app = express();
var server = require('http').Server(app);

//Making sure express sees these folders as static
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/app/css'));
app.use(express.static(__dirname + '/app/js'));

//Send the index file
app.get('/', function(req, res){
 res.sendFile(path.join(__dirname + '/app/index.html'));
});

//Make the server listen
server.listen(4321, function(){
 console.log("Listening on port 8888");
});

var io = require('socket.io').listen(server);
```
---
#### Socket server side programming to catch client calls
#### NOTE: This is just an example, all of the server-side code is located in Server.js
```javascript
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
   }
  });
```
#### Client.js Making calls to the server
#### This is used to interact with the web pages and make calls out to the server
```javascript
  //This is used to connect to the socket server
  var socket = io.connect();
  var user;

  $(document).ready(function(){
    //Get user name and make sure it isnt null
    user = prompt("Please enter your user name", "User");
    if(user == null){
      //reload page if username isnt entered
      location.reload();
    } else {
      //emit the message out to the server
      socket.emit('newUser', user);
    }

    //ease of use tool for submitting msg on enter key
    $("#chatText").keypress(function(e){
      //keycode for enter key
      if(e.which == 13){
        sendMsg();
      }
    })
  });

  function sendMsg(){
    var msg = $("#chatText").val();
    console.log(user+": " + msg);
    socket.emit('sendMessage', user, msg);
    $("#chatText").val("");
  }
```
