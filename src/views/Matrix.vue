<template>
  <div id="matrix">
    <div id="header">
          <div id="logo" v-on:click="showAbout()"></div>
          <!-- <span id="res">resized?</span>
          <span id="hd"> hDiff</span> -->
          <AboutMatrix v-bind:OrganismName="this.structures[1].name" v-bind:OrgSynonyms="this.structures[1].OrgSynonyms" id="about_matrix" />
          <!-- <a  v-bind:href="'https://doi.org/10.1101/2020.07.16.207308'" target="_blank"><img id="paper" class="infoLink" v-bind:src="'../images/PDF.png'" v-if="$mq === 'laptop' || $mq === 'tablet'"/></a>
          <a  v-bind:href="'https://youtu.be/J2nWQTlJNaY'" target="_blank"><img id="video" class="infoLink" v-bind:src="'../images/Video.png'" v-if="$mq === 'laptop' || $mq === 'tablet'"/></a> -->
          <img id="menu" v-bind:src="'../images/menu.png'" v-if="$mq === 'mobile' || $mq === 'tablet'" v-on:click="showSwitch()"/>
          <toggle-switch :options="option5" @change="updateMap($event.value)" v-model="value3" style="position: absolute;top: 15px;right: 15px;" v-if="$mq === 'laptop'"/>
          <toggle-switch id="switch" :options="option5" @change="updateMap($event.value)" v-model="value3" v-if="$mq === 'mobile' || $mq === 'tablet'"/>
          <span id='pageName' v-if="$mq === 'laptop'" v-on:click="showAbout()">Aquaria-COVID resource</span>
    </div>
      <!-- <GraphViewer :path="`${publicPath}lib`" url="../COVID/web/Fig_1_hi-res.pdf"/> -->
     <!-- <iframe id="slide" src='../COVID/web/viewer.html#zoom=28?Fig_2_hi-res.pdf' :style="[this.showSlide == 0 ? {'display': 'none'} : {'display': 'block'}]" v-if="$mq === 'laptop' || $mq === 'tablet'"></iframe>
     <iframe id="slide" src='../COVID/web/viewer.html#zoom=16.5?Fig_2_hi-res.pdf' :style="[this.showSlide == 0 ? {'display': 'none'} : {'display': 'block'}]" v-if="$mq === 'mobile'"></iframe> -->
     <!-- <canvas id="slide"></canvas> -->
     <div id="container" :style="[this.showSlide == 0 ? {'display': 'grid'} : {'display': 'none'}]">
        <div v-for="structure in structures" :key="structure.primary_accession" class="cell"  v-on="structure.count > 0 ? { click: () => redirect(structure.primary_accession) } : {}">
          <a v-bind:href="[structure.count > 0 ? redirect(structure.primary_accession) : '']" :style="[structure.count > 0 ? {'cursor': 'pointer'} : {'pointer-events': 'none', 'cursor': 'none'}]" target="_blank" class='link'>
          <h3>{{structure.synonym}}</h3>
          <picture>
             <source v-bind:srcset="[structure.count < 1 ? '../images/covid19/unknown-structure_1000.png, ../images/covid19/unknown-structure_500.png, ../images/covid19/unknown-structure_250.png' : '../images/covid19/WEBP/' + structure.primary_accession + '.webp 2000w, ../images/covid19/WEBP/' + structure.primary_accession + '_w1000.webp 1000w, ../images/covid19/WEBP/' + structure.primary_accession + '_w500.webp 500w']" type="image/webp" sizes="33vw">
             <source v-bind:srcset="[structure.count < 1 ? '../images/covid19/unknown-structure_1000.png, ../images/covid19/unknown-structure_500.png, ../images/covid19/unknown-structure_250.png' : '../images/covid19/JPEG/' + structure.primary_accession + '.jpg 2000w, ../images/covid19/JPEG/' + structure.primary_accession + '_w1000.jpg 1000w, ../images/covid19/JPEG/' + structure.primary_accession + '_w500.jpg 500w']"  type="image/jpeg" sizes="33vw">
             <img v-bind:src="[structure.count < 1 ? '../images/covid19/unknown-structure_1000.png, ../images/covid19/unknown-structure_500.png, ../images/covid19/unknown-structure_250.png' : '../images/covid19/JPEG/' + structure.primary_accession + '_w1000.jpg']"/>
           </picture>
          <p :style="[structure.count == 0 ? {'color': 'grey'} : {'color': '#3a3a3a'}]">{{structure.count}} matching structures</p>
          </a>
        </div>
    </div>
     <a id='graph' title='Click to open interactive version' v-bind:href="'/Fig_2_hi-res.pdf'" target="_blank" :style="[this.showSlide == 0 ? {'display': 'none'} : {'display': 'block'}]">
      <v-lazy-image
        src="../images/Fig_2_100.jpg"
        src-placeholder="../images/Fig_2_55.jpg"
        />
      </a>
    <AboutAquaria />
  </div>
