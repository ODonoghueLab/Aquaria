
import $ from 'jquery'
import axios from 'axios'
import * as textpanel from '../components/InfoAbout/helpers/textpanels'
import ShowMatchingStructures from '../components/MatchingStructures/helpers/show_matching_structures'
import showExpandedCluster from '../components/MatchingStructures/helpers/show_expanded_clusters'
import Store from '../store/index'
import * as fetchFeature from '../components/Features/helpers/fetch_features'
// import ifUrlHasVarExtractInfo from '../components/Features/helpers/fetch_features' // eslint-disable-line
// const ff = require('../components/Features/helpers/fetch_features.js') // eslint-disable-line

export async function loadAccession (primaryAccession, autoSelectPDB, autoSelectChain, skip3DView, preferredProteinName) {
  preferredProteinName = preferredProteinName || 'unknown'
  skip3DView = skip3DView || false

  if (primaryAccession === null) {
    // TODO here we want to revert to the initial state, e.g. no structure in the viewer
    // window.AQUARIA.blankAll(true)
    window.AQUARIA.panel3d.blankApplet(true)
    window.AQUARIA.structures2match = {}
    window.AQUARIA.blankCount = {}
    delete window.AQUARIA.preferred_protein_name
    return
  }

  if (isLoadRequestsEqual(primaryAccession)) {
    // window.AQUARIA.blankAll(false)
    window.AQUARIA.panel3d.blankApplet(false)
    /// console.log('AQUARIA.loadAccession skipping: already loaded', primaryAccession)
    return
  }

  const pdbParam = autoSelectPDB ? '/' + autoSelectPDB : ''
  const chainParam = autoSelectChain ? '/' + autoSelectChain : ''
  window.AQUARIA.prefferedChain = [] // Set preferred Chain
  // window.AQUARIA.prefferedChain.push(autoSelectChain || '')
  var urlParams = window.location.href.substr(window.location.origin.length + window.location.pathname.length)
  if (Store.state.Organism) {
    history.pushState(primaryAccession, document.title, '/' +
    Store.state.Organism + '/' + Store.state.Gene + pdbParam + chainParam + urlParams)
  } else {
    history.pushState(primaryAccession, document.title, '/' +
      primaryAccession + pdbParam + (chainParam || '') + urlParams)
  }
  window.AQUARIA.blankPanel('#vis', true)
  window.AQUARIA.blankPanel('#uniProtDesc', true)

  window.AQUARIA.preferred_protein_name = preferredProteinName
  window.AQUARIA.protein_primaryAccession = primaryAccession

  window.AQUARIA.variantStructs = {}

  // TODO this is currently being called again once the
  // structures come back (in updateUniprotInfo), but
  // is required to be called now in order to make sure
  // thatwindow.AQUARIA.preferred_protein_name is being set.
  textpanel.fetchSynonyms(primaryAccession)

  window.AQUARIA.showMatchingStructures = new ShowMatchingStructures(onTextClick)

  var loadRequest = {
    selector: primaryAccession,
    selectPDB: autoSelectPDB, // optional fields
    selectChain: autoSelectChain // optional fields
  }
  window.AQUARIA.structures2match = {
    initialLoadRequest: loadRequest,
    clusters: [],
    sequences: [],
    source_primaryAccession: primaryAccession
  }

  var matches = await getMatchingStructures(loadRequest)

  var varRes = await fetchFeature.ifUrlHasVarExtractInfo()
  if (varRes) {
    var data = await getTheBestStructureForVar(pdbParam, chainParam, loadRequest.selector[0], varRes)
    matches.Selected_PDB = data.Selected_PDB
    window.AQUARIA.variantStructs = data.variantStructs
    Store.commit('setvariantStructs', data.variantStructs)
    processMatches(matches, loadRequest, skip3DView)
  } else {
    processMatches(matches, loadRequest, skip3DView)
  }
}

function processMatches (matches, loadRequest, skip3DView) {
  if (loadRequest.primaryAccession === window.AQUARIA.structures2match.initialLoadRequest.primaryAccession) {
    // window.AQUARIA.updateIssueEnvironment();
    const err = matches.err
    if (err !== undefined && err !== null) {
      if (skip3DView && err.name === 'MatchingStructuresError') {
        window.AQUARIA.blankPanel('#vis', true, err.message)
      } else {
        // window.AQUARIA.panel3d.blankApplet(true, err.message)
        Store.commit('setErrorTitle', err.message)
      }
    } else {
      if (matches.clusters) {
        window.AQUARIA.structures2match.clusters = matches.clusters
      }

      window.AQUARIA.showMatchingStructures.updateSizes(window.AQUARIA.structures2match.clusters)
      window.AQUARIA.blankPanel('#vis', false)
      console.log('The matches.Selected_PDB is ')
      console.log(matches.Selected_PDB)
      window.AQUARIA.structures2match.Selected_PDB = matches.Selected_PDB

      window.AQUARIA.structures2match.version_string = matches.viewer
      var clusterNumber = matches.Selected_PDB.cluster_number
      var cluster = window.AQUARIA.structures2match.clusters[clusterNumber]
      window.AQUARIA.showMatchingStructures.selectCluster(cluster,
        clusterNumber)
      if (!skip3DView) {
        if (window.threedView === 'IDR') {
          var threeDWidth = $('#threeD').width()
          var threeDHeight = threeDWidth
          threeDHeight = $('#threeDSpan').innerHeight()
          if (threeDHeight < 570) {
            threeDHeight = 570
          }
          window.AQUARIA.panel3d.display_cluster(cluster, threeDWidth, threeDHeight)
        }
        window.AQUARIA.display_member()
      }
      window.AQUARIA.showMatchingStructures.drawCoverageMap(cluster)
    }
  } else {
    console.log('AQUARIA.loadAccession error: received old data for Best PDB: ' + loadRequest.primaryAccession + ', which does not match requested: ' + window.AQUARIA.structures2match.initialLoadRequest.primaryAccession)
  }
}

async function getMatchingStructures (loadRequest) {
  var matches
  var url = `${window.BACKEND}/get_matching_structures`
  try {
    const response = await axios({
      method: 'get',
      url: url,
      params: loadRequest
    })
    if (typeof (response.data) === 'string') {
      throw (response.data)
    } else {
      matches = response.data
      sequenceCallback(loadRequest, matches.sequences)
      clusterCallback(loadRequest, matches.clusters)
      return matches
    }
  } catch (err) {
    Store.commit('setErrorTitle', err)
    Store.commit('setErrorMsg', "This is a 'dark' protein, i.e., it has no matching structure in Aquaria.")
  }
}

export function clusterCallback (loadRequest, newClusters) {
  window.AQUARIA.structures2match.clusters = window.AQUARIA.structures2match.clusters.concat(newClusters)
  // console.log('got newcluster:' + newCluster);
  // matching structures added a new cluster, lets draw it!
  // for each doesn't work on these wierd dnode arrays
  var i
  if (loadRequest.primaryAccession === window.AQUARIA.structures2match.initialLoadRequest.primaryAccession) {
    for (i = 0; i < newClusters.length; i++) {
      window.AQUARIA.showMatchingStructures.addCluster(newClusters[i])
    }
  } else {
    /// console.log('AQUARIA.clusterCallback error: received old data for cluster callback: ' + loadRequest.primary_accession + ', which does not match requested: ' +window.AQUARIA.structures2match.initialLoadRequest.primary_accession);
  }
  // window.AQUARIA.showMatchingStructures.showMap(newClusters[0])
}

