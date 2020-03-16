<template>
<div id="content">
    <Controls />
    <Center id="center"/>
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

<style>
#center{
  display: inline-flex;
  width: 100%;
}
</style>
