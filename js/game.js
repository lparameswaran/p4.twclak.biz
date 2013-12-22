var minwords;
var maxlength;
var tiles;
var playtiles;
var gametiles;
var words;
var hwords;
var earnedscore;
var playedwords;
var totalwords = 0;
var totalletters = 0;
var final = false;
var showlog = false;
var timer;
var timerseconds = 100; /* 5 minute timer */

function myTimer()
{
   if (final) return;
   timerseconds --;
   if (timerseconds < 0) timerseconds = 0;
   var timedisp = "";
   var timemm = Math.floor(timerseconds / 60);
   var timess = Math.floor(timerseconds % 60);
   if (timemm < 10) timedisp = "0" + timemm;
   else timedisp = timemm;
   timedisp += ":";
   if (timess < 10) timedisp += "0" + timess;
   else timedisp += timess;
   $("#time").html(timedisp);
   if (timerseconds <= 0) showFinalScore(true);
}

function debug(showmsg) {
   if (showmsg && showmsg == true)
      showlog = true;
   else 
      showlog = false;
}

function draw(wordlen) {
   var innerHTML = "";
   for (var j=hwords["" + wordlen].length - 1;j >= 0;j--) {
       innerHTML += "  <div id=\"word" + wordlen + "_" + j + "\" class=\"row eachword\">" +
                    "<div class=\"col-md-12 btn-default btn-sm\">" + hwords["" + wordlen][j] + "</div>" + "</div>";
   }
   $("#onlywords" + wordlen).html(innerHTML);
   $("#score").html(earnedscore);
   $("#whead" + wordlen).html("Word Count: " + hwords["" + wordlen].length + "/" + words["" + wordlen].length);
   if (earnedscore == totalletters) {
      showFinalScore(false);
   } else {
      showOkMsg("Word OK", wordlen);
   }
}

function showFinalWordList() {
   // Write the words the user guess first
   for (var wordlen = minwords;wordlen <= maxlength;wordlen ++) {
      var innerHTML = "";
      for (var j=hwords["" + wordlen].length - 1;j >= 0;j--) {
          innerHTML += "  <div id=\"word" + wordlen + "_" + j + "\" class=\"row eachword\">" +
                       "<div class=\"col-md-12 btn-default btn-sm\">" + hwords["" + wordlen][j] + "</div>" + "</div>";
      }
      for (var j=words["" + wordlen].length - 1;j >= 0;j--) {
          var alreadydisp = false;
          for (var k=hwords["" + wordlen].length - 1;k >= 0;k--) {
              if (hwords["" + wordlen][k].match("^" + words["" + wordlen][j] + "$")) {
                 alreadydisp = true;
              }
          }
          if (!alreadydisp) {
             innerHTML += "  <div id=\"word" + wordlen + "_" + j + "\" class=\"row eachword\">" +
                          "<div class=\"col-md-12 btn-danger btn-sm\">" + words["" + wordlen][j] + "</div>" + "</div>";
          }
      }
      $("#onlywords" + wordlen).html(innerHTML);
   }
}


function redraw() {
   for (var i = 0;i < playtiles.length;i ++) {
      if (playtiles[i] == " ") { 
         $("#ptile" + i).button('disable');
         $("#ptile" + i).html("&nbsp;");
      } else {
         $("#ptile" + i).button('enable');
         $("#ptile" + i).html(playtiles[i]);
      }
   }
   for (var i = 0;i < gametiles.length;i ++) {
      if (gametiles[i] == " ") {
         $("#gtile" + i).button('disable');
         $("#gtile" + i).html("&nbsp;");
      } else {
         $("#gtile" + i).button('enable');
         $("#gtile" + i).html(gametiles[i]);
      }
   }
}

