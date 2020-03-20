<template>
<div>
    <StructureViewer id="structureviewer"/>
    <Structures class="panel" id="structurematches" data-intro=" " data-position="top" />
    <AboutAquaria />
</div>
</template>

<script>
import StructureViewer from './StructureViewer'
import Structures from './Structures'
import AboutAquaria from './AboutAquaria'
import $ from 'jquery'

export default {
  name: 'Center',
  components: {
    StructureViewer,
    Structures,
    AboutAquaria
  },
  mounted () {
    var width = window.innerWidth - 75
    $('#structurematches').css({
      width: width
    })
    $('#threeDSpan-inner-sequence-widget-inner canvas').on('click', function () {
      $('#structurematches').show()
    })
  }
}
</script>

<style scoped>
#structurematches{
  position: fixed;
  top: 4vh;
  height: 93vh;
  z-index: 4;
  margin-left: 27px;
  overflow-y: scroll;
  display: none;
}
#structureviewer{
  width: 100%;
}
</style>
