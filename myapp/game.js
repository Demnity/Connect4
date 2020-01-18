//var Player = require('./public/javascripts/player');

class Game {
  constructor(gameId, time) {
    this.playerA = null;
    this.playerB = null;
    this.winnerId = null;
    this.board = [
      [0, 0, 0, 0, 0, 0, 0], // ---->colValue
      [0, 0, 0, 0, 0, 0, 0], //|
      [0, 0, 0, 0, 0, 0, 0], //|
      [0, 0, 0, 0, 0, 0, 0], //v
      [0, 0, 0, 0, 0, 0, 0], //rowValue
      [0, 0, 0, 0, 0, 0, 0]
    ];
    this.gameId = gameId;
    this.noPlayer = 0;
    this.isGameFull = false;
    this.gameStatus = "SEARCHING";
  }

  clearBoard() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0], // ---->colValue
      [0, 0, 0, 0, 0, 0, 0], //|
      [0, 0, 0, 0, 0, 0, 0], //|
      [0, 0, 0, 0, 0, 0, 0], //v
      [0, 0, 0, 0, 0, 0, 0], //rowValue
      [0, 0, 0, 0, 0, 0, 0]
    ];
  }

  setStatus(status) {
    this.gameStatus = status;
    if (status == "TIE") {
      var msg = {
        type: "TIE"
      };

      this.playerA.send(JSON.stringify(msg));
      this.playerB.send(JSON.stringify(msg));
    }
  }

  getStatus() {
    return this.gameStatus;
  }
  //Shitty code, might change later.
  addPlayer(ws) {
    if (this.isGameFull) return "Game Full";

    var id = ++this.noPlayer;

    if (id == 1) {
      this.playerA = ws;

      ws.send(JSON.stringify({ type: "PLAYER_ID", id: 1 }));
    } else if (id == 2) {
      this.playerB = ws;
      ws.send(JSON.stringify({ type: "PLAYER_ID", id: 2 }));
      this.isGameFull = true;
      this.gameStatus = "STARTED";
    }
    //this.playerB.otherPlayer = this.playerA;
    //this.playerA.otherPlayer = this.playerB;

    return id;
  }

  startGame() {
    this.timer.currentTurn = this.playerA; //starting player.
    //this.mouseListener();
  }

  mouseListener() {
    $("[col]").click(
      function(event) {
        let colValue = event.target.getAttribute("col");
        let rowValue = event.target.getAttribute("row");
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

  checkWinner(row, col) {
    const that = this;
    let id = this.board[row][col];

    let i = row;
    let j = col;

    var leftCount = 0;
    var rightCount = 0;

    while (++j < 7 && this.board[i][j] == id) rightCount++;

    j = col;
    while (--j >= 0 && this.board[i][j] == id) leftCount++;

    if (rightCount + leftCount + 1 >= 4) {
      this.winnerId = id;
      return id;
    }

    var upCount = 0;
    var downCount = 0;

    i = row;
    j = col;

    while (++i < 6 && this.board[i][j] == id) downCount++;

    i = row;
    while (--i >= 0 && this.board[i][j] == id) upCount++;

    if (downCount + upCount + 1 >= 4) {
      this.winnerId = id;
      return id;
    }

    var diagCount = 0;
    var oppCount = 0;

    i = row;
    j = col;
    while (++i < 6 && ++j < 7 && this.board[i][j] == id) diagCount++;

    i = row;
    j = col;
    while (--i >= 0 && --j >= 0 && this.board[i][j] == id) oppCount++;

    if (diagCount + oppCount + 1 >= 4) {
      this.winnerId = id;
      return id;
    }

    diagCount = 0;
    oppCount = 0;

    i = row;
    j = col;
    while (++i < 6 && --j >= 0 && this.board[i][j] == id) diagCount++;

    i = row;
    j = col;
    while (--i >= 0 && ++j < 7 && this.board[i][j] == id) oppCount++;

    if (diagCount + oppCount + 1 >= 4) {
      this.winnerId = id;
      return id;
    }

    return null;
  }
}

module.exports = Game;
