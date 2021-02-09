<template>
  <div id="map" class='rel level2'>
    <div id='selectedCluster'></div>
    <div id='selectedFeature'></div>
  </div>
</template>

<script>
export default {
  name: 'CoverageMap'
}
</script>

<style scoped>
#map {
  bottom: -2em;
  height: 3em;
}
#selectedCluster{
  position: absolute;
  bottom: 0px;
  width: 100%;
  left: 0.2%;
}
#selectedFeature{
  position: absolute;
  bottom: 0px;
  width: 100%;
  left: 0.2%;
}
</style>
