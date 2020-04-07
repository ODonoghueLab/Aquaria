<template>
  <div id="Matrix">
    <div id="top">
    <img src="../assets/img/icon-large.png" id="logo" v-on:click="showAbout()"/>
    <div id="title">
    <br/>
    <h3 id="name"></h3>
    <p id="h4"></p>
    </div>
    </div>
    <div class="noflex">
    <cdr-row cols="4 4@sm 3@md 4@lg" id="matrix">
      <cdr-col v-for="structure in structures" :key="structure.primary_accession" class="grid-example">
      <img class="image" v-bind:src="'../images/covid19/' + structure.primary_accession + '.png'" @click="redirect(structure.primary_accession)"/>
      <figcaption>{{structure.synonym}}</figcaption>
      <p id="numStructures" :style="[structure.count == 0 ? {'color': 'red'} : {'color': '#5a5a5a'}]">{{structure.count}} matching structures</p>
      </cdr-col>
    </cdr-row>
    </div>
    <MatrixView id="matrixView" style="display: none;" v-if="clicked"/>
    <AboutAquaria />
  </div>
</template>

<script>
import MatrixView from '../components/MatrixView'
import * as CdrComps from '../cedar.js'
import axios from 'axios'
import $ from 'jquery'
import AboutAquaria from '../components/AboutAquaria'

export default {
  name: 'Matrix',
  components: {
    ...CdrComps,
    MatrixView,
    AboutAquaria
  },
  data () {
    return {
      structures: null,
      organism: null,
      clicked: false,
      matching_structures: null,
      totalStructures: 0
    }
  },
  updated () {
    var isSafari = window.safari !== undefined
    if (isSafari) {
      $('img.image').css({
        height: '167px',
        'margin-top': '60px'
      })
      if (window.innerWidth < 415) {
        $('img.image').css({
          margin: '47px auto 0 -44%',
          'max-width': '200%',
          height: '67px'
        })
      }
      $('.grid-example').css({
        'margin-top': '6px'
      })
    }

    $('#h4').html(this.totalStructures + ' matching structures')
    $('#name').html(this.structures[1].name)
    // var captionPosition = $('.grid-example').width() / 2 - $('figcaption').width() / 2
    // captionPosition = captionPosition + 'px'
    // $('figcaption').css({
    //   'margin-left': captionPosition
    // })

    // var h3Position = $('#Matrix').width() / 2 - $('h3').width() / 2
    // h3Position = h3Position + 'px'
    // $('h3').css({
    //   'margin-left': h3Position
    // })

    var matrixHeight = $('#home').height() - $('#title').height() - 30
    matrixHeight = matrixHeight + 'px'
    $('.noflex').css({
      height: matrixHeight
    })
  },
  beforeMount () {
    var numStructures = [0, 2, 2, 2, 0, 0, 0, 0, 0, 25, 357, 495, 117, 0]
    // function csvJSON (csv) {
    //   var lines = csv.split('\n')
    //   var result = []
    //   var headers = lines[0].split(',')
    //   for (var i = 1; i < lines.length; i++) {
    //     var obj = {}
    //     var currentline = lines[i].split(',')
    //     for (var j = 0; j < headers.length; j++) {
    //       obj[headers[j]] = currentline[j]
    //     }
    //     result.push(obj)
    //   }
    //   return JSON.stringify(result)
    // }

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
          // var hostname = window.location.hostname
          // url = window.location.protocol + '//' + hostname + ':8010/' + this.structures[index].primary_accession + '.csv'
          // axios({
          //   method: 'get',
          //   url: url
          // })
          //   .then(response => {
          //     this.matching_structures = csvJSON(response.data)
          //     this.matching_structures = JSON.parse(this.matching_structures)
          //     console.log('THIS IS TEXT', this.matching_structures)
          //     for (var i = 0; i < this.matching_structures.length; i++) {
          //       this.structures[index].count = this.structures[index].count + parseInt(this.matching_structures[i]['cluster size'])
          //     }
          //     this.totalStructures = this.totalStructures + this.structures[index].count
          //   })
        }
      })

    // window.location.pathname = '/' + this.structures[1].name
  },
  methods: {
    redirect: function (primaryAccession) {
      if (document.getElementsByClassName('dimmer').length === 0) {
        $('body').append('<div class="dimmer"></div>')
        $('div.dimmer').on('click', function () {
          $('#matrixView').hide()
          $('div.dimmer').remove()
        })
      } else {
        $('div.dimmer').remove()
      }
      $('#matrixView').slideToggle('slow')
      $('#centerView').attr('v-bind:primary_accession', primaryAccession)
      this.clicked = true

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
    }
  }
}
</script>

