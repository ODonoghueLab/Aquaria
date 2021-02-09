<template>
    <!-- About Alignment -->
    <div id="Alignment" class="panel overlay about level4" >
      <p class="spacer" v-if="alignment">&nbsp;</p>
      <p>What you see in the 3D viewer is the experimentally-determined structure of {{pdbName}} from
      <a href='http://www.rcsb.org/pdb/explore.do?structureId={{}}' target='_blank'> PDB entry {{pdbId}}</a>chain {{chainId}}.
      </p>
      <p> The full-length sequence of the protein you specified ({{uniprotName}}) has been aligned onto the sequence used to determine this PDB structure.</p>
      <p> Overall, the two sequences align with {{score}}% identity; any amino acid substitutions are indicated using dark coloring (see legend).</p>
      <p class='quality'> This alignment has an HHblits E-value of {{evalueString}} &times; <nobr>10<sup>{{power}}</sup></nobr>, which is considered to be {{quality}}.
          Based on cross-validation, the likelihood that your specified protein ({{uniprotName}}) adopts a structure similar to that shown is estimated to be {{precisiontxt}}%.</p>
          <p>Note that the structure shown is taken directly from the PDB; it has not been derived by ab-initio or comparative modeling.</p>
      <expandable-text-line :use-click="Hover" v-if="alignment"> <!--  -->
          <p v-if="$mq === 'laptop' || $mq === 'tablet'"><strong>Alignment:</strong><pre>{{ alignment }}</pre></p>
      </expandable-text-line>
    </div>
</template>
<script>
import $ from 'jquery'
import d3 from 'd3'
import ExpandableTextLine from 'vue-expandable-text-line'

export default {
  name: 'AboutAlignment',
  components: {
    ExpandableTextLine
  },
  props: ['alignment'],
  data () {
    return {
      pdbName: null,
      pdbId: null,
      chainId: null,
      score: null,
      qualClass: null,
      evalueString: null,
      quality: null,
      uniprotName: null,
      precisiontxt: null,
      power: null
    }
  },
  beforeMount () {
    const _this = this

    window.AQUARIA.explainTitle = function (accession, uniprotName, pdbName, pdbId, chainId, score, evalue) {
      _this.pdbName = pdbName
      _this.pdbId = pdbId
      _this.chainId = chainId
      _this.score = score
      _this.uniprotName = uniprotName
      var Log10E
      Log10E = -Math.log(evalue) / Math.LN10
      var precision = (_this.BioScience_PlantDisease_Weibull_model(Log10E) * 100)
      precision = Math.round(precision)
      _this.evalueString = evalue.toString().split('e')[0]
      _this.power = evalue.toString().split('e')[1]
      if (evalue === 0 && precision === 1) {
        _this.precisiontxt = 'close to 100'
      } else {
        _this.precisiontxt = '≥ ' + precision
      }
      if (evalue > 10E-72) {
        _this.quality = 'in the twilight zone'
        _this.qualClass = 'twilight'
      } else {
        _this.quality = 'high quality'
        _this.qualClass = 'high'
      }
    }
  },
  methods: {
    // To the best of my knowledge this code is correct.
    // If you find any errors or problems please contact
    // me directly using zunzun@zunzun.com.
    //
    // James
    BioScience_PlantDisease_Weibull_model: function (xIn) {
      var temp
      temp = 0.0

      // coefficients
      var a = -2.9039350989124828E+00
      var b = 7.9846661459228132E+00
      var c = 4.4780238831200248E-01

      temp = 1.0 - Math.exp(-1.0 * Math.pow((xIn - a) / b, c))
      return temp
    },
    showBubble: function (msgHtml) {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      // $('body').append('<div class="dimmer" style="opacity: 0.08; -moz-opacity: 0.08;"></div>');
      $('span#help3D.roundButton').css('background-position', '0 -21px')
      document.querySelector('div.dimmer').addEventListener('click', function () {
        $('div.popup, div.dimmer').fadeOut().remove()
        $('span#help3D.roundButton').css('background-position', '0 0')
      })

      var balloon = "<div class='balloon'><h3>3D View Explained<span class='x'>&nbsp;</span></h3>"

      balloon = balloon + msgHtml + '</div>'
      d3.select('body')
        .append('div')
        .attr('class', 'popup top')
        .html(balloon)

      var fpos = $('#help3D').offset()

      var bleft = parseInt(fpos.left - 230)
      var btop = parseInt(fpos.top + 30)

      $('div.popup').css({
        left: bleft + 'px',
        top: btop + 'px'
      }).draggable().fadeIn(600)

      $('span.x').click(function () {
        $('div.popup, div.dimmer').fadeOut().remove()
        $('span#help3D.roundButton').css('background-position', '0 0')
      })
    },
    resetSelection: function () {
      document.querySelectorAll('#titlebar span').forEach(el => {
        el.className = 'titlepanel'
      })
      document.querySelectorAll('.contents').forEach(el => {
        el.style.display = 'none'
      })
    }
  },
  mounted () {
    this.resetSelection()
  }
}
</script>
<style scoped>
.expandable-text-line{
  max-width: 50vw;
  max-height: 33vh;
  overflow: hidden;
  white-space: nowrap;
}
.expandable-text-line strong {
  display: block;
}
.expandable-text-line pre {
  font-size: 0.75rem;
  max-height: 30vh;
  overflow: auto;
}
</style>
