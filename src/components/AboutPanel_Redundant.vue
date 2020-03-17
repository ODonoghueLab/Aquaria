<template>
    <div id="AboutPanel">
        <div id="left-panel">
        <AboutUniProt v-if="$mq === 'laptop' || $mq === 'tablet'" />
        <Gallery v-if="$mq === 'laptop' || $mq === 'tablet'" />
        </div>
        <img id="hide" src="../assets/img/hide.png" style="height: 4vh; padding-top: 20px; padding-left: 1px;" @click.self="onClick">
    </div>
</template>

<script>
import AboutUniProt from './AboutUniprot'
import Gallery from './Gallery'
import $ from 'jquery'

export default {
  name: 'AboutPanel',
  components: {
    AboutUniProt,
    Gallery
  },
  methods: {
    onClick () {
      $('#left-panel').toggle()
      if ($('#left-panel').is(':hidden')) {
        $('#hide').attr('src', '/images/show.png')
      } else {
        $('#hide').attr('src', '/images/hide.png')
      }
    }
  }
}
</script>

<style scoped>
#AboutPanel{
    top: 10vh;
    position: absolute;
    display: inline-flex;
}
</style>
