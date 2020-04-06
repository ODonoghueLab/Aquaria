<template>
  <div id="Matrix">
    <!-- <img src="../assets/img/icon-large.png" id="logo"/> -->
    <br/>
    <h3></h3>
    <p id="h4"></p>
    <div class="noflex">
    <cdr-row cols="4 4@sm 3@md 4@lg" id="matrix">
      <cdr-col v-for="structure in structures" :key="structure.primary_accession" class="grid-example">
      <img v-bind:src="'../images/covid19/' + structure.primary_accession + '.png'" @click="redirect(structure.primary_accession)"/>
      <figcaption>{{structure.synonym}}</figcaption>
      <p id="numStructures" :style="[structure.count == 0 ? {'color': 'red'} : {'color': '#5a5a5a'}]">{{structure.count}} matching structures</p>
      </cdr-col>
    </cdr-row>
    </div>
    <MatrixView id="matrixView" style="display: none;" v-if="clicked"/>
  </div>
</template>

<script>
import MatrixView from '../components/MatrixView'
import * as CdrComps from '../cedar.js'
import axios from 'axios'
import $ from 'jquery'

export default {
  name: 'Matrix',
  components: {
    ...CdrComps,
    MatrixView
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
    $('#h4').html(this.totalStructures + ' matching structures')
    $('h3').html(this.structures[1].name)
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

    // var h3pPosition = $('#Matrix').width() / 2 - $('#Matrix>p').width() / 2
    // h3pPosition = h3pPosition + 'px'
    // $('#Matrix>p').css({
    //   'margin-left': h3pPosition
    // })
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
  background: #c0c0c0 url(../assets/img/icon-large.png) no-repeat 20px 12px;
  background-size: 70px 72px;
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
.grid-example:hover figcaption{
   transform: scale(1.05);
  opacity: 1;
  cursor: pointer;
}
.grid-example:hover #numStructures{
  transform: scale(1.25);
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
.noflex{
  height: 88%;
}
.noflex div{
  display: inline-block;
  overflow: hidden;
  margin:0;
}
h3{
    font-size: calc(12px + 2vw);
    background-color: #77777780;
    width: fit-content;
    padding: 10px 16px;
    border-radius: 13px;
    color: white;
    margin: 0 auto;
}
#h4{
    font-size: calc(10px + 1vw);
    padding: 5px;
}
figcaption{
    position: absolute;
    display: block;
    font-size: calc(12px + 0.4vw);
    background-color: #5a595988;
    width: 74%;
    left: 13%;
    top: 8px;
    padding: 10px;
    border-radius: 7px;
    opacity: 0.75;
    color: white;
    margin-top: 3px;
    line-height: 1em;
    transition: opacity 0.3s, transform 0.3s;
}
#numStructures{
  position: absolute;
  bottom: 2px;
  transition: transform 0.3s;
}
</style>
