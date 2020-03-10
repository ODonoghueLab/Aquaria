<template>
  <div id="controls">
    <Logo/>
    <div>
        <SearchPanel/>
        <AboutUniProt/>
        <Gallery />
    </div>
  </div>
</template>

<script>
import Logo from './Logo'
import SearchPanel from './SearchPanel'
import AboutUniProt from './AboutUniprot'
import Gallery from './Gallery'

export default {
  name: 'Controls',
  components: {
    Logo,
    SearchPanel,
    AboutUniProt,
    Gallery
  }
}
</script>

<style scoped>
  #controls {
      float: left;
      width: 250px;
      position: absolute;
      z-index: 12;
      top: 1vh;
  }
  div {
  margin: 6px 2px;
  }
  div.panel {
    background: #CCC;
    border: 1px solid #999;
    border-radius: 12px;
    padding: 2px;
  }
  .panel h3, #gallery h3, #controls h3, .balloon h3, #about_overlay h3, #help_overlay h3 {
    background-color: #999;
    border-radius: 10px;
    color: white;
    font-size: 100%;
    font-weight: normal;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 2px 3px 2px 10px;
    margin: 0px;
  }

  div.panel h3 span.explanation {
      color: #dedede;
      display: inline;
      letter-spacing: 0;
      text-transform: none;
  }
</style>
