<template>
    <div class="icons">
        <div class="tabs">
            <div class="tab" id="Structures" @click='showMatches'>
                <a href="#Structures">Matching Structures&nbsp;
                <span class="icon"><img v-bind:src="MS" /></span></a>
            </div>
            <div class="tab" id="Features" @click='showFeatures'>
                <a href="#Features"><span class="icon"><img v-bind:src="FT" /></span> Features</a>
            </div>
        </div>
        <MatchingStructures />
        <FeatureList />
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
  methods: {
    showMatches: function () {
      document.querySelector('#featurelist').style.display = 'none'
      document.querySelector('#Features > a').style.color = '#ffffff00'
      document.querySelector('#Features > a > span').style.backgroundColor = '#ffffff00'
      document.querySelector('#vis').style.display = 'flex'
      document.querySelector('#Structures > a').style.color = 'white'
      document.querySelector('#Structures > a > span').style.backgroundColor = 'white'
      if (document.getElementsByClassName('dimmer').length === 0) {
        var elemDiv = document.createElement('div')
        elemDiv.className = 'dimmer'
        document.body.append(elemDiv)
        document.querySelector('div.dimmer').style.zIndex = '0'
        document.querySelector('div.dimmer').addEventListener('click', function () {
          document.querySelector('div.dimmer').remove()
          document.querySelector('#vis').style.display = 'none'
          document.querySelector('#featurelist').style.display = 'none'
          document.querySelector('#Structures > a').style.color = '#ffffff00'
          document.querySelector('#Structures > a > span').style.backgroundColor = '#ffffff00'
          document.querySelector('#Features > a').style.color = '#ffffff00'
          document.querySelector('#Features > a > span').style.backgroundColor = '#ffffff00'
        })
      }
    },
    showFeatures: function () {
      document.querySelector('#vis').style.display = 'none'
      document.querySelector('#Structures > a').style.color = '#ffffff00'
      document.querySelector('#Structures > a > span').style.backgroundColor = '#ffffff00'
      document.querySelector('#featurelist').style.display = 'flex'
      document.querySelector('#Features > a').style.color = 'white'
      document.querySelector('#Features > a > span').style.backgroundColor = 'white'
      if (document.getElementsByClassName('dimmer').length === 0) {
        var elemDiv = document.createElement('div')
        elemDiv.className = 'dimmer'
        document.body.append(elemDiv)
        document.querySelector('div.dimmer').style.zIndex = '0'
        document.querySelector('div.dimmer').addEventListener('click', function () {
          document.querySelector('div.dimmer').remove()
          document.querySelector('#featurelist').style.display = 'none'
          document.querySelector('#Features > a').style.color = '#ffffff00'
          document.querySelector('#Features > a > span').style.backgroundColor = '#ffffff00'
          document.querySelector('#vis').style.display = 'none'
          document.querySelector('#Structures > a').style.color = '#ffffff00'
          document.querySelector('#Structures > a > span').style.backgroundColor = '#ffffff00'
        })
      }
    }
  },
  mounted () {
    document.querySelector('#Structures').style.color = '#ffffff00'
    document.querySelector('#Features').style.color = '#ffffff00'
  }
}
</script>

<style>
.icons{
    z-index: 1;
    position: absolute;
    bottom: 11px;
}
/* .tabs {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    position: fixed;
    z-index: 2;
    bottom: 4px;
    background: #f0f8ff00;
} */
.highlighted{
    background-color: var(--primary-tab);
    opacity: 1;
    height: auto;
    order: 3;
    display: flex;
    flex-direction: column;
    width: 100%;
    transition: All 0.8s ease;
}

.tabs{
    z-index: 1;
    display: block;
}

#vis, #featurelist{
    background-color: var(--primary-tab);
    opacity: 1;
    height: auto;
    order: 3;
    /* display: flex; */
    flex-direction: column;
    /* width: 100%; */
    transition: All 0.8s ease;
}
</style>