function showFinalScore(timerranout) {
   if (final) return;
   if (showlog) console.log("showFinalScore");
   final = true;
   $('#submitclr').prop('disabled', true);
   $('#submitclr').removeClass('btn-info');
   $('#submitnclr').prop('disabled', true);
   $('#submitnclr').removeClass('btn-info');
   $('#clear').prop('disabled', true);
   $('#clear').removeClass('btn-info');
   var message, shortmsg;
   if (earnedscore == totalletters) {
      message = "Congratulations... you guessed all the words correctly -- you are a genius!";
      shortmsg = "Congrats Genius!";
   } else if (earnedscore == 0) {
      message = "No words? Hmm... Time to brush up on vocab skills!"
      shortmsg = "Better luck next time!";
   } else if (earnedscore > 0.4 * totalletters) {
      message = "Wow, you are a walking dictionary!"
      shortmsg = "Great job!";
   } else {
      message = "Yes, the words were tough, even I had to rake my memory!"
      shortmsg = "You are getting there!";
   }
   message = "Points: " + earnedscore + "/" + totalletters + "\n" + message;
   if (showlog) console.log(message);
   $("#titlemsg").html("You earned " + earnedscore + "/" + totalletters + " points. " + shortmsg); 
   $("#score").popover({ animation: true, html: true, content: message, placement: "auto top", trigger: "manual"});
   $("#score").popover('show');
   if (timer && timer != null) {
      clearInterval(timer);
   }
   timer = null;
   showFinalWordList();
   window.setTimeout(function() {
          $("#score").popover('destroy');
       }, 7000);
}

function showOkMsg(message, wordlen) {
   var pos = ("#onlywords" + wordlen); 
   $(pos).popover({ animation: true, html: true, content: message, placement: "auto top", trigger: "manual"});
   $(pos).popover('show');
   $("#score").popover({ animation: true, html: true, content: message, placement: "auto top", trigger: "manual"});
   $("#score").popover('show');
   window.setTimeout(function() {
          $(pos).popover('destroy');
          $("#score").popover('destroy');
       }, 3000);
}

function showMsg(pos, message) {
   $(pos).popover({ animation: true, html: true, content: message, placement: "auto top", trigger: "manual"});
   $(pos).popover('show');
   window.setTimeout(function() {
          $(pos).popover('destroy');
       }, 3000);
}

function submit(wsubmit, wclear) {
   if (final) return;
   if (wsubmit) {
      var playedword = "";
      var playedlen = "";
      var i;
      for (i = 0;i < maxlength;i ++) {
          if (gametiles[i].match("^ $")) break;
          playedlen++;
          playedword += gametiles[i].toLowerCase();
      }
      if (playedlen < minwords) {
         showMsg("#gtile0", "<h3 style=\"color:red\">Please play atleast " + minwords + " tiles</h3>");
         return;
      } else if (playedlen > maxlength) {
         showMsg("#gtile0", "<h3 color=\"red\">Please play a max of " + maxlength + " tiles</font>");
         return;
      }
      // Is it a a valid word?
      var valid = false;
      for (var j = 0;j < words["" + playedlen].length;j ++) {
         if (words["" + playedlen][j].match("^" + playedword + "$")) {
            valid = true;
            break;
         }
      }
      if (!valid) {
         if (showlog) console.log("Word: " + playedword + " len:" + playedlen + " maxlen:" + maxlength);
         showMsg("#gtile0", "<h3 style=\"color:red\">Word is not in SCOWL dictionary!</h3>");
         return;
      }
      // Has it already been played?
      var alreadyplayed = false;
      for (var j = 0;j < hwords["" + playedlen].length;j ++) {
         if (hwords["" + playedlen][j].match("^" + playedword + "$")) {
            alreadyplayed = true;
            break;
         }
      }
      if (alreadyplayed) {
         showMsg("#gtile0", "<h3 style=\"color:red\">Word has already been played!</h3>");
         return;
      }

      // It is a valid word, which has not been played before
      hwords["" + playedlen].push(playedword);
      showMsg("#gtile0", "<h3 style=\"color:green\">Good job!</h3>");
      earnedscore += playedlen;
      playedwords ++;
      draw(playedlen);
   }
   if (wclear) {
      // Just move all the gametiles to play tiles
      for (var i = 0;i < maxlength;i ++) {
          if (gametiles[0].match("^ $")) { break; }
          for (var j = 0;j < maxlength;j ++) {
              if (playtiles[j].match("^ $")) { break; }
          }
          playtiles[j] = gametiles[0];
          for (var k = 0;k < maxlength - 1;k ++) {
             gametiles[k] = gametiles[k + 1];
          }
          gametiles[maxlength - 1] = " ";
          redraw();
      }
   }
}

