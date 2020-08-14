var browser = navigator.userAgent;
console.log("browser_check browser is: " + browser);
console.log("browser_check Macintosh", browser.indexOf("Macintosh") != -1);
console.log("browser_check Windows", browser.indexOf("Windows") != -1);
console.log("browser_check Safari", browser.indexOf("Safari") != -1);
console.log("browser_check Chrome", browser.indexOf("Chrome") != -1);
console.log("browser_check Firefox", navigator.userAgent.indexOf("Firefox") != -1);
if (browser.indexOf("Safari") != -1 && browser.indexOf("Chrome") === -1 && navigator.userAgent.indexOf("Firefox") === -1) {
  $("body").addClass("safari");
} 

if (browser.indexOf("Windows") != -1) {
  $("body").addClass("windows");
}

window.threedViewer = 'jolecule';

if (window.threedViewer === 'Applet' && !deployJava.versionCheck("1.6.0+")) {
  $("#structureviewer h3")
    .after(
      '<div id="FFMenubug_note" class="aquariaWarning"><p>Aquaria requires Java to be installed on the system. <strong>Please download Java from <a href="http://java.com/en/download/index.jsp" target="_blank">Sun</a></strong>.</p><p><button id="myButton" type="button" onclick="$(\'#FFMenubug_note\').remove();">Okay, It\'s installed now.</button></div>'
    );
}

window.showAquariaSetup = function() {
  $("#threeD").css("visibility", "hidden");
  //  $("#structureviewer").hide();
  $("#updateJava3D").show();
};

console.log("browser_check window.threedViewer =", window.threedViewer);

function showMsg(txt) {
  $("#content").hide();
  $("#bad_browser").show();
  $("#bad_browser").append("<p style='font-size: 1.5em;'>" + txt + "</p><p style='color: #999;'>Your browser: " + browser + "</p>");
}
