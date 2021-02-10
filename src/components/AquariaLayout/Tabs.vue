<template>
  <div>
    <div class="tabs rel level3">
      <div class="tab"  id="Structures">
        <a href="#Structures">Matching Structures&nbsp;<span class="icon"><img v-bind:src="MS" /></span></a>
      </div>
      <MatchingStructures />
      <div class="tab" id="Features">
        <a href="#Features"><span class="icon"><img v-bind:src="FT" /></span> Features</a>
      </div>
      <Features />
    </div>
    <CoverageMap />
  </div>
</template>
<script>
import MatchingStructures from '../MatchingStructures/MatchingStructures'
import Features from '../Features/Features'
import CoverageMap from '../MatchingStructures/CoverageMap'
import * as Panels from './helpers/hidePanels'
export default {
  name: 'Tabs',
  components: {
    MatchingStructures,
    Features,
    CoverageMap
  },
  data () {
    return {
      MS: require('../../assets/img/MS-01.svg'),
      FT: require('../../assets/img/FT-01.svg')
    }
  },
  mounted () {
    var showPanel = function (elem1, elem2) {
      document.querySelector('#' + elem1).style.display = 'block'
      document.querySelectorAll('.tab').className = 'tab inactive'
      document.querySelector('#' + elem2).className = 'tab active'
    }
    var showMatches = function () {
      // const _this = this
      if (window.AQUARIA.panel3d) {
        const soupController = window.AQUARIA.panel3d.embededJolecule.controller
        soupController.clearSelectedResidues()
      }
      showPanel('vis', 'Structures')
      Panels.hidePanel('featurelist', 'Features')
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      document.querySelector('div.dimmer').style.zIndex = '0'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelector('a.close').click()
        // document.querySelector('div.tabs').style.bottom = '50px'
        Panels.hidePanels()
      })
    }
    var showFeatures = function () {
      // const _this = this
      if (window.AQUARIA.panel3d) {
        const soupController = window.AQUARIA.panel3d.embededJolecule.controller
        soupController.clearSelectedResidues()
      }
      Panels.hidePanel('vis', 'Structures')
      showPanel('featurelist', 'Features')
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      document.querySelector('div.dimmer').style.zIndex = '0'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelector('a.close').click()
        // document.querySelector('div.tabs').style.bottom = '50px'
        Panels.hidePanels()
      })
    }
    window.addEventListener('hashchange', function () {
      if (window.location.hash.includes('Structures')) {
        showMatches()
      }
      if (window.location.hash.includes('Features')) {
        showFeatures()
      }
    })
  }
}
</script>
<style scoped>
.tabs {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    top: 3em;
}
.tab {
    flex: 0 3 auto;
    height: 2rem;
    padding: 0.25rem 0.5rem 0 0.5rem;
    transition: All 0.5s ease;
    min-width: 7rem;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}
.tab#Structures {
    order: 1;
}
.tab#Features {
    order: 2;
    flex-basis: calc(9rem + 1vw);
}
span.icon {
    display: inline-block;
    background-color: var(--background);
    width: calc(1.25rem + 1vh);
    height: calc(1.25rem + 1vh);
    border-radius: 50%;
    transition: All 0.5s ease;
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
/* .tab a:hover span.icon {
    background-color: #eee;
    transition: All 0.5s ease;
}
:target a span.icon {
    background-color: transparent;
}
.icon img {
    height:  calc(1rem + 1vh);
    margin: .15rem;
}

.tab a {
    color: var(--background);
    text-decoration: none;
    transition: All 0.5s ease;
}
.tab a:hover {
    color: #FFF;
    transition: All 0.5s ease;
} */
:target a {
    color: var(--dark-text);
}
.tab:target {
    background-color: var(--bg-highlite);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}

a.to-right {
    float: right;
    margin-right: 0.5rem;
    text-decoration: none;
    font-size: 150%;
}

/* from test branch */
#Structures, #Features {
    color: transparent;
}
</style>
