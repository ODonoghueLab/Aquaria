<template>
  <div>
    <div id="structureviewerexplanation" class="explanation">
      <div id='titlebar' @mouseover="showSearch" @mouseout="hideSearch" >
        <span id="uniprotpanel" class='titlepanel' @click="showUniprotPanel" @mouseover="select" @mouseout="diselect">
          <img v-bind:src="search" id='search'/>
          {{organism_name}} {{primary_accession}}
        </span>
        <span id="threeDexplanation" class='titlepanel' @click="showthreeDexplanation" @mouseover="select" @mouseout="diselect">{{text}} </span>
        <span id="pdbpanel" class='titlepanel' @click="showPdbPanel" @mouseover="select" @mouseout="diselect">{{pdb}}</span>
      </div>
      <!-- <a href='javascript:;'  data-intro='Model Quality' data-position='top'><span id='help3D' class='help roundButton'>&nbsp;</span></a> -->
    </div>
    <div id='contentPanel'>
      <!-- <h3 id="structureviewerexplanation_1" > -->
        <span id='titlebar' class="explanation">
          <span id="uniprotpanel" class='titlepanel' @click="showUniprotPanel">
            <!-- <img v-bind:src="search" id='search'/> -->
            {{organism_name}} {{primary_accession}}
          </span>
          <span id="threeDexplanation" class='titlepanel' @click="showthreeDexplanation">{{text}} </span>
          <span id="pdbpanel" class='titlepanel' @click="showPdbPanel">{{pdb}}</span>
        </span>
      <!-- </h3> -->
      <div id='panel1' class='contents'>
        <SearchPanel id="searchByName"/>
        <AboutUniprot id="uniprot"/>
      </div>
      <AboutPDB id="gallery" class='contents'/>
      <Explanation id="explanation" class='contents'/>
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
      search: require('../assets/img/search.png')
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
        // $("#help3D").hide();
      }
    }
    // var searchLeft = $('#affordance_mode').width() / 2 - $('#searchByName').width() / 2
    // searchLeft = searchLeft + 'px'
    // $('#searchByName').css({
    //   'margin-left': searchLeft
    // })
  },
  methods: {
    select: function () {
      event.currentTarget.style.background = 'orange'
      if (event.currentTarget.children[0]) {
        document.querySelector('#search').style.background = 'orange'
      } else {
        document.querySelector('#search').style.background = '#5d5d5d'
      }
    },
    diselect: function () {
      event.currentTarget.style.background = '#5d5d5d'
    },
    showSearch: function () {
      document.querySelector('#search').style.display = 'inline'
      document.querySelector('#threeDexplanation').style.borderLeft = '1px solid white'
      document.querySelector('#threeDexplanation').style.borderRight = '1px solid white'
    },
    hideSearch: function () {
      document.querySelector('#search').style.display = 'none'
      document.querySelector('#threeDexplanation').style.border = 'none'
    },
    resetSelection: function () {
      document.querySelectorAll('.titlepanel').forEach(el => {
        el.style.background = '#5d5d5d'
      })
      document.querySelector('#search').style.background = '#5d5d5d'
      document.querySelectorAll('.contents').forEach(el => {
        el.style.display = 'none'
      })
    },
    showUniprotPanel: function () {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      this.resetSelection()
      document.querySelector('#contentPanel').style.display = 'block'
      document.querySelector('#structureviewerexplanation').style.display = 'none'
      document.querySelector('#panel1').style.display = 'block'
      document.querySelector('#uniprot').style.display = 'block'
      document.querySelector('#searchByName').style.display = 'block'
      document.querySelector('#contentPanel > #titlebar > #uniprotpanel').style.background = 'orange'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelector('#uniprot').style.display = 'none'
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('#structureviewerexplanation').style.display = 'grid'
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
      document.querySelector('#contentPanel').style.display = 'block'
      document.querySelector('#structureviewerexplanation').style.display = 'none'
      document.querySelector('#contentPanel > #titlebar > #pdbpanel').style.background = 'orange'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('#structureviewerexplanation').style.display = 'grid'
        document.querySelector('div.dimmer').remove()
        // $('#gene_name').show()
      })
    },
    showthreeDexplanation: function () {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      this.resetSelection()
      document.querySelector('#explanation').style.display = 'block'
      document.querySelector('#contentPanel').style.display = 'block'
      document.querySelector('#structureviewerexplanation').style.display = 'none'
      document.querySelector('#contentPanel >  #titlebar > #threeDexplanation').style.background = 'orange'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('#structureviewerexplanation').style.display = 'grid'
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
  // updated () {
  //   var titleLeft = document.querySelector('#affordance_mode').offsetWidth / 2 - document.querySelector('#structureviewerexplanation').offsetWidth / 2
  //   // var searchLeft = titleLeft + 5
  //   titleLeft = titleLeft + 'px'
  //   document.querySelector('#structureviewerexplanation').style.marginLeft = titleLeft
  //   // document.querySelector('#search').style.left = searchLeft + 'px'
  //   document.querySelector('#contentPanel').style.marginLeft = titleLeft
  // }
}
</script>