</template>

<script>
import * as CdrComps from '../cedar.js'
import axios from 'axios'
import AboutAquaria from '../components/AboutAquaria'
import AboutMatrix from '../components/AboutMatrix'
// import GraphViewer from '../components/GraphViewer'
import $ from 'jquery'
import VLazyImage from 'v-lazy-image'
import store from '@/store/index'

export default {
  name: 'Matrix',
  components: {
    ...CdrComps,
    AboutAquaria,
    AboutMatrix,
    VLazyImage
    // GraphViewer
  },
  data () {
    return {
      hostname: store.state.url,
      publicPath: process.env.BASE_URL,
      showSlide: 1,
      structures: null,
      organism: null,
      clicked: false,
      totalStructures: 0,
      value3: 'not selected',
      selected3: false,
      option5: {
        layout: {
          backgroundColor: '#999999',
          selectedBackgroundColor: 'orange',
          selectedColor: 'white',
          color: 'white',
          fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
          fontWeightSelected: 'normal'
        },
        size: {
          height: 2,
          width: 7,
          padding: 0.3,
          fontSize: 1,
          'border-radius': '15px'
        },
        items: {
          preSelected: 'Genome',
          labels: [{ name: 'Genome' }, { name: 'Matrix' }]
        }
      }
    }
  },
  beforeMount () {
    if (window.location.search === '?Matrix') {
      this.option5.items.preSelected = 'Matrix'
      this.showSlide = 0
    } else {
      this.option5.items.preSelected = 'Genome'
      this.showSlide = 1
    }
    // var numStructures = [0, 2, 2, 2, 0, 0, 0, 0, 0, 25, 357, 495, 117, 0]
    // var numStructures = [2, 0, 35, 0, 0, 0, 0, 3, 0, 0, 4, 678, 528, 134]
    var allStructures, matchingStructures
    function csvJSON (csv) {
      var lines = csv.split('\n')
      var result = []
      var headers = lines[0].split(',')
      for (var i = 1; i < lines.length; i++) {
        var obj = {}
        var currentline = lines[i].split(',')
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j]
        }
        result.push(obj)
      }
      return JSON.stringify(result)
    }

    var url = ''
    if (window.location.pathname.split('/')[1] === 'SARS-CoV-2' || window.location.pathname.split('/')[1] === 'covid19') {
      url = `${process.env.VUE_APP_AQUARIA_BACKEND}/2697049`
    } else {
      url = `${process.env.VUE_APP_AQUARIA_BACKEND}/${window.location.pathname.split('/')[2]}`
    }
    axios({
      method: 'get',
      url: url
    })
      .then(response => {
        allStructures = JSON.parse(response.data.primary_accessions)
        // this.organismSynonyms = this.structures.OrgSynonyms
        for (let index = 0; index < allStructures.length; index++) {
          allStructures[index].count = 0
          if (allStructures[index].PDB_chain_hash != null) {
            var purl = `${process.env.VUE_APP_AQUARIA_BACKEND}/${allStructures[index].primary_accession}.csv`
            axios({
              method: 'get',
              url: purl
            })
              .then(response => {
                matchingStructures = csvJSON(response.data)
                matchingStructures = JSON.parse(matchingStructures)
                for (var i = 0; i < matchingStructures.length; i++) {
                  allStructures[index].count = allStructures[index].count + parseInt(matchingStructures[i]['cluster size'])
                }
                // this.totalStructures = this.totalStructures + this.structures[index].count
              })
          }
          // this.totalStructures = this.totalStructures + numStructures[index]
        }
        this.structures = allStructures
      })

    this.structures = allStructures
  },
  methods: {
    updateMap: function (value) {
      if (value === 'Genome') {
        console.log('Genome')
        window.history.replaceState({}, document.title, '?' + 'Genome')
        document.getElementById('container').style.display = 'none'
        if (document.getElementsByClassName('dimmer').length === 1) {
          document.querySelector('.dimmer').remove()
          document.querySelector('#switch').style.display = 'none'
        }
        document.getElementById('graph').style.display = 'block'
        document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2) > label').style.zIndex = '0'
        document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1) > label').style.zIndex = '1'
      } else {
        window.history.replaceState({}, document.title, '?' + 'Matrix')
        document.querySelector('#container').style.display = 'grid'
        if (document.getElementsByClassName('dimmer').length === 1) {
          document.querySelector('.dimmer').remove()
          document.querySelector('#switch').style.display = 'none'
        }
        document.getElementById('graph').style.display = 'none'
        document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1) > label').style.zIndex = '0'
        document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2) > label').style.zIndex = '1'
      }
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        document.querySelector('#switch').style.display = 'none'
        document.querySelector('div.dimmer').remove()
      }
    },
    redirect: function (primaryAccession) {
      return `${process.env.VUE_APP_MATRIX_REDIRECT_URL || ''}/${primaryAccession}`
    },
    showAbout: function () {
      var Position = window.innerWidth / 2 - $('#about_overlay').width() / 2
      Position = Position + 'px'
      $('#about_overlay').css({
        left: Position
      })
      // dim background
      document.querySelector('div#about_overlay').style.display = 'block'
      if (document.getElementsByClassName('dimmer').length === 0) {
        var elemDiv = document.createElement('div')
        elemDiv.className = 'dimmer'
        document.body.append(elemDiv)
        document.querySelector('div#about_overlay').style.display = 'block'
        document.querySelector('div.dimmer').addEventListener('click', function () {
          document.querySelector('div#about_overlay').style.display = 'none'
          document.querySelector('div.dimmer').remove()
        })
      } else {
        document.querySelector('div.dimmer').remove()
      }
    },
    showSwitch: function () {
      document.querySelector('#switch > ul').style.position = 'absolute'
      document.querySelector('#switch > ul').style.top = '15px'
      document.querySelector('#switch > ul').style.right = '20px'
      var Position = window.innerWidth / 2 - $('#switch').width() / 2
      Position = Position + 'px'
      document.querySelector('#switch').style.left = Position
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
      // Switch styling
      document.querySelector('#switch > ul > li:nth-child(1) > label').style.borderBottomLeftRadius = '20px'
      document.querySelector('#switch > ul > li:nth-child(1) > label').style.borderTopLeftRadius = '20px'
      document.querySelector('#switch > ul > li:nth-child(1) > label').style.borderBottomRightRadius = '20px'
      document.querySelector('#switch > ul > li:nth-child(1) > label').style.borderTopRightRadius = '20px'
      document.querySelector('#switch > ul > li:nth-child(1) > label').style.borderColor = 'transparent'
      // document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1)').style.fontSize = 'calc(8px + 0.6vw)'
      document.querySelector('#switch  > ul > li:nth-child(1)').style.left = '25px'
      document.querySelector('#switch  > ul > li:nth-child(1)').style.width = '50%'

      document.querySelector('#switch  > ul > li:nth-child(2) > label').style.borderBottomLeftRadius = '20px'
      document.querySelector('#switch  > ul > li:nth-child(2) > label').style.borderTopLeftRadius = '20px'
      document.querySelector('#switch  > ul > li:nth-child(2) > label').style.borderBottomRightRadius = '20px'
      document.querySelector('#switch  > ul > li:nth-child(2) > label').style.borderTopRightRadius = '20px'
      document.querySelector('#switch  > ul > li:nth-child(2) > label').style.borderColor = 'transparent'
      document.querySelector('#switch  > ul > li:nth-child(2)').style.width = '50%'
      // document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2)').style.fontSize = 'calc(8px + 0.6vw)'

      document.querySelector('#switch  > ul').style.width = '15rem'
    }
  },
  updated () {
    setTimeout(function () {
      if (document.querySelector('.matrixLoading')) {
        document.querySelector('.matrixLoading').style.visibility = 'hidden'
        document.querySelector('.matrixLoading').style.display = 'none'
      }
    }, 350)

    // setTimeout(function () {
    //   document.getElementById('slide').src = '../COVID/web/viewer.html#zoom=28?Fig_2_med-res.pdf'
    //   document.getElementById('slide').contentWindow.location.reload()
    // }, 5000)

    // setTimeout(function () {
    //   document.getElementById('slide').src = '../COVID/web/viewer.html#zoom=28?Fig_1_hi-res.pdf'
    //   document.getElementById('slide').contentWindow.location.reload()
    // }, 9000)

    if (window.location.hash === '#about') {
      this.showAbout()
    }

    if (window.location.search === '?Matrix') {
      document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1) > label').style.zIndex = '0'
      document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2) > label').style.zIndex = '1'
    } else {
      document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1) > label').style.zIndex = '1'
      document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2) > label').style.zIndex = '0'
    }

    // Switch styling
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1) > label').style.borderBottomLeftRadius = '20px'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1) > label').style.borderTopLeftRadius = '20px'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1) > label').style.borderBottomRightRadius = '20px'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1) > label').style.borderTopRightRadius = '20px'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1) > label').style.borderColor = 'transparent'
    // document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1)').style.fontSize = 'calc(8px + 0.6vw)'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1)').style.left = '25px'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(1)').style.width = '50%'

    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2) > label').style.borderBottomLeftRadius = '20px'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2) > label').style.borderTopLeftRadius = '20px'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2) > label').style.borderBottomRightRadius = '20px'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2) > label').style.borderTopRightRadius = '20px'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2) > label').style.borderColor = 'transparent'
    document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2)').style.width = '50%'
    // document.querySelector('#header > div:nth-child(3) > ul > li:nth-child(2)').style.fontSize = 'calc(8px + 0.6vw)'

    document.querySelector('#header > div:nth-child(3) > ul').style.width = '15rem'

    // document.querySelector('div#Matrix').addEventListener('click', function () {
    //   document.querySelector('iframe#slide').focus()
    // })

    var checkPhone = function () {
      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ]

      if (navigator.platform) {
        while (iDevices.length) {
          if (navigator.platform === iDevices.pop() || (screen.width >= 300 && screen.width <= 600)) { return true }
        }
      } else {
        return false
      }
    }
    var isPhone = checkPhone()
    var hDiff = (window.outerHeight - window.innerHeight)
    // document.getElementById('res').innerHTML = 'updated! '
    // document.getElementById('hd').innerHTML = ' hDiff: ' + hDiff
    if (isPhone && window.innerHeight > 315) {
      if (Math.abs(hDiff) >= 114) {
        // document.getElementById('hd').innerHTML = ' hDiff:  ' + hDiff
        // document.getElementById('header').style.backgroundColor = 'Hotpink'
        document.getElementById('Matrix').style.height = '88vh'
        document.getElementById('about_overlay').style.maxHeight = '80vh'
        document.getElementById('container').style.maxHeight = '80vh'
        window.scrollTo(0, 0)
      } else {
        // document.getElementById('hd').innerHTML = ' hDiff:  ' + hDiff
        // document.getElementById('header').setAttribute('style', '')
        document.getElementById('Matrix').setAttribute('style', '')
        document.getElementById('about_overlay').setAttribute('style', '')
        // document.getElementById('container').setAttribute('style', '')
        // window.scrollTo(0, 9)
      }
    }
  },
  created () {
    var checkPhone = function () {
      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ]

      if (navigator.platform) {
        while (iDevices.length) {
          if (navigator.platform === iDevices.pop() || (screen.width >= 300 && screen.width <= 600)) { return true }
        }
      } else {
        return false
      }
    }
    var isPhone = checkPhone()
    window.addEventListener('resize', function () {
      var hDiff = window.outerHeight - window.innerHeight
      // document.getElementById('res').innerHTML = 'resized! '
      // document.getElementById('hd').innerHTML = ' hDiff: ' + hDiff
      if (isPhone && window.innerHeight > 300) {
        if ((Math.abs(hDiff) <= 200) && (Math.abs(hDiff) >= 50)) {
          // document.getElementById('res').innerHTML = 'resized! '
          // document.getElementById('hd').innerHTML = ' hDiff: ' + hDiff
          // document.getElementById('header').style.backgroundColor = 'DeepPink'
          document.getElementById('Matrix').style.height = '88vh'
          document.getElementById('about_overlay').style.maxHeight = '80vh'
          document.getElementById('container').style.maxHeight = '80vh'
          window.scrollTo(0, 0)
        } else {
          // document.getElementById('res').innerHTML = 'also resized! '
          // document.getElementById('hd').innerHTML = ' hDiff: ' + hDiff
          // document.getElementById('header').setAttribute('style', '')
          document.getElementById('Matrix').setAttribute('style', '')
          document.getElementById('about_overlay').setAttribute('style', '')
          document.getElementById('container').setAttribute('style', '')
          // window.scrollTo(0, 9)
        }
      }
    })
  }
}
</script>

