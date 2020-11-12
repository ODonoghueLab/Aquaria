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
      document.querySelectorAll('.tab').className = 'tab inactive'
      document.querySelector('#' + elem2).className = 'tab active'
      // document.querySelector('#' + elem2 + ' > a').style.color = 'white'
      // document.querySelector('#' + elem2 + ' > a > span').style.backgroundColor = 'white'
    },
    hidePanel: function (elem1, elem2) {
      document.querySelector('#' + elem1).style.display = 'none'
      document.querySelector('#' + elem2).className = 'tab inactive'
      // document.querySelector('#' + elem2 + ' > a').style.color = '#ffffff00'
      // document.querySelector('#' + elem2 + ' > a > span').style.backgroundColor = '#ffffff00'
    },
    hidePanels: function () {
      document.querySelectorAll('div.dimmer').forEach(el => el.remove())
      this.hidePanel('vis', 'Structures')
      this.hidePanel('featurelist', 'Features')
      document.querySelector('#Structures').className = 'tab'
      document.querySelector('#Features').className = 'tab'
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
    line-height: 31px;
    transition: all 0s ease 0s;
    width: 90vw;
    display: flex;
    background-color: var(--transparent);
    position: relative;
    left: 50%;
    transform: translate(-50%, 15%);
    align-items: baseline;
    padding: 5px calc(4px + 0.4vw);
    font-size: calc(8px + .6vw);
}
.tab {
    flex: 0 3 auto;
    height: 2rem;
    padding: 0.2rem 0.5rem;
    transition: All 0.5s ease;
    min-width: 6rem;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}
.tab.active a, .tab.active a:hover {
    color: var(--dark-text);
}
.tab.active, .tab.active:hover {
    background-color: var(--bg-highlite);
}
.tab:hover, .tab.inactive  {
    background-color: rgba(180, 180, 180, 0.7);
}
span.icon {
    display: inline-block;
    background-color: transparent;
    width: calc(1.25rem + 1vh);
    height: calc(1.25rem + 1vh);
    border-radius: 50%;
    transition: All 0.5s ease;
}
/* .tab a:hover span.icon {
    background-color: #eee;
    transition: All 0.5s ease;
} */
/* .tab.active a span.icon {
    background-color: transparent;
} */
.tab a {
    color: var(--transparent);
    text-decoration: none;
    transition: All 0.5s ease;
}
.tab a:hover  {
    color: #FFF;
    text-decoration: none;
    transition: All 0.5s ease;
}
.tab.inactive a { color: #dedede; }
.icon img {
    height:  calc(1rem + 1vh);
    margin-top: -0.175rem;
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
