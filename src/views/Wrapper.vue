<template>
  <div class="main">
    <!-- Header -->
    <Header />
    <!-- InfoAbout -->
    <Sequence />
    <div>
      <AboutAlignment />  <!--  v-bind:alignment="alignment"/> -->
    </div>
    <div>
      <AboutPdb />
    </div>
    <div>
      <AboutAquaria />
      <div class='dimmer' @click="closeHelp"></div>
      <UserHelp />
      <Errors />
    </div>
    <div id="heightinspector"></div>
    <!-- StructureViewer -->
    <StructureViewer />
    <!-- AquariaLayout -->
    <Tabs />
    <PopUp />
    <!-- <div id = 'help'>
      <div id='helpDoc'>
        <a href="https://aquaria.ws/help>">Help manual</a>
        <a href="#" class="close" @click="closeHelp">X</a>
        </div>
      <youtube-playlist :videos="data.arrayOfVideos" id='playlist'></youtube-playlist>
      <iframe id='playlist' src="https://www.youtube.com/embed/videoseries?list=PLsGaleFn8YydVFkxDhOvHHE5NoTsl6D1e" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div> -->
    <a v-bind:href="data.hash"><div id="scrim" class="hide" @click="dismissPanel"></div></a>
  </div>
</template>

<script>
import store from '../store/index'
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
import UserHelp from '../components/InfoAbout/UserHelp'

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
    Errors,
    UserHelp
  },
  computed: {
    data () {
      return {
        hash: store.state.hash,
        arrayOfVideos: [
          'https://youtu.be/FAQ3yVGYSzY?list=PLsGaleFn8YydVFkxDhOvHHE5NoTsl6D1e',
          'https://www.youtube.com/watch?v=UZNEmPOaVrA&list=PLsGaleFn8YydVFkxDhOvHHE5NoTsl6D1e&index=2'
        ]
      }
    }
  },
  methods: {
    closeHelp: function () {
      var _this = this
      document.querySelector('#UserHelp').style.display = 'none'
      document.querySelector('.dimmer').style.display = 'none'
      if (document.querySelector('#helpbtn').classList.contains('active')) {
        _this.toggleActive(document.querySelector('#helpbtn'))
      }
    },
    checkPhone: function () {
      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ]

      if (navigator.platform) {
        while (iDevices.length) {
          if (navigator.platform === iDevices.pop() || (screen.width >= 300 && screen.width <= 600)) { return true }
        }
      } else {
        return false
      }
    },
    inspectHeight: function () {
      // var visible = window.toolbar.visible
      document.querySelector('#heightinspector').innerHTML = 'reset'
      var hDiff = (window.outerHeight - window.innerHeight)
      document.querySelector('#heightinspector').innerHTML = 'HO:' + window.outerHeight + ', hDiff:' + hDiff + ', scroll: ' + window.scrollY + ' bodyHeight: ' + document.body.scrollHeight
    },
    dismissPanel: function () {
      // hide scrim
      document.querySelector('#scrim').className = 'hide'
      // reset title to neutral state
      document.querySelector('#title').className = 'item title fix level6'
      if (document.querySelector('#titleAlign') !== null) { document.querySelector('#titleAlign').className = '' }
      document.querySelectorAll('#title span a').forEach(el => {
        el.className = ''
      })
      document.querySelector('#pdb_id > span#help').style.visibility = 'visible'
    },
    toggleActive: function (ev) {
      if (ev.className === 'lnk active') {
        ev.className = 'lnk'
      }
    }
  },
  mounted () {
    window.scrollBy(0, 100)
    // this.inspectHeight()
    window.addEventListener('resize', function () {
      window.scrollBy(0, 100)
      document.querySelector('#vis > .ruler').remove()
      document.querySelectorAll('#vis > #allclusters .outer_container').forEach(el => el.remove())
      window.AQUARIA.refresh()
      var hDiff = (window.outerHeight - window.innerHeight)
      document.querySelector('#heightinspector').innerHTML = 'HO:' + window.outerHeight + ', hDiff:' + hDiff + ', scroll: ' + window.scrollY + ' bodyHeight: ' + document.body.scrollHeight
    })
    setTimeout(function () {
      if (document.querySelector('.matrixLoading')) {
        document.querySelector('.matrixLoading').style.visibility = 'hidden'
        document.querySelector('.matrixLoading').style.display = 'none'
      }
    }, 1500)
  },
  updated () {
    // const isPhone = this.checkPhone()
    // this.inspectHeight()
  }
}
</script>

<style>
.dimmer {
  z-index: 99;
  display: none;
}
/* .close {
  float: right;
}
#helpDoc {
  background: white;
  z-index: 9999;
  position: relative;
  padding: 4px;
}
#help {
  position: absolute;
  width: 90vw;
  height: 90vh;
  margin: 5vh 5vw 5vh 5vw;
}

#playlist {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: black;
} */
div#heightinspector {
  display: none;
  position: absolute;
  top:10em;
  left:2em;
  z-index: 1000;
}
/* general layout + styling */
body {
    font-family: 'Source Sans Pro', sans-serif;
    background-color: var(--background);
    color: var(--dark-text);
    font-size: calc(0.8rem + 3 * ((100vw - 320px) / 680));
    line-height: 1.05rem;
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
  padding-top: 4em;
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
