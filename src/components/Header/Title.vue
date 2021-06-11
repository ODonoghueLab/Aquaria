<template>
    <div id="title" class="item title fix level6">
      <span id="org_prot"  v-if="organism_name && !seqRes" v-on:click="storeHash">
        <a href="#Sequence" class="" @click="makeActive">
          <img v-bind:src="search">
          {{organism_name}} <strong>{{primary_accession}}</strong>
        </a>
      </span>
      <span id="uniprotpanel" class='titlepanel' v-if="!organism_name && !seqRes" v-on:click="storeHash">
          <a href="#Sequence" class="" @click="makeActive"><img v-bind:src="search">
          Protein Sequence</a>
        </span>
      <span id="alignmt" v-if="!seqRes" v-on:click="storeHash">
          <a href="#Alignment" class="" @click="makeActive" >aligned onto</a>
      </span>
      <span id="no_pdb_id" v-if="!pdb" v-on:click="storeHash">
        <a href="#Structure" class="" @click="makeActive">PDB ID</a>
      </span>
      <span id="pdb_id" v-if="pdb && !seqRes" v-on:click="storeHash">
        <a href="#Structure" class="" @click="makeActive">{{pdb}}</a>
        <span id='help' @click="showHelp">?</span>
      </span>
      <div id='titleAlign' class='' v-if="seqRes">
        <span class='titlepanel' v-on:click="storeHash">
          <a href="#Alignment" class="" @click="makeActive" >
          <strong>{{primary_accession}}</strong> Sequence: {{seqRes}} <br/>
          <strong>{{pdb}}</strong> Structure: {{structRes}} </a>
        </span>
      </div>
      <a  v-bind:href="data.hash" class="close" @click="dismissPanel"></a>
    </div>
</template>

<script>
import store from '../../store/index'
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
      structRes: null
    }
  },
  computed: {
    data () {
      return {
        hash: store.state.hash
      }
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
    showHelp: function () {
      store.commit('setHelpTitle', 'Aquaria Help')
      store.commit('setUserStatus', false)
      document.getElementById('UserHelp').classList.remove('hide')
      document.getElementById('UserHelp').className += (' show')
      // document.querySelector('#UserHelp').style.display = 'flex'
      // document.querySelector('.main .dimmer').style.display = 'block'
      if (!document.querySelector('div.dimmer')) {
        window.AQUARIA.overlay()
        document.querySelector('div.dimmer').className += ' level7'
      }
      document.querySelector('div.dimmer').addEventListener('click', function () {
        window.AQUARIA.RemoveOverlay()
        document.getElementById('UserHelp').classList.remove('show')
        document.getElementById('UserHelp').className += (' hide')
      })
    },
    storeHash: function () {
      store.commit('setHash', window.location.hash)
    },
    makeActive: function (ev) {
      document.querySelector('#pdb_id > span#help').style.visibility = 'hidden'
      document.querySelectorAll('#title span a').forEach(el => {
        el.classList.remove('active')
      })
      if (ev.target.localName.includes('strong')) {
        ev.target = ev.target.parentElement
      }
      ev.target.className = 'active'
      if (document.querySelector('#title').className.indexOf('active') === -1) { document.querySelector('#title').className += ' active' }
      document.querySelector('#scrim').className = 'show level3'
      if (document.querySelector('#titleAlign') !== null) {
        document.querySelector('#titleAlign').className = 'active'
        store.commit('setAlignment', window.AQUARIA.panel3d.joleculeAlignment.copyToClipboard())
        store.commit('setHash', window.location.hash)
      }
    },
    dismissPanel: function () {
      // hide scrim
      document.querySelector('#pdb_id > span#help').style.visibility = 'visible'
      document.querySelector('#scrim').className = 'hide'
      // reset title to neutral state
      document.querySelector('#title').className = 'item title fix level6'
      if (document.querySelector('#titleAlign') !== null) { document.querySelector('#titleAlign').className = '' }
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
        // _this.alignment = null
        store.commit('setAlignment', '')
      } else {
        var residues = document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').innerText.split('\n')
        var pdb = window.AQUARIA.currentMember.pdb_id + '-' + window.AQUARIA.currentMember.pdb_chain + ':'
        var accession = window.AQUARIA.Gene + ':'
        _this.seqRes = residues[1].split(accession)[1]
        _this.structRes = residues[0].split(pdb)[1]
        // _this.alignment = window.AQUARIA.panel3d.joleculeAlignment.copyToClipboard()
      }
    })
    selectedRes.observe(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection'), {
      attributes: true, childList: true, characterData: true
    })
  }
}
</script>

<style>
#pdb_id > span#help {
  background: white;
  color: #595656;
  padding: 0px 0.4em;
  border-radius: 1.5rem;
  margin: 2px;
  font-size: 100%;
}
/* #pdb_id:hover{
  background-color: var(--primary-link);
} */
#pdb_id > span#help:hover {
  background-color: var(--primary-link);
  color: white;
}
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
    /* width: fit-content; */
}
#title.active, #titleAlign.active {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  width: 78vw;
  max-width: 29.5rem;
  margin-top: .125rem;
}
#title span {
  background-color: var(--primary-label);
  white-space: nowrap;
  text-align: left;
  flex-shrink: 0;
}
#title.active span#pdb_id, #title.active span#no_pdb_id {
  flex-grow: 2;
  flex-shrink: 0;
  /* width: 50%; */
}
#title span a {
  display: inline-block;
  background-color: var(--primary-label);
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
  border-top-left-radius: 2rem;
  border-bottom-left-radius: 2rem;
}
span#org_prot a, span#uniprotpanel a {
  padding-left: 0.5rem;
  border-top-left-radius: 2rem;
  border-bottom-left-radius: 2rem;
  transition: all 0.7s ease;
}
span#org_prot img, span#uniprotpanel img, span#pdb_id img  {
height: calc(10px + .4vw);
}
span#pdb_id , span#no_pdb_id {
  padding-right: 0.5rem;
  font-weight: 600;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
}
#titleAlign {
  display: flex;
  justify-content: center;
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
  text-align: center;
}

#title span.titlepanel {
  background-color: transparent;
  text-align: left;
}

#titleAlign.active span.titlepanel a {
  width: 80vw;
  max-width: 29.5rem;
}
#titleAlign.active + a.close::after {
    top: calc(0.5rem + 3 * ((100vw - 320px) / 680));
}
</style>
