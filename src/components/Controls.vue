<template>
  <div id="controls">
    <Logo/>
    <div>
        <SearchPanel/>
        <AboutUniProt/>
    </div>
  </div>
</template>

<script>
import Logo from './Logo'
import SearchPanel from './SearchPanel'
import AboutUniProt from './AboutUniprot'

export default {
  name: 'Controls',
  components: {
    Logo,
    SearchPanel,
    AboutUniProt
  }
}
</script>

<style>
    /* #controls{
        display: flex;
    } */
</style>
