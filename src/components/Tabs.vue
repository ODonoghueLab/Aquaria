<template>
    <div class="tabs">
      <div class="tab" id="Structures">
        <a href="#Structures">Matching Structures&nbsp;<span class="icon"><img v-bind:src="MS" /></span></a>
      </div>
      <div class="tab" id="Features">
        <a href="#Features"><span class="icon"><img v-bind:src="FT" /></span> Features</a>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Tabs',
  data () {
    return {
      MS: require('../assets/img/MS-01.svg'),
      FT: require('../assets/img/FT-01.svg')
    }
  }
}
</script>

<style scoped>
.tabs {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
}
</style>
