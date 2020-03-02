<template>
  <div class="panel" id="strctureviewer">
    <Title3D/>
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
                <iframe src="../assets/html/waiting.html" frameBorder="0" name="waitingFrame" id="waitingFrame" scrolling="no" allowtransparency="true">
                <p>Your browser does not support iframes.</p>
              </iframe>
                <iframe src="../assets/html/selectionText.html" frameBorder="0" name="selectionText" id="selectionText" scrolling="no" allowtransparency="true" style="bottom: 20px; left: 20px;">
                <p>Your browser does not support iframes.</p>
              </iframe>
        </span>
  </div>
</template>

<script>
import Title3D from './Title3D'

export default {
  name: 'StructureViewer',
  components: {
    Title3D
  }
}
</script>

<style>

</style>
