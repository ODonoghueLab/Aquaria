<template>
<div id="wrapper">
    <Content/>
    <Footer />
    <BadBrowser />
  </div>
</template>

<script>
import Content from './Content'
import Footer from './Footer'
import BadBrowser from './BadBrowser'

export default {
  name: 'Wrapper',
  components: {
    Content,
    BadBrowser,
    Footer
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
