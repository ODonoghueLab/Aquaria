<template>
    <div id="logo-intro">
    <div id="logo">
        <img :src="Icon" alt="Aquaria Logo" v-if="$mq === 'mobile' || $mq === 'tablet' || $mq === 'laptop'" v-on:click="showAbout()">
        <div id="wait">
            <img id="gif" :src="Gif" alt="Loading" title="Loading data...">
        </div>
    </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'Logo',
  data () {
    return {
      Gif: require('../../assets/img/aquaria-spin.gif'),
      Icon: require('../../assets/img/icon-large.png')
    }
  },
  methods: {
    showAbout: function () {
    // dim background
      if (document.getElementsByClassName('dimmer').length === 0) {
        $('body').append('<div class="dimmer"></div>')
        document.querySelector('#xr-button').click()
        $('div.dimmer').on('click', function () {
          $('div#about_overlay, div#help_overlay').hide()
          $('div.dimmer').remove()
        })
      } else {
        $('div.dimmer').remove()
      }
      $('div#about_overlay').slideToggle('slow')
    }
  }
}
</script>

<style scoped>
    img{
      width: 50px;
      position: fixed;
      padding: 4px 0px 0px 0px;
    }
    #logo{
      width: 50px;
    }
    #intro{
      width: 10vw;
    }
    #gif{
      position: relative;
      bottom: 53px;
      width: 44px;
      left: 5px;
    }
    #logo-intro{
      z-index: 1;
    }
</style>