export function isLoadRequestsEqual (primaryAccession) {
  var isEqual = false

  if (typeof window.AQUARIA.structures2match !== 'undefined' && typeof window.AQUARIA.structures2match.initialLoadRequest !== 'undefined') {
    if (primaryAccession instanceof Array && window.AQUARIA.structures2match.initialLoadRequest.selector instanceof Array) {
      if (primaryAccession.length === window.AQUARIA.structures2match.initialLoadRequest.selector.length) {
        var i
        isEqual = true
        for (i = 0; i < primaryAccession.length; i++) {
          if (primaryAccession[i] !== window.AQUARIA.structures2match.initialLoadRequest.selector[i]) {
            isEqual = false
            break
          }
        }
      }
    }
  }
  return isEqual
}

export function onTextClick (d, cluster) {
  return showExpandedCluster.expand_cluster(d, cluster, window.AQUARIA.structures2match.sequences[0])
}

export function sequenceCallback (loadRequest, sequences) {
  // matching structures added found the sequence! This is the first
  if (loadRequest.primary_accession === window.AQUARIA.structures2match.initialLoadRequest.primary_accession) {
    window.AQUARIA.structures2match.sequences = sequences
    // Somewhere here, we inappropriately clear the
    // matching structures before they are loaded
    /// console.log('AQUARIA.sequenceCallback initialise matching structures')
    window.AQUARIA.showMatchingStructures.initialise(sequences[0])
    window.AQUARIA.blankPanel('#vis', true, 'Loading clusters...')
    textpanel.updateUniprotInfo(sequences[0])
    window.AQUARIA.addedFeature = false
    window.AQUARIA.display_features(sequences)
  } else {
    console.log('AQUARIA.sequenceCallback error: received old data for sequence callback: ' + loadRequest.primary_accession + ', which does not match requested: ' + window.AQUARIA.structures2match.initialLoadRequest.primary_accession)
  }
}

export function chainSelected (primaryAccession, pdbId, chainId) {
  /// console.log('AQUARIA.chainSelected ' + primaryAccession + ', for pdb chain: ' + pdbId + ":" + chainId);
  const uniprotAccession = []
  uniprotAccession.push(primaryAccession)
  console.log('The pdbId and the chainId are ' + pdbId + ' ' + chainId)
  window.AQUARIA.currentChain = chainId

  // TODO THis shouldn't call load Accession because that loads everything as if it is the first time.
  // in this case, we just want to load matching structures and the protein, and leave the 3d context.
  loadAccession(uniprotAccession, pdbId, chainId, true)

  if ('pdb_data' in window.AQUARIA) {
    textpanel.updatePDBChain(pdbId, chainId, window.AQUARIA.currentMember.alignment_identity_score, window.AQUARIA.pdb_data.Organism[primaryAccession])
  }
}

// const oneAaCodes = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
async function getTheBestStructureForVar (pdbParam, chainParam, uniprotId, varRes) { // eslint-disable-line
  // let chosenRes = 350
  pdbParam = pdbParam.replace('\/', '') // eslint-disable-line
  chainParam = chainParam.replace('\/', '') // eslint-disable-line
  if (!Object.prototype.hasOwnProperty.call(window.AQUARIA, 'variantResidues')) {
    window.AQUARIA.variantResidues = varRes
  }

  // Variants in order specified by user.
  const sortedKeys = Object.keys(varRes).sort(function (a, b) {
    console.log(varRes[a].order + '; ' + varRes[b].order)
    return varRes[a].order - varRes[b].order
  })
  if (sortedKeys.length === 0) {
    return null
  }
  var varResParam = {}
  var key = Object.keys(varRes)[0]
  varResParam[key] = {}
  varResParam[key].newAas = varRes[key].newAas
  varResParam[key].defaultDesc = varRes[key].defaultDesc
  varResParam[key].oldAa = varRes[key].oldAa
  varResParam[key].order = varRes[key].order

  var loadRequest = {
    selector: [uniprotId],
    selectPDB: pdbParam,
    selectChain: chainParam,
    varRes: varResParam,
    sortedKeys: sortedKeys,
    variantStructs: window.AQUARIA.variantStructs
  }
  var url = `${window.BACKEND}/getStruct`
  var response = await axios({
    method: 'post',
    url: url,
    data: loadRequest
  })
  return response.data
}
