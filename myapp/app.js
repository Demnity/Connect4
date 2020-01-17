var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");

var port = process.argv[2];
var app = express();

var Game = require("./game");

var gameId = 0;

var currentGame = new Game(gameId++, 7);

app.use(express.static(__dirname + "/public"));

app.get("/", indexRouter);
app.get("/play", indexRouter);

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {}; //property: websocket, value: game
var seachingForGame = {};
/*
 * regularly clean up the websockets object
 */
setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets, i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);
/////

var connectionID = 0;

wss.on("connection", function(ws, req) {
  console.log("Client Joined");

  let con = ws;
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log(
    "Player %s placed in game %s as %s",
    con.id,
    currentGame.gameId,
    currentGame.noPlayer
  );

  if (currentGame.isGameFull) {
    currentGame = new Game(gameId++, 7);
  }

  con.on("message", function(message) {
    data = JSON.parse(message);
    //console.log(message);

    let gameObj = websockets[con.id];

    if (data.type == "PLAYER_CLICK") {
      //if(currentTurn ) need to implement
      var col = data.col;

      var i;
      for (i = 0; i < 6; i++) {
        if (gameObj.board[i][col] > 0) break;
      }

      //i-- so that it goes well with the server board;
      i--;

      if (i >= 0) {
        gameObj.board[i][col] = data.playerid;
        let winner = gameObj.checkWinner(i, col);

        if (winner != null) {
          if (winner == 1) winner = gameObj.playerA.id;
          else if (winner == 2) winner = gameObj.playerB.id;
          console.log("Player " + winner + " Has Won!.");
          gameObj.clearBoard();

          var out = {
            type: "CLEAR_BOARD"
          };

          if (gameObj.playerA) gameObj.playerA.send(JSON.stringify(out));
          if (gameObj.playerB) gameObj.playerB.send(JSON.stringify(out));
        } else {
          var animation = {
            type: "ANIMATION",
            row: i + 1, //+1 because of top ring
            col: data.col,
            color: data.color
          };

          if (gameObj.playerA) {
            gameObj.playerA.send(JSON.stringify(animation));
          }
          if (gameObj.playerB) {
            gameObj.playerB.send(JSON.stringify(animation));
          }

          var enableMouse = {
            type: "ENABLE"
          };
          var disableMouse = {
            type: "DISABLE"
          };
        if (data.playerid == 1) {
          gameObj.timer.currentTurn = 1; //switchPlayer changes to correct currentPlayer
          var restartTimer = gameObj.timer.restart();
          gameObj.playerA.send(JSON.stringify(restartTimer));
          gameObj.playerB.send(JSON.stringify(restartTimer));

          gameObj.playerA.send(JSON.stringify(disableMouse));
          gameObj.playerB.send(JSON.stringify(enableMouse));

        } else {
          gameObj.timer.currentTurn = 2;
          var restartTimer = gameObj.timer.restart();
          gameObj.playerA.send(JSON.stringify(restartTimer));
          gameObj.playerB.send(JSON.stringify(restartTimer));

          gameObj.playerB.send(JSON.stringify(disableMouse));
          gameObj.playerA.send(JSON.stringify(enableMouse));
        }
      }
    }
  }
});

  con.on("close", function(code) {
    /*
     * code 1001 means almost always closing initiated by the client;
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    console.log(con.id + " disconnected ...");

    let gameObj = websockets[con.id];

    /////
    gameObj.noPlayer--;
    if(currentGame.isGameFull)
      currentGame = new Game(gameId++, 7);
    
    /////

    //if (code == "1001") {
    /*
     * if possible, abort the game; if not, the game is already completed
     */
    gameObj.setStatus("ABORTED");
    gameObj.isGameFull = false;

    /*
     * determine whose connection remains open;
     * close it
     */

    if (gameObj.playerA != null) {
      gameObj.playerA.send(JSON.stringify({ type: "RESTART" }));
      //gameObj.playerA.close();
      gameObj.playerA = null;
    }
    if (gameObj.playerB != null) {
      gameObj.playerB.send(JSON.stringify({ type: "RESTART" }));
      //gameObj.playerB.close();
      gameObj.playerB = null;
    }
    //}
  });
});

server.listen(port);
