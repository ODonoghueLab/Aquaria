<template>
<div id="content">
    <Controls/>
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