<style scoped>
span#pageName{
  color: #747373;
  position: absolute;
  left: 3px;
  top: calc(8px + 1vw);
  font-size: calc(8px + 0.6vw);
  font-weight: 600;
  margin-left: calc(6px + 0.4vw + 26px + 1.5vw);
  cursor: pointer;
}
.toggle-switch li:first-child label[data-v-3cf97114] {
    border: 1px none;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    height: 30px;
    border-top-right-radius: 20px;
}
.infoLink{
    position: absolute;
    top: 10px;
    height: 42px;
    right: 125px;
}

#video{
  top: 15px;
  margin-right: 36px;
}

#switch{
    display: none;
    z-index: 11;
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
#logo{
    width: 84px;
    height: 86px;
    position: absolute;
    left: 0px;
}
#logo:hover{
  cursor: pointer;
}

#about_source{
  top: 59px;
}

/* Christian's work */
#matrix{
  height: 99vh;
  background: #c0c0c0 url(../assets/img/icon-large.png) no-repeat calc(6px + 0.4vw) calc(8px + 0.1vh);
  background-size: calc(26px + 1.5vw) calc(26px + 1.5vw);
  text-align: center;
}
/* general layout and colors */
    body {
        margin: 0;
        padding: 0;
        background: #bbbbbb;
    }
    #header {
        display: inline-flex;
        padding: 2px 22px;
        height: 4em;
        min-height: calc(48px + 1.5vw);
    }
    #header span {
      display: inline;
    }
    div.no_match h3 {
        font-weight:400;
    }
    .cell {
        background-color: #cccccc;
        position: relative;
        overflow: hidden;
        /* 'relative' as reference point for absolute positioned elements inside */
    }
    /* * * * * CSS grid * * * * */
    #container {
        /* display: grid; */
        grid-gap: 6px;
        background: #c0c0c0;
        padding: 6px;
        height: 90%;
        margin: 0 auto;
    }
    /* Wide aspect ratio */
    @media (max-aspect-ratio: 15/4) and (min-aspect-ratio: 8/5) {
        #container {
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(3, 1fr);
            height: 90%;
        }
    }
    @media screen and (max-height: 420px) and (max-aspect-ratio: 15/4) and (min-aspect-ratio: 8/5) {
      #matrix {
        height: 88vh;
      }
    }
    @media screen and (orientation:landscape) and (max-width : 1024px){
        #container {
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(3, 1fr);
            height: 89%;
        }
        #about_matrix{
          margin-bottom: 11px;
        }
    }

    /* Tall aspect ratio */
    @media (max-aspect-ratio: 3/4) {
        #container {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(5, 1fr);
            height: 88%;
        }
    }
    @media (max-aspect-ratio: 3/4) and (min-height: 1000px) {
        #container {
            height: 92%;
        }
    }
/* In-between aspect ratio, put it at the bottom to avoid override*/
    @media (max-aspect-ratio: 8/5) and (min-aspect-ratio: 3/4) {
        #container  {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
            height: 92%;
        }
    }
        @media (max-aspect-ratio: 8/5) and
              (min-aspect-ratio: 3/4) and
              (min-height: 1000px) {
        #container  {
            height: 93%;
        }
    }

    .cell {
        grid-column: span 1;
        grid-row: span 1;
    }
    .cell img {
        max-height: 100%;
        max-width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
    /* TYPOGRAPHY */
    /* responsive sizes */
    #matrix .cell {
        /* font-family: 'Source Sans Pro', sans-serif; */
        font-size: 10px;
    }
    @media screen and (min-width: 320px) {
        #matrix .cell {
            font-size: calc(8px + 6 * ((100vw - 320px) / 680));
        }
    }
    /* Alignment */
    body {
        text-align: center;
    }
    h1, h3, p {
        margin: 0;
    }
    span#count {
        color:#383838;
        font-weight: 300;
        font-size: 60%;
        margin-left: 20px;
    }
    a span#help {
        display:inline-block;
        color:#ffffff;
        background:#0876d6;
        font-weight: 700;
        font-size: 80%;
        border-radius: 50%;
        margin-left: 20px;
        width: 1.2em;
        line-height: 1.2em;
    }
    .cell p {
        position: absolute;
        width: 100%; /* this, together with 'text-align:center' from body, keeps text centered */
        bottom: 5%;
        z-index:1;
    }
    .cell h3 {
        position: absolute;
        width: 100%;
        top: 5%;
        z-index:1;
        font-size: inherit;
    }

    /* iframe#slide{
      height:91.7vh;
      width: 100%;
      border: none;
    } */

    #graph{
      width: 100vw;
      position: absolute;
    }

  .v-lazy-image {
  filter: blur(10px);
  transition: filter 0.7s;
  }

  .v-lazy-image-loaded {
    filter: blur(0);
  }
</style>
