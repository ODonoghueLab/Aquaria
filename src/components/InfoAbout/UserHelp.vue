<template>
    <div id="UserHelp" class="HelpPanel hide dialouge-window overlay level7">
        <a href="#" class="close" @click="closeHelp"></a>
          <div id='fullwindow-video' class='fill'>
            <youtube v-for="video in videos" :key="video.id" :id='video.id' :video-id="video.id" class='hide' ref="youtube" @paused="paused($event)" @ended="finished($event)"></youtube>
          </div>
          <div id='contents'>
            <p class="thetitle">{{data.title}}</p>
            <p class="intro">Watch tutorial videos to get started.</p>
            <p class="intro">Skip watching tutorial videos and start using Aquaria.</p>
            <Playlist v-if="!data.newUser" v-bind:playlist='videos'/>
            <div v-if="data.newUser">
              <youtube id='intro-video' video-id="FAQ3yVGYSzY" ref="youtube" @playing="playing($event)" @paused="paused($event)" @ended="finished($event)"></youtube>
            </div>
            <a href="#" id='skip' @click="closeHelp">Skip > </a>
          </div>
    </div>
</template>

<script>
import store from '@/store/index'
import Playlist from './Playlist'
import * as Panels from '../AquariaLayout/helpers/hidePanels'
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
    data () {
      return {
        title: store.state.helpTitle,
        newUser: store.state.newUser
      }
    }
  },
  methods: {
    closeHelp: function () {
      var _this = this
      if (document.querySelector('iframe.show')) {
        var activeVideoID = document.querySelector('iframe.show').id
        document.getElementById('contents').classList.remove('hide')
        document.getElementById(activeVideoID).classList.remove('show')
        document.getElementById('UserHelp').className += ' dialouge-window'
        document.getElementById('UserHelp').className += ' overlay'
        document.getElementById('UserHelp').className += ' level7'
        document.getElementById('UserHelp').classList.remove('fullwindow')
        var event = {}
        event.h = {}
        event.h.id = activeVideoID
        _this.paused(event)
      } else {
        // window.AQUARIA.RemoveOverlay()
        document.getElementById('UserHelp').classList.remove('show')
        document.getElementById('UserHelp').className += (' hide')
        // document.querySelector('#UserHelp').style.display = 'none'
        Panels.RemoveOverlay()
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
    getIndex: function (targetId) {
      for (var i = 0; i < this.$refs.youtube.length; i++) {
        if (this.$refs.youtube[i].$attrs.id === targetId) {
          return i
        }
      }
    },
    playing: function (event) {
      targetId = event.h.id
      if (this.$refs.youtube.length) {
        index = this.getIndex(targetId)
        this.$refs.youtube[index].player.playVideo()
      } else {
        this.$refs.youtube.player.playVideo()
        var iframe = document.querySelector('#intro-video')
        var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen
        if (requestFullScreen) {
          requestFullScreen.bind(iframe)()
        }
      }
    },
    paused: function (event) {
      targetId = event.h.id
      if (document.querySelector('iframe.active')) {
        this.closeHelp()
      } else {
        if (this.$refs.youtube.length) {
          index = this.getIndex(targetId)
          this.$refs.youtube[index].player.pauseVideo()
        } else {
          this.$refs.youtube.player.pauseVideo()
        }
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
          document.exitFullscreen()
        }
      }
    },
    finished: function (event) {
      targetId = event.h.id
      if (this.$refs.youtube.length) {
        index = this.getIndex(targetId)
        this.$refs.youtube[index].player.stopVideo()
      } else {
        this.$refs.youtube.player.stopVideo()
      }
      if (document.querySelector('iframe.active')) {
        document.querySelector('#UserHelp a.close').click()
      }
      document.exitFullscreen()
      this.closeHelp()
    }
  }
}
</script>

<style>
.intro {
  padding: 0px 4px;
}
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
  height: 29vh;
  margin-bottom: 0.5rem;
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
    padding: 0.5rem 0.5rem 0.75rem 0.5rem;
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
    max-width: calc(23rem + 3vw);
  }
  /* .HelpPanel .close::after {
    width: calc(1.25rem + 0.5vw);
    height: calc(1.25rem + 0.5vw);
  } */

  .HelpPanel .close {
    position: relative;
    display: block;
  }
  .HelpPanel .close::after {
    right: 0.25rem;
    top: 0.25rem;
    width: calc(1.25rem + 0.5vw);
    height: calc(1.25rem + 0.5vw);
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
    font-size: calc(1rem + 0.5vw)
  }
  .HelpPanel .close:hover::after {
      background-color: var(--primary-highlight);
  }
</style>
