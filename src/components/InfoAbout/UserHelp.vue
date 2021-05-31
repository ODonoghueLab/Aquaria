<template>
    <div id="UserHelp" class="HelpPanel overlay level7">
        <a href="#" class="close" @click="closeHelp"></a>
        <div>
            <p class="thetitle">{{data.title}}</p>
            <!-- <div v-if="play" id="playlist"></div> -->
            <p class="intro1">Watch tutorial videos to get started.</p>
            <p>Skip watching tutorial videos and start using Aquaria.</p>
            <youtube id='playlist' video-id="FAQ3yVGYSzY" ref="youtube" @playing="playing" @paused="paused" @ended="finished"></youtube>
            <!-- <iframe id='playlist' src="https://www.youtube.com/embed/videoseries?list=PLsGaleFn8YydVFkxDhOvHHE5NoTsl6D1e" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
            <a href="#" id='skip' @click="closeHelp">Skip > </a>
        </div>
    </div>
</template>

<script>
import store from '@/store/index'
export default {
  name: 'UserHelp',
  computed: {
    player () {
      return this.$refs.youtube.player
    },
    data () {
      return {
        title: store.state.helpTitle
      }
    }
  },
  methods: {
    closeHelp: function () {
      var _this = this
      store.commit('setHelpTitle', 'Aquaria Help')
      document.querySelector('#UserHelp').style.display = 'none'
      document.querySelector('.dimmer').style.display = 'none'
      if (document.querySelector('#helpbtn').classList.contains('active')) {
        _this.toggleActive(document.querySelector('#helpbtn'))
      }
    },
    toggleActive: function (ev) {
      if (ev.className === 'lnk active') {
        ev.className = 'lnk'
      } else {
        ev.className = 'lnk active'
      }
    },
    // showTutorial: function () {
    //   var elem = document.getElementById('UserHelp')
    //   elem.classList.remove('overlay')
    //   elem.className += ' fullwindow'
    //   document.querySelector('#UserHelp').style.left = '0px'
    // },
    // openFullscreen: function (iframe) {
    //   var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen
    //   if (requestFullScreen) {
    //     requestFullScreen.bind(iframe)()
    //   }
    // },
    // closeFullscreen: function (iframe) {
    //   var ExitFullScreen = iframe.exitFullscreen || iframe.msExitFullscreen || iframe.webkitExitFullscreen
    //   if (ExitFullScreen) {
    //     ExitFullScreen.bind(iframe)()
    //   }
    // },
    playing: function () {
      this.player.playVideo()
      var iframe = document.querySelector('#playlist')
      var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen
      if (requestFullScreen) {
        requestFullScreen.bind(iframe)()
      }
    },
    paused: function () {
      this.player.pauseVideo()
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        document.exitFullscreen()
      }
    },
    finished: function () {
      this.player.stopVideo()
      document.exitFullscreen()
      this.closeHelp()
      store.commit('setHelpTitle', 'Help')
    }
  }
}
</script>

<style>
#UserHelp iframe {
  /* width: 100%; */
  height: 29vh;
}
#skip {
  float: right;
  padding: 2px;
}
.fullwindow {
    left: 0px;
    width: 100vw;
    height: 100vh;
}
#UserHelp{
    display: none;
    position: absolute;
    z-index: 9999999999999;
    top: 1vh;
    left: 50%;
    background: var(--primary-tab);
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    flex-direction: column;
}

#AboutError:target.HelpPanel {
      display: flex;
      font-size: 90%;
      max-width: 40rem;
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
.HelpPanel.overlay {
    border-radius: 1rem;
    /* box-shadow: 0 0 0 9999px rgba(0,0,0,0.6); /* dark background overlay */
    /* -webkit-box-shadow: 0 0 0 999px rgba(0,0,0,0.6); */
    padding: 0.5rem 0.75rem;
    position: absolute;
    top: 1vh;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 90vw;
    max-width: 20rem;
  }
  .HelpPanel .close::after {
    width: 1.5rem;
    height: 1.5rem;
  }

  .HelpPanel .close {
    position: relative;
    display: block;
  }
  .HelpPanel .close::after {
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
  .HelpPanel .close:hover::after {
      background-color: var(--primary-highlight);
  }
</style>
