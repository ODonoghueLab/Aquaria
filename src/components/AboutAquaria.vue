<template>
    <div id="about_overlay">
            <h3>About Aquaria <span class='x' v-on:click="hideAbout()">&nbsp;</span></h3>
            <p id="starter">
              <p class="intro1">Aquaria helps biologists use 3D structures to gain insight into function. For >500,000 protein sequences,
                Aquaria has >100 million pre-calculated model structures that can be mapped with >65 million sequence features. </p>
              <!-- <img v-bind:src="data.logo"
                   width="605"
                   height="167"
                   alt="Aquaria"></p> -->
            <p class="intro1">To learn more, watch the <a>introductory video</a> or read our <a>bioRxiv preprint</a>.</p>
            <div id="XRcontent"><XRButton /></div>
            <p><i>Last updated May, 2020. PDB entries released since then are not yet available in Aquaria.</i><p>
            <p><b>Team: </b><span>Se&aacute;n I. O&rsquo;Donoghue<sup>1,2,3</sup>,</span>
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
            </p>
            <p class="affiliations">
              <b>Institutions: </b> <sup>1</sup> Garvan Institute of Medical Research, Sydney, Australia.
              <sup>2</sup> CSIRO Data61, Sydney, Australia.
              <sup>3</sup> University of NSW, Australia.
              <sup>4</sup> Weihenstephan-Tr. University of Applied Sciences, Freising, Germany.
              <sup>5</sup> Technische Universit&auml;t M&uuml;nchen, Germany.
              <sup>6</sup> The University of Dundee, UK.
              <sup>7</sup> University College London, UK.
            </p>
            <p><b>Support: </b>Sony Foundation, Tour de Cure Australia, Amazon AWS.<br>&nbsp;</p>
          </div>
</template>

<script>
import store from '@/store/index'
import $ from 'jquery'
import XRButton from './XRButton'
export default {
  name: 'AboutAquaria',
  components: {
    XRButton
  },
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
    max-height: 92vh;
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
.intro1{
  font-size: 14px;
}
#about_overlay p {
  line-height: 1.4em;
  text-align: center;
  margin: 1.8em;
  line-break: strict;
  font-size: 80%;
  text-align: left;
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
