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
  top: 2.5rem;
  height: 3rem;
}
@media screen and (min-width: 550px) {
  #map { top: 3rem; }
}
@media screen and (min-width: 950px) {
  #map { top: 3.5rem; }
}
@media screen and (min-width: 1850px) {
  #map { top: 4.5rem; }
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
