<template>
  <span id="map">
    <div id='selectedCluster'></div>
    <div id='selectedFeature'></div>
  </span>
</template>

<script>
export default {
  name: 'CoverageMap'
}
</script>

<style scoped>
#selectedCluster{
  position: absolute;
  bottom: 24px;
}
#selectedFeature{
  position: absolute;
  bottom: 4px;
}
</style>