<style scoped>
#matrix{
  margin-top: 20px;
  background: #c0c0c0;
  height: 100%;
}
#Matrix{
  position: relative;
  height: 100vh;
  background: #c0c0c0;
  background-size: 50px 50px;
  text-align: center;
}
/* #structure{
  width: 10vw;
  height: 10vw;
} */
.grid-example {
  position: relative;
  padding: 10px;
  text-align: center;
    /* These are the main settings for the page layout */
  width: 840px; /* was: 760px */
  background-color: #cccccc;
  /* Development only */
  border-color: #c0c0c0;
  border-style: solid;
  border-width: 0.1px 4px;
  font-size: 10px;
  line-height: 12px;
  height: 24%;
}
.grid-example img {
  transition: opacity 0.5s;
  max-width: 100%;
  width: 33vh;
  margin: 18px auto 0 auto;
  border:0px none;
}
.cdr-col__content_1\.0\.4:hover figcaption{
  opacity: 1;
  cursor: pointer;
}
.grid-example:hover #numStructures{
  color: black;
  cursor: pointer;
}
.grid-example:hover img{
  /* transform: scale(1.1); */
  cursor: pointer;
}

.grid-example:hover img {
  opacity:0.8;
}
.cdr-col_1\.0\.4.cdr-col_1\.0\.4{
  padding: 0px;
}

.noflex div{
  display: inline-block;
  overflow: hidden;
  margin:0;
}
h3{
    font-size: calc(12px + 1.2vw);
    background-color: #77777780;
    width: fit-content;
    padding: 10px 16px;
    border-radius: 13px;
    color: white;
    margin: 0 auto;
}
#h4{
    font-size: calc(10px + 1vw);
    padding-top: 5px;
}
figcaption{
    position: absolute;
    display: block;
    background-color: #5a595988;
    width: 84%;
    left: 8.4%;
    top: 8px;
    padding: 10px;
    border-radius: 7px;
    opacity: 0.75;
    color: white;
    margin-top: 3px;
    line-height: 1em;
    transition: opacity 0.3s, transform 0.3s;
    font-size: calc(12px + 0.4vw);
}
#numStructures{
  position: absolute;
  bottom: 2px;
  transition: transform 0.3s;
}

#top{
  display: inline-flex;
}

#logo{
  position: absolute;
    left: 0%;
    width: 50px;
    margin: 23px 11px;
}

#logo:hover {
    cursor: pointer;
    }

@media only screen
and (min-width : 100px)
and (max-width : 400px) {
  figcaption {
    font-size: 8px;
  }

  .grid-example img {
  /* margin: 66px auto 0 -34%; */
  margin: 49px auto 0 -44%;
  }

  .grid-example img {
    max-width: 200%;
    /* width: 171%; */
    width: 195%;
  }
}
  @media only screen
  and (min-width : 400px)
  and (max-width : 540px) {
  figcaption {
    font-size: 10px;
  }

  .grid-example img {
  margin: 47px auto 0 -44%;
  }

  .grid-example img {
    max-width: 200%;
    width: 195%;
  }
}

@media only screen
  and (min-width : 541px)
  and (max-width : 624px) {
  figcaption {
    font-size: 10px;
  }

  .grid-example img {
  margin: 48px auto 0 -34%;
  }

  .grid-example img {
    max-width: 200%;
    width: 171%;
  }

}

@media only screen
  and (min-width : 625px)
  and (max-width : 1240px) {
  figcaption {
    font-size: 10px;
  }

  .grid-example img {
  margin: 48px auto 0 auto;
  }

}

</style>
