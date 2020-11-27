<template>
  <div id="controls">
    <Logo/>
    <!-- <AffordanceMode /> -->
    <Title3D id='title' class="item title" />
  </div>
</template>

<script>
import Logo from './Logo'
import Title3D from './Title3D'

export default {
  name: 'Controls',
  components: {
    Logo,
    Title3D
  }
}
</script>

<style scoped>
#controls{
  /* padding-left: 10px; */
  width: 66%;
  min-width: 300px;
  display: flex;
  margin: auto;
}

.title{
  z-index: 1;
  position: relative;
  top: 4vh;
  flex-basis: auto;
  color: white;
  text-align: center;
  line-height: 2.5;
  padding: 0.5rem 1.5rem;
  border-radius: 1.5rem;
  margin: auto;
  transition: all 0.7s ease;
}
</style>
