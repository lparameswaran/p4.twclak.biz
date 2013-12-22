var tiles = new Array(10);
var minwords;
var maxlength;
var playtiles = new Array(10);
var gametiles = new Array(10);


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

function showMsg(message) {
   console.log(message);
   $("#gtile0").popover({ animation: true, html: true, content: message, placement: "auto top", trigger: "manual"});
   $("#gtile0").popover('show');
   window.setTimeout(function() {
          $("#gtile0").popover('destroy');
       }, 3000);
}

function submit(wsubmit, wclear) {
   if (wsubmit) {
      var playedword = "";
      var playedlen = "";
      for (var i = 0;i < maxlength;i ++) {
          if (gametiles[i].match("^ $")) break;
          playedlen++;
          playedword += playtiles[i];
      }
      if (playedlen < minwords) {
         showMsg("<h3 color=\"red\">Please play atleast " + minwords + " tiles</font>");
         return;
      } else if (playedlen > maxlength) {
         showMsg("<h3 color=\"red\">Please play a max of " + minwords + " tiles</font>");
         return;
      }
   }
}

function gtile(pos) {
    if (pos >= maxlength) {
       console.log("gtile - pos:" + pos + " >= " + maxlength);
       return;
    } 
    if (gametiles[pos].match("^ $")) {
       console.log("gtile - pos:" + pos + " is blank");
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
       console.log("ptile - pos:" + pos + " >= " + maxlength);
       return;
    } 
    if (playtiles[pos].match("^ $")) {
       console.log("ptile - pos:" + pos + " is blank");
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

function level(numwords) {
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
      console.log("Incorrect numwords=" + numwords + " for level()");
      return 1;
   }
   $.post( "/game/getwords", { numwords: numwords, minwords: minwords }, function( dataout ) {
     console.log("result = " + dataout);
     var data = jQuery.parseJSON(dataout);
     console.log("chars = " + data.chars);
     //console.log("lens = " + data.lens);
     //console.log("words = " + data.words);
     var words = new Array();
     var totalwords = 0;
     var totalletters = 0;
     for (var i = minwords;i <= numwords;i ++) {
         words["" + i] = new Array();
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
         console.log("Words of len " + i + ":" + words["" + i]);
         innerHTML += " <div id=\"wlist" + i + "\" class=\"col-md-3\">";
         innerHTML += "  <div class=\"row\"><div class=\"col-md-12 btn-success btn-lg\">Words of Length " + i + "</div></div>";
         innerHTML += "  <div class=\"row\">";
         innerHTML += "   <div id=\"whead" + i + "\" class=\"col-md-12 btn-info btn-lg\">Word Count: 0/" + words["" + i].length + "</div>";
         innerHTML += "  </div>";
         innerHTML += "  <div id=\"onlywords\" class=\"row\">";
         for (var j=0;j < words["" + i].length;j++) 
            innerHTML += "  <div id=\"eachword\" class=\"row\">" + "<div class=\"col-md-12 btn-default btn-sm\">" + words["" + i][j] + "</div>" + "</div>";
         innerHTML += "  </div>";
         innerHTML += " </div>";
     }
     innerHTML += "</div>";
     innerHTML += "<div id=\"title\" class=\"row\">";
     innerHTML += " <div class=\"col-md-8 btn-success btn-lg\">Can you guess all the " + totalwords + " words to earn " + totalletters + " points?</div>";
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
     innerHTML += " <div id=\"score\" class=\"col-md-1 btn-danger btn-lg\">0</div>";
     innerHTML += " <div class=\"col-md-1\"></div>";
     innerHTML += " <div id=\"submit\" class=\"col-md-2 btn-info btn-lg\" onclick=\"submit(true, false)\">Submit</div>";
     innerHTML += " <div class=\"col-md-1\"></div>";
     innerHTML += " <div id=\"submit\" class=\"col-md-2 btn-info btn-lg\" onclick=\"submit(true, true)\">Submit<br/>(autoclear)</div>";
     innerHTML += " <div class=\"col-md-1\"></div>";
     innerHTML += " <div id=\"clear\" class=\"col-md-2 btn-info btn-lg\" onclick=\"submit(false, true)\">Clear</div>";
     innerHTML += " <div class=\"col-md-1\"></div>";
     innerHTML += "</div>";
     document.getElementById("words").innerHTML = innerHTML;
     redraw();
   });
    
}
