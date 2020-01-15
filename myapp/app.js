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

  con.send("test");

  con.on("message", function(message){
    
  })

  con.on("close", function(code) {
    /*
     * code 1001 means almost always closing initiated by the client;
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    console.log(con.id + " disconnected ...");
    connectionID--;

    /////
    currentGame.noPlayer--;
    /////
  });
});


server.listen(port);