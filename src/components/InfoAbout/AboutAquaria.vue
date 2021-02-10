<template>
  <div id="About" class="panel overlay level7">
    <a href="#" class="close" @click="hideScrim"></a>
    <div>
      <p class="thetitle">About Aquaria</p>
      <p class="intro1">Aquaria helps biologists use 3D structures to gain insight into function. For all <a href="https://www.uniprot.org/help/about" title="Visit their website">SwissProt sequences</a>,
                Aquaria has >100 million <a href="https://doi.org/10.5281/zenodo.4279164" title="View the article about our methods">pre-calculated 3D models</a> that can be mapped with sequence features (pre-defined or user-defined).</p>
      <p>To learn more, watch the<a href="https://www.youtube.com/watch?v=FAQ3yVGYSzY&t=306s" title="Watch on Youtube"> introductory video</a> or read the <a href="https://www.nature.com/articles/nmeth.3258">Nature Methods paper</a>.<br>
      To improve Aquaria, we encourage you to <a href="https://github.com/ODonoghueLab/Aquaria_Client/issues" title="Go to Github">report issues, propose code changes</a>, or <a href="mailto:contact@aquaria.app" title="Email us">contact us</a> regarding suggestions or collaboration.
      </p>
     <!-- p id="starter"><img v-bind:src="data.logo"
                   width="50%"
                   alt="Aquaria" />
      </p -->
      <div id="XRcontent">
        <XRButton />
      </div>
      <!-- <p><i>Last updated May, 2020. PDB entries released since then are not yet available in Aquaria.</i><p> -->
      <p><b>TEAM: </b><span>Se&aacute;n I. O&rsquo;Donoghue<sup>1,2,3</sup>,</span>
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
        <b>INSTITUTIONS: </b> <sup>1</sup> Garvan Institute of Medical Research, Sydney, Australia.
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
      max-width: 40rem;
  }
  p#starter {
      text-align: center;
  }
  #About p.thetitle {
      text-transform: uppercase;
      letter-spacing: 0.25em;
  }
 #About a {
   /* color: var(--primary-link); */
   text-decoration: none;
 }
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
  .panel .close::after {
    width: 1.5rem;
    height: 1.5rem;
  }
 </style>
