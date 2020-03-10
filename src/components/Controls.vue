<template>
  <div id="controls">
    <Logo/>
    <div>
        <SearchPanel/>
        <!-- <AboutUniProt/>
        <Gallery /> -->
        <br/>
        <Tabs/>
    </div>
  </div>
</template>

<script>
import Logo from './Logo'
import SearchPanel from './SearchPanel'
// import AboutUniProt from './AboutUniprot'
// import Gallery from './Gallery'
import Tabs from './Tabs'

export default {
  name: 'Controls',
  components: {
    Logo,
    SearchPanel,
    Tabs
  }
}
</script>

<style scoped>
#controls{
  padding-left: 10px;
}
</style>
