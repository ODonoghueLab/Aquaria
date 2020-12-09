<template>
  <div>
    <div id="structureviewerexplanation" class="explanation">
      <div id='titlebar'>
        <span id="uniprotpanel" class='titlepanel' @click="showUniprotPanel" v-if="organism_name">
          <img v-bind:src="search">
          {{organism_name}} <strong>{{primary_accession}}</strong>
        </span>
        <span id="uniprotpanel" class='titlepanel' @click="showUniprotPanel" v-if="!organism_name">
          <img v-bind:src="search">
          Protein Sequence
        </span>
        <span id="threeDexplanation" class='titlepanel' @click="showthreeDexplanation">aligned onto </span>
        <span id="pdbpanel" class='titlepanel' @click="showPdbPanel" v-if="pdb">{{pdb}}</span>
        <span id="pdbpanel" class='titlepanel' @click="showPdbPanel" v-if="!pdb">PDB-ID </span>
        <!-- <span id="search">?</span> -->
      </div>
    </div>
    <div id='contentPanel'>
      <div id='panel1' class='contents'>
        <SearchPanel id="searchByName"/>
        <AboutUniprot id="uniprot"/>
      </div>
      <AboutPDB id="gallery" class='contents'/>
      <Explanation id="explanation" class='contents'/>
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
      search: require('../assets/img/search_100.png')
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
          _this.organism_name = window.AQUARIA.organismName
          _this.primary_accession = window.AQUARIA.Gene
          _this.text = 'aligned onto'
          _this.pdb = pdbId + '-' + chainId

          // '[id^="structureviewerexplanation"]'
          var evalue = window.AQUARIA.currentMember.E_value // e-value from pssh2
          window.AQUARIA.explainTitle(accession, window.AQUARIA.preferred_protein_name, shortName, pdbId, chainId, score, evalue)
          // $('#help3D').show().parent().attr('onmouseenter', "AQUARIA.explainTitle('" + accession + "','" + window.AQUARIA.preferred_protein_name + "','" + shortName + "','" + pdbId + "','" + chainId +
          //   "','" + score + "','" + evalue + "');")
        } else { // DNA or RNA (no accession)
          _this.organism_name = window.AQUARIA.organismName
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
      document.querySelector('#contentPanel').style.display = 'block'
      document.querySelector('#panel1').style.display = 'block'
      document.querySelector('#uniprot').style.display = 'block'
      document.querySelector('#searchByName').style.display = 'block'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelectorAll('#titlebar span').forEach(el => { el.className = 'titlepanel' })
        document.querySelector('#uniprot').style.display = 'none'
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('#structureviewerexplanation').style.display = 'grid'
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
      document.querySelector('#contentPanel').style.display = 'block'
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
      document.querySelector('#contentPanel').style.display = 'block'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelectorAll('#titlebar span').forEach(el => { el.className = 'titlepanel' })
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('div.dimmer').remove()
      })
    }
  },
  mounted () {
    this.resetSelection()
  },
  updated () {
    var input
    input = document.querySelector('#organism_syn_input')
    input.placeholder = window.AQUARIA.organismName
    input.setAttribute('size', input.getAttribute('placeholder').length)
    input = document.querySelector('#protein_syn_input')
    input.placeholder = window.AQUARIA.preferred_protein_name
    input.setAttribute('size', input.getAttribute('placeholder').length)
  }
}
</script>

<style>
/* #search {
  font-weight: 500;
    padding: 1px 8px;
    margin-right: 12px;
    color: black;
    background: white;
    border-radius: 11rem;
    margin-left: 5px;
} */
#uniprotpanel > img {
 height: calc(12px + .6vw);
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
  padding: calc(0.4rem + 3 * ((100vw - 320px) / 680)) 0.2rem;
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

#title:hover span#threeDexplanation {
  border-right: 1px dotted var(--background);
  border-left: 1px dotted var(--background);
}
span#uniprotpanel {
  padding-left: 1rem;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  transition: all 0.7s ease;
}

span#pdbpanel {
  padding-right: 1rem;
  font-weight: 600;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}

/* Neblina */
#titlebar {
    /* display: -webkit-box;
    margin: auto;
    border-radius: 5em; */
    background-color: var(--primary-label);
    min-width: 245px;
}
.roundButton {
    color: #999;
    height: 17px;
    width: 17px;
    padding: 0 4px;
}
.contents {
  padding: 0px 40px;
  text-align: left;
  color: #5d5d5d;
  overflow: auto;
}
#structureviewerexplanation,#structureviewerexplanation_1 {
    display: grid;
    background-color: var(--transparent);
    position: fixed;
    left: 50%;
    top: 28px;
    transform: translate(-50%, -50%);
    -webkit-box-align: baseline;
    align-items: baseline;
    border-radius: 5em;
    padding: 5px calc(4px + 0.4vw);
    font-size: calc(8px + .6vw);
    z-index: 2;
}
#searchByName {
    display: block;
    overflow: auto;
    width: fit-content;
    padding: 5px;
    border-radius: 10px;
    z-index: 200;
}

#uniprot {
    display: block;
    margin: 10px 0px;
    width: 100%;
    height: fit-content;
    padding: 10px;
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
</style>
