<template>
  <div id="center">
    <StructureViewer/>
    <Structures/>
  </div>
</template>

<script>
import StructureViewer from './StructureViewer'
import Structures from './Structures'

export default {
  name: 'Center',
  components: {
    StructureViewer,
    Structures
  }
}
</script>

<style>

</style>
