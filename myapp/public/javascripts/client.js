var main = function() {
  const board = new Board("#board");
  var player;

  //THIS SHIT IS THE CLIENT VVVVVVVVVVVVV DONT FORGET
  var socket = new WebSocket("ws://localhost:3000");
  socket.onopen = function() {
    socket.send(
      JSON.stringify({
        type: "message",
        message: "Socket Opened"
      })
    );
  };

  socket.onmessage = function(message) {
    var data = JSON.parse(message.data);
    console.log(data);
    if (data.type == "PLAYER_ID") {
      if (data.id == 1) {
        player = new Player("rgb(218, 187, 53)", "Player 1", 1, socket, true);
      } else if (data.id == 2) {
        player = new Player("rgb(48, 207, 160)", "Player 2", 2, socket, false);
      }
    }
    if (data.type == "ANIMATION") {
      console.log(data);
      board.dropAnimation(data.row, data.col, data.color);
    }
    if (data.type == "DISABLE_MOUSE") {
      board.disableMouse();
    }
    if (data.type == "ENABLE_MOUSE") {
      board.enableMouse();
    }
  };
};

$(document).ready(main);
