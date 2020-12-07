<template>
  <div>
        <div id="updateJava3D" class="aquariaWarning">
          <p><strong>Aquaria needs to update your Java3D.</strong></p>
          <form action="/downloads/AquariaSetupMac.dmg">
            <p>1. <button id="myButton" type="submit">Download Aquaria Setup</button></p>
          </form>
          <p>2. After downloading, run AquariaSetupMac.dmg from your Downloads folder.</p>
          <p>3. Restart your browser once the setup is finished.</p><br>
          <p>For more information see <a href="https://docs.google.com/document/d/1waNOvw442Bwncx_FlMJAATH35aJxXpxu0iRcrZt8hrQ/pub" target="_blank">Aquaria help</a>.</p>
        </div>
        <span class="threedcontent resizable" id="threeD">
              <span id="threeDSpan">
              </span>
                <iframe src="/html/waiting.html" frameBorder="0" name="waitingFrame" id="waitingFrame" scrolling="no" allowtransparency="true">
                <p>Your browser does not support iframes.</p>
              </iframe>
                <iframe src="/html/selectionText.html" frameBorder="0" name="selectionText" id="selectionText" scrolling="no" allowtransparency="true" style="bottom: 20px; left: 20px;">
                <p>Your browser does not support iframes.</p>
              </iframe>
        </span>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'StructureViewer',
  mounted () {
    function checkPhone () {
      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ]

      if (navigator.platform) {
        while (iDevices.length) {
          if (navigator.platform === iDevices.pop() || (screen.width >= 300 && screen.width <= 600)) { return true }
        }
      } else {
        return false
      }
    }
    var isPhone = checkPhone()
    if (isPhone) {
      if ((window.outerHeight - window.innerHeight) >= 80) {
        $('#structureviewer').css({
          height: '88vh'
        })
        window.scrollTo(0, 0)
      } else {
        $('#structureviewer').css({
          height: '103vh'
        })
        window.scrollTo(0, 0)
      }
      window.addEventListener('resize', function () {
        if ((window.outerHeight - window.innerHeight) >= 80) {
          $('#structureviewer').css({
            height: '88vh'
          })
          window.scrollTo(0, 0)
        } else {
          $('#structureviewer').css({
            height: '103vh'
          })
          window.scrollTo(0, 0)
        }
      })
    }
  }
}
</script>

<style scoped>
#structureviewer{
  /* height: 150vh;
  position: absolute;
  margin-top: -90px; */
    position: fixed;
    top: 0px;
    height: 150vh;
}

#updateJava3D {
    display: none;
}
.aquariaWarning, .aquariaWarning button {
    font-size: 105%;
}
.aquariaWarning {
    position: absolute;
    top: 50px;
    left: 30%;
    background: #FAC88C;
    border: 15px solid transparent;
    border-image: url(/../public/images/border-1.png) 15 15 round;
    margin: 12px auto;
    width: 40%;
    padding: 20px 20px 14px 20px;
    text-align: left;
    box-shadow: 6px 6px 15px #669;
    z-index: 999;
}

#selectionText {
    overflow: hidden;
    position: absolute;
    z-index: 95;
    pointer-events: none;
    display: none;
    padding: 0px;
    margin: 0px;
    width: 200px;
    height: 100px;
}

#waitingFrame {
    overflow: hidden;
    width: 100vw;
    top: 0px;
    height: 100vh;
    position: fixed;
    z-index: 101;
    pointer-events: none;
    display: none;
    /* padding: 0px;
    margin: 0px;
    width: 100%;
    height: 107vh;
    bottom: 112vh; */
}

/* div.panel span#threeD {
    height: 100vh;
    width: 100vw;
}
div.panel span#threeD {
    overflow: hidden;
    min-height: 100vh;
    z-index: 10;
}

#threeDSpan {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: absolute;
    z-index: 1;
} */

.jolecule-embed-toolbar, .jolecule-embed-toolbar a {
    color: #777;
    text-decoration: none;
}
.jolecule-embed-toolbar {
    padding: 5px 5px 2px 5px;
    vertical-align: middle;
    background-color: #CCC;
    color: #666;
    font-family: helvetica;
    font-size: 12px;
    letter-spacing: 0.05em;
    overflow: hidden;
    box-sizing: border-box;
}

.jolecule-embed-body {
    font-size: 12px;
    font-family: helvetica;
    letter-spacing: 0.05em;
    line-height: 1.2em;
    color: #666;
}

.jolecule-overlay-text {
    z-index: 5001;
    padding: 10px;
    opacity: 0.7;
    text-align: left;
    letter-spacing: 0.1em;
    line-height: 1.5em;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    border: 1px solid #888;
    background-color: rgba(200, 200, 200, 0);
    color: #333;
}
</style>
