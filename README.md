# Web Socket Chat Room
## Exploration 1

```javascript

var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/app/css'));
app.use(express.static(__dirname + '/app/js'));

app.get('/', function(req, res){
 res.sendFile(path.join(__dirname + '/app/index.html'));
});

server.listen(4321, function(){
 console.log("Listening on port 8888");
});

```
