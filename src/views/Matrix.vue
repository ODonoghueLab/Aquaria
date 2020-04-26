<template>
  <div id="Matrix">
    <div id="header">
          <div id="logo" v-on:click="showAbout()"></div>
          <AboutMatrix v-bind:OrganismName="this.structures[1].name" v-bind:OrgSynonyms="this.structures[1].OrgSynonyms" id="about_matrix" />
    </div>
     <div id="container">
        <div v-for="structure in structures" :key="structure.primary_accession" class="cell"  v-on="structure.count > 0 ? { click: () => redirect(structure.primary_accession) } : {}">
          <a v-bind:href="[structure.count > 0 ? redirect(structure.primary_accession) : '']" :style="[structure.count > 0 ? {'cursor': 'pointer'} : {'pointer-events': 'none', 'cursor': 'none'}]" target="_blank" class='link'>
          <h3>{{structure.synonym}}</h3>
          <picture>
             <source v-bind:srcset="'../images/covid19/WEBP/' + structure.primary_accession + '.webp 2000w, ../images/covid19/WEBP/' + structure.primary_accession + '_w1000.webp 1000w, ../images/covid19/WEBP/' + structure.primary_accession + '_w500.webp 500w'"  type="image/webp" sizes="33vw">
             <source v-bind:srcset="'../images/covid19/JPEG/' + structure.primary_accession + '.jpg 2000w, ../images/covid19/JPEG/' + structure.primary_accession + '_w1000.jpg 1000w, ../images/covid19/JPEG/' + structure.primary_accession + '_w500.jpg 500w'"  type="image/jpeg" sizes="33vw">
             <img v-bind:src="'../images/covid19/JPEG/' + structure.primary_accession + '_w1000.jpg'"/>
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
      totalStructures: 0
    }
  },
  beforeMount () {
    var numStructures = [0, 2, 2, 2, 0, 0, 0, 0, 0, 25, 357, 495, 117, 0]
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
        this.structures = JSON.parse(response.data.primary_accessions)
        // this.organismSynonyms = this.structures.OrgSynonyms
        for (let index = 0; index < this.structures.length; index++) {
          this.structures[index].count = numStructures[index]
          this.totalStructures = this.totalStructures + numStructures[index]
        }
      })
  },
  methods: {
    redirect: function (primaryAccession) {
      // THIS GOES BACK TO AQUARIA.WS
      let redirectionPort = ':8009/'
      if (window.location.hostname === 'aquaria.ws') {
        // Only on AWS production server, use the default port
        redirectionPort = '/'
      }
      var url = window.location.protocol + '//' + window.location.hostname + redirectionPort + primaryAccession
      return url
    },
    showAbout: function () {
    // dim background
      document.querySelector('div#about_overlay').style.visibility = 'visible'
      if (document.getElementsByClassName('dimmer').length === 0) {
        var elemDiv = document.createElement('div')
        elemDiv.className = 'dimmer'
        document.body.append(elemDiv)
        document.querySelector('div#about_overlay').style.visibility = 'visible'
        document.querySelector('div.dimmer').addEventListener('click', function () {
          document.querySelector('div#about_overlay').style.visibility = 'hidden'
          document.querySelector('div.dimmer').remove()
        })
      } else {
        document.querySelector('div.dimmer').remove()
      }
    }
  },
  updated () {
    setTimeout(function () {
      document.querySelector('.matrixLoading').remove()
    }, 1000)
  },
  mounted () {
    if ((window.outerHeight - window.innerHeight) >= 80) {
      document.getElementById('Matrix').style.height = '74vh'
    } else {
      document.getElementById('Matrix').style.height = '92.5vh'
    }
    window.scrollTo(0, 9)
    window.addEventListener('resize', function () {
      if ((window.outerHeight - window.innerHeight) >= 80) {
        document.getElementById('Matrix').style.height = '74vh'
        window.scrollTo(0, 0)
      } else {
        document.getElementById('Matrix').style.height = '92.5vh'
        window.scrollTo(0, 9)
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
#matrix{
  margin-top: 20px;
  background: #c0c0c0;
}
#Matrix{
  height: 100vh;
  background: #c0c0c0 url(../assets/img/icon-large.png) no-repeat calc(6px + 0.4vw) 8px;
  background-size: calc(30px + 1.5vw) calc(31px + 1.5vw);
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
        /* height:5em; */
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
        height: 92vh;
        width: 98vw;
        margin: 0 auto;
    }
    /* Wide aspect ratio */
    @media (max-aspect-ratio: 15/4) and (min-aspect-ratio: 8/5) {
        #container {
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(3, 1fr);
            height: 88vh;
        }
    }
    /* Tall aspect ratio */
    @media (max-aspect-ratio: 3/4) {
        #container {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(5, 1fr);
            height: 88vh;
        }
    }
    @media (max-aspect-ratio: 3/4) and (min-height: 1000px) {
        #container {
            height: 94vh;
        }
    }
/* In-between aspect ratio, put it at the bottom to avoid override*/
    @media (max-aspect-ratio: 8/5) and (min-aspect-ratio: 3/4) {
        #container  {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
            height: 90vh;
        }
    }
        @media (max-aspect-ratio: 8/5) and
              (min-aspect-ratio: 3/4) and
              (min-height: 1000px) {
        #container  {
            height: 93vh;
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
    @media screen and (min-width: 1000px) {
        #Matrix .cell {
            font-size: 16px;
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
</style>
