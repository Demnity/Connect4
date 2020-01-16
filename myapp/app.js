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
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
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

wss.on('connection', function (ws, req) {
  console.log("Client Joined");
  
  let con = ws;
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log(
    "Player %s placed in game %s as %s",
    con.id,
    currentGame.gameId,
    playerType
  );

  if (currentGame.isGameFull) {
    currentGame = new Game(gameId++, 7);
  }


  con.on("message", function(message){
    data = JSON.parse(message);
    //console.log(message);

    let gameObj = websockets[con.id];

    if(data.type == 'PLAYER_CLICK'){
      //if(currentTurn ) need to implement
      var col = data.col;

      var i;
      for(i = 0; i < 6; i++){
        if(gameObj.board[i][col] > 0)
          break;
      }
      
      //i-- so that it goes well with the server board;
        i--;
       
      if(i >= 0){
        gameObj.board[i][col] = data.playerid;
        let winner = gameObj.checkWinner(i,col);
        
        if(winner != null) {
          console.log("Player " + winner + " Has Won!." );
        }

        var out = {
          type: 'ANIMATION',
          row: i+1,  //+1 because of top ring
          col: data.col,
          color: data.color
        };

        if(gameObj.playerA)
          gameObj.playerA.send(JSON.stringify(out));
        if(gameObj.playerB)
          gameObj.playerB.send(JSON.stringify(out));
      }
    }
  })

  con.on("close", function(code) {
    /*
     * code 1001 means almost always closing initiated by the client;
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    console.log(con.id + " disconnected ...");
    connectionID--;

    let gameObj = websockets[con.id];

    /////
    gameObj.noPlayer--;
    /////

    if (code == "1001") {
      /*
       * if possible, abort the game; if not, the game is already completed
       */
        gameObj.setStatus("ABORTED");
        gameObj.isGameFull = false;

        /*
         * determine whose connection remains open;
         * close it
         */
        try {
          gameObj.playerA.close();
          gameObj.playerA = null;
        } catch (e) {
          console.log("Player A closing: " + e);
        }

        try {
          gameObj.playerB.close();
          gameObj.playerB = null;
        } catch (e) {
          console.log("Player B closing: " + e);
        }
    }
  });
});


server.listen(port);