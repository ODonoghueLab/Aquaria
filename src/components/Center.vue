<template>
  <div id="center">
    <StructureViewer/>
    <StructureMatches/>
  </div>
</template>

<script>
import StructureViewer from './StructureViewer'
import StructureMatches from './StructureMatches'

export default {
  name: 'Center',
  components: {
    StructureViewer,
    StructureMatches
  }
}
</script>

<style>

</style>
