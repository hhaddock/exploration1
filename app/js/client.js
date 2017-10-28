var socket = io.connect();
var user;
var auth;

url = parseUrl(window.location.href).search;
auth = getAuth(url);

$(document).ready(function(){
  //Get user name and make sure it isnt null
  //ease of use tool for submitting msg on enter key
  $("#chatText").keypress(function(e){
    //keycode for enter key
    if(e.which == 13){
      sendMsg();
    }
  })
});

function parseUrl(url){
  var a = document.createElement('a');
  a.href = url;
  return a;
}

function getAuth(url){
  var user = url.split("=");
  socket.emit('checkUser', user[1]);
}

function sendMsg(){
  var msg = $("#chatText").val();
  console.log(user+": " + msg);
  socket.emit('sendMessage', user, msg);
  $("#chatText").val("");
}

function viewLogs(){
  socket.emit('getChatLogs');
}

function logout(){
  window.location.href = "http://ec2-34-209-75-64.us-west-2.compute.amazonaws.com/exploration2/";
}

socket.on('checkUser', function(data){
  if(data.auth == 1){
    user = data.username;
    socket.emit('newUser', user);
  } else {
    window.location.href = "http://ec2-34-209-75-64.us-west-2.compute.amazonaws.com/exploration2/";
  }
});

socket.on('allUsers', function(data){
  for(i = 0; i < data.length; i++){
    console.log(data[i]);
    $("#connectedUserList").append("<li class='user' name="+data[i].id+"><h3><u>"+data[i].username+"</u></h3></li>");
  }
});

socket.on('newUser', function(data){
  $("#connectedUserList").append("<li class='user' name="+data.id+"><h3><u>"+data.username+"</u></h3></li>");
  $("#chatList").append("<li>User <strong><u>"+data.username+"</u></strong> has entered </li><hr>")
});

socket.on('sendMessage', function(user, msg){
  $("#chatList").append("<li><span><strong><u>"+user+"</u></strong><span>: <span>"+msg+"</span></li><hr>")
  var clock = setInterval(function() {
    var elem = document.getElementById('chatList');
    elem.scrollTop = elem.scrollHeight;
    clearInterval(clock);
  }, 1000);
});

socket.on('getChatLogs', function(res){
  for(i = 0; i < res.length; i++){
    console.log(res[i]);
    $('.modal-body').html();
  }
});

socket.on('disconnect', function(user){
  $("#chatList").append("<li>User <strong><u>"+user.username+"</u></strong> has left the room</li><hr>")
  $('li[name="'+user.id+'"]').remove();
});

socket.on('kick', function(data){
  window.location.href = "http://ec2-34-209-75-64.us-west-2.compute.amazonaws.com/exploration2";
});
