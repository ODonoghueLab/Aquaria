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
      <div id='titleAlign' class=''>
        <span class='titlepanel' v-if="seqRes">
          <a href="#Alignment" class="" @click="makeActive" >
          Sequence <strong>{{primary_accession}}:</strong> {{seqRes}} <br/>
          Structure  <strong>{{pdb}}:</strong>  {{structRes}} </a>
        </span>
      </div>
      <a href="#" class="close" @click="dismissPanel"></a>
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
      document.querySelector('#title').className += ' active'
      document.querySelector('#scrim').className = 'show level3'
      if (ev.target.getAttribute('href') === '#Alignment') {
        document.querySelector('#titleAlign').className = 'active'
      }
    },
    dismissPanel: function () {
      // hide scrim
      document.querySelector('#scrim').className = 'hide'
      // reset title to neutral state
      document.querySelector('#title').className = 'item title fix level6'
      document.querySelector('#titleAlign').className = ''
      document.querySelectorAll('#title span a').forEach(el => {
        el.className = ''
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
    width: fit-content;
}
#title.active, #titleAlign.active {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  width: 78vw;
  max-width: 29.5rem;
  margin-top: .25rem;
}
#title span {
  background-color: var(--primary-label);
  white-space: nowrap;
  text-align: left;
}
#title.active span#pdb_id, #title.active span#no_pdb_id {
  flex-grow: 2;
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
span#org_prot, span#uniprotpanel {
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
}
span#org_prot a, span#uniprotpanel a {
  padding-left: 1rem;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  transition: all 0.7s ease;
}
span#org_prot img, span#uniprotpanel img  {
height: calc(10px + .4vw);
}
span#pdb_id , span#no_pdb_id {
  padding-right: 1rem;
  font-weight: 600;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}
#titleAlign {
  display: flex;
}
#titleAlign.active {
  /* background-color: var(--primary-highlight); */
  border-radius: 1.5rem;
}
#titleAlign span a {
  padding: calc(0.2rem + 2 * ((100vw - 320px) / 680)) 1rem;
  font-size: 95%;
  line-height: 1rem;
  border-radius: 1.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 15rem;
}

#title span.titlepanel {
  background-color: transparent;
  text-align: left;
}

#titleAlign.active span.titlepanel a {
  width: 80vw;
  max-width: 29.5rem;
}
</style>
