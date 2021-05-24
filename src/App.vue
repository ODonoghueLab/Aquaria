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
import { screenshot } from './components/AquariaLayout/helpers/Screenshot'

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
      primary_accession: null
    }
  },
  beforeCreate () {
    // var regex = /(^\d+\/*$)/
    if (window.location.pathname === '/') {
      if (localStorage.getItem('LastSuccess') == null) {
        window.location.pathname = '/Human/TP53'
      } else {
        window.location.pathname = localStorage.getItem('LastSuccess')
      }
    }
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

#main{
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
        #waiting-gif{
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
  height: 100vh;
  overflow: hidden;
}
#home{
  background-color: #c0c0c0;
  height: 99vh;
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
    z-index: 1;
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
    z-index: 3;
}

</style>
