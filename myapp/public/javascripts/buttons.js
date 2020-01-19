function toggleInfo() {
  if ($("#info").css("display") == "none") $("#info").css("display", "block");
  else $("#info").css("display", "none");
}

function toggleSound() {
  var audioArr = $("audio").toArray();
  if (audioArr[0].muted == true)
    audioArr.forEach(function(audio) {
      audio.muted = false;
      $(".volume")[0].src = "images/volume.png";
    });
  else
    audioArr.forEach(function(audio) {
      audio.muted = true;
      $(".volume")[0].src = "images/mute.png";
    });
}

function fullscreen() {
  $("body")[0].requestFullscreen();
}