function gtile(pos) {
    if (pos >= maxlength) {
       if (showlog) console.log("gtile - pos:" + pos + " >= " + maxlength);
       return;
    } 
    if (gametiles[pos].match("^ $")) {
       if (showlog) console.log("gtile - pos:" + pos + " is blank");
       return;
    }
    var i, j;
    for (i = 0;i < maxlength; i ++) {
       if (playtiles[i].match("^ $")) break; 
    }   
    playtiles[i] = gametiles[pos];
    for (j = pos;j < maxlength - 1; j ++) {
       gametiles[j] = gametiles[j + 1]; 
    }   
    gametiles[maxlength - 1] = " ";
    redraw();
}
function ptile(pos) {
    if (pos >= maxlength) {
       if (showlog) console.log("ptile - pos:" + pos + " >= " + maxlength);
       return;
    } 
    if (playtiles[pos].match("^ $")) {
       if (showlog) console.log("ptile - pos:" + pos + " is blank");
       return;
    }
    var i, j;
    for (i = 0;i < maxlength; i ++) {
       if (gametiles[i].match("^ $")) break; 
    }
    gametiles[i] = playtiles[pos];
    for (j = pos;j < maxlength - 1; j ++) {
       playtiles[j] = playtiles[j + 1];
    }
    playtiles[maxlength - 1] = " ";
    redraw();
}

function reset(numwords) {
    // Clear old game history
    if (words) words.length = 0;
    if (hwords) hwords.length = 0;
    if (tiles) tiles.length = 0;
    if (playtiles) playtiles.length = 0;
    if (gametiles) gametiles.length = 0;

    // Create fresh set of arrays for the new game
    words = new Array();  // List of valid words
    hwords = new Array(); // List of words already played
    tiles = new Array(numwords);
    playtiles = new Array(numwords);
    gametiles = new Array(numwords);
    earnedscore = 0;
    playedwords = 0;
    totalwords = 0;
    totalletters = 0;
    final = false;
    timerseconds = 100;
    var timedisp = "";
    var timemm = Math.floor(timerseconds / 60);
    var timess = Math.floor(timerseconds % 60);
    if (timemm < 10) timedisp = "0" + timemm;
    else timedisp = timemm;
    timedisp += ":";
    if (timess < 10) timedisp += "0" + timess;
    else timedisp += timess;
    $("#time").html(timedisp);
    if (timer && timer != null) {
       clearInterval(timer);
    }
    timer = setInterval(function(){myTimer()},1000);
}

