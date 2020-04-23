<template>
    <div id="about_overlay">
            <h3>About Aquaria <span class='x' v-on:click="hideAbout()">&nbsp;</span></h3>
            <p id="starter"><img src="../../public/images/logo-large.png"
                   width="605"
                   height="167"
                   alt="Aquaria"></p>
            <p style="text-align: center; margin-bottom: 1.8em;"><strong>Simplifying the generation of insight from protein structures</strong></p>
            <p style="text-align: center; margin-bottom: 1.8em;">Se&aacute;n I. O&rsquo;Donoghue<sup>1,2,3</sup>, Kenneth Sabir<sup>2,3</sup>, Christian Stolte<sup>1</sup>, Benjamin Wellmann<sup>4</sup>,
              Maria Kalemanov<sup>4</sup>,<br>Fabian Buske<sup>2,7</sup>, Julian Heinrich<sup>1</sup>, Manfred Roos<sup>4</sup>, Nelson Perdig&atilde;o<sup>5,6</sup>, Burkhard Rost<sup>4</sup>,
              Andrea Schafferhans<sup>4</sup><br>
              <br>
              <!-- <script src="/javascripts/email.js"></script><br> -->
              <br><strong>Updated: <span class="lastupdate">{{data}}</span></strong>
              <br>This indicates when the Aquaria database (PSSH2) was last calculated.
              <br>PDB structures released since then are not yet available in Aquaria.
              <br>The next update is planned for <span class="nextupdate">15th April 2015</span>.
            </p>
            <p class="affiliations">
              1. CSIRO Digital Productivity, Sydney, Australia &nbsp;
              2. Garvan Institute of Medical Research, Sydney, Australia &nbsp;
              3. University of Sydney, Australia <br>
              4. Technische Universit&auml;t M&uuml;nchen, Germany &nbsp;
              5. University of Lisbon, Portugal &nbsp;
              6. Instituto de Sistemas e Rob&oacute;tica, Lisboa, Portugal<br>
              7. St. Vincent's Clinical School, UNSW, Sydney, Australia.
            </p>
            <p style="text-align: center;">We gratefully acknowledge generous support from Amazon AWS in hosting the Aquaria database and server.<br>&nbsp;</p>

          </div>
</template>

<script>
import store from '@/store/index'
import $ from 'jquery'

export default {
  name: 'AboutAquaria',
  computed: {
    data () {
      return store.state.message
    }
  },
  methods: {
    hideAbout: function () {
    // dim background
      // $('div#about_overlay, div#help_overlay').hide()
      document.querySelector('div#about_overlay').style.visibility = 'hidden'
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
    /* display: none; */
    border-radius: 12px;
    position: fixed;
    top: 1em;
    left: 10%;
    max-width: 700px;
    width: 80%;
    padding: 2px;
    margin: 10px auto;
    background-color: #DDD;
    z-index: 105;
    /* bottom: 1em; */
    overflow: scroll;
    visibility: hidden;
    font-size: 10px;
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
  @media screen and (min-width: 320px) {
      #about_overlay {
          font-size: calc(8px + 6 * ((100vw - 320px) / 680));
      }
  }
  @media screen and (min-width: 1000px) {
      #about_overlay {
          font-size: 16px;
      }
  }

</style>
