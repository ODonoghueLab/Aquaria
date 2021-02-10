<template>
  <div>
    <div id="tabs">
    <h3 class="sub" title="Click to see clusters of matching structures" rel="vis" v-on:click="narrowpanel()">Matching Structures | <span class="explanation" id="structureexplanation"></span>
    </h3>
    <h3 class="sub inactive" title="Click to see annotated features" rel="featurelist" id="h_featurelist" data-intro="Provides access to sequence features." data-position="top" v-on:click="widepanel()">Features |
      <span class="explanation" id="featureExplanation"></span>
      <!-- <span class="counter" id="featureCounter"></span> -->
    </h3>
    <!-- <span class="x"></span> -->
    </div>
    <MatchingStructures />
    <div class="toggled" id="ppi-diagram"></div>
    <FeatureList />
  </div>
</template>

<script>
import MatchingStructures from './MatchingStructures'
import FeatureList from './Features'
import $ from 'jquery'

export default {
  name: 'Structures',
  components: {
    MatchingStructures,
    FeatureList
  },
  methods: {
    widepanel: function () {
      var width = window.innerWidth - 55
      $('#structurematches').css({
        width: width
      })
      $('h3[rel="featurelist"]').css({
        'background-color': '#cccccc',
        color: '#484547'
      })
      $('h3[rel="vis"]').css({
        'background-color': '#999597',
        color: 'white'
      })
    },
    narrowpanel: function () {
      var width = window.innerWidth - 75
      $('#structurematches').css({
        width: width
      })
      $('h3[rel="featurelist"]').css({
        'background-color': '#999597',
        color: 'white'
      })
      $('h3[rel="vis"]').css({
        'background-color': '#cccccc',
        color: '#484547'
      })
    }
  },
  mounted () {
    $('h3[rel="vis"]').css({
      'background-color': '#cccccc',
      color: '#484547'
    })
  }
}
</script>

<style scoped>
#tabs{
  display: flex;
  width: 105%;
  background: linear-gradient(to bottom, #999697 8%, #cccccc 67%);
}
</style>
