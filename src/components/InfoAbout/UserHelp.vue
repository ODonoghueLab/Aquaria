<template>
    <div id="UserHelp" class="HelpPanel deactive dialouge-window overlay level7">
        <a href="#" class="close" @click="closeHelp"></a>
          <div id='fullwindow-video' class='fill'>
            <youtube v-for="video in videos" :key="video.id" :id='video.id' :video-id="video.id" class='deactive' ref="youtube" @paused="paused($event)" @ended="finished($event)"></youtube>
          </div>
          <div id='contents'>
          <p class="thetitle">{{data.title}}</p>
          <p class="intro1">Watch tutorial videos to get started.</p>
          <p>Skip watching tutorial videos and start using Aquaria.</p>
          <youtube v-if='data.show' id='intro-video' video-id="FAQ3yVGYSzY" ref="youtube" @playing="playing($event)" @paused="paused($event)" @ended="finished($event)"></youtube>
          <Playlist v-bind:playlist='videos'/>
          <!-- <iframe id='playlist' src="https://www.youtube.com/embed/videoseries?list=PLsGaleFn8YydVFkxDhOvHHE5NoTsl6D1e" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
          <a href="#" id='skip' @click="closeHelp">Skip > </a>
          </div>
    </div>
</template>

<script>
import store from '@/store/index'
import Playlist from './Playlist'
var targetId
var index
export default {
  name: 'UserHelp',
  components: {
    Playlist
  },
  data () {
    return {
      videos: [
        { id: 'FAQ3yVGYSzY', title: 'Introduction to Aquaria' },
        { id: 'UZNEmPOaVrA', title: 'How to Calculate Distances' }
      ]
    }
  },
  computed: {
    intro () {
      return this.$refs.youtube.player
    },
    data () {
      return {
        title: store.state.helpTitle,
        show: false
      }
    }
  },
  methods: {
    closeHelp: function () {
      var _this = this
      if (document.querySelector('iframe.active')) {
        var activeVideoID = document.querySelector('iframe.active').id
        document.getElementById('contents').classList.remove('deactive')
        document.getElementById(activeVideoID).classList.remove('active')
        document.getElementById('UserHelp').className += ' dialouge-window'
        document.getElementById('UserHelp').className += ' overlay'
        document.getElementById('UserHelp').className += ' level7'
        document.getElementById('UserHelp').classList.remove('fullwindow')
        var event = {}
        event.h = {}
        event.h.id = activeVideoID
        _this.paused(event)
      } else {
        store.commit('setHelpTitle', 'Aquaria Help')
        window.AQUARIA.RemoveOverlay()
        document.getElementById('UserHelp').classList.remove('active')
        document.getElementById('UserHelp').className += (' deactive')
        // document.querySelector('#UserHelp').style.display = 'none'
        // document.querySelector('.dimmer').style.display = 'none'
        if (document.querySelector('#helpbtn').classList.contains('active')) {
          _this.toggleActive(document.querySelector('#helpbtn'))
        }
      }
    },
    toggleActive: function (ev) {
      if (ev.className === 'lnk active') {
        ev.className = 'lnk'
      } else {
        ev.className = 'lnk active'
      }
    },
    playing: function (event) {
      targetId = event.h.id
      for (var i = 0; i < this.$refs.youtube.length; i++) {
        if (this.$refs.youtube[i].$attrs.id === targetId) {
          index = i
        }
      }
      this.$refs.youtube[index].player.playVideo()
      // this.player.playVideo()
      var iframe = document.querySelector('#intro-video')
      var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen
      if (requestFullScreen) {
        requestFullScreen.bind(iframe)()
      }
    },
    paused: function (event) {
      targetId = event.h.id
      for (var i = 0; i < this.$refs.youtube.length; i++) {
        if (this.$refs.youtube[i].$attrs.id === targetId) {
          index = i
        }
      }
      if (document.querySelector('iframe.active')) {
        this.closeHelp()
      } else {
        this.$refs.youtube[index].player.pauseVideo()
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
          document.exitFullscreen()
        }
      }
    },
    finished: function (event) {
      targetId = event.h.id
      for (var i = 0; i < this.$refs.youtube.length; i++) {
        if (this.$refs.youtube[i].$attrs.id === targetId) {
          index = i
        }
      }
      this.$refs.youtube[index].player.stopVideo()
      if (document.querySelector('iframe.active')) {
        document.querySelector('#UserHelp a.close').click()
      }
      document.exitFullscreen()
      this.closeHelp()
      store.commit('setHelpTitle', 'Aquaria Help')
    }
  }
}
</script>

<style>
.dialouge-window {
  left: 50%;
  max-height: 86vh;
}
#fullwindow-video iframe, .fill {
  width: 100%;
  height: 100%;
}
.fullwindow {
  left: 0;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
}
.deactive{
  display: none;
}
.active {
  display: block;
}
.showIframe {
  display: flex;
  left: 0;
  width: 100%;
  max-height: 98vh;
  position: absolute;
  height: 100vh;
}
iframe#intro-video {
  /* width: 100%; */
  height: 29vh;
}
#skip {
  float: right;
  padding: 2px;
}
#UserHelp{
    overflow: scroll;
    /* display: none; */
    position: absolute;
    z-index: 9;
    top: 1vh;
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
    padding: 0.5rem 1rem;
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
