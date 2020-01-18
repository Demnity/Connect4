/* 
 In-memory game statistics "tracker".
 TODO: as future work, this object should be replaced by a DB backend.
*/

var gameStatus = {
  since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
  gamesInitialized: 0 /* number of games initialized  */,
  usersOnline: 0 /* number of users online in game */,
  ongoingGames: 0 /* number of games successfully completed */
};

module.exports = gameStatus;