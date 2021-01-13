<template>
  <div>
    <div id="structureviewerexplanation" class="explanation">
      <div id='titlebar'>
        <span id="uniprotpanel" class='titlepanel' @click="showUniprotPanel" v-if="organism_name && !seqRes">
          <img v-bind:src="search">
          {{organism_name}} <strong>{{primary_accession}}</strong>
        </span>
        <span id="uniprotpanel" class='titlepanel' @click="showUniprotPanel" v-if="!organism_name && !seqRes">
          <img v-bind:src="search">
          Protein Sequence
        </span>
        <span id="threeDexplanation" class='titlepanel' v-if="!seqRes" @click="showthreeDexplanation">aligned onto
        </span>
        <span id="pdbpanel" class='titlepanel' @click="showPdbPanel" v-if="pdb && !seqRes">{{pdb}} <a href="javascript: alert('HELP')" class="help">?</a></span>
        <span id="pdbpanel" class='titlepanel' @click="showPdbPanel" v-if="!pdb">PDB-ID <a href="javascript: alert('HELP')" class="help">?</a></span>
        <div id='titleAlign' @click="showthreeDexplanation" @mouseover="highlightTitle" @mouseout="removeHighlight">
          <span id='left' class='titlepanel' @click="showUniprotPanel" v-if="seqRes">
            <img v-bind:src="search">
            <span>
            Sequence <br/>Structure
            </span>
          </span>
          <span class='titlepanel' v-if="seqRes"><strong>{{primary_accession}}:</strong> <br/> <strong>{{pdb}}:</strong> </span>
          <span id='right' class='titlepanel' @click="showthreeDexplanation" v-if="seqRes">{{seqRes}} <br/> {{structRes}} <a href="#" class="close">×</a></span>
        </div>
      </div>
    </div>
    <div id='contentPanel'>
      <div id='panel1' class='contents'>
        <SearchPanel id="searchByName"/>
        <AboutUniprot id="uniprot"/>
      </div>
      <AboutPDB id="gallery" class='contents'/>
      <Explanation id="explanation" class='contents' v-bind:alignment='alignment'/>
    </div>
</div>
</template>

<script>
import SearchPanel from './SearchPanel'
import AboutUniprot from './AboutUniprot'
import AboutPDB from './AboutPDB'
import Explanation from './Explanation'
import $ from 'jquery'

export default {
  name: 'Title3D',
  components: {
    AboutPDB,
    SearchPanel,
    AboutUniprot,
    Explanation
  },
  data () {
    return {
      organism_name: null,
      primary_accession: null,
      text: null,
      pdb: null,
      search: require('../assets/img/search_100.png'),
      seqRes: null,
      structRes: null,
      alignment: null
    }
  },
  beforeMount () {
    const _this = this

    window.AQUARIA.update3DTitle = function (accession, pdbId, chainId, moleculeName, score) {
      if (chainId && moleculeName) {
        var shortName = moleculeName
        if (shortName.indexOf('(') !== -1) {
          shortName = moleculeName.substring(0, moleculeName.indexOf('(')).trim()
        }

        window.AQUARIA.short_moleculeName = shortName

        if (accession && pdbId && score) {
          _this.organism_name = window.AQUARIA.Organism.Name
          _this.primary_accession = window.AQUARIA.Gene
          _this.text = 'aligned onto'
          _this.pdb = pdbId + '-' + chainId

          // '[id^="structureviewerexplanation"]'
          var evalue = window.AQUARIA.currentMember.E_value // e-value from pssh2
          window.AQUARIA.explainTitle(accession, window.AQUARIA.preferred_protein_name, shortName, pdbId, chainId, score, evalue)
          // $('#help3D').show().parent().attr('onmouseenter', "AQUARIA.explainTitle('" + accession + "','" + window.AQUARIA.preferred_protein_name + "','" + shortName + "','" + pdbId + "','" + chainId +
          //   "','" + score + "','" + evalue + "');")
        } else { // DNA or RNA (no accession)
          _this.organism_name = window.AQUARIA.Organism.Name
          _this.primary_accession = shortName
          _this.text = 'structure from'
          _this.pdb = pdbId + '-' + chainId
        }
      } else {
        $('#accession_link').text(window.AQUARIA.preferred_protein_name)
      }
    }
  },
  methods: {
    removeHighlight: function () {
      document.querySelectorAll('#titleAlign span').forEach(el => {
        el.style.background = '#888888'
      })
    },
    highlightTitle: function () {
      document.querySelectorAll('#titleAlign span').forEach(el => {
        el.style.background = '#3ca8f7'
      })
    },
    resetSelection: function () {
      document.querySelectorAll('#titlebar span').forEach(el => {
        el.className = 'titlepanel'
      })
      document.querySelectorAll('.contents').forEach(el => {
        el.style.display = 'none'
      })
    },
    showUniprotPanel: function (ev) {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      this.resetSelection()
      ev.target.className = 'titlepanel active'
      document.querySelector('#contentPanel').style.display = 'table'
      document.querySelector('#panel1').style.display = 'block'
      document.querySelector('#uniprot').style.display = 'block'
      document.querySelector('#searchByName').style.display = 'block'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelectorAll('#titlebar span').forEach(el => { el.className = 'titlepanel' })
        document.querySelector('#uniprot').style.display = 'none'
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('#structureviewerexplanation').style.display = 'table'
        document.querySelector('div.dimmer').remove()
      })
    },
    showPdbPanel: function (ev) {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      this.resetSelection()
      ev.target.className = 'titlepanel active'
      document.querySelector('#gallery').style.display = 'block'
      document.querySelector('#contentPanel').style.display = 'table'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelectorAll('#titlebar span').forEach(el => { el.className = 'titlepanel' })
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('div.dimmer').remove()
      })
    },
    showthreeDexplanation: function (ev) {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      this.resetSelection()
      ev.target.className = 'titlepanel active'
      document.querySelector('#explanation').style.display = 'block'
      document.querySelector('#contentPanel').style.display = 'table'
      if (document.querySelector('.expandable-text-line')) {
        document.querySelector('.expandable-text-line').style.maxWidth = document.querySelector('#structureviewerexplanation').offsetWidth + 20 + 'px'
      }
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelectorAll('#titlebar span').forEach(el => { el.className = 'titlepanel' })
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('div.dimmer').remove()
      })
    },
    release: function () {
      document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').style.display = 'none'
      this.resetSelection()
    },
    formatAlignment: function (alignment) {
      alignment.replace(/\n\n/g, '<br /><br />')
      return alignment
    }
  },
  mounted () {
    this.resetSelection()
  },
  updated () {
    var _this = this
    this.$children[0].placeholderText(window.AQUARIA.Organism.Name, window.AQUARIA.preferred_protein_name)
    var selectedRes = new MutationObserver(function () {
      if (document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').style.display === 'none') {
        _this.seqRes = null
        _this.structRes = null
        _this.alignment = null
      } else {
        var residues = document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').innerText.split('\n')
        var pdb = window.AQUARIA.currentMember.pdb_id + '-' + window.AQUARIA.currentMember.pdb_chain + ':'
        var accession = window.AQUARIA.Gene + ':'
        _this.seqRes = residues[1].split(accession)[1]
        _this.structRes = residues[0].split(pdb)[1]
        _this.alignment = window.AQUARIA.panel3d.joleculeAlignment.copyToClipboard()
        // _this.alignment = '<p>' + _this.alignment
        // _this.alignment = _this.alignment.replace(/\n\n/g, '</p><br /><p>"')
        // _this.alignment = _this.alignment.replace(/\n/g, '</p><p>')
        // var showAlignment = new MutationObserver(function () {
        //   if (document.querySelector('.expandable-text-line').style.whiteSpace === '') {
        //     document.querySelector('#alignment').style.display = 'none'
        //     document.querySelector('#msg').style.display = 'block'
        //   } else {
        //     document.querySelector('#msg').style.display = 'none'
        //     document.querySelector('#alignment').style.display = 'block'
        //   }
        // })

        // showAlignment.observe(document.querySelector('.expandable-text-line'), {
        //   attributes: true, childList: true, characterData: true
        // })
      }
    })

    selectedRes.observe(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection'), {
      attributes: true, childList: true, characterData: true
    })
  }
}
</script>

<style>
#titleAlign > .titlepanel {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  margin-top: 1rem;
}
#titleAlign > .titlepanel#left{
  padding-left: 0.5rem;
}
#titleAlign > .titlepanel#right{
  padding-right: 0.5rem;
}
#left {
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  padding-left: 0.6rem;
}
#left > img {
  height: calc(10px + .6vw);
}
#right {
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  padding-right: 0.6rem;
}
.titlepanel {
  text-align: left;
}

#uniprotpanel > img {
 height: calc(10px + .6vw);
}
/* Christian */
#titlebar {
    flex-basis: auto;
    text-align: center;
    line-height: 1.25;
    padding: 0;
    border-radius: 1.5rem;
    margin: auto;
    position: relative;
    z-index: 6;
}
#titlebar span {
  display: inline-block;
  background-color: var(--primary-label);
  padding: 0 0.2rem;
  transition: all 0.5s ease;
  color: var(--text);
  text-decoration: none;
  line-height: calc(14px + .6vw);
}
#titlebar span:hover {
  background-color: var(--primary-link);
}
#titlebar span.titlepanel.active {
  background-color: var(--primary-highlight);
}
#titleAlign.active {
  background-color: var(--primary-highlight);
}

#title:hover span#threeDexplanation {
  border-right: 1px dotted var(--background);
  border-left: 1px dotted var(--background);
}

span#uniprotpanel, span#pdbpanel, span#threeDexplanation {
  padding-top: 0.3rem;
  padding-bottom: 0.4rem;
}

span#uniprotpanel {
  padding-left: 0.6rem;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  transition: all 0.7s ease;
  text-align: right;
}

span#pdbpanel {
  padding-right: 0.5rem;
  font-weight: 600;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  position: relative;
}
span#pdbpanel.wide {
  padding-right: 2rem;
}
/* Neblina */
#titlebar {
    /* display: -webkit-box;
    margin: auto;
    border-radius: 5em; */
    /* background-color: var(--primary-label); */
    min-width: 272px;
}
.roundButton {
    color: #999;
    height: 17px;
    width: 17px;
    padding: 0 4px;
}
.contents {
  padding: 0 1rem;
  text-align: left;
  color: #5d5d5d;
  overflow: auto;
}
#structureviewerexplanation,#structureviewerexplanation_1 {
    display: table;
    background-color: var(--transparent);
    position: fixed;
    left: 50%;
    top: 4.5vh;
    transform: translate(-50%, -50%);
    -webkit-box-align: baseline;
    align-items: baseline;
    border-radius: 5em;
    padding: 5px calc(4px + 0.4vw);
    font-size: calc(8px + .6vw);
    z-index: 2;
}
@media screen and (min-width: 2100px) {
  #structureviewerexplanation,#structureviewerexplanation_1  {
    font-size: 22px;
  }
}
#uniprot {
    display: block;
    margin: 10px 0px;
    width: 100%;
    height: fit-content;
    z-index: 20;
}
#contentPanel {
  z-index: 1;
  display: none;
  border-radius: 2em;
  background: rgb(222, 222, 222);
  max-height: 80vh;
  top: -30px;
  position: relative;
  padding: 4rem 0 2rem 0;
}
#panel1 {
  margin-top: -1rem;
}
#structureviewerexplanation_1 > #titlebar >  #uniprotpanel {
  padding-right: 5px;
}
#structureviewerexplanation_1 > #titlebar >  #uniprotpanel > img {
  display: block;
}
#structureviewerexplanation_1 > #titlebar >  #threeDexplanation {
  padding-right: 5px;
  border-right: 1px solid white;
  border-left: 1px solid white;
}
#structureviewerexplanation_1 > #titlebar >  #pdbpanel {
  padding-left: 8px;
}
/* #pdbpanel .help {
  position: relative;
} */
#pdbpanel .help {
    width: calc(12px + .6vw);
    height: calc(12px + .6vw);
    position: relative;
    left: 0.2rem;
    display: inline-flex;
    /* z-index: 11; */
    align-items: center;
    justify-content: center;
    background-color: var(--primary-highlight);
    border-radius: 50%;
    color: white;
    cursor: pointer;
    /* font-size: 0.6rem; */
}
#pdbpanel .close {
  right: 0.25rem;
    top: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    position: absolute;
    display: table;
    z-index: 11;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,.5);
    border-radius: 50%;
    color: white;
    cursor: pointer;
    font-size: 1rem;
}
</style>
