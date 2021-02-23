<template>
  <div id="AboutError" v-if="data.error">
    <a href="#" class="close" @click="hideScrim"></a>
    <div>
      <p class="thetitle">Error</p>
      <p class="intro1">{{data.error}}</p>
      <p>We encourage you to <a v-bind:href="issues" target="_blank" title="Go to Github">report issues</a>, <a :href="changes" target="_blank" title="Go to Github">propose code changes</a>, or <a href="mailto:contact@aquaria.app" title="Email us">contact us</a> regarding suggestions.</p>
      <!-- <p><i>Last updated May, 2020. PDB entries released since then are not yet available in Aquaria.</i><p> -->
    </div>
  </div>
</template>
<script>
import store from '@/store/index'
export default {
  name: 'Errors',
  data () {
    return {
      issues: '',
      title: '',
      changes: 'https://github.com/aqclient/dev.aqclient.github.io/issues/new?labels=enhancement',
      logo: require('../../assets/img/logo-large.png')
    }
  },
  mounted () {
    this.waitForElement()
  },
  computed: {
    data () {
      return {
        message: store.state.message,
        error: store.state.error
      }
    }
  },
  methods: {
    waitForElement: function () {
      var _this = this
      //   if (!window.AQUARIA.currentMember) {
      //     setTimeout(_this.waitForElement, 50)
      //   } else {
      _this.title = window.AQUARIA.Organism.Name + ' ' + window.AQUARIA.Gene + ' aligned onto ' + window.AQUARIA.currentMember.pdb_id + '-' + window.AQUARIA.currentMember.pdb_chain
      _this.issues = 'https://github.com/aqclient/dev.aqclient.github.io/issues/new?title=Problem with this page&labels=bug&body=<a href="' + encodeURIComponent(window.location.href) + '">' + _this.title + '</a>'
      // proposed code change
    //   }
    },
    hideScrim: function () {
      document.querySelector('#scrim').className = 'hide'
    }
  }
}
</script>
<style scoped>
#AboutError{
    display: flex;
    position: absolute;
    z-index: 9999999999999;
    top: 1vh;
    left: 25%;
    background: var(--primary-tab);
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    flex-direction: column;
}
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
  #AboutError:target.panel {
      display: flex;
      font-size: 90%;
      max-width: 40rem;
  }
  p#starter {
      text-align: center;
  }
  #AboutError p.thetitle {
      text-transform: uppercase;
      letter-spacing: 0.25em;
  }
 #AboutError a {
   /* color: var(--primary-link); */
   text-decoration: none;
 }
  .affiliations {
    font-size: 70%;
  }
  #AboutError span {
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
