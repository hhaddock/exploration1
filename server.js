var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('app'));

app.get('/', function(req, res){
 res.sendFile(__dirname + '/app/index.html');
});

http.listen(3000, function(){
 console.log("Listening on port 3000");
});

io.on('connection', function(socket){
 console.log("a user has connected!");
});
