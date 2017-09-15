var socket = io.connect();
var user;

$(document).ready(function(){
  //Get user name and make sure it isnt null
  user = prompt("Please enter your user name", "User");
  if(user == null){
    location.reload();
  } else {
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

socket.on('allUsers', function(data){
  for(i = 0; i < data.length; i++){
    console.log(data[i]);
    $("#connectedUserList").append("<li class='user' name="+data[i].id+"><h3><u>"+data[i].username+"</u></h3></li>");
  }
});

socket.on('newUser', function(data){
  $("#connectedUserList").append("<li class='user' name="+data.id+"><h3><u>"+data.username+"</u></h3></li>");
  $("#chatList").append("<li>User <strong><u>"+data.username+"</u></strong> has entered </li>")
});

socket.on('sendMessage', function(user, msg){
  $("#chatList").append("<li><span><strong><u>"+user+"</u></strong><span>: <span>"+msg+"</span></li>")
});

socket.on('disconnect', function(user){
  $("#chatList").append("<li>User <strong><u>"+user.username+"</u></strong> has left the room</li>")
  $('li[name="'+user.id+'"]').remove();
});
