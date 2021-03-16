<template>
  <div class="main">
    <!-- Header -->
    <Header />
    <!-- InfoAbout -->
    <Sequence />
    <div>
      <AboutAlignment v-bind:alignment="alignment"/>
    </div>
    <div>
      <AboutPdb />
    </div>
    <div>
      <AboutAquaria />
      <Errors />
    </div>
    <!-- StructureViewer -->
    <StructureViewer />
    <!-- AquariaLayout -->
    <Tabs />
    <PopUp />
    <a href="#"><div id="scrim" class="hide" @click="dismissPanel"></div></a>
  </div>
</template>

<script>

import '../components/AquariaLayout/helpers/aquaria' // most legacy code bundling is triggered from here (expects global jolecule)
import Header from '../components/Header/Header'
import Sequence from '../components/InfoAbout/Sequence'
import AboutAlignment from '../components/InfoAbout/AboutAlignment'
import AboutPdb from '../components/InfoAbout/AboutPdb'
import StructureViewer from '../components/StructureViewer/StructureViewer'
import Tabs from '../components/AquariaLayout/Tabs'
import PopUp from '../components/AquariaLayout/PopUp'
import AboutAquaria from '../components/InfoAbout/AboutAquaria'
import Errors from '../components/InfoAbout/Errors'

export default {
  name: 'Wrapper',
  components: {
    Header,
    Sequence,
    AboutAlignment,
    AboutPdb,
    StructureViewer,
    Tabs,
    PopUp,
    AboutAquaria,
    Errors
  },
  methods: {
    // load: function () {
    //   console.log('Loader loaded')
    //   setTimeout(() => {
    //     if (document.querySelector('div.loader')) {
    //       document.querySelector('div.loader').style.display = 'none'
    //       document.querySelector('div#jolecule-protein-container').style.display = 'block'
    //       document.querySelector('div.tabs').style.display = 'flex'
    //     }
    //   }, 3000)
    // },
    dismissPanel: function () {
      // hide scrim
      document.querySelector('#scrim').className = 'hide'
      // reset title to neutral state
      document.querySelectorAll('#title span a').forEach(el => {
        el.className = ''
      })
    }
  },
  mounted () {
    // this.load()
    window.scrollBy(0, 100)
    window.addEventListener('resize', function () {
      window.scrollBy(0, 100)
      document.querySelector('#vis > .ruler').remove()
      document.querySelectorAll('#vis > #allclusters .outer_container').forEach(el => el.remove())
      window.AQUARIA.refresh()
    })
    setTimeout(function () {
      if (document.querySelector('.matrixLoading')) {
        document.querySelector('.matrixLoading').style.visibility = 'hidden'
        document.querySelector('.matrixLoading').style.display = 'none'
      }
    }, 1500)
  }
}
</script>

<style>
/* hide 3D structure and tabs while loading */
/* div#jolecule-protein-container, div.tabs {
  display: none;
} */
/* general layout + styling */
body {
    font-family: 'Source Sans Pro', sans-serif;
    background-color: var(--background);
    color: var(--dark-text);
    font-size: calc(0.8rem + 3 * ((100vw - 320px) / 680));
    transition: All 0.5s ease;
  }
.main {
    margin: auto;
    display: flex;
    flex-flow: column nowrap;
    align-content: stretch;
    height: 95vh;
}
#scrim {
  background: dimgrey;
  position: fixed;
  opacity: 0.7;
  width: 100vw;
  height: 100vh;
  top: 0;
}
/* 3D structure viewer */
#structure-viewer {
    width: 100%;
    height: calc(100% - 70px);
    display: flex;
}

#structure-viewer:target {
    /* when residue is selected */
    background: radial-gradient(closest-side,var(--secondary-label), var(--background));
}
.panel.overlay.about {
  padding-top: 3em;
  max-height: 85vh;
}
.about p {
  margin: 0.25em 0;
}
.scrollable {
  overflow-y: scroll;
  max-height: 80vh;
}
</style>
