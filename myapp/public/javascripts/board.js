class Board {
  constructor(board, create) {
    this.row = 7;
    this.col = 7;
    this.board = board;
    console.log(create);
    if (create) this.createBoard();
    else this.clearBoard();

    //Disable Mouse in the beginning
    for (let i = 0; i < this.row; i++) {
      $(`[row = '${i}']`).addClass("ring-disable");
    }
    //this.listenMouseEvent();
  }

  createBoard() {
    var $board = $(this.board);
    for (let i = 0; i < this.row; i++) {
      var $row = $("<div>").addClass("row");
      for (let j = 0; j < this.col; j++) {
        var $col = $("<div>")
          .addClass("ring")
          .attr("row", "" + i)
          .attr("col", "" + j);
        if (i == 0) {
          $col.attr("class", "top-ring");
        }
        $row.append($col);
      }
      $board.append($row);
    }
  }

  //DOESNT CHECK COLLISIONl
  dropAnimation(rowValue, colValue, pColor) {
    //seems like a generic function.
    let col = $("[col=" + colValue + "]");

    for (let i = 1; i <= rowValue; i++) {
      let $colNext = $(col[i + 1]);
      let $col = $(col[i]);

      //check if col is filled
      //if ($col.css("border-top-color") != "rgb(255, 255, 255)") break;
      let color = $colNext.css("border-top-color");

      //check white color
      if (i < rowValue) {
        setTimeout(function() {
          $col.css("border-color", pColor);
        }, i * 20);
        setTimeout(function() {
          $col.css("border-color", "white");
        }, i * 20 + 20);
      } else {
        //$col.attr("id", playerId);
        setTimeout(function() {
          $col.css("border-color", pColor);
        }, i * 20);
        return $col;
      }
    }
    return null;
  }

  disableMouse(id) {
    for (let i = 0; i < this.row; i++) {
      $(`[row = '${i}']`).addClass("ring-disable");
    }
    //Change #playerTurn color
    $("#playerTurn").html("Opponent's Turn");
    if (id == 1) {
      $("#playerTurn").removeClass("player2");
      $("#playerTurn").addClass("player1");
    } else {
      $("#playerTurn").removeClass("player1");
      $("#playerTurn").addClass("player2");
    }
  }

  enableMouse(id, timer) {
    for (let i = 0; i < this.row; i++) {
      $(`[row = '${i}']`).removeClass("ring-disable");
    }
    //Change #playerTurn color
    $("#playerTurn").html("Your Turn");
    if (id == 1) {
      $("#playerTurn").removeClass("player1");
      $("#playerTurn").addClass("player2");
    } else {
      $("#playerTurn").removeClass("player2");
      $("#playerTurn").addClass("player1");
    }
  }
}

class Timer {
  constructor(time, socket) {
    this.currentTurn = 2;
    this.interval = undefined;
    this.countFrom = time; // second
    this.count = this.countFrom;
    this.socket = socket;
  }

  restart() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.switchPlayer();
    this.count = this.countFrom;
    $("#timer").html(this.count);

    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    this.count--;
    if (this.count < 0) {
      this.count = this.countFrom;
      this.switchPlayer();
    }
    // update the view
    $("#timer").html(this.count);
  }

  stop() {
    clearInterval(this.interval);
  }

  switchPlayer() {
    if (this.currentTurn == 1) this.currentTurn = 2;
    else this.currentTurn = 1;
    this.socket.send(
      JSON.stringify({
        type: "TIMER_SWITCH",
        currentPlayer: this.currentTurn
      })
    );
  }
}

/*$(document).ready(function(){
  const gameBoard = new Board("#board"); 
});*/
