<template>
  <div>
    <h3 id="structureviewerexplanation" class="explanation">
      <span id="uniprotpanel" class='titlepanel' @click="showUniprotPanel">{{organism_name}} {{primary_accession}} </span>
      <span id="threeDexplanation" class='titlepanel' @click="showthreeDexplanation">{{text}} </span>
      <span id="pdbpanel" class='titlepanel' @click="showPdbPanel">{{pdb}}</span>
      <a href='javascript:;'  data-intro='Model Quality' data-position='top'><span id='help3D' class='help roundButton'>&nbsp;</span></a>
    </h3>
    <div id='conentPanel'>
      <h3 id="structureviewerexplanation_1" class="explanation">
        <span id="uniprotpanel" class='titlepanel' @click="showUniprotPanel">{{organism_name}} {{primary_accession}} </span>
        <span id="threeDexplanation" class='titlepanel' @click="showthreeDexplanation">{{text}} </span>
        <span id="pdbpanel" class='titlepanel' @click="showPdbPanel">{{pdb}}</span>
        <a href='javascript:;'  data-intro='Model Quality' data-position='top'><span id='help3D' class='help roundButton'>&nbsp;</span></a>
      </h3>
      <SearchPanel id="searchByName" class='contents'/>
      <AboutUniprot id="uniprot" class='contents'/>
      <Gallery id="gallery" class='contents'/>
    </div>
    <!-- <div class="rightHeaderBar">
        <a href="javascript:;" title="Toggle full window view" data-intro="Full window" data-position="bottom">
          <span id="expander" class="roundButton" style="display: inline-block;">&nbsp;</span>
        </a>
        <a class="launchApplicationLink" href="#" target="_blank" title="Launch stand-alone Java application" data-intro="Standalone application" data-position="top">
            <span class="applauncher roundButton" style="display: inline-block;">&nbsp;</span>
        </a>
  </div> -->
</div>
</template>

<script>
import SearchPanel from './SearchPanel'
import AboutUniprot from './AboutUniprot'
import Gallery from './Gallery'
import $ from 'jquery'

export default {
  name: 'Title3D',
  components: {
    Gallery,
    SearchPanel,
    AboutUniprot
  },
  data () {
    return {
      organism_name: null,
      primary_accession: null,
      text: null,
      pdb: null
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
          _this.primary_accession = window.AQUARIA.preferred_protein_name
          _this.text = 'aligned onto'
          _this.pdb = pdbId + '-' + chainId

          // '[id^="structureviewerexplanation"]'
          var evalue = window.AQUARIA.currentMember.E_value // e-value from pssh2
          $('#help3D').show().parent().attr('onmouseenter', "AQUARIA.explainTitle('" + accession + "','" + window.AQUARIA.preferred_protein_name + "','" + shortName + "','" + pdbId + "','" + chainId +
            "','" + score + "','" + evalue + "');")
        } else { // DNA or RNA (no accession)
          _this.organism_name = window.AQUARIA.organismName
          _this.primary_accession = shortName
          _this.text = 'structure from'
          _this.pdb = pdbId + '-' + chainId
        }
      } else {
        $('#accession_link').text(window.AQUARIA.preferred_protein_name)
        // $("#help3D").hide();
      }
      _this.resetSelection()
    }
    var searchLeft = $('#affordance_mode').width() / 2 - $('#searchByName').width() / 2
    searchLeft = searchLeft + 'px'
    $('#searchByName').css({
      'margin-left': searchLeft
    })
  },
  methods: {
    resetSelection: function () {
      document.querySelectorAll('.titlepanel').forEach(el => {
        el.style.display = 'flex'
        el.style.background = '#5d5d5d'
      })
      document.querySelectorAll('.contents').forEach(el => {
        el.style.display = 'none'
      })
    },
    showUniprotPanel: function () {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      this.resetSelection()
      document.querySelector('#conentPanel').style.display = 'block'
      document.querySelector('#structureviewerexplanation').style.display = 'none'
      document.querySelector('#uniprot').style.display = 'block'
      document.querySelector('#searchByName').style.display = 'block'
      document.querySelector('#structureviewerexplanation_1 > #uniprotpanel').style.background = 'orange'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelector('#uniprot').style.display = 'none'
        document.querySelector('#conentPanel').style.display = 'none'
        document.querySelector('#structureviewerexplanation').style.display = '-webkit-box'
        document.querySelector('div.dimmer').remove()
        // $('#gene_name').show()
      })
    },
    showPdbPanel: function () {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      this.resetSelection()
      document.querySelector('#gallery').style.display = 'block'
      document.querySelector('#conentPanel').style.display = 'block'
      document.querySelector('#structureviewerexplanation').style.display = 'none'
      document.querySelector('#structureviewerexplanation_1 > #pdbpanel').style.background = 'orange'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelector('#conentPanel').style.display = 'none'
        document.querySelector('#structureviewerexplanation').style.display = '-webkit-box'
        document.querySelector('div.dimmer').remove()
        // $('#gene_name').show()
      })
    },
    showthreeDexplanation: function () {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      document.querySelector('#conentPanel').style.display = 'block'
      document.querySelector('#structureviewerexplanation').style.display = 'none'
      this.resetSelection()
      document.querySelector('#structureviewerexplanation_1 > #threeDexplanation').style.background = 'orange'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelector('#conentPanel').style.display = 'none'
        document.querySelector('#structureviewerexplanation').style.display = '-webkit-box'
        document.querySelector('div.dimmer').remove()
        // $('#gene_name').show()
      })
    }
  }
}
</script>

<style>
#gallery{
    top: 20vh;
    margin: 10px 0px;
    width: 100%;
    height: fit-content;
    padding: 10px;
    z-index: 20;
}

#uniprotpanel{
    padding-left: 12px;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
    line-height: 31px;
}
#threeDexplanation{
    padding-left: 7px;
    line-height: 31px;
}
#pdbpanel{
    padding-left: 7px;
    padding-right: 12px;
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
    line-height: 31px;
}
.titlepanel{
  cursor: pointer;
}
.roundButton {
    color: #999;
    height: 17px;
    width: 17px;
    padding: 0 4px;
    /*margin-left: 4px;*/
}
#structureviewerexplanation,#structureviewerexplanation_1{
  width: max-content;
  display: -webkit-box;
  background-color: var(--transparent);
}
#searchByName{
    display: block;
    overflow: auto;
    width: fit-content;
    /* top: 40vh; */
    position: relative;
    background-color: #d1d1d1;
    padding: 5px;
    border-radius: 10px;
    z-index: 200;
}
#uniprot{
    display: block;
    margin: 10px 0px;
    position: relative;
    width: 100%;
    height: fit-content;
    padding: 10px;
    z-index: 20;
}
#conentPanel{
  display: none;
  z-index: 1;
  position: relative;
  top: 2vh;
  flex-basis: auto;
  background-color: #d2d2d2;
  color: white;
  text-align: center;
  line-height: 2.5;
  padding: 0.5rem 1.5rem;
  border-radius: 1.5rem;
  margin: auto;
  transition: all 0.7s ease;
}
#structureviewerexplanation_1 > #uniprotpanel {
  padding-right: 5px;
}
#structureviewerexplanation_1 > #threeDexplanation {
  padding-right: 5px;
  border-right: 1px solid white;
  border-left: 1px solid white;
}
#structureviewerexplanation_1 > #pdbpanel {
  padding-left: 8px;
}
</style>
