<template>
  <div id="Matrix">
    <div id="header">
          <div id="logo" v-on:click="showAbout()"></div>
          <div id="title">
          <p id="Orgname"></p>
          <p id="matches"></p>
          <p id="help" v-on:mouseover="showAbout2()" v-on:mouseout="showAbout2()">?</p>
          </div>
    </div>
     <div id="container">
        <div v-for="structure in structures" :key="structure.primary_accession" class="cell">
          <h3>{{structure.synonym}}</h3>
          <picture>
             <source v-bind:srcset="'../images/covid19/WEBP/' + structure.primary_accession + '.webp 2000w, ../images/covid19/WEBP/' + structure.primary_accession + '_w1000.webp 1000w, ../images/covid19/WEBP/' + structure.primary_accession + '_w500.webp 500w'"  type="image/webp" sizes="33vw">
             <source v-bind:srcset="'../images/covid19/JPEG/' + structure.primary_accession + '.jpg 2000w, ../images/covid19/JPEG/' + structure.primary_accession + '_w1000.jpg 1000w, ../images/covid19/JPEG/' + structure.primary_accession + '_w500.jpg 500w'"  type="image/jpeg" sizes="33vw">
             <img v-bind:src="'../images/covid19/JPEG/' + structure.primary_accession + '_w1000.jpg'" @click="redirect(structure.primary_accession)"/>
           </picture>
          <p :style="[structure.count == 0 ? {'color': 'grey'} : {'color': '#3a3a3a'}]">{{structure.count}} matching structures</p>
        </div>
    </div>
    <AboutAquaria />
    <AboutSource />
  </div>
</template>

<script>
import * as CdrComps from '../cedar.js'
import axios from 'axios'
import $ from 'jquery'
import AboutAquaria from '../components/AboutAquaria'
import AboutSource from '../components/AboutSource'

export default {
  name: 'Matrix',
  components: {
    ...CdrComps,
    AboutAquaria,
    AboutSource
  },
  data () {
    return {
      structures: null,
      organism: null,
      clicked: false,
      totalStructures: 0
    }
  },
  updated () {
    $('#matches').html(this.totalStructures + ' matching structures')
    $('#Orgname').html(this.structures[1].name + '&nbsp;')
    var matrixHeight = $('#home').height() - $('#title').height() - 30
    matrixHeight = matrixHeight + 'px'
    $('.noflex').css({
      height: matrixHeight
    })
    // $('h1').html(this.structures[1].name + ' <span id="count"> ' + this.totalStructures + ' matching structures</span><a href="#"><span id="help">?</span></a>')
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

        for (let index = 0; index < this.structures.length; index++) {
          this.structures[index].count = numStructures[index]
          this.totalStructures = this.totalStructures + numStructures[index]
        }
      })
  },
  methods: {
    redirect: function (primaryAccession) {
      // THIS GOES BACK TO AQUARIA.WS
      var url = window.location.protocol + '//' + window.location.hostname + ':8009/' + primaryAccession
      window.open(url)
    },
    showAbout: function () {
    // dim background
      if (document.getElementsByClassName('dimmer').length === 0) {
        $('body').append('<div class="dimmer"></div>')
        $('div.dimmer').on('click', function () {
          $('div#about_overlay, div#help_overlay').hide()
          $('div.dimmer').remove()
        })
      } else {
        $('div.dimmer').remove()
      }

      $('div#about_overlay').slideToggle('slow')
    },
    showAbout2: function () {
      $('div#about_source').slideToggle('slow')
    }
  },
  mounted () {
    if ((window.outerHeight - window.innerHeight) >= 80) {
      $('#Matrix').css({
        height: '74vh'
      })
      window.scrollTo(0, 0)
    } else {
      $('#Matrix').css({
        height: '92.5vh'
      })
      window.scrollTo(0, 9)
    }
    window.addEventListener('resize', function () {
      if ((window.outerHeight - window.innerHeight) >= 80) {
        $('#Matrix').css({
          height: '74vh'
        })
        window.scrollTo(0, 0)
      } else {
        $('#Matrix').css({
          height: '92.5vh'
        })
        window.scrollTo(0, 9)
      }
    })
  }
}
</script>

<style scoped>
#logo{
    width: 84px;
    height: 86px;
    position: absolute;
    left: 0px;
}
#logo:hover{
  cursor: pointer;
}

#title{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 5em;
    background: #999999;
    margin-left: 12px;
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 2px calc(5px + 0.4vw);
}

#Orgname{
      color: white;
      font-size: calc(12px + 0.8vw);
      font-weight: bold;
      padding: 0 1vw;
}

#matches{
    font-size: calc(10px + 0.4vw);
    /* padding-top: 5px; */
}

.cell:hover{
  cursor: pointer;
}
#about_source{
  top: 59px;
}

@media only screen
  and (min-width : 100px)
  and (max-width : 700px) {
    #title{
    margin-left: calc(32px + 0.8vw);
  }
}
/* iPhone SE */
@media only screen
  and (min-width : 200px)
  and (max-height : 600px) {
    #Orgname{
    font-size: calc(9px + 0.8vw);
  }
  #matches {
    font-size: calc(8px + 0.5vw);
  }
}

#help{
  border-radius: 50%;
  background-color: aliceblue;
  width: calc(10px + 0.8vw);
  height: calc(10px + 0.8vw);
  font-size: calc(10px + 0.4vw);
  /* margin-top: 6px; */
  margin-left: 5px;
}

#help:hover{
  background-color:orange;
  color: white;
}
/* Christian's work */

#matrix{
  margin-top: 20px;
  background: #c0c0c0;
}
#Matrix{
  height: 100vh;
  background: #c0c0c0 url(../assets/img/icon-large.png) no-repeat calc(6px + 0.4vw) 8px;
  background-size: calc(44px + 0.8vw) calc(46px + 0.8vw);
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
    #header h1 {
        font-size: calc(12px + 0.7vw);
        color: #ffffff;
        font-weight:900;
        line-height: 145%;
        background:#999999;
        width:fit-content;
        padding: 0 20px;
        border-radius: 5em;
        margin: 4px auto 0;
        margin-top: 20px;
    }
    div.no_match h3 {
        /* color: #666666; */
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
        height: 100%;
        width: 98vw;
        margin: 0 auto;
    }
    /* Wide aspect ratio */
    @media (min-aspect-ratio: 8/5) and (max-aspect-ratio: 15/4) {
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
            height: 100%;
        }
    }
/* In-between aspect ratio, put it at the bottom to avoid override*/
    @media (min-aspect-ratio: 3/4) and (max-aspect-ratio: 8/5) {
        #container  {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
        }
    }
    .cell {
        grid-column: span 1;
        grid-row: span 1;
    }
    .cell img {
        max-height: 100%; /*  = 100% of the available space */
        /* don't specify width to maintain aspect ratio */
        position: relative;
        top: 4%;
        z-index:0;
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
    }
</style>
