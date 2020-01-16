class Board {
  constructor(board, create) {
    this.row = 7;
    this.col = 7;
    this.board = board;
    if(create)
      this.createBoard();
    else 
      this.clearBoard();
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
    $('#board .ring').css("border", "8px solid #fff");
  }

  //DOESNT CHECK COLLISIONl
  dropAnimation(rowValue,colValue, pColor) {
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
}

/*$(document).ready(function(){
  const gameBoard = new Board("#board"); 
});*/

/////////////////////////////////////////////////////////////////////////////
