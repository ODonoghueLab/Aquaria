<template>
<div id="content">
    <Controls/>
    <Center />
    <Gallery />
  </div>
</template>

<script>
import Controls from './Controls'
import Center from './Center'
import Gallery from './Gallery'

export default {
  name: 'Content',
  components: {
    Controls,
    Center,
    Gallery
  }
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

</style>
