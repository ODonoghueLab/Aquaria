<template>
    <div id="about_overlay">
            <h3>About Aquaria <span class='x' v-on:click="hideAbout()">&nbsp;</span></h3>
            <p id="starter"><img v-bind:src="data.logo"
                   width="605"
                   height="167"
                   alt="Aquaria"></p>
            <p><strong>Simplifying the generation of insight from protein structures</strong></p>
            <p><span>Se&aacute;n I. O&rsquo;Donoghue<sup>1,2,3</sup>,</span>
            <span>Andrea Schafferhans<sup>4,5</sup>,</span>
            <span>Neblina Sikta<sup>1</sup>,</span>
            <span>Christian Stolte<sup>1</sup>,</span>
            <span>Sandeep Kaur<sup>1,3</sup>,</span>
            <span>James Procter<sup>6</sup>,
            </span><span>Bosco Ho<sup>1</sup>,</span>
            <span>Stuart Anderson<sup>2</sup>,</span>
            <span>Matt Adcock<sup>2</sup>,</span>
            <span>Christian Dallago<sup>5</sup>,</span>
            <span>Nicola Bordin<sup>7</sup>,</span>
            <span>Burkhard Rost<sup>5</sup></span>
              <br>
              <!-- <script src="/javascripts/email.js"></script><br> -->
              <br><strong>Updated: <span class="lastupdate">{{data.message}}</span></strong>
              <br>This indicates when the Aquaria database (PSSH2) was last calculated.
              <br>PDB structures released since then are not yet available in Aquaria.
            </p>
            <p class="affiliations">
              <span>1. Garvan Institute of Medical Research, Sydney, Australia</span>
              <span>2. CSIRO Data61, Sydney, Australia</span>
              <span>3. University of NSW, Australia</span>
              <span>4. Weihenstephan-Tr. University of Applied Sciences, Freising, Germany</span>
              <span>5. Technische Universit&auml;t M&uuml;nchen, Germany</span>
              <span>6. The University of Dundee, UK</span>
              <span>7. University College London, UK.</span>
            </p>
            <p>We gratefully acknowledge generous support from Amazon AWS in hosting the Aquaria database and server.<br>&nbsp;</p>
          </div>
</template>

<script>
import store from '@/store/index'
import $ from 'jquery'

export default {
  name: 'AboutAquaria',
  computed: {
    data () {
      return {
        message: store.state.message,
        logo: require('../assets/img/logo-large.png')
      }
    }
  },
  methods: {
    hideAbout: function () {
    // dim background
      // $('div#about_overlay, div#help_overlay').hide()
      document.querySelector('div#about_overlay').style.display = 'none'
      document.querySelector('div.dimmer').remove()
      // $('div.dimmer').remove()
      // $('div#about_overlay').hide()
    }
  },
  mounted () {
    var Position = window.innerWidth / 2 - $('#about_overlay').width() / 2
    Position = Position + 'px'
    $('#about_overlay').css({
      left: Position
    })
  }
}
</script>

<style scoped>
#about_overlay{
    display: none;
    border-radius: 12px;
    position: absolute;
    top: 1em;
    left: 10%;
    max-width: 700px;
    width: 80%;
    padding: 2px;
    margin: 10px auto;
    background-color: #DDD;
    z-index: 105;
    bottom: 1em;
    overflow: scroll;
    /* visibility: hidden; */
    font-size: 10px;
    max-height: 90vh;
    height: fit-content;
}
#about_overlay h3{
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
#about_overlay p {
  line-height: 1.4em;
  text-align: center;
  margin: 1.8em;
  line-break: strict;
}
.affiliations {
  font-size: 70%;
}
span {
  display: inline-block;
  white-space: nowrap;
  margin-right: 0.25em;
}
.affiliations span {
    margin-right: 1.2em;
}
  @media screen and (min-width: 320px) {
      #about_overlay {
          /* font-size: calc(8px + 6 * ((100vw - 320px) / 680)); */
          font-size: calc(8px + 0.75vw);
      }
  }
  @media screen and (min-width: 1000px) {
      #about_overlay {
          font-size: 16px;
      }
  }

</style>
