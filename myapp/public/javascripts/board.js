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
  constructor(color, name, id) {
    this.name = name;
    this.color = color;
    this.id = id;
    this.ingameListener(this);
  }

  ingameListener(player) {
    $("[col]").mouseenter(function(event) {
      let colValue = event.target.getAttribute("col");
      $(`[row = 0][col= ${colValue}]`).css("border-color", player.color);
    });

    $("[col]").mouseout(function(event) {
      let colValue = event.target.getAttribute("col");
      $(`[row = 0][col= ${colValue}]`).css("border-color", "transparent");
    });
  }
}

class Game {
  constructor(gameId, board, playerA, playerB, time) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.board = board;
    this.gameId = gameId;
    this.timer = {
      currentTurn: playerA,
      interval: undefined,
      countFrom: time, // second
      count: this.countFrom,

      restart: function() {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.switchPlayer();
        this.count = this.countFrom;
        $("#timer").html(this.count);
        this.interval = setInterval(this.tick.bind(this), 1000);
      },

      stop: function() {
        clearInterval(this.interval);
      },

      tick: function() {
        this.count--;
        if (this.count < 0) {
          this.count = this.countFrom;
          this.switchPlayer();
        }
        // update the view
        $("#timer").html(this.count);
      },

      setCurrentPlayer: function(player) {
        player.ingameListener(player);
        $("#playerTurn")
          .html(player.name)
          .css("color", player.color);
      },

      switchPlayer: function() {
        if (this.currentTurn == playerA) {
          this.currentTurn = playerB;
          this.setCurrentPlayer(this.currentTurn);
        } else {
          this.currentTurn = playerA;
          this.setCurrentPlayer(this.currentTurn);
        }
      }
    };

    this.mouseListener();
  }

  mouseListener() {
    $("[col]").click(
      function(event) {
        let colValue = event.target.getAttribute("col");
        let currentTurn = this.timer.currentTurn;
        let emptyRing = this.dropAnimation(
          colValue,
          currentTurn.color,
          currentTurn.id
        );
        //changed
        if (emptyRing) {
          let winner = this.checkWinner(
            parseInt(emptyRing.attr("col")),
            parseInt(emptyRing.attr("row"))
          );
          if (winner) {
            alert("winner winner");
          }
          //restart timer
          this.timer.restart();
          //switch topring color
          let color = this.timer.currentTurn.color;
          $(`[row = 0][col= ${colValue}]`).css("border-color", color);
        }
      }.bind(this)
    );
  }

  checkWinner(col, row) {
    const that = this;
    function getRing(row, col) {
      return $(`[row='${row}'][col='${col}']`);
    }

    function checkVertical() {
      return checkWin({ i: -1, j: 0 }, { i: 1, j: 0 });
    }

    function checkHorizontal() {
      return checkWin({ i: 0, j: -1 }, { i: 0, j: 1 });
    }

    function checkDiagonal() {
      return (
        checkWin({ i: 1, j: -1 }, { i: -1, j: 1 }) ||
        checkWin({ i: -1, j: -1 }, { i: 1, j: 1 })
      );
    }

    function checkWin(directionA, directionB) {
      let sum = 1 + countRings(directionA) + countRings(directionB);
      if (sum >= 4) {
        return true;
      }
      return false;
    }

    function countRings(direction) {
      let i = row + direction.i;
      let j = col + direction.j;
      let start_ring = getRing(i, j);
      let count = 0;
      while (
        i >= 1 &&
        i < 7 &&
        j >= 0 &&
        j < 7 &&
        parseInt(start_ring.attr("id")) === that.timer.currentTurn.id
      ) {
        count++;
        i += direction.i;
        j += direction.j;
        start_ring = getRing(i, j);
      }
      return count;
    }

    return checkVertical() || checkHorizontal() || checkDiagonal();
  }

  dropAnimation(colValue, pColor, playerId) {
    //seems like a generic function.
    let col = $(`[col= ${colValue}]`);
    for (let i = 1; i < col.length; i++) {
      let $colNext = $(col[i + 1]);
      let $col = $(col[i]);

      //check if col is filled
      if ($col.css("border-top-color") != "rgb(255, 255, 255)") break;
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
        $col.attr("id", playerId);
        setTimeout(function() {
          $col.css("border-color", pColor);
        }, i * 20);
        return $col;
      }
    }
    return null;
  }
}
