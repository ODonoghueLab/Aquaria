<template>
  <div class="panel" id="structurematches" data-intro=" " data-position="top">
        <h3 class="sub" title="Click to see clusters of matching structures" rel="vis">Matching Structures <span class="explanation" id="structureexplanation"> in PDB</span></h3>
        <h3 class="sub inactive" title="Click to see annotated features" rel="featurelist" id="h_featurelist" data-intro="Provides access to sequence features." data-position="top">Features
          <span class="explanation" id="featureExplanation"></span><span class="counter" id="featureCounter"></span></h3>
        <span class="content toggled" id="vis"></span>
        <div class="toggled" id="ppi-diagram">
        </div>
        <div class="toggled" id="featurelist">
        </div>
      </div>
</template>

<script>
export default {
  name: 'StructureMatches'
}
</script>

<style>
</style>
