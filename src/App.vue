<template>
  <div id="app">
      <router-view/>
      <div class="matrixLoading">
      <div id="waiting_gif">
          <img id="loading_gif" src="./assets/img/aquaria-spin.gif">
      </div>
      <div id="loading_overlay"> LOADING<span id="myspan"></span></div>
      </div>
      <div id="superFamCharts" style="display: none">
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import { screenshot } from './utils/Screenshot'
import store from './store/index'

// @TODO consider how best to expose screenshot feature in UI
window.ss = async (resX, resY, bgColor, bgAlpha) => {
  const url = await screenshot(resX, resY, bgColor, bgAlpha)
  const link = document.createElement('a')
  link.href = url
  link.download = 'aq_screenshot.png'
  link.click()
}

// make env avaialble to legacy scripts (not processed by Vue)
window.BACKEND = process.env.VUE_APP_AQUARIA_BACKEND

export default {
  name: 'App',
  data () {
    return {
      primary_accession: null,
      hostname: store.state.url
    }
  },
  beforeCreate () {
    // var regex = /(^\d+\/*$)/
    if (window.location.pathname === '/') {
      if (sessionStorage.getItem('link') == null) {
        window.location.pathname = '/P04637/3kmd'
      } else {
        window.location.pathname = sessionStorage.getItem('link')
      }
    }
  },
  // beforeMount () {
  //   // var regex = /(^\d+\/*$)/
  //   if (window.location.pathname === '/') {
  //     if (sessionStorage.getItem('link') == null) {
  //       window.location.pathname = '/O15350/2xwc/A'
  //     } else {
  //       window.location.pathname = sessionStorage.getItem('link')
  //     }
  //   }
  //   var url = ''
  //   // var hostname = window.location.protocol + '//' + window.location.hostname
  //   if (window.location.pathname.split('/')[1] === 'covid19') {
  //     url = `${process.env.VUE_APP_AQUARIA_BACKEND}/SARS-CoV-2`
  //   } else {
  //     url = `${process.env.VUE_APP_AQUARIA_BACKEND}${window.location.pathname}`
  //   }
  //   axios({
  //     method: 'get',
  //     url: url
  //   })
  //     .then(function (response) {
  //       if (response.data.initialParams) {
  //         window.location.pathname = JSON.parse(response.data.initialParams).primary_accession + '/' + JSON.parse(response.data.initialParams).pdb_id
  //       }
  //       if (response.data.primary_accessions) {
  //         window.localStorage.setItem('OrgID', response.data.OrganismID)
  //         if (response.data.OrganismID === '2697049') {
  //           window.location.pathname = 'SARS-CoV-2'
  //         } else {
  //           window.location.pathname = '/orgID/' + response.data.OrganismID
  //         }
  //         this.primary_accession = response
  //       }
  //     }
  //     )
  // },
  // mounted () {
  //   setTimeout(function () {
  //     const pdf = window.BACKEND + '/COVID-Structural-Coverage-Map.pdf'
  //     const js1 = window.BACKEND + '/javascripts/aquaria.js'
  //     const js2 = window.BACKEND + '/javascripts/jolecule.js'
  //     axios({
  //       method: 'get',
  //       url: pdf
  //     })
  //     axios({
  //       method: 'get',
  //       url: js1
  //     })

  //     axios({
  //       method: 'get',
  //       url: js2
  //     })
  //   }, 15000)
  // },
  updated () {
    sessionStorage.setItem('link', window.location.pathname)
  }
}
</script>

<style>
.matrixLoading{
  display: flex;
  visibility: hidden;
  padding: 45vh 45vw;
  background: #ABABAB;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 9;
}

#wrapper{
  width: 100vw;
}

#myspan{
  position: relative;
}

#loading_overlay{
    display: inline-flex;
    height: 100%;
    position: fixed;
    width: 100%;
    z-index: 6;
    color: #DDDDDD;
    font-size: calc(16px + 6 * ((100vw - 320px) / 680));
    padding-top: calc(38px + 1.5vw);
    margin-left: calc(1.8vw - 12px);
  }

    /* Tall aspect ratio */
  @media (max-aspect-ratio: 3/4) {
        #loading_overlay {
            font-size: calc(8px + 1.5vw);
        }
        #waiting-git{
          left: calc(49vw - 5px);
        }
    }
    @media (max-aspect-ratio: 3/4) and (min-height: 1000px) {
        #loading_overlay {
            font-size: calc(8px + 0.8vw);
        }
        #waiting-git{
          left: calc(49vw - 5px);
        }
    }

#loading_gif{
  width: calc(30px + 1.5vw);
  height: calc(31px + 1.5vw);
}

#waiting_gif{
  position: absolute;
  z-index: 8;
  /* left: 47.5vw; */
  left: calc(49vw - 8px);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  background-color: #cccccc;
  overflow: auto;
  height: 100vh;
}
#home{
  background-color: #c0c0c0;
  height: fit-content;
}

html{
  background-color: #c0c0c0;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

div.dimmer {
    background: #5E5E5E;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    opacity: 0.68;
    -moz-opacity: 0.68;
    width: 100%;
    z-index: 0;
}
div.dimmer2 {
    background: #5E5E5E;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    opacity: 0.68;
    -moz-opacity: 0.68;
    width: 100%;
    z-index: 2;
}
</style>
