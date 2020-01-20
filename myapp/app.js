var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");

var port = process.argv[2];
var app = express();

var gameStatus = require("./statTracker");
var Game = require("./game");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("splash.ejs", {
    gamesInitialized: gameStatus.gamesInitialized,
    usersOnline: gameStatus.usersOnline,
    ongoingGames: gameStatus.ongoingGames
  });
});

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

var currentGame = new Game(gameStatus.gamesInitialized++, 7);
var connectionID = 0;

wss.on("connection", function(ws, req) {
  console.log("Client Joined from " + req.url);

  let con = ws;
  con.id = connectionID++;
  gameStatus.usersOnline++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log(
    "Player %s placed in game %s as %s",
    con.id,
    currentGame.gameId,
    currentGame.noPlayer
  );

  if (currentGame.isGameFull) {
    currentGame.playerA.send(JSON.stringify({ type: "ENABLE" }));
    currentGame.playerB.send(JSON.stringify({ type: "DISABLE" })); //playerA starts turn
    currentGame.playerA.send(JSON.stringify({ type: "DISABLE_LOADING" }));
    currentGame.playerB.send(JSON.stringify({ type: "DISABLE_LOADING" }));

    currentGame.setStatus("STARTED");

    gameStatus.ongoingGames++;

    currentGame = new Game(gameStatus.gamesInitialized++, 7);
  }

  con.on("message", function(message) {
    data = JSON.parse(message);
    //console.log(message);

    let gameObj = websockets[con.id];
    if (data.type == "TIMER_SWITCH") {
      if (data.currentPlayer == 1) {
        gameObj.playerB.send(JSON.stringify({ type: "ENABLE" }));
        gameObj.playerA.send(JSON.stringify({ type: "DISABLE" }));
      } else {
        gameObj.playerA.send(JSON.stringify({ type: "ENABLE" }));
        gameObj.playerB.send(JSON.stringify({ type: "DISABLE" }));
      }
    } else if (data.type == "PLAYER_CLICK" && data.col >= 0 && data.col <= 6) {
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

        if (i == 0) {
          var j;
          for (j = 0; j < 7; j++) {
            if (gameObj.board[0][j] == 0) {
              break;
            }
          }
          if (j == 7) {
            gameObj.setStatus("TIE");
            console.log("GAME TIE");
          }
        }

        let winner = gameObj.checkWinner(i, col);

        if (winner != null) {
          console.log("Player " + winner + " Has Won!.");
          gameObj.clearBoard();

          if (winner == 1) {
            gameObj.playerA.send(JSON.stringify({ type: "WINNER" }));
            gameObj.playerB.send(JSON.stringify({ type: "LOSER" }));
          } else {
            gameObj.playerB.send(JSON.stringify({ type: "WINNER" }));
            gameObj.playerA.send(JSON.stringify({ type: "LOSER" }));
          }
        } else {
          var restartTimer = {
            type: "RESTART_TIMER",
            count: this.count
          };
          gameObj.playerA.send(JSON.stringify(restartTimer));
          gameObj.playerB.send(JSON.stringify(restartTimer));
          gameObj.gameTimer.restart(gameObj);    //essentially start?

          if (data.playerid == 1) {
            gameObj.playerA.send(JSON.stringify({ type: "DISABLE" }));
            gameObj.playerB.send(JSON.stringify({ type: "ENABLE" }));
          } else {
            gameObj.playerB.send(JSON.stringify({ type: "DISABLE" }));
            gameObj.playerA.send(JSON.stringify({ type: "ENABLE" }));
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
    gameObj.gameTimer.stop();
    gameStatus.usersOnline--;

    if (gameObj.getStatus() == "STARTED") {
      //Add all other cases when game started but then stopped.
      if (gameStatus.ongoingGames != 0) gameStatus.ongoingGames--;
    }

    if (currentGame.isGameFull)
      currentGame = new Game(gameStatus.gamesInitialized++, 7);

    /////

    if (code == "1001") {
      /*
       * if possible, abort the game; if not, the game is already completed
       */

      //gameObj.setStatus("ABORTED");
      gameObj.isGameFull = false;

      /*
       * determine whose connection remains open;
       * close it
       */

      if (gameObj.playerA != null) {
        if (gameObj.getStatus() == "STARTED")
          gameObj.playerA.send(JSON.stringify({ type: "ABORTED" }));
        else if (gameObj.getStatus() == "SEARCHING") delete websockets[con.id];
        else gameObj.playerA.send(JSON.stringify({ type: "RESTART" })); //This probably wont get executed in our current code
        gameObj.playerA = null;
      }
      if (gameObj.playerB != null) {
        if (gameObj.getStatus() == "STARTED")
          gameObj.playerB.send(JSON.stringify({ type: "ABORTED" }));
        else if (gameObj.getStatus() == "SEARCHING") delete websockets[con.id];
        else gameObj.playerB.send(JSON.stringify({ type: "RESTART" })); //This probably wont get executed in our current code
        gameObj.playerB = null;
      }
    }
  });
});

server.listen(port);
