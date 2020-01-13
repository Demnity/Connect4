class Board {
  constructor(board) {
    this.row = 7;
    this.col = 7;
    this.board = board;
    this.createBoard();
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
   
}


class Player {
  constructor(color, name) {
    this.name = name;
    this.color = color;
    this.ingameListener(this);
    
  }

  ingameListener(player) {
    console.log(this);
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
  constructor(gameId, board, playerA, playerB, timer){
    this.playerA = playerA;
    this.playerB = playerB;
    this.board = board;
    this.gameId = gameId;
    this.currentTurn = playerA;
    this.timer = timer;

    this.runTimer(this, 3);
    this.clickFunc(this, this.board, this.currentTurn);
  }

  runTimer(game, i){
    $(game.timer).html(""+i);

    setInterval(function(){
      i--;
      if(i < 0){
        i = 3;
        if(game.currentTurn == game.playerA){
          game.currentTurn = game.playerB;
          game.setCurrentPlayer(game.currentTurn);
        }
        else {
          game.currentTurn = game.playerA;
          game.setCurrentPlayer(game.currentTurn);
        }
      }
      $(timer).html(""+i);
    }, 1000)
  }

  clickFunc(game, board) {
    
    $("[col]").click(function(event) {
      let colValue = event.target.getAttribute("col");
      let rowValue = event.target.getAttribute("row");
      let color = game.currentTurn.color;
      let emptyRing = game.dropAnimation(colValue, color);
      console.log(emptyRing);
    });
  }

  setCurrentPlayer(player){
    player.ingameListener(player);
    $('#playerTurn').html(player.name).css("color", player.color);
  }

  dropAnimation(colValue, pColor) { //seems like a generic function.
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

}