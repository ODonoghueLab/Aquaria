<template>
    <div id="logo-intro">
    <div id="logo">
        <img src="../assets/img/aquaria-logo.png" alt="Aquaria Logo">
        <div id="wait">
            <img src="../assets/img/aquaria-spin.gif" alt="Loading" title="Loading data...">
        </div>
    </div>
    <p id="intro">
        <span class="small">
            <a href="#" v-on:click="showAbout()" >Updated:
                <span class="lastupdate">{{data}}</span>
            </a>
        </span>
        <br>
        <a href="#" v-on:click="showAbout()" style="color:#DDD;">About</a> |
        <a target="_blank" style="color:#DDD;" href="https://www.biostars.org/t/aquaria">Forum</a> |
        <a href="#" v-on:click="showExplanations()" style="color:#DDD;">Help</a>
        <br>
    </p>
    </div>
</template>

<script>
import store from '@/store/index'
import $ from 'jquery'

export default {
  name: 'Logo',
  methods: {
    showAbout: function () {
    // dim background

      if (document.getElementsByClassName('dimmer').length === 0) {
        $('body').append('<div class="dimmer"></div>')
        $('div.dimmer').on('click', function () {
          $('div#about_overlay, div#help_overlay').hide()
          $('div.dimmer').remove()
        })
      } else {
        $('div.dimmer').remove()
      }

      $('div#about_overlay').slideToggle('slow')
    },
    showExplanations: function () {
      $('div.dimmer').remove()
      $('div#about_overlay, div#help_overlay').hide()
      $('body, #gallery').css('margin-top', '5em')
      $('div.container').first().hide()
      $('div.outer_container').first().append("<div id='tree_helper' class='chardinjs-helper-layer chardinjs-relative-position'></div>")
      $('#tree_helper').html('<img src="/images/tree-overlay.png" />')
      $('body').chardinJs('start')
    }

  },
  computed: {
    data () {
      return store.state.message
    }
  }
}
</script>

<style>
    #wait img{
        position: absolute;
        left: 4px;
        width: 79px;
    }
    #logo{
        display: flex;
        width: 100%;
        height: auto;
    }
    #intro{
        position: absolute;
        top: 73px;
    }
</style>
