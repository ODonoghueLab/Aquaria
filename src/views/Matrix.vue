<template>
  <div id="matrix">
    <MatrixHeader/>
    <LoadingPage/>
    <a id='graph' title='Click to open interactive version' v-bind:href="this.hostname + '/COVID-Structural-Coverage-Map.pdf'" target="_blank" :style="[this.showSlide == 0 ? {'display': 'none'} : {'display': 'block'}]">
      <v-lazy-image
        :src="Fig100"
        :src-placeholder="Fig55"
        />
    </a>
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
  </div>
</template>

<script>
import axios from 'axios'
import MatrixHeader from '../components/COVID/MatrixHeader'
import LoadingPage from '../components/COVID/LoadingPage'
import VLazyImage from 'v-lazy-image'
import store from '@/store/index'

export default {
  name: 'Matrix',
  components: {
    VLazyImage,
    MatrixHeader,
    LoadingPage
  },
  data () {
    return {
      Fig55: require('../assets/img/Fig_2_55.jpg'),
      Fig100: require('../assets/img/Fig_2_100.jpg'),
      hostname: store.state.url,
      publicPath: process.env.BASE_URL,
      showSlide: 1,
      structures: null,
      organism: null,
      clicked: false,
      totalStructures: 0
    }
  },
  mounted () {
    const search = window.location.hash.toLowerCase()
    if (search === '#matrix') {
      document.querySelector('#graph').style.display = 'none'
      document.querySelector('#container').style.display = 'grid'
    } else {
      document.querySelector('#graph').style.display = 'block'
      document.querySelector('#container').style.display = 'none'
    }
    let allStructures
    var matchingStructures, purl

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
    if (window.location.pathname.split('/')[1].toLowerCase() === 'sars-cov-2' || window.location.pathname.split('/')[1].includes('covid')) {
      if (window.location.hostname === 'aquaria.ws') {
        url = 'https://' + window.location.hostname + ':8010/2697049'
      } else {
        url = `${window.BACKEND}/2697049`
      }
    } else {
      url = `${window.BACKEND}/2697049/` + window.location.pathname.split('/')[2]
    }

    document.querySelector('#graph > img').addEventListener('load', () => {
      setTimeout(function () {
        if (document.querySelector('.matrixLoading')) {
          document.querySelector('.matrixLoading').style.visibility = 'hidden'
          document.querySelector('.matrixLoading').style.display = 'none'
        }
      }, 350)
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
              if (window.location.hostname === 'aquaria.ws') {
                purl = 'https://aquaria.ws' + ':8010/' + allStructures[index].primary_accession + '.csv'
              } else {
                purl = this.hostname + ':8010/' + allStructures[index].primary_accession + '.csv'
              }
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
    })
  },
  methods: {
    checkPhone: function () {
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
    },
    redirect: function (primaryAccession) {
      // THIS GOES BACK TO AQUARIA.WS
      let redirectionPort = '/'
      if (window.location.hostname === 'localhost') {
        // Only on local dev server
        redirectionPort = ':8009/'
      }
      var url = this.hostname + redirectionPort + primaryAccession
      return url
    }
  },
  updated () {
    const isPhone = this.checkPhone()
    var hDiff = (window.outerHeight - window.innerHeight)
    if (isPhone && window.innerHeight > 315) {
      if (Math.abs(hDiff) >= 114) {
        document.querySelector('#matrix').style.height = '88vh'
        document.getElementById('about_overlay').style.maxHeight = '80vh'
        document.getElementById('container').style.maxHeight = '80vh'
        window.scrollTo(0, 0)
      } else {
        document.querySelector('#matrix').style = ''
      }
    }
  },
  created () {
    var isPhone = this.checkPhone()
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
.v-lazy-image{
  width: 100vw;
}

.infoLink{
    position: absolute;
    top: 10px;
    height: 42px;
    right: 125px;
}

/* Christian's work */
@media (min-width: 550px){
  #matrix{
    height: 99vh;
    background: #c0c0c0 url(../assets/img/Resource-banner.svg) no-repeat calc(6px + 0.4vw) calc(8px + 0.1vh);
    background-size: calc(115px + 5vw) calc(26px + 2vw);
    text-align: center;
  }
}
 @media screen and (max-width: 549px){
   #matrix{
  height: 99vh;
  background: #c0c0c0 url(../assets/img/AquariaLogo.svg) no-repeat calc(6px + 0.4vw) calc(8px + 0.1vh);
  background-size: calc(130px + 1.5vw) calc(35px + 1.5vw);
  text-align: center;
  }
}
/* general layout and colors */
    body {
        margin: 0;
        padding: 0;
        background: #bbbbbb;
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
    @media screen and (max-aspect-ratio: 15/4) and (min-aspect-ratio: 8/5) {
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
    @media screen and (max-aspect-ratio: 3/4) {
        #container {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(5, 1fr);
            height: 88%;
        }
    }
    @media screen and (max-aspect-ratio: 3/4) and (min-height: 1000px) {
        #container {
            height: 92%;
        }
    }
/* In-between aspect ratio, put it at the bottom to avoid override*/
    @media screen and (max-aspect-ratio: 8/5) and (min-aspect-ratio: 3/4) {
        #container  {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
            height: 92%;
        }
    }
        @media screen and (max-aspect-ratio: 8/5) and
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
        /* text-align: center; */
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
  transition: filter 1.5s;
  }

  .v-lazy-image-loaded {
    filter: blur(0);
  }
</style>
