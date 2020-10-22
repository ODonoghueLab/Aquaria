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
  mounted () {
    if (window.location.hash.includes('Structures')) {
      this.showMatches()
    }
    if (window.location.hash.includes('Features')) {
      this.showFeatures()
    }
  },
  methods: {
    showPanel: function (elem1, elem2) {
      document.querySelector('#' + elem1).style.display = 'flex'
      document.querySelector('#' + elem2 + ' > a').style.color = 'white'
      document.querySelector('#' + elem2 + ' > a > span').style.backgroundColor = 'white'
    },
    hidePanel: function (elem1, elem2) {
      document.querySelector('#' + elem1).style.display = 'none'
      document.querySelector('#' + elem2 + ' > a').style.color = '#ffffff00'
      document.querySelector('#' + elem2 + ' > a > span').style.backgroundColor = '#ffffff00'
    },
    hidePanels: function () {
      document.querySelectorAll('div.dimmer').forEach(el => el.remove())
      this.hidePanel('vis', 'Structures')
      this.hidePanel('featurelist', 'Features')
    },
    showMatches: function () {
      const _this = this
      _this.showPanel('vis', 'Structures')
      _this.hidePanel('featurelist', 'Features')
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      document.querySelector('div.dimmer').style.zIndex = '0'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        _this.hidePanels()
      })
    },
    showFeatures: function () {
      const _this = this
      _this.hidePanel('vis', 'Structures')
      _this.showPanel('featurelist', 'Features')
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      document.querySelector('div.dimmer').style.zIndex = '0'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        _this.hidePanels()
      })
    }
  }
}
</script>

<style>
#Structures, #Features {
    color: '#ffffff00'
}
.icons{
    z-index: 1;
    position: absolute;
    bottom: 11px;
}

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
