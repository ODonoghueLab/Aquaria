<template>
     <div id='header'>
          <div id="m-logo"></div>
          <AboutMatrix id="about_matrix" v-bind:OrganismName="'COVID-19'" />
          <img id="menu" v-bind:src="menu" v-if="$mq === 'mobile' || $mq === 'tablet'" v-on:click="showSwitch()"/>
          <!-- <toggle-switch :options="option5" @change="updateMap($event.value)" v-model="value3" style="position: absolute;top: 15px;right: 15px;" v-if="$mq === 'laptop'"/>
          <toggle-switch id="switch" :options="option5" @change="updateMap($event.value)" v-model="value3" v-if="$mq === 'mobile' || $mq === 'tablet'"/> -->
          <!-- <span id='pageName' v-if="$mq === 'laptop'">Aquaria-COVID resource</span> -->
          <span id='toggle-switch' v-if="$mq === 'laptop'">Structural coverage <span id='selected'> map</span> <span id='idle' @click="updateMap" @mouseover="highlight()" @mouseout="removeHighlight()">| matrix</span></span>
          <span id='switch' v-if="$mq === 'mobile' || $mq === 'tablet'">Structural coverage <span id='selected'> map</span> <span id='idle' @click="updateMap" @mouseover="highlight()" @mouseout="removeHighlight()">| matrix</span></span>
          <AboutAquaria/>
    </div>
</template>

<script>
import AboutMatrix from './AboutMatrix'
import AboutAquaria from '../InfoAbout/AboutAquaria'

export default {
  name: 'MatrixHeader',
  components: {
    AboutMatrix,
    AboutAquaria
  },
  data () {
    return {
      menu: require('../../assets/img/menu.png')
    }
  },
  mounted () {
    let hash = ''
    if (window.location.hash) {
      hash = window.location.hash
    } else if (localStorage.getItem('visited')) {
      hash = ''
    } else {
      hash = '#info'
    }
    window.history.replaceState({}, document.title, hash)
    localStorage.setItem('visited', true)
  },
  updated () {
    const search = window.location.hash.toLowerCase()
    if (search === '#matrix') {
      document.querySelector('#selected').innerHTML = 'matrix'
      document.querySelector('#idle').innerHTML = '| map'
    } else if (search === '#map') {
      document.querySelector('#selected').innerHTML = 'map'
      document.querySelector('#idle').innerHTML = '| matrix'
    } else {
    }
    const that = this
    if (window.location.hash.toLowerCase() === '#about') {
      that.AboutAquaria()
    }
    document.querySelector('div#m-logo').addEventListener('click', function () {
      that.AboutAquaria()
    })
  },
  methods: {
    highlight: function () {
      document.querySelector('#idle').style.color = 'orange'
    },
    removeHighlight: function () {
      document.querySelector('#idle').style.color = '#999999'
    },
    updateMap: function () {
      var currentSelection = document.querySelector('#idle').innerHTML.split('|')[1]
      var previousSelection = document.querySelector('#selected').innerHTML
      if (currentSelection.includes('map')) {
        window.history.replaceState({}, document.title, '#' + 'Map')
        document.querySelector('#graph').style.display = 'block'
        document.querySelector('#container').style.display = 'none'
      } else {
        window.history.replaceState({}, document.title, '#' + 'Matrix')
        document.querySelector('#graph').style.display = 'none'
        document.querySelector('#container').style.display = 'grid'
      }
      document.querySelector('#selected').innerHTML = currentSelection
      document.querySelector('#idle').innerHTML = '| ' + previousSelection
      document.querySelector('#switch').style.display = 'none'
      document.querySelector('.dimmer').remove()
    },
    showSwitch: function () {
      // dim background
      document.querySelector('#switch').style.display = 'block'
      if (document.getElementsByClassName('dimmer').length === 0) {
        var elemDiv = document.createElement('div')
        elemDiv.className = 'dimmer'
        document.body.append(elemDiv)
        document.querySelector('#switch').style.display = 'block'
        document.querySelector('div.dimmer').addEventListener('click', function () {
          document.querySelector('#switch').style.display = 'none'
          document.querySelector('div.dimmer').remove()
        })
      } else {
        document.querySelector('div.dimmer').remove()
      }
    },
    AboutAquaria: function () {
      window.history.replaceState({}, document.title, '#About')
      // dim background
      document.querySelector('#about_overlay').style.display = 'block'
      var Position = window.innerWidth / 2 - document.querySelector('#about_overlay').offsetWidth / 2
      Position = Position + 'px'
      document.querySelector('#about_overlay').style.left = Position
      if (document.getElementsByClassName('dimmer').length === 0) {
        var elemDiv = document.createElement('div')
        elemDiv.className = 'dimmer'
        document.body.append(elemDiv)
        document.querySelector('#about_overlay').style.display = 'block'
        document.querySelector('div.dimmer').addEventListener('click', function () {
          if (document.querySelector('#graph').style.display === 'block') {
            window.history.replaceState({}, document.title, '#Map')
          } else {
            window.history.replaceState({}, document.title, '#Matrix')
          }
          document.querySelector('#about_overlay').style.display = 'none'
          document.querySelector('div.dimmer').remove()
        })
      } else {
        document.querySelector('div.dimmer').remove()
      }
    }
  }
}
</script>

<style scoped>

#header {
    display: inline-flex;
    padding: 2px 22px;
    height: 4em;
    min-height: calc(48px + 1.5vw);
 }
#idle{
    color: #818181;
    font-weight: 100;
    cursor: pointer;
}
span#toggle-switch{
  color: white;
  position: absolute;
  right: -10px;
  top: calc(8px + 1vw);
  font-size: calc(10px + 0.6vw);
  font-weight: 700;
  margin-right: calc(3px + 0.4vw);
  /* cursor: pointer; */
  /* background: grey; */
  padding: 2px 10px;
  border-radius: 14px;
}
span#pageName{
  color: #747373;
  position: absolute;
  left: 3px;
  top: calc(10px + 1vw);
  font-size: calc(8px + 0.6vw);
  font-weight: 600;
  margin-left: calc(6px + 0.4vw + 26px + 1.5vw);
  cursor: pointer;
}
#toggle-switch, #pageName {
      display: inline;
}
#switch{
    display: none;
    right: 20px;
    top: 15px;
    padding: 4px 20px;
    border-radius: 16px;
    position: absolute;
    z-index: 19;
    color: white;
    background-color: #b6b6b6;
    font-weight: 700;
}
#video{
  top: 15px;
  margin-right: 36px;
}
#menu{
    height: 35px;
    position: absolute;
    right: -0.8vw;
    margin-top: 13px;
}
.link{
  color: #2c3e50;
  font-weight:400;
}
#m-logo{
    width: 84px;
    height: 86px;
    position: absolute;
    left: 0px;
}
#m-logo:hover{
  cursor: pointer;
}

#about_source{
  top: 59px;
}
</style>
