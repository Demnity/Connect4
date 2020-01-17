class Board {
  constructor(board, create) {
    this.row = 7;
    this.col = 7;
    this.board = board;
    console.log(create);
    if (create) this.createBoard();
    else this.clearBoard();
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

  clearBoard() {
    $("#board .ring").css("border", "8px solid #fff");
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
    $("#playerTurn").html("Opponent");
    if (id == 1) {
      $("#playerTurn").removeClass("player2");
      $("#playerTurn").addClass("player1");
    } else {
      $("#playerTurn").removeClass("player1");
      $("#playerTurn").addClass("player2");
    }
  }

  enableMouse(id) {
    for (let i = 0; i < this.row; i++) {
      $(`[row = '${i}']`).removeClass("ring-disable");
    }
    //Change #playerTurn color
    $("#playerTurn").html("You");
    if (id == 1) {
      $("#playerTurn").removeClass("player1");
      $("#playerTurn").addClass("player2");
    } else {
      $("#playerTurn").removeClass("player2");
      $("#playerTurn").addClass("player1");
    }
  }
}

class Timer{
  constructor(time){
    this.currentTurn = null;
    this.interval = undefined;
    this.countFrom = time; // second
    this.count = this.countFrom;
  }

  restart() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    //this.switchPlayer();
    this.count = this.countFrom;
    $("#timer").html(this.count);
    //var msg = {
    //  type: "RESTART_TIMER",
    //  count: this.count
    //}

    this.interval = setInterval(this.tick.bind(this), 1000);

    //return msg;
  }

  setCurrentPlayer(player) {
    $("#playerTurn")
      .html("FILLER")
  }

  tick() {
    this.count--;
    if (this.count < 0) {
      if (this.interval) {
        clearInterval(this.interval);
      }
      //this.count = this.countFrom;
      //this.switchPlayer();
    }
    // update the view
    $("#timer").html(this.count);
  }

  stop() {
    clearInterval(this.interval);
  }
}

/*$(document).ready(function(){
  const gameBoard = new Board("#board"); 
});*/

/////////////////////////////////////////////////////////////////////////////
