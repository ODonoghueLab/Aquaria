<template>
  <div id="controls">
    <Logo/>
    <AffordanceMode />
  </div>
</template>

<script>
import Logo from './Logo'
import AffordanceMode from './Affordance'

export default {
  name: 'Controls',
  components: {
    Logo,
    AffordanceMode
  }
}
</script>

<style scoped>
#controls{
  padding-left: 10px;
  position: absolute;
  width: 0;
  display: flex;
}
</style>
