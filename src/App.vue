<template>
  <div id="app">
      <router-view/>
      <div class="matrixLoading" id="loading_overlay"> LOADING....</div>
      <!-- <div id="waiting_gif">
            <img id="loading_gif" src="./assets/img/aquaria-spin.gif">
      </div> -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      primary_accession: null
    }
  },
  beforeMount () {
    // var regex = /(^\d+\/*$)/
    if (window.location.pathname === '/') {
      if (sessionStorage.getItem('link') == null) {
        window.location.pathname = '/O15350/2xwc/A'
      } else {
        window.location.pathname = sessionStorage.getItem('link')
      }
    }
    var url = ''
    var hostname = window.location.protocol + '//' + window.location.hostname
    if (window.location.pathname.split('/')[1] === 'covid19') {
      url = hostname + ':8010/SARS-CoV-2'
    } else {
      url = hostname + ':8010' + window.location.pathname
    }
    axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
        if (response.data.initialParams) {
          window.location.pathname = JSON.parse(response.data.initialParams).primary_accession + '/' + JSON.parse(response.data.initialParams).pdb_id
        }
        if (response.data.primary_accessions) {
          window.localStorage.setItem('OrgID', response.data.OrganismID)
          if (response.data.OrganismID === '2697049') {
            window.location.pathname = 'SARS-CoV-2'
          } else {
            window.location.pathname = '/orgID/' + response.data.OrganismID
          }
          this.primary_accession = response
        }
      }
      )
  },
  mounted () {
    if (window.location.pathname === '/SARS-CoV-2') {
      document.querySelector('.matrixLoading').style.visibility = 'visible'
    }
  }
}
</script>

<style>
.matrixLoading{
  display: block;
  visibility: hidden;
}

#loading_overlay{
    background: #5E5E5E ;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    opacity: 0.77;
    -moz-opacity: 0.68;
    width: 100%;
    z-index: 6;
    color: white;
    font-size: calc(16px + 6 * ((100vw - 320px) / 680));
    padding: 45vh 22vh;
  }

/* #loading_gif{
  width: calc(30px + 1.5vw);
  height: calc(31px + 1.5vw);
}

#waiting_gif{
  position: absolute;
  z-index: 8;
  margin: calc(6px + 0.4vw) 8px;
} */

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #c0c0c0;
}
#home{
  background-color: #c0c0c0;
  height: fit-content;
  overflow: hidden;
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
</style>
