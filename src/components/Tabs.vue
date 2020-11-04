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
    // var iconLeft = document.querySelector('#affordance_mode').offsetWidth - document.querySelector('.tabs').offsetWidth
    // iconLeft = iconLeft + 'px'
    // document.querySelector('.tabs').style.marginLeft = iconLeft
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
      // const soupController = window.AQUARIA.panel3d.embededJolecule.controller
      // soupController.clearSelectedResidues()
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
      if (window.AQUARIA.panel3d) {
        const soupController = window.AQUARIA.panel3d.embededJolecule.controller
        soupController.clearSelectedResidues()
      }
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
  // updated () {
  //   var iconLeft = document.querySelector('#affordance_mode').offsetWidth - document.querySelector('.tabs').offsetWidth
  //   iconLeft = iconLeft + 'px'
  //   document.querySelector('.tabs').style.marginLeft = iconLeft
  // }
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
    padding-left: 12px;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
    line-height: 31px;
    transition: all 0s ease 0s;
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    display: -webkit-box;
    display: -ms-flexbox;
    display: inline-table;
    background-color: var(--transparent);
    position: fixed;
    left: 45%;
    /* top: 28px; */
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -87%);
    -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
    border-radius: 5em;
    padding: 5px calc(4px + 0.4vw);
    font-size: calc(8px + .6vw);
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
