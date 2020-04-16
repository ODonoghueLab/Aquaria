<template>
  <div id="app" style="height: 90vh;">
      <router-view/>
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
  }
}
</script>

<style>
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
