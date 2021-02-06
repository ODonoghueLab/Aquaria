<template>
  <div id="controls">
    <Logo/>
    <Title3D id='title' class="item title" />
  </div>
</template>

<script>
import Logo from './Logo'
import Title3D from '../Title/Title3D'

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
  width: 80%;
  min-width: 272px;
  max-width: 30rem;
  display: flex;
  margin: auto;
}

.title{
  z-index: 2;
  position: relative;
  top: 4vh;
  flex-basis: auto;
  color: white;
  text-align: center;
  /* line-height: 2.5; */
  padding: 0.5rem 0;
  border-radius: 1.5rem;
  margin: auto;
  transition: all 0.7s ease;
}
</style>
