<template>
    <div class="tabs">
      <div class="tab" id="Structures">
        <a href="#Structures">Matching Structures&nbsp;<span class="icon"><img v-bind:src="MS" /></span></a>
      </div>
      <MatchingStructures class='panel'/>
      <div class="tab" id="Features">
        <a href="#Features"><span class="icon"><img v-bind:src="FT" /></span> Features</a>
      </div>
      <FeatureList class='panel'/>
    </div>
</template>

<script>
import MatchingStructures from './MatchingStructures'
import FeatureList from './Features'
export default {
  name: 'Tabs',
  components: {
    MatchingStructures,
    FeatureList
  },
  data () {
    return {
      MS: require('../assets/img/MS-01.svg'),
      FT: require('../assets/img/FT-01.svg')
    }
  }
//   mounted () {
//     document.querySelector('.icon').addEventListener('click', function () {
//       document.querySelector('#structureviewer').style.height = document.querySelector('#structureviewer').style.height - document.querySelector('.tabs').offsetHeight
//     })
//   }
}
</script>

<style scoped>
.tabs {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
}
</style>
