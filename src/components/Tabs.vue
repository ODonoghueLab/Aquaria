<template>
    <div class="tabs">
      <div class="tab" id="Structures">
        <a href="#Structures">Matching Structures&nbsp;<span class="icon"><img v-bind:src="MS" /></span></a>
      </div>
      <MatchingStructures class='panel'/>
      <div class="tab" id="Features">
        <a href="#Features"><span class="icon"><img v-bind:src="FT" /></span> Features</a>
      </div>
      <FeatureList class='panel'/>
    </div>
</template>

<script>
import MatchingStructures from './MatchingStructures'
import FeatureList from './Features'
export default {
  name: 'Tabs',
  components: {
    MatchingStructures,
    FeatureList
  },
  data () {
    return {
      MS: require('../assets/img/MS-01.svg'),
      FT: require('../assets/img/FT-01.svg')
    }
  },
  mounted () {
    document.querySelector('.icon').addEventListener('click', function () {
    //   document.querySelector('.tabs').style.position = 'sticky'
      if (document.getElementsByClassName('dimmer').length === 0) {
        var elemDiv = document.createElement('div')
        elemDiv.className = 'dimmer'
        document.body.append(elemDiv)
        document.querySelector('.tabs > .panel').style.display = 'block'
        // document.querySelector('#switch').style.display = 'block'
        document.querySelector('div.dimmer').style.height = '100%'
        document.querySelector('div.dimmer').style.zIndex = '0'
        document.querySelector('div.dimmer').addEventListener('click', function () {
          document.querySelector('.tabs > .panel').style.display = 'none'
          document.querySelector('div.dimmer').remove()
        })
      } else {
        document.querySelector('div.dimmer').remove()
        // document.querySelector('#vis').style.display = 'none'
        // document.querySelector('.tabs').style.position = 'relative'
      }
    })
  }
}
</script>

<style>
/* .tabs {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    position: fixed;
    z-index: 2;
    bottom: 4px;
    background: #f0f8ff00;
} */
.tabs{
    position: fixed;
    z-index: 1;
    display: flex;
    bottom: 1px;
}
#Structures{
    float: left;
}
#Features{
    float: right;
}
</style>
