var Player = require('./public/javascripts/player');

class Game {
constructor(gameId, time) {
  this.playerA = null;
  this.playerB = null;
  this.board = [
    [0,0,0,0,0,0,0],  // ---->row
    [0,0,0,0,0,0,0],  //|
    [0,0,0,0,0,0,0],  //|
    [0,0,0,0,0,0,0],  //v
    [0,0,0,0,0,0,0],  //column
    [0,0,0,0,0,0,0]
  ];
  this.gameId = gameId;
  this.noPlayer = 0;
  this.isGameFull = false;
  this.timer = {
    currentTurn: null,
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

  //Starts listening
  //this.mouseListener();
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

  while((++j < 7) && this.board[i][j] == id)
    rightCount++;

  j = col;
  while((--j >= 0) && this.board[i][j] == id)
    leftCount++;

  if(rightCount + leftCount + 1 >= 4)
    return id; //id of winning player


  var upCount = 0;
  var downCount = 0;

  i = row;
  j = col;
  console.log(i + " yes " +j)  
  while((++i < 6) && this.board[i][j] == id)
    downCount++;

  i = row;
  while((--i >= 0) && this.board[i][j] == id)
    upCount++;

  if(downCount + upCount + 1 >= 4)
    return id;

  var diagCount = 0;
  var oppCount = 0;

  i = row;
  j = col;
  while((++i < 6 && ++j < 7) && this.board[i][j] == id)
    diagCount++;

    i = row;
    j = col;
  while((--i >= 0 && --j >= 0) && this.board[i][j] == id)
    oppCount++;

  if(diagCount + oppCount + 1 >= 4)
    return id;

  diagCount = 0;
  oppCount = 0;

  i = row;
  j = col;
  while((++i < 6 && --j >= 0) && this.board[i][j] == id)
    diagCount++;

    i = row;
    j = col;
  while((--i >= 0 && ++j < 7) && this.board[i][j] == id)
    oppCount++;

  if(diagCount + oppCount + 1 >= 4)
    return id;

  return null;
}
  /*function getRing(row, col) {
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
}*/

//Shitty code, might change later.
addPlayer(ws, player){
  if(this.isGameFull)
    return "Game Full";

  var id = ++this.noPlayer;
  
  if(id == 1){
    this.playerA = ws;
    
    ws.send(JSON.stringify({type: 'PLAYER_ID', id:1}));
    //ws.Player = this.playerA;
  }
  else if(id == 2){
    this.playerB = ws;
    ws.send(JSON.stringify({type : "PLAYER_ID", id: 2}));
    //ws.Player = this.playerB;
    this.isGameFull = true;

    //start game ---- testing
    //this.startGame();*/
  }

  //this.playerB.otherPlayer = this.playerA;
  //this.playerA.otherPlayer = this.playerB;
}
}


module.exports = Game;