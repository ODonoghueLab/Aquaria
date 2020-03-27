<template>
<div>
    <Center id="centerView"/>
  </div>
</template>

<script>
import axios from 'axios'
import Center from './Center'

export default {
  name: 'MatrixView',
  props: ['primary_accession'],
  components: {
    Center
  },
  beforeMount () {
    const url = 'http://localhost:8009/' + window.location.pathname.split('/')[2]
    // const url = 'http://localhost:8009/2kby'
    axios({
      method: 'get',
      url: url,
      headers: { 'Cache-Control': 'no-cache' }
    }).then(response => (this.structures = JSON.parse(response.data.primary_accessions)))
  }
}
</script>

<style>
#centerView{
    position: absolute;
    z-index: 9;
    width: 99vw;
    top: -60px;
    left: 6px;
}
</style>
