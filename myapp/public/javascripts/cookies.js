  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  var visits = 1;
  if(getCookie("noVisit") == ""){
    setCookie("noVisit", 1, 5);
  }
  else{
      visits = getCookie("noVisit");
      setCookie("noVisit", parseInt(visits) + 1, 5);
  }

  var outMsg;
  if(parseInt(visits) > 1)
    $('#timesVisited').html("You have visited: "+ visits +" times");