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
/* #center{
  display: grid;
  width: 100%;
  z-index: 1;
} */
#center{
  margin: auto;
  display: flex;
  flex-flow: column nowrap;
  align-content: stretch;
  height: 98vh;
}
</style>
