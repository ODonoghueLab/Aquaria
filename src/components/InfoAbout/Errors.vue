<template>
  <div id="AboutError" v-if="data.error" class='ErrorPanel overlay level7'>
    <a href="#" class="close" @click="loadLastSuccess"></a>
    <div>
      <p class="thetitle">{{data.error}}</p>
      <p class="intro1">Press 'Report Issue' to tell the Aquaria team, or press 'Cancel' to return to previous structure.</p>
      <div>
        <md-button class="md-raised md-primary" :href='lastURL'>Cancel</md-button>
        <md-button class="md-raised md-primary" :href='issuesURL' target='_blank'>Report Issue</md-button>
      </div>
      <!-- <p>We encourage you to <a v-bind:href="issues" target="_blank" title="Go to Github">report issues</a>, <a :href="changes" target="_blank" title="Go to Github">propose code changes</a>, or <a href="mailto:contact@aquaria.app" title="Email us">contact us</a> regarding suggestions.</p> -->
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
  computed: {
    data () {
      return {
        message: store.state.message,
        error: store.state.error
      }
    },
    issuesURL () {
      return 'https://github.com/aqclient/dev.aqclient.github.io/issues/new?title=Problem with this page&labels=bug&body=<a href="' + encodeURIComponent(window.location.href) + '">' + this.data.error + '</a>'
    },
    pageUrl () {
      return window.location.href
    },
    lastURL () {
      return window.location.origin
      // + (localStorage.getItem('LastSuccess') ? localStorage.getItem('LastSuccess') : '/P04637')
    }
  },
  methods: {
    loadLastSuccess: function () {
      window.location.pathname = localStorage.getItem('LastSuccess') ? localStorage.getItem('LastSuccess') : '/P04637'
    }
  }
}
</script>
<style scoped>
.md-button.md-theme-default.md-raised:not([disabled]).md-primary{
  background: #707070;
  float: right;
}
.intro1{
  padding-left: 10px;
}
#AboutError{
    display: flex;
    position: absolute;
    z-index: 9999999999999;
    top: 1vh;
    left: 50%;
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
  #AboutError:target.ErrorPanel {
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
  .ErrorPanel .close::after {
    width: 1.5rem;
    height: 1.5rem;
  }

  .ErrorPanel .close {
    position: relative;
    display: block;
  }
  .ErrorPanel .close::after {
    right: 0.25rem;
    top: 0.25rem;
    width: 1.25rem;
    height: 1.25rem;
    position: absolute;
    display: flex;
    z-index: 11;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,.5);
    border-radius: 50%;
    color: white;
    content: "×";
    cursor: pointer;
    font-size: 1rem;
  }
  .ErrorPanel .close:hover::after {
      background-color: var(--primary-highlight);
  }
 .ErrorPanel.overlay {
    border-radius: 1rem;
    /* box-shadow: 0 0 0 9999px rgba(0,0,0,0.6); /* dark background overlay */
    /* -webkit-box-shadow: 0 0 0 999px rgba(0,0,0,0.6); */
    padding: 0.5rem 0.75rem;
    position: absolute;
    top: 1vh;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 90vw;
    max-width: 30rem;
  }
 </style>
