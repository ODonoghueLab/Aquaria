
import $ from 'jquery'
import axios from 'axios'
import * as textpanel from '../components/InfoAbout/helpers/textpanels'
import ShowMatchingStructures from '../components/MatchingStructures/helpers/show_matching_structures'
import showExpandedCluster from '../components/MatchingStructures/helpers/show_expanded_clusters'
import Store from '../store/index'

export function loadAccession (primaryAccession, autoSelectPDB, autoSelectChain, skip3DView, preferredProteinName) {
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
  /// console.log('AQUARIA.loadAccession load', primaryAccession)

  const pdbParam = autoSelectPDB ? '/' + autoSelectPDB : ''
  const chainParam = autoSelectChain ? '/' + autoSelectChain : ''
  window.AQUARIA.prefferedChain = []
  window.AQUARIA.prefferedChain.push(autoSelectChain || '')
  var urlParams = window.location.href.substr(window.location.origin.length + window.location.pathname.length)
  if (window.AQUARIA.orgName) {
    history.pushState(primaryAccession, document.title, '/' +
     window.AQUARIA.orgName + '/' + window.AQUARIA.gene + pdbParam + chainParam + urlParams)
  } else {
    history.pushState(primaryAccession, document.title, '/' +
      primaryAccession + pdbParam + (chainParam || '') + urlParams)
  }

  window.AQUARIA.blankPanel('#vis', true)
  window.AQUARIA.blankPanel('#uniProtDesc', true)

  window.AQUARIA.preferred_protein_name = preferredProteinName
  window.AQUARIA.protein_primaryAccession = primaryAccession

  // TODO this is currently being called again once the
  // structures come back (in updateUniprotInfo), but
  // is required to be called now in order to make sure
  // thatwindow.AQUARIA.preferred_protein_name is being set.
  textpanel.fetchSynonyms(primaryAccession)

  window.AQUARIA.showMatchingStructures = new ShowMatchingStructures(onTextClick)

  var loadRequest = {
    selector: primaryAccession,
    selectPDB: autoSelectPDB,
    selectChain: autoSelectChain
  }
  window.AQUARIA.structures2match = {
    initialLoadRequest: loadRequest,
    clusters: [],
    sequences: [],
    source_primaryAccession: primaryAccession
  }

  // cache_matching_structures(primaryAccession, function(primaryAccession) {
  var url = `${window.BACKEND}/get_matching_structures`
  axios({
    method: 'get',
    url: url,
    params: loadRequest
  })
    .then(function (response) {
      const matches = response.data
      sequenceCallback(loadRequest, matches.sequences)
      clusterCallback(loadRequest, matches.clusters)
      // })
      // window.AQUARIA.remote.get_matching_structures(loadRequest, sequenceCallback, clusterCallback, function(err, loadRequest, Selected_PDB, finalClusters, cachedHit, version_string) {
      if (loadRequest.primaryAccession === window.AQUARIA.structures2match.initialLoadRequest.primaryAccession) {
        // window.AQUARIA.updateIssueEnvironment();
        const err = matches.err
        if (err !== undefined && err !== null) {
          if (skip3DView && err.name === 'MatchingStructuresError') {
            window.AQUARIA.blankPanel('#vis', true, err.message)
          } else {
            window.AQUARIA.panel3d.blankApplet(true, err.message)
            Store.commit('setErrorMsg', err.message)
            // window.AQUARIA.blankAll(true, err.message, false)
          }
        } else {
          if (matches.clusters) {
            window.AQUARIA.structures2match.clusters = matches.clusters
          }

          window.AQUARIA.showMatchingStructures.updateSizes(window.AQUARIA.structures2match.clusters)
          window.AQUARIA.blankPanel('#vis', false)

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
    })
    .catch(function (err) {
      window.AQUARIA.panel3d.blankApplet(true, err)
    })
    // });
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
  // callback
  // console.log('got sequences:' + sequences);
  if (loadRequest.primary_accession === window.AQUARIA.structures2match.initialLoadRequest.primary_accession) {
    window.AQUARIA.structures2match.sequences = sequences
    // Somewhere here, we inappropriately clear the
    // matching structures before they are loaded
    /// console.log('AQUARIA.sequenceCallback initialise matching structures')
    window.AQUARIA.showMatchingStructures.initialise(sequences[0])
    window.AQUARIA.blankPanel('#vis', true, 'Loading clusters...')
    /// console.log('AQUARIA.sequenceCallback update Uniprot')
    textpanel.updateUniprotInfo(sequences[0])
    /// console.log('AQUARIA.sequenceCallback display features')
    window.AQUARIA.addedFeature = false
    window.AQUARIA.display_features(sequences)
  } else {
    /// console.log('AQUARIA.sequenceCallback error: received old data for sequence callback: ' + loadRequest.primary_accession + ', which does not match requested: ' +window.AQUARIA.structures2match.initialLoadRequest.primary_accession);
  }
}

export function chainSelected (primaryAccession, pdbId, chainId) {
  /// console.log('AQUARIA.chainSelected ' + primaryAccession + ', for pdb chain: ' + pdbId + ":" + chainId);
  const uniprotAccession = []
  uniprotAccession.push(primaryAccession)
  window.AQUARIA.currentChain = chainId

  // TODO THis shouldn't call load Accession because that loads everything as if it is the first time.
  // in this case, we just want to load matching structures and the protein, and leave the 3d context.
  loadAccession(uniprotAccession, pdbId, chainId, true)

  if ('pdb_data' in window.AQUARIA) {
    textpanel.updatePDBChain(pdbId, chainId, window.AQUARIA.currentMember.alignment_identity_score, window.AQUARIA.pdb_data.Organism[primaryAccession])
  }
}
