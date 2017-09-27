var socket = io.connect();
var user;
var auth;

url = parseUrl(window.location.href).search;
auth = getAuth(url);

$(document).ready(function(){
  //Get user name and make sure it isnt null
  // user = prompt("Please enter your user name", "User");
  // if(user == null){
  //   location.reload();
  // } else {
  //   socket.emit('newUser', user);
  // }
  // $.ajax({
  //   url: "http://ec2-34-209-75-64.us-west-2.compute.amazonaws.com/exploration2/php/auth.php",
  //   type: "post",
  //   success: function(res){
  //     console.log(res);
  //   }
  // });
  user = auth[1];
  socket.emit('newUser', user);
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
  if(url){
    var str = url.split("&");
    var auth = str[0].split("=");
    var user = str[1].split("=");

    var array = [auth[1], user[1]];
  } else {
    window.location.href = "http://ec2-34-209-75-64.us-west-2.compute.amazonaws.com/exploration2"
  }

  return array;
}

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
