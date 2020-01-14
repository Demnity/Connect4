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
        let rowValue = event.target.getAttribute("row");
        let color = this.timer.currentTurn.color;
        let emptyRing = this.dropAnimation(colValue, color);
        console.log(emptyRing);
        //changed
        if (emptyRing) {
          //restart timer
          this.timer.restart();
          //switch topring color
          color = this.timer.currentTurn.color;
          $("[row = 0][col=" + colValue + "]").css("border-color", color);
        }
      }.bind(this)
    );
  }

  dropAnimation(colValue, pColor) {
    //seems like a generic function.
    let col = $("[col=" + colValue + "]");
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
        setTimeout(function() {
          $col.css("border-color", pColor);
        }, i * 20);
        return true;
      }
    }
    return false;
  }
}
