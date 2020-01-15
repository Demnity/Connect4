
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
        $("[row = 0][col=" + colValue + "]").css("border-color", player.color);
      });
  
      $("[col]").mouseout(function(event) {
        let colValue = event.target.getAttribute("col");
        $("[row = 0][col=" + colValue + "]").css("border-color", "transparent");
      });
    }
  }

if(typeof exports != undefined)
  module.exports = Player;