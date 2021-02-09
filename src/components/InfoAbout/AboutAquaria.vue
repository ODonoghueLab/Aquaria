<template>
  <div id="About" class="panel overlay level7">
    <a href="#" class="close" @click="hideScrim"></a>
    <div>
      <p class="thetitle">About Aquaria</p>
      <p class="intro1">Aquaria helps biologists use 3D structures to gain insight into function. For >500,000 protein sequences,
                Aquaria has >100 million pre-calculated model structures that can be mapped with >65 million sequence features. </p>
      <p id="starter"><img v-bind:src="data.logo"
                   width="50%"
                   alt="Aquaria" />
      </p>
      <p class="intro1">To learn more, watch the <a>introductory video</a> or read our <a>bioRxiv preprint</a>.</p>
      <div id="XRcontent">
        <XRButton />
      </div>
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
  </div>
</template>
<script>
import store from '@/store/index'
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
        logo: require('../../assets/img/logo-large.png')
      }
    }
  },
  methods: {
    hideScrim: function () {
      document.querySelector('#scrim').className = 'hide'
    }
  }
}
</script>
<style scoped>
p.thetitle {
  display: flex;
    background-color: var(--primary-label);
    flex-basis: auto;
    color: var(--text);
    text-align: center;
    line-height: 1.25;
    padding: 0.5rem 2rem;
    border-radius: 1.5rem;
    margin: auto;
}
  #About:target.panel {
      display: flex;
      font-size: 90%;
      max-width: 30rem;
      text-align: center;
  }
  #About p.thetitle {
      text-transform: uppercase;
      letter-spacing: 0.25em;
      font-size: 85%;
  }
  /* .intro1{
    font-size: 1.4rem;
  } */
  .affiliations {
    font-size: 70%;
  }
  #About span {
    display: inline-block;
    white-space: nowrap;
    margin-right: 0.25em;
  }
  .affiliations span {
      margin-right: 1.2em;
  }
 </style>
