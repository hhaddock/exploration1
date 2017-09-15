# Web Socket Chat Room
## Exploration 1
---
Server connection using NodeJS
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

```
