<template>
  <div id="Matrix">
    <img src="../assets/img/icon-large.png" id="logo"/>
    <br/>
    <h3></h3>
    <p id="h4"></p>
    <div>
    <cdr-row cols="1 2@sm 3@md 4@lg" id="matrix">
      <cdr-col v-for="structure in structures" :key="structure.primary_accession" class="grid-example">
      <img v-bind:src="'../images/covid19/' + structure.primary_accession + '.png'" @click="addCard(structure.primary_accession)"/>
      <figcaption id="caption">{{structure.synonym}}</figcaption>
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
      totalStructures: 0
    }
  },
  updated () {
    for (let index = 0; index < this.structures.length; index++) {
      this.totalStructures = this.totalStructures + this.structures[index].count
    }
    $('#h4').html(this.totalStructures + ' matching structures')
    $('h3').html(this.structures[1].name)
    var captionPosition = $('.grid-example').width() / 2 - $('figcaption').width() / 2
    captionPosition = captionPosition + 'px'
    $('figcaption').css({
      'margin-left': captionPosition
    })

    var h3Position = $('#Matrix').width() / 2 - $('h3').width() / 2
    h3Position = h3Position + 'px'
    $('h3').css({
      'margin-left': h3Position
    })

    var h3pPosition = $('#Matrix').width() / 2 - $('#Matrix>p').width() / 2
    h3pPosition = h3pPosition + 'px'
    $('#Matrix>p').css({
      'margin-left': h3pPosition
    })
  },
  beforeMount () {
    const url = 'http://odonoghuelab.org:8009/' + window.location.pathname.split('/')[2]
    axios({
      method: 'get',
      url: url
    })
      .then(response => (this.structures = JSON.parse(response.data.primary_accessions)))

    // window.location.pathname = '/' + this.structures[1].name
  },
  methods: {
    addCard: function (primaryAccession) {
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
      window.location.pathname = window.location.pathname + '/' + primaryAccession
    }
  },
  computed () {
    var i
    for (i = 0; i < this.structures.length; i++) {
      this.totalStructures = this.totalStructures + this.structures[i].count
    }
  }
}
</script>

<style scoped>
#matrix{
  margin-top: 20px;
}
#Matrix{
  position: relative;
  height: 100vh;
}
#structure{
  width: 10vw;
  height: 10vw;
}
.grid-example {
  position: relative;
  padding: 10px;
  text-align: center;
  background-color: lightgray;
    /* These are the main settings for the page layout */
  width: 840px; /* was: 760px */
  height: 30%;
  /* margin: 0px auto 0px auto; */
  padding: 0px;
  /* Development only */
  border-color: black;
  border-style: dotted;
  border-width: 1px;
  font-size: 10pt;
  line-height: 12pt;
  height: 10vw;
  border-top: none;
  border-left: none;
  height: 20vh;
}

.grid-example:hover #caption{
  transform: scale(1.2);
}

.grid-example:hover #numStructures{
  transform: scale(1.5);
}

div.grid-example.col_1\.0\.4{
  padding: 0px;
}

.cdr-col_1\.0\.4.cdr-col_1\.0\.4{
  padding: 0px;
}

.cdr-row_1\.0\.4 {
    background-color: #cccccc;
    border-color: black;
    border-style: dotted;
    border-right: none;
    border-bottom: none;
    border-width: 1px;
}

h3{
    bottom: 19vh;
    position: static;
    font-size: 54px;
    background-color: #77777780;
    width: fit-content;
    padding: 10px;
    border-radius: 13px;
    /* left: 38%; */
    /* opacity: 61%; */
    color: white;
}

#h4{
    bottom: 15vh;
    position: static;
    font-size: 30px;
    width: fit-content;
    padding: 5px;
    border-radius: 13px;
    /* left: 43.5%; */
}

figcaption{
    position: absolute;
    font-size: 23px;
    background-color: #5a595954;
    width: fit-content;
    top: 8px;
    padding: 10px;
    border-radius: 7px;
    /* opacity: 44%; */
    color: white;
    margin-top: 3px;
    max-width: 74%;
    line-height: 21px
}
#numStructures{
  position: absolute;
  bottom: 2px;
}

#logo{
  width: 67px;
  position: relative;
  padding: 11px 0px 0px 8px;
  float: left;
}
</style>
