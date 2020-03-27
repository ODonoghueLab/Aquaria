<template>
  <div id="app">
      <!-- <router-link to="O15350/2xwc/A">Home</router-link> | -->
      <!-- <router-link to="/about">About</router-link> -->
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
    const url = 'http://localhost:8009' + window.location.pathname
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
  background-color: #cccccc;
}
#home{
  background-color: #cccccc;
}

html{
  background-color: #cccccc;
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
