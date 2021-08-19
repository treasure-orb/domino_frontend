var socket = io('http://localhost:3030');
//get parameter from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const email = urlParams.get('email')
var playerPosition;

var chatPartnerIndex;
socket.emit('join', {email: email})

//get connected players
socket.on('showUsers', (users)=>{
  var players = '';
  users.map((user, index)=>{
    if(user.email !== email)
      players += '<div class="player" onclick="setChatPartner('+index+')">'+ '<img src="./assets/img/avatar.png" class="player-list-avatar"><p>' + user.email + '<p></div>';
  })
  $('#players-list').html(players);
})  

//get created gamerooms
socket.on('showRooms', (rooms)=>{
  var roomsBoard = ''
  rooms.map((room, index)=>{
    roomsBoard += "<div class='room' onclick='joinRoom("+index+")'><div class='center'>";
    room.players.map((player, index)=>{

      if(index == 2) roomsBoard += "<span class='vs'>vs</span>";
      roomsBoard += '<img src="./assets/img/avatar.png" class="room-players">';
    })
    for(var i=room.players.length; i<4; i++) {
      if(i == 2) roomsBoard += "<span class='vs'>vs</span>";
      roomsBoard += '<div class="no-player"></div>';
    }
    roomsBoard += "</div></div>";
  })
  $("#rooms-board").html(roomsBoard);
})

//display players in same gameroom to modal
socket.on('sameRoomPlayers', (room)=>{
  var modalPlayers = "<div class='modla-partner center'>";
  room.players.map((player, index)=>{
    if(index == 2) {
      modalPlayers += "</div><div class='modal-vs center'><img src='./assets/img/vs.png'></div><div class='modal-partner center'>";
    }
    modalPlayers += '<div class="modal-player"><img src="./assets/img/avatar.png" class="modal-player-img"></div>';
    
  })
  for(var i= room.players.length; i<4; i++) {
    if(i==2) modalPlayers += "</div><div class='modal-vs center'><img src='./assets/img/vs.png'></div><div class='modal-partner center'>";
      modalPlayers += '<div class="modal-no-player"></div>';  
  }
  modalPlayers += "</div>";
  $("#modal-player-board").html(modalPlayers);
  if(room.roomEmail != email) {
    $('#delete-room-button').css('display', "none");
    $('#create-room-button').css('display', "none");
  }
  else  {
    $('#delete-room-button').css('display', "flex");
    $('#create-room-button').css('display', "none");
    $('#game-start-button').css('display', "flex");
  }
})

//create gameroom when player click 'Create' button
$('#create-room-button').click(() => {
  socket.emit('createRoom', {roomEmail: email, createPlayerEmail: email}, (err)=>{
    if(err) {
      alert(err);
      return;
    }
    $('#game-start-button').css('display', "flex");
    $('#delete-room-button').css('display', "flex");
  });
})

//delete gameroom when player click 'Delete' button
$('#delete-room-button').click(()=>{
  socket.emit("deleteRoom", {roomEmail: email});
})

//display modal when player click 'Create Room' button
$('#modal-show-button').click(()=>{
  $('#game-start-button').css('display', "none");      
  $('#create-room-button').css('display', "flex");      
  $('#delete-room-button').css('display', "none");
  $('#modal-player-board').html("");      
})

//send message when player click 'Send' button
$('#chat-send-button').click(()=>{
  var newMessage = $('#chat-input').val();
  if(newMessage&&chatPartnerIndex>=0) {
    socket.emit('sendMessage', {newMessage,playerEmail: email, chatPartnerIndex});
  }
  $('#chat-input').val("");
})

//display messages
socket.on("showMessages", (messages)=>{
  var msgs = '';
  if(messages) {
    messages.map((message=>{
      if(message.email==email) {
        msgs += "<div class='message'><div class='right-message'>" + message.msg + "</div></div>";
      }
      else {
        msgs += "<div class='message'><div class='left-message'>" + message.msg + "</div></div>";
      }
    }))        
  }
  document.getElementById('chat-body').innerHTML = msgs;
  var chatBody = document.getElementById('chat-body');
  chatBody.scrollTop = chatBody.scrollHeight;      
})

//function for getting partner's index when player click partner in 'Connected Players'
setChatPartner = (partnerIndex) => {
  chatPartnerIndex = partnerIndex;
  socket.emit("showPartnerMessage", {playerEmail: email, chatPartnerIndex});
}

//function for joining to gameroom when player click gameroom
joinRoom = (roomIndex) => {
  socket.emit('joinPlayerInRoom', {roomIndex, playerEmail:email}, (err)=>{
  });
  $('#modal-show-button').click();  
}  

//send message when player press the 'Enter' on keyboard
$('body').keydown((e)=>{
  if(e.keyCode==13) {
    var newMessage = $('#chat-input').val();
    if(newMessage&&chatPartnerIndex>=0) {
      socket.emit('sendMessage', {newMessage,playerEmail: email, chatPartnerIndex});
    }
    $('#chat-input').val("");
  }
})
//emit Event when player click 'Start' button
$('#game-start-button').click(()=>{
  socket.emit("startBtnClick", {roomEmail: email});
})
//set player position
socket.on("setPosition", ({position})=>{
  playerPosition = position;
})
//start game
socket.on('startGame', (roomEmail)=>{
  location.href = './game.html?roomEmail='+roomEmail+"&position="+playerPosition;
})
