<template>
    <div id="title" class="item title fix level6">
      <span id="org_prot"  v-if="organism_name && !seqRes">
        <a href="#Sequence" class="" @click="makeActive">
          <img v-bind:src="search">
          {{organism_name}} <strong>{{primary_accession}}</strong>
        </a>
      </span>
      <span id="uniprotpanel" class='titlepanel' v-if="!organism_name && !seqRes">
          <a href="#Sequence" class="" @click="makeActive"><img v-bind:src="search">
          Protein Sequence</a>
        </span>
      <span id="alignmt" v-if="!seqRes" >
          <a href="#Alignment" class="" @click="makeActive" >aligned onto</a>
      </span>
      <span id="no_pdb_id" v-if="!pdb" >
        <a href="#Structure" class="" @click="makeActive">PDB ID</a>
      </span>
      <span id="pdb_id" v-if="pdb && !seqRes" >
        <a href="#Structure" class="" @click="makeActive">{{pdb}}</a>
      </span>
      <div id='titleAlign'>
        <span id='left' class='titlepanel' v-if="seqRes">
          <a href="#Alignment" class="" @click="makeActive" >
          Sequence <br/>Structure</a>
        </span>
        <span class='titlepanel' v-if="seqRes"><a href="#Alignment" class="" @click="makeActive" ><strong>{{primary_accession}}:</strong> <br/> <strong>{{pdb}}:</strong> </a></span>
        <span id='right' class='titlepanel' v-if="seqRes"><a href="#Alignment" class="" @click="makeActive" >{{seqRes}} <br/> {{structRes}} </a></span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Title',
  data () {
    return {
      organism_name: null,
      primary_accession: null,
      text: null,
      pdb: null,
      search: require('../../assets/img/search_100.png'),
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
        document.querySelector('#uniProtDesc').text(window.AQUARIA.preferred_protein_name)
      }
    }
  },
  methods: {
    makeActive: function (ev) {
      document.querySelectorAll('#title span a').forEach(el => {
        el.className = ''
      })
      ev.target.className = 'active'
      document.querySelector('#scrim').className = 'show level3'
    },
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
      document.querySelector('#contentPanel').style.display = 'flex'
      document.querySelector('#panel1').style.display = 'block'
      document.querySelector('#uniprot').style.display = 'block'
      document.querySelector('#searchByName').style.display = 'block'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelectorAll('#titlebar span').forEach(el => { el.className = 'titlepanel' })
        document.querySelector('#uniprot').style.display = 'none'
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('#structureviewerexplanation').style.display = 'flex'
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
      document.querySelector('#contentPanel').style.display = 'flex'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelectorAll('#titlebar span').forEach(el => { el.className = 'titlepanel' })
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('div.dimmer').remove()
      })
    },
    showResidueExplanation: function (ev) {
      if (document.getElementsByClassName('dimmer').length === 0) {
        window.AQUARIA.overlay()
      }
      this.resetSelection()
      ev.target.className = 'titlepanel active'
      document.querySelector('#explanation').style.display = 'block'
      document.querySelector('#contentPanel').style.display = 'flex'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        document.querySelectorAll('#titlebar span').forEach(el => { el.className = 'titlepanel' })
        document.querySelector('#contentPanel').style.display = 'none'
        document.querySelector('div.dimmer').remove()
      })
    },
    release: function () {
      document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').style.display = 'none'
      this.resetSelection()
    }
  },
  mounted () {
    this.resetSelection()
  },
  updated () {
    var _this = this
    // this.$children[0].placeholderText(window.AQUARIA.Organism.Name, window.AQUARIA.preferred_protein_name)
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
      }
    })
    selectedRes.observe(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection'), {
      attributes: true, childList: true, characterData: true
    })
  }
}
</script>

<style>
.title {
    flex-basis: auto;
    color: white;
    text-align: center;
    line-height: 1.25;
    padding: 0;
    border-radius: 1.5rem;
    margin: auto;
    left: 50%;
    top: 1.5vh;
    transform: translate(-50%, -5%);
}
#title span {
  white-space: nowrap;
}
#title span a {
  display: inline-block;
  background-color: var(--primary-label);
  background-position: 1rem 50%;
  background-size: 0;
  padding: calc(0.4rem + 3 * ((100vw - 320px) / 680)) 0.2rem;
  transition: all 0.5s ease;
  color: var(--text);
  text-decoration: none;
}
#title span a:hover {
  background-color: var(--primary-link);
}
#title span a:active, #title span a.active {
  background-color: var(--primary-highlight);
}

#title:hover span#alignmt a {
  border-right: 1px dotted var(--background);
  border-left: 1px dotted var(--background);
}
span#org_prot a, span#uniprotpanel a  {
  padding-left: 1rem;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  transition: all 0.7s ease;
}
span#org_prot img, span#uniprotpanel img  {
height: calc(10px + .4vw);
}
span#pdb_id a, span#no_pdb_id a {
  padding-right: 1rem;
  font-weight: 600;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}
#titleAlign {
  display: flex;
}

#titleAlign span a {
  padding: calc(0.2rem + 2 * ((100vw - 320px) / 680)) 0.2rem;
  line-height: 1rem;
}

#titleAlign #left a {
  padding-left: 1.5rem;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  text-align: right;
}

#titleAlign #right a {
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  padding-right: 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8rem;
}
.titlepanel {
  text-align: left;
}
</style>
