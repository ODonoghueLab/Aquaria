<template>
    <div id="about_overlay">
            <h3>About Aquaria <span class='x' v-on:click="hideAbout()">&nbsp;</span></h3>
            <p id="starter"><img src="../../public/images/logo-large.png"
                   width="605"
                   height="167"
                   alt="Aquaria"></p>
            <p><strong>Simplifying the generation of insight from protein structures</strong></p>
            <p><span>Se&aacute;n I. O&rsquo;Donoghue<sup>1,2,3</sup>,</span><span>Kenneth Sabir<sup>2,3</sup>,</span><span>Christian Stolte<sup>1</sup>,</span><span>Benjamin Wellmann<sup>4</sup>,</span>
            <span>Maria Kalemanov<sup>4</sup>,</span><span>Fabian Buske<sup>2,7</sup>,</span><span>Julian Heinrich<sup>1</sup>,</span><span>Manfred Roos<sup>4</sup>,</span><span>Nelson Perdig&atilde;o<sup>5,6</sup>,</span>
            <span>Burkhard Rost<sup>4</sup>,</span><span>Andrea Schafferhans<sup>4</sup></span>
              <br>
              <!-- <script src="/javascripts/email.js"></script><br> -->
              <br><strong>Updated: <span class="lastupdate">{{data}}</span></strong>
              <br>This indicates when the Aquaria database (PSSH2) was last calculated.
              <br>PDB structures released since then are not yet available in Aquaria.
              <br>The next update is planned for <span class="nextupdate">15th April 2025</span>.
            </p>
            <p class="affiliations">
              <span>1. CSIRO Digital Productivity, Sydney, Australia</span>
              <span>2. Garvan Institute of Medical Research, Sydney, Australia</span>
              <span>3. University of Sydney, Australia</span>
              <span>4. Technische Universit&auml;t M&uuml;nchen, Germany</span>
              <span>5. University of Lisbon, Portugal</span>
              <span>6. Instituto de Sistemas e Rob&oacute;tica, Lisboa, Portugal</span>
              <span>7. St. Vincent's Clinical School, UNSW, Sydney, Australia.</span>
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
      return store.state.message
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
