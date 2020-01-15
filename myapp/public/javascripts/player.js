
class Player {
    constructor(color, name, id, socket) {
      this.name = name;
      this.color = color;
      this.id = id;
      this.socket = socket;
      this.ingameListener(this);
      this.mouseListener();
    }
  
    ingameListener(player) {
      $("[col]").mouseenter(function(event) {
        let colValue = event.target.getAttribute("col");
        $("[row = 0][col=" + colValue + "]").css("border-color", player.color);
      });
  
      $("[col]").mouseout(function(event) {
        let colValue = event.target.getAttribute("col");
        $("[row = 0][col=" + colValue + "]").css("border-color", "transparent");
      });
    }

    mouseListener() {
      $("[col]").click(
        function(event) {
          let colValue = event.target.getAttribute("col");
          let rowValue = event.target.getAttribute("row");
          this.socket.send(JSON.stringify({
            type: "PLAYER_CLICK",
            row: rowValue,
            col: colValue,
            playerid: this.id,
            color: this.color
          }));
        }.bind(this)
      );
    }
  }

if(typeof exports != undefined)
  module.exports = Player;