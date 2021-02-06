<template>
<div>
    <div id="menu-btn" class="item"><a href="#Menu"><img :src="menu" /></a></div>
    <Menu />
    <StructureViewer id="structureviewer"/>
    <AboutAquaria />
    <Tabs />
    <CoverageMap />
    <PopUp />
</div>
</template>

<script>
import CoverageMap from '../Footer/CoverageMap'
import StructureViewer from '../StructureViewer/StructureViewer'
import AboutAquaria from '../InfoAbout/AboutAquaria'
import Tabs from '../AquariaLayout/Tabs'
import $ from 'jquery'
import Menu from '../AquariaLayout/Menu'
import PopUp from '../AquariaLayout/PopUp'
export default {
  name: 'Center',
  components: {
    StructureViewer,
    AboutAquaria,
    Tabs,
    Menu,
    CoverageMap,
    PopUp
  },
  data () {
    return {
      menu: require('../../assets/img/aquaria-menu.svg')
    }
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

<style>
#XRbutton{
  display: none;
}
#menu-btn{
  z-index: 1;
  position: fixed;
  right: 6px;
  top: 18px;
}
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
