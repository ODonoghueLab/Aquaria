<template>
  <div>
    <h3 id="structureviewerexplanation" class="explanation"></h3>
    <div id='conentPanel'>
      <h3 id="structureviewerexplanation_1" class="explanation"></h3>
      <SearchPanel id="searchByName"/>
      <AboutUniprot id="uniprot"/>
      <Gallery id="gallery"/>
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
          $('[id^="structureviewerexplanation"]').html('<span id="uniprotpanel" class="titlepanel">' + window.AQUARIA.pdb_data.Organism[window.AQUARIA.protein_primary_accession] + ' ' + window.AQUARIA.preferred_protein_name +
            "</span><span id='threeDexplanation' class='titlepanel'>aligned onto</span><span id='pdbpanel' class='titlepanel'>" + pdbId + '-' + chainId + "</a></span><a href='javascript:;'  data-intro='Model Quality' data-position='top'><span id='help3D' class='help roundButton'>&nbsp;</span></a>")

          var evalue = window.AQUARIA.currentMember.E_value // e-value from pssh2
          $('#help3D').show().parent().attr('onmouseenter', "AQUARIA.explainTitle('" + accession + "','" + window.AQUARIA.preferred_protein_name + "','" + shortName + "','" + pdbId + "','" + chainId +
            "','" + score + "','" + evalue + "');")
        } else { // DNA or RNA (no accession)
          $('[id^="structureviewerexplanation"]').html(shortName + "</a> structure from <a href='http://www.rcsb.org/pdb/explore.do?structureId=" + pdbId + "' title='Go to PDB'>PDB " + pdbId + '-' +
            chainId + '</a>')
        }
      } else {
        $('#accession_link').text(window.AQUARIA.preferred_protein_name)
        // $("#help3D").hide();
      }
      document.querySelectorAll('.titlepanel').forEach(el => {
        el.style.display = 'flex'
        el.style.background = '#5d5d5d'
      })
      document.querySelector('#uniprotpanel').addEventListener('click', function () {
        document.querySelectorAll('.titlepanel').forEach(el => {
          el.style.display = 'flex'
          el.style.background = '#5d5d5d'
        })
        document.querySelector('#structureviewerexplanation_1 > #uniprotpanel').style.background = 'orange'
        _this.showPanels()
      })
      document.querySelector('#pdbpanel').addEventListener('click', function () {
        document.querySelectorAll('.titlepanel').forEach(el => {
          el.style.display = 'flex'
          el.style.background = '#5d5d5d'
        })
        document.querySelector('#structureviewerexplanation_1 > #pdbpanel').style.background = 'orange'
        _this.showPanels()
      })
    }
    // var searchLeft = $('#affordance_mode').width() / 2 - $('#searchByName').width() / 2
    // searchLeft = searchLeft + 'px'
    // $('#searchByName').css({
    //   'margin-left': searchLeft
    // })
  },
  methods: {
    showPanels: function () {
    // dim background
      document.querySelector('#conentPanel').style.display = 'block'
      document.querySelector('#structureviewerexplanation').style.display = 'none'
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
        // $('#gene_name').hide()
        document.querySelector('div.dimmer').addEventListener('click', function () {
          document.querySelector('#conentPanel').style.display = 'none'
          document.querySelector('#structureviewerexplanation').style.display = '-webkit-box'
          document.querySelector('div.dimmer').remove()
          // $('#gene_name').show()
        })
      } else {
        $('div.dimmer').remove()
      }

      $('#searchByName, #title3D').slideToggle('slow')
    }
  }
}
</script>

<style>
#gallery{
    top: 20vh;
    margin: 10px 0px;
    position: absolute;
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
/* .titlepanel{
  display: flex;
  background: '#5d5d5d';
} */
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
