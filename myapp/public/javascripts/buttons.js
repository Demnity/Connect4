function toggleInfo() {
  if ($("#info").css("display") == "none") $("#info").css("display", "block");
  else $("#info").css("display", "none");
}

function toggleSound() {
  var audioArr = $("audio").toArray();
  if (audioArr[0].muted == true)
    audioArr.forEach(function(audio) {
      audio.muted = false;
    });
  else
    audioArr.forEach(function(audio) {
      audio.muted = true;
    });
}
