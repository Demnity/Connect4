var main = function(create) {
  const board = new Board("#board", create);
  const timer = new Timer(20);
  var player;

  
  //THIS SHIT IS THE CLIENT VVVVVVVVVVVVV DONT FORGET
  var socket = new WebSocket("ws://localhost:3000");
  socket.onopen = function(){
    socket.send(JSON.stringify({
      type: "message",
      message:"Socket Opened"
    })
    );
  };

  socket.onmessage = function(message){
    var data = JSON.parse(message.data)
    console.log(data);
    if(data.type == 'PLAYER_ID'){
      if(data.id == 1){
        player = new Player("rgb(218, 187, 53)", "Player 1", 1, socket);
      }
      else if(data.id == 2) {
        player = new Player("rgb(48, 207, 160)", "Player 2", 2, socket);
      }
    }
    else if(data.type == 'ANIMATION'){
      console.log(data);
      board.dropAnimation(data.row, data.col, data.color);
    }
    else if(data.type == 'RESTART_TIMER'){
      timer.restart();
    }
    else if (data.type == "DISABLE_MOUSE") {
      board.disableMouse();
    }
    else if (data.type == "ENABLE_MOUSE") {
      board.enableMouse();
    }
    else if(data.type == 'CLEAR_BOARD'){
      board.clearBoard();
    }
    else if(data.type == 'RESTART'){
      socket.close();
      setTimeout(main(false), 2000);
    }
  }
  
};

$(document).ready(main(true));
