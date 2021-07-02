import axios from 'axios'
import pako from './pako'
import Store from '../../../store/index'
export default class DataServer {
  constructor (url, id) {
    this.url = url
    this.pdbId = id
  }

  getProteinData (callback) {
    // fetch(this.url).then(res => res.text()).then(pdbText => callback({ pdbId: this.pdbId, pdbText }));
    axios({
      method: 'get',
      url: this.url,
      responseType: 'arraybuffer',
      'accept-encoding': 'gzip'
		  }).then(function (response) {
      const pdbText = pako.inflate(response.data, { to: 'string' })
      callback({ pdbId: window.AQUARIA.currentMember.pdb_id, pdbText })
      if (localStorage.getItem('LastSuccess') === null) {
        showHelp()
      }
      localStorage.setItem('LastSuccess', window.location.pathname)
      if (!window.AQUARIA.pdbTopTen.previousLookupByName(Store.state.Organism + '_' + Store.state.Gene)) {
        window.AQUARIA.pdbTopTen.submitFired(Store.state.Organism + '_' + Store.state.Gene, window.AQUARIA.protein_primaryAccession[0], window.AQUARIA.currentMember.pdb_id)
      } else {
        window.AQUARIA.pdbTopTen.updatePDB(window.AQUARIA.protein_primaryAccession[0], window.AQUARIA.currentMember.pdb_id)
      }
    }).catch(function () {
      // Load next structure
      if (window.AQUARIA.structures2match.clusters[window.AQUARIA.PDBIndex.cluster].members.length <= window.AQUARIA.PDBIndex.member) {
        if (window.AQUARIA.structures2match.clusters.length < window.AQUARIA.PDBIndex.cluster) {
          window.AQUARIA.PDBIndex.cluster = window.AQUARIA.PDBIndex.cluster + 1
          window.AQUARIA.PDBIndex.member = 0
        } else {
          Store.commit('setErrorTitle', 'PDB not available')
          window.AQUARIA.panel3d.blankApplet(false)
          document.querySelector('#Structures > a > span').click()
          console.log('PDB not found')
        }
      } else {
        window.AQUARIA.PDBIndex.member = window.AQUARIA.PDBIndex.member + 1
      }
      var selectedMember = window.AQUARIA.structures2match.clusters[window.AQUARIA.PDBIndex.cluster].members[window.AQUARIA.PDBIndex.member]
      AQUARIA.blankAll(true, 'Waiting for data...')
      window.location.pathname = window.AQUARIA.protein_primaryAccession[0] + '/' + selectedMember.pdb_id
    })
  }

  getViews (callback) {
    callback([])
  }

  saveViews (views, callback) {
    callback()
  }

  deleteView (viewId, callback) {
    callback()
  }
}

function showHelp () {
  Store.commit('setHelpTitle', 'Welcome to Aquaria')
  document.getElementById('UserHelp').classList.remove('hide')
  document.getElementById('UserHelp').className += (' show')
  if (!document.querySelector('div.dimmer')) {
    window.AQUARIA.overlay()
    document.querySelector('div.dimmer').className += ' level7'
  }
  document.querySelector('div.dimmer').addEventListener('click', function () {
    window.AQUARIA.RemoveOverlay()
    document.getElementById('UserHelp').classList.remove('show')
    document.getElementById('UserHelp').className += (' hide')
  })
}

export { DataServer }
