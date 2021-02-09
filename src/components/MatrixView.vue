<template>
<div>
    <Center id="centerView"/>
  </div>
</template>

<script>
// import axios from 'axios'
import Center from './Center'

export default {
  name: 'MatrixView',
  props: ['primary_accession'],
  components: {
    Center
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