<style>
#titlebar {
    display: -webkit-box;
    /* margin-left: 12px;
    margin-top: calc(12px + 1.5vh);
    margin-bottom: 20px; */
    margin: auto;
    display: inline-table;
    /* -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline; */
    border-radius: 5em;
    /* background-color: var(--primary-label); */
    padding: 5px calc(4px + .4vw);
    min-width: 260px;
}
#search {
    display: none;
    height: calc(1.2rem + 0.2vh);
    width: 32px;
    height: 32px;
    position: absolute;
    padding: 6px 2px 3px 6px;
    background: #5d5d5d;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
    margin-left: -31px;
}
/* #gallery{
    top: 20vh;
    margin: 10px 0px;
    width: 100%;
    height: fit-content;
    z-index: 20;
} */
#uniprotpanel {
    /* padding-left: 14px; */
    padding: 8px 0px 8px 14px;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
    line-height: 31px;
    transition: all 0s ease 0s
}
#threeDexplanation {
    padding: 8px 1px 8px 1px;
    line-height: 31px;
    margin: 0px -1px;
}
#pdbpanel{
    padding: 8px 14px 8px 2px;
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
    line-height: 31px;
    margin-left: -1px;
}
.titlepanel {
  cursor: pointer;
}
.roundButton {
    color: #999;
    height: 17px;
    width: 17px;
    padding: 0 4px;
}
/* #structureviewerexplanation,#structureviewerexplanation_1{
  width: max-content;
  display: flex;
  background-color: var(--transparent);
  position: fixed;
  left: 47vw;
  top: 28px;
  transform: translate(-50%, -50%);
  align-items: baseline;
  border-radius: 5em;
  padding: 5px calc(4px + 0.4vw);
  font-size: calc(8px + .6vw)
} */

.contents {
  padding: 0px 40px;
  text-align: left;
  color: #5d5d5d;
  overflow: scroll;
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

/* .contents{
  padding: 70px 20px 22px 20px;
  min-width: 50vw;
  text-align: left;
  color: #5d5d5d;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  background-color: var(--transparent);
  position: fixed;
  margin-left: 45vw;
  top: 249px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-box-align: baseline;
  -ms-flex-align: baseline;
  border-radius: 5em;
  font-size: calc(8px + .6vw);
  background: #dedede;
  z-index: 1;
} */

#searchByName {
    display: block;
    overflow: auto;
    width: fit-content;
    /* top: 40vh; */
    /* position: absolute; */
    /* background-color: #d1d1d1; */
    padding: 5px;
    border-radius: 10px;
    z-index: 200;
}

#uniprot {
    display: block;
    margin: 10px 0px;
    /* position: absolute; */
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
  /*
  position: absolute;
  top: 2vh;
  flex-basis: auto;
  background-color: #d2d2d2;
  color: white;
  text-align: center;
  line-height: 2.5;
  padding: 1.5rem 1.5rem;
  border-radius: 1.5rem;
  margin-left: -19px;
  transition: all 0.7s ease; */
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