function level(numwords) {
   reset(numwords);
   for (var wlen = 3;wlen <= 10;wlen ++) {
      $("#btn" + wlen).removeClass("btn-info");
   }
   $("#btn" + numwords).addClass("btn-info");
   maxlength = numwords;
        if (numwords == 3)  minwords = 3;
   else if (numwords == 4)  minwords = 3;
   else if (numwords == 5)  minwords = 3;
   else if (numwords == 6)  minwords = 3;
   else if (numwords == 7)  minwords = 4;
   else if (numwords == 8)  minwords = 5;
   else if (numwords == 9)  minwords = 6;
   else if (numwords == 10) minwords = 7;
   else {
      if (showlog) console.log("Incorrect numwords=" + numwords + " for level()");
      return 1;
   }
   $.post( "/game/getwords", { numwords: numwords, minwords: minwords }, function( dataout ) {
     if (showlog) console.log("result = " + dataout);
     var data = jQuery.parseJSON(dataout);
     if (showlog) console.log("chars = " + data.chars);
     //console.log("lens = " + data.lens);
     //console.log("words = " + data.words);
     playedwords = 0;
     earnedscore = 0;
     totalwords = 0;
     totalletters = 0;
     for (var i = minwords;i <= numwords;i ++) {
         words["" + i] = new Array();
         hwords["" + i] = new Array();
     }
     for (var i = 0;i < data.lens.length;i ++) {
         words["" + data.lens[i]].push(data.words[i]);
         totalwords ++;
         totalletters += data.lens[i];
     }
     for (var i = 0;i < data.chars.length;i ++) {
         tiles[i] = data.chars[i].toUpperCase();
         gametiles[i] = " ";
         playtiles[i] = tiles[i];
     }
     var innerHTML = "";
     innerHTML += "<div id=\"allwords\" class=\"row\">";
     for (var i = minwords;i <= numwords;i ++) {
         if (showlog) console.log("Words of len " + i + ":" + words["" + i]);
         innerHTML += " <div id=\"wlist" + i + "\" class=\"col-md-3\">";
         innerHTML += "  <div class=\"row\"><div class=\"col-md-12 btn-success btn-lg\">Words of Length " + i + "</div></div>";
         innerHTML += "  <div class=\"row\">";
         innerHTML += "   <div id=\"whead" + i + "\" class=\"col-md-12 btn-info btn-lg\">Word Count: " +
                                                     hwords["" + i].length + "/" + words["" + i].length + "</div>";
         innerHTML += "  </div>";
         innerHTML += "  <div id=\"onlywords" + i + "\" class=\"row\">";
         for (var j=0;j < hwords["" + i].length;j++) 
            innerHTML += "  <div id=\"word" + i + "_" + j + "\" class=\"row\">" + "<div class=\"col-md-12 btn-default btn-sm\">" + hwords["" + i][j] + "</div>" + "</div>";
         innerHTML += "  </div>";
         innerHTML += " </div>";
     }
     innerHTML += "</div>";
     innerHTML += "<div id=\"title\" class=\"row\">";
     innerHTML += " <div id=\"titlemsg\" class=\"col-md-8 btn-success btn-lg\">";
     if (totalwords > 1) {
        innerHTML += "Can you guess all the " + totalwords + " words to earn " + totalletters + " points?</div>";
     } else {
        innerHTML += "Can you guess the " + totalwords + " word to earn " + totalletters + " points?</div>";
     }
     innerHTML += " <div class=\"col-md-1 btn-default\"></div>";
     innerHTML += " <div id=\"time-title\" class=\"col-md-2 btn-info btn-lg\">Time Left: </div>";
     innerHTML += " <div id=\"time\" class=\"col-md-1 btn-success btn-lg\">00:00</div>";
     innerHTML += "</div>";
     innerHTML += "<div id=\"space\" class=\"row\"></div>";
     var i;
     innerHTML += "<div id=\"gametiles\" class=\"row\">";
     innerHTML += " <div id=\"gtile-title\" class=\"col-md-2 btn-warning btn-lg\">Game Tiles:</div>";
     for (i = 0;i < data.chars.length;i ++) {
        innerHTML += " <button type=\"button\" onclick=\"gtile(" + i + ")\" id=\"gtile" + i + "\" class=\"col-md-1 btn-default btn-lg\">" + "</button>";
     }
     if (i < 10) {
        innerHTML += " <div id=\"gtile" + i + "\" class=\"col-md-" + (10 - i) + "\"></div>";
     }
     innerHTML += "</div>";
     innerHTML += "<div id=\"space\" class=\"row\"></div>";
     innerHTML += "<div id=\"playertiles\" class=\"row\">";
     innerHTML += " <div id=\"ptile-title\" class=\"col-md-2 btn-warning btn-lg\">Your Tiles:</div>";
     for (i = 0;i < data.chars.length;i ++) {
        innerHTML += " <button type=\"button\" onclick=\"ptile(" + i + ")\" id=\"ptile" + i + "\" class=\"col-md-1 btn-default btn-lg\"></button>";
     }
     if (i < 10) {
        innerHTML += " <div id=\"ptile" + i + "\" class=\"col-md-" + (10 - i) + "\"></div>";
     }
     innerHTML += "</div>";
     innerHTML += "<div id=\"space\" class=\"row\"></div>";
     innerHTML += "<div id=\"buttons\" class=\"row\">";
     innerHTML += " <div id=\"scoretext\" class=\"col-md-1 btn-info btn-lg\">Your<br/>Score:</div>";
     innerHTML += " <div id=\"score\" class=\"col-md-1 btn-danger btn-lg\">" + earnedscore + "</div>";
     innerHTML += " <div class=\"col-md-1\"></div>";
     innerHTML += " <div id=\"submitclr\" class=\"col-md-2 btn-info btn-lg\" onclick=\"submit(true, false)\">Submit</div>";
     innerHTML += " <div class=\"col-md-1\"></div>";
     innerHTML += " <div id=\"submitnclr\" class=\"col-md-2 btn-info btn-lg\" onclick=\"submit(true, true)\">Submit<br/>(autoclear)</div>";
     innerHTML += " <div class=\"col-md-1\"></div>";
     innerHTML += " <div id=\"clear\" class=\"col-md-2 btn-info btn-lg\" onclick=\"submit(false, true)\">Clear</div>";
     innerHTML += " <div class=\"col-md-1\"></div>";
     innerHTML += "</div>";
     document.getElementById("words").innerHTML = innerHTML;
     redraw();
   });
    
}
