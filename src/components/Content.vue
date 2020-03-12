<template>
<div id="content">
    <Controls />
    <Center />
  </div>
</template>

<script>
import Controls from './Controls'
import Center from './Center'

export default {
  name: 'Content',
  components: {
    Controls,
    Center
  }
}
</script>

<style scoped>
</style>
