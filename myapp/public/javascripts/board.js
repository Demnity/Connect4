class Board {
  constructor(board) {
    this.row = 7;
    this.col = 7;
    this.board = board;
    this.createBoard();
    this.listenMouseEvent();
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

  listenMouseEvent() {
    function dropAnimation(colValue, pColor) {
      let col = $("[col=" + colValue + "]");
      for (let i = 1; i < col.length; i++) {
        let $colNext = $(col[i + 1]);
        let $col = $(col[i]);
        
        //Have to change this vvv
        
        if ($col.css("border-top-color") == pColor) break; 
        let color = $colNext.css("border-top-color");
        //check white color
        if (color == "rgb(255, 255, 255)") {
          setTimeout(function() {
            $col.css("border-color", pColor);
          }, i * 20);
          setTimeout(function() {
            $col.css("border-color", "white");
          }, i * 20 + 20);
        } else {
          setTimeout(function() {
            $col.css("border-color", pColor);
          }, i * 20);
          return true;
        }
      }
      return false;
    }

    $("[col]").click(function(event, color) {
      let colValue = event.target.getAttribute("col");
      let rowValue = event.target.getAttribute("row");
      let emptyRing = dropAnimation(colValue, color);
      console.log(emptyRing);
    });
  }
}


class Player {
  constructor(color) {
    this.color = color;
    this.ingameListener(this);
    
  }

  ingameListener(player) {
    $("[col]").mouseenter(function(event) {
      let colValue = event.target.getAttribute("col");
      $("[row = 0][col=" + colValue + "]").css("border-color", player.color);
    });

    $("[col]").mouseout(function(event) {
      let colValue = event.target.getAttribute("col");
      $("[row = 0][col=" + colValue + "]").css("border-color", "transparent");
    });
  }
}

class Game {
  constructor(gameId, board, playerA, playerB){
    this.playerA = playerA;
    this.playerB = playerB;
    this.board = board;
    this.gameId = gameId;
  }

}