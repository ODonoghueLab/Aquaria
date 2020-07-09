<template>
  <div id="Matrix">
    <div id="header">
          <div id="logo" v-on:click="showAbout()"></div>
          <!-- <span id="res">resized?</span>
          <span id="hd"> hDiff</span> -->
          <AboutMatrix v-bind:OrganismName="this.structures[1].name" v-bind:OrgSynonyms="this.structures[1].OrgSynonyms" id="about_matrix" />
          <toggle-switch :options="option5" @change="updateMap($event.value)" v-model="value3" style="position: absolute;top: 15px;right: 15px;" v-if="$mq === 'laptop'"/>
    </div>
     <iframe id="slide" src='../COVID/index.html'></iframe>
     <div id="container">
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
    <AboutAquaria />
  </div>
</template>

<script>
import * as CdrComps from '../cedar.js'
import axios from 'axios'
import AboutAquaria from '../components/AboutAquaria'
import AboutMatrix from '../components/AboutMatrix'
import $ from 'jquery'

export default {
  name: 'Matrix',
  components: {
    ...CdrComps,
    AboutAquaria,
    AboutMatrix
  },
  data () {
    return {
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
          fontFamily: 'Lucida Grande',
          fontWeightSelected: 'normal'
        },
        size: {
          height: 2,
          width: 7,
          padding: 0.25,
          fontSize: 0.70,
          'border-radius': '15px'
        },
        items: {
          preSelected: 'Grid',
          labels: [{ name: 'Grid' }, { name: 'Genome' }]
        }
      }
    }
  },
  beforeMount () {
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
      url = window.location.protocol + '//' + window.location.hostname + ':8010/2697049'
    } else {
      url = window.location.protocol + '//' + window.location.hostname + ':8010/' + window.location.pathname.split('/')[2]
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
            var purl = window.location.protocol + '//' + window.location.hostname + ':8010/' + allStructures[index].primary_accession + '.csv'
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
        document.getElementById('container').style.display = 'none'
        document.getElementById('slide').style.display = 'block'
      } else {
        document.getElementById('container').style.display = 'grid'
        document.getElementById('slide').style.display = 'none'
      }
    },
    redirect: function (primaryAccession) {
      // THIS GOES BACK TO AQUARIA.WS
      let redirectionPort = ':8009/'
      if (window.location.hostname === 'aquaria.ws') {
        // Only on AWS production server, use the default port
        redirectionPort = '/'
      }
      if (window.location.hostname === 'localhost') {
        // Only on local dev server
        redirectionPort = ':8080/'
      }
      var url = window.location.protocol + '//' + window.location.hostname + redirectionPort + primaryAccession
      return url
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
    }
  },
  updated () {
    setTimeout(function () {
      if (document.querySelector('.matrixLoading')) {
        document.querySelector('.matrixLoading').remove()
      }
    }, 350)
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
        document.getElementById('container').setAttribute('style', '')
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
#Matrix{
  height: 99vh;
  background: #c0c0c0 url(../assets/img/icon-large.png) no-repeat calc(6px + 0.4vw) calc(6px + 0.1vh);
  background-size: calc(40px + 1.5vw) calc(40px + 1.5vw);
  text-align: center;
}
/* general layout and colors */
    body {
        margin: 0;
        padding: 0;
        background: #bbbbbb;
    }
    #header {
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
        display: grid;
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
      #Matrix {
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
    #Matrix .cell {
        /* font-family: 'Source Sans Pro', sans-serif; */
        font-size: 10px;
    }
    @media screen and (min-width: 320px) {
        #Matrix .cell {
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

    iframe#slide{
      display: none;
      height:90%;
      width: 100%;
      border: none;
    }
</style>
