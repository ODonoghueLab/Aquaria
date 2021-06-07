
import $ from 'jquery'
import axios from 'axios'
import * as textpanel from '../components/InfoAbout/helpers/textpanels'
import ShowMatchingStructures from '../components/MatchingStructures/helpers/show_matching_structures'
import showExpandedCluster from '../components/MatchingStructures/helpers/show_expanded_clusters'
import Store from '../store/index'
// import ifUrlHasVarExtractInfo from '../components/Features/helpers/fetch_features' // eslint-disable-line
// const ff = require('../components/Features/helpers/fetch_features.js') // eslint-disable-line

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

  const pdbParam = autoSelectPDB ? '/' + autoSelectPDB : ''
  const chainParam = autoSelectChain ? '/' + autoSelectChain : ''
  window.AQUARIA.prefferedChain = [] // Set preferred Chain
  // window.AQUARIA.prefferedChain.push(autoSelectChain || '')
  var urlParams = window.location.href.substr(window.location.origin.length + window.location.pathname.length)
  if (window.AQUARIA.orgName) {
    history.pushState(primaryAccession, document.title, '/' +
     window.AQUARIA.orgName + '/' + window.AQUARIA.Gene + pdbParam + chainParam + urlParams)
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

  // cache_matching_structures(primaryAccession, function(primaryAccession) {
  var url = `${window.BACKEND}/get_matching_structures`
  axios({
    method: 'get',
    url: url,
    params: loadRequest
  })
    .then(function (response) {
      console.log('loadData.get_matching_structures ')
      console.log(response)
      if (typeof (response.data) === 'string') {
        throw (response.data)
      }
      const matches = response.data
      sequenceCallback(loadRequest, matches.sequences)
      clusterCallback(loadRequest, matches.clusters)
      updateSelectedPdb(matches).then(function () {
        // })
        // window.AQUARIA.remote.get_matching_structures(loadRequest, sequenceCallback, clusterCallback, function(err, loadRequest, Selected_PDB, finalClusters, cachedHit, version_string) {
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
      })
    })
    .catch(function (err) {
      // window.AQUARIA.panel3d.blankApplet(true, err)
      Store.commit('setErrorTitle', err)
      Store.commit('setErrorMsg', "This is a 'dark' protein, i.e., it has no matching structure in Aquaria.")
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

function filterByExactResPos (intersectList, resPos, newAas, uniprotId, matchingClusters) {
  return new Promise(function (resolve, reject) {
    console.log('The intersect list is ' + intersectList + ' ' + newAas + ' ' + uniprotId + ' ' + resPos)

    var arrMatchingPdbs = [] // [{clusNum, memNum, pdbId, pdbChain}, ...]

    getJsonFromUrl(uniprotId).then(function (response) {
      if (Object.prototype.hasOwnProperty.call(response, 'data')) {
        // console.log('The intersect is ')
        // console.log(response.data)
        Object.keys(matchingClusters).forEach(function (resPos, resPosI) {
          matchingClusters[resPos].forEach(function (clusNum, clusNumI) {
            response.data[clusNum].members.forEach(function (anAlignment, anAlignmentI) {
              var arrAlignPos = anAlignment.Alignment.split(' ')
              for (var i = 0; i < arrAlignPos.length; i++) {
                var arrRefPdb = arrAlignPos[i].split(':')
                var arrRef = arrRefPdb[0].split('-')
                var resStart = resPos
                if (resPos.match(/\-/)){ // eslint-disable-line
                  resStart = resPos.split('-')[0]
                }
                if (resStart >= parseInt(arrRef[0]) && resStart <= parseInt(arrRef[1])) {
                  var arrPdb = arrRefPdb[1].split('-')
                  var distance = resStart - parseInt(arrRef[0])
                  var resPosInPdb = parseInt(arrPdb[0]) + distance - 1

                  console.log('An alignment toAdd is ' + resPos + ' ' + arrRefPdb[0] + ' ' + arrRefPdb[1] + '|' + arrRef[0] + ' ' + arrRef[1] + ' ' + distance + ' ' + resPosInPdb + ' SeqLen:' + anAlignment.SEQRES.length + ' ' + ' PdbAa:' + anAlignment.SEQRES[resPosInPdb] + ' PdbId:' + anAlignment.PDB_ID + ' ' + ' PdbChain:' + anAlignment.Chain)

                  // Add to window.AQUARIA.variantStructs
                  if (!Object.prototype.hasOwnProperty.call(window.AQUARIA.variantStructs, resPos)) { // resPos in dict_
                    window.AQUARIA.variantStructs[resPos] = {}
                  }

                  if (!Object.prototype.hasOwnProperty.call(window.AQUARIA.variantStructs[resPos], anAlignment.SEQRES[resPosInPdb])) { // aa in dict_[resPos]
                    window.AQUARIA.variantStructs[resPos][anAlignment.SEQRES[resPosInPdb]] = {}
                    window.AQUARIA.variantStructs[resPos][anAlignment.SEQRES[resPosInPdb]].pdbs = []
                  }
                  window.AQUARIA.variantStructs[resPos][anAlignment.SEQRES[resPosInPdb]].pdbs.push(anAlignment.PDB_ID)
                  /* if (newAas.includes(anAlignment.SEQRES[resPosInPdb])) {
                    // arrMatchingPdbs.push({ clusNum: clusNum, memNum: anAlignmentI, pdbId: anAlignment.PDB_ID, pdbChain: anAlignment.Chain })
                    // window.AQUARIA.variantResidues[resPos].inStructAa = anAlignment.SEQRES[resPosInPdb]
                  } */
                }
              }
              // console.log(anAlignment)
            })
          })
          /* if (resPosI === Object.keys(matchingClusters).length - 1) {
            console.log('Everybody is free: ')
            console.log(window.AQUARIA.variantStructs)
            resolve(arrMatchingPdbs)
          } */
        })
        intersectList.forEach(function (clusNum, clusNumI) {
          if (clusNum < response.data.length) {
            response.data[clusNum].members.forEach(function (anAlignment, anAlignmentI) {
              var arrAlignPos = anAlignment.Alignment.split(' ')
              for (var i = 0; i < arrAlignPos.length; i++) {
                var arrRefPdb = arrAlignPos[i].split(':')
                var arrRef = arrRefPdb[0].split('-')
                var resStart = resPos
                if (resPos.match(/\-/)){ // eslint-disable-line
                  resStart = resPos.split('-')[0]
                }
                if (resStart >= parseInt(arrRef[0]) && resStart <= parseInt(arrRef[1])) {
                  var arrPdb = arrRefPdb[1].split('-')
                  var distance = resStart - parseInt(arrRef[0])
                  var resPosInPdb = parseInt(arrPdb[0]) + distance - 1

                  console.log('An alignment is ' + arrRefPdb[0] + ' ' + arrRefPdb[1] + '|' + arrRef[0] + ' ' + arrRef[1] + ' ' + distance + ' ' + resPosInPdb + ' SeqLen:' + anAlignment.SEQRES.length + ' ' + ' PdbAa:' + anAlignment.SEQRES[resPosInPdb] + ' PdbId:' + anAlignment.PDB_ID + ' ' + ' PdbChain:' + anAlignment.Chain)
                  if (newAas.includes(anAlignment.SEQRES[resPosInPdb])) {
                    arrMatchingPdbs.push({ clusNum: clusNum, memNum: anAlignmentI, pdbId: anAlignment.PDB_ID, pdbChain: anAlignment.Chain })
                    // window.AQUARIA.variantResidues[resPos].inStructAa = anAlignment.SEQRES[resPosInPdb]

                    // Add to window.AQUARIA.variantStructs
                    if (!Object.prototype.hasOwnProperty.call(window.AQUARIA.variantStructs, resPos)) { // resPos in dict_
                      window.AQUARIA.variantStructs[resPos] = {}
                    }

                    if (!Object.prototype.hasOwnProperty.call(window.AQUARIA.variantStructs[resPos], anAlignment.SEQRES[resPosInPdb])) { // aa in dict_[resPos]
                      window.AQUARIA.variantStructs[resPos][anAlignment.SEQRES[resPosInPdb]] = {}
                      window.AQUARIA.variantStructs[resPos][anAlignment.SEQRES[resPosInPdb]].pdbs = []
                    }

                    window.AQUARIA.variantStructs[resPos][anAlignment.SEQRES[resPosInPdb]].isShown = true
                  }
                }
              }
              // console.log(anAlignment)
            })
          }
          if (clusNumI === intersectList.length - 1) {
            console.log('Everybody is free: ')
            console.log(window.AQUARIA.variantStructs)

            resolve(arrMatchingPdbs)
          }
        })
      } else {
        // else no data recieved
        resolve(arrMatchingPdbs)
      }
    })
  })
}

function getVariantPosCovered (seqStart, seqEnd, sortedKeys) {
  for (let i = 0; i < seqStart.length; i++) {
    sortedKeys.forEach(function (resNum, resNumI) {
      var resStart = resNum
      if (resNum.match('-')) {
        resStart = parseInt(resNum.split('-')[0])
      }

      // console.log('SeqStart: ' + seqStart[i] + ' seqEnd:' + seqEnd[i] + ' ' + resStart)

      if (parseInt(resStart) >= parseInt(seqStart[i]) && parseInt(resStart) <= parseInt(seqEnd[i])) {
        console.log('Yes, this should be added ' + resNum)
        window.AQUARIA.variantResidues[resNum].inStructPos = true
        window.AQUARIA.variantStructs[resNum].isShown = true
      }
    })
  }
}

function getJsonFromUrl (uniprotId) {
  return new Promise(function (resolve, reject) {
    var url = 'https://odonoghuelab.org:8011/getSequence?selector[]=' + uniprotId

    axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) { /* eslint handle-callback-err: "warn" */
        // handle error
        console.log('Error: encountered in fetching seqres and alignment information from aquaria backend.')
        resolve({})
      })
  })
}
function updateSelectedPdb (matches) {
  return new Promise(function (resolve, reject) {
    console.log('Mother of dragons')
    console.log(matches)
    const featureRegex = new RegExp(/(p\.)?[A-Za-z]+[0-9]+[A-Za-z\*\_\?\[\]\(\)\%\=]+/) // eslint-disable-line

    var uniprotId = window.AQUARIA.protein_primaryAccession

    var searchParam = decodeURIComponent(window.location.search.split('?')[1])

    // const chosenRes2 = ifUrlHasVar_extractInfo()
    // console.log('CHOSENRES2 ')
    // console.log(chosenRes2)

    if (featureRegex.test(searchParam)) {
      // let chosenRes = 350
      window.AQUARIA.ifUrlHasVarExtractInfo().then(function (varRes) {
        if (!Object.prototype.hasOwnProperty.call(window.AQUARIA, 'variantResidues')) {
          window.AQUARIA.variantResidues = varRes
        }
        console.log('Hello world!!')
        console.log(varRes)

        // Variants in order specified by user.
        const sortedKeys = Object.keys(varRes).sort(function (a, b) {
          console.log(varRes[a].order + '; ' + varRes[b].order)
          return varRes[a].order - varRes[b].order
        })

        console.log(sortedKeys)

        // const chosenRes = sortedKeys[0]
        var matchingClusters = {} // dict_{resNum} => [matchingClus1, matchingClus2, matchingClus3, ...] (end gets updated evertime the same one is encountered)
        // let isSelectedPdb = false
        // let maxNumResFit = -1

        if ('clusters' in matches) {
          matches.clusters.forEach(function (aCluster, aClusterI) {
            // return new Promise(function (resolve_1, reject_1) { // eslint-disable-line
            for (let i = 0; i < aCluster.seq_start.length; i++) {
              sortedKeys.forEach(function (aRes, aResI) {
                let aResStart = -1
                let aResEnd = -1

                if (aRes.match(/\-/)) { // eslint-disable-line
                  aResStart = parseInt(aRes.split('-')[0])
                  aResEnd = parseInt(aRes.split('-')[1])
                } else {
                  aResStart = aRes
                }

                if (aResEnd != -1 && aResStart >= parseInt(aCluster.seq_start[i]) && aResStart <= parseInt(aCluster.seq_end[i]) && aResEnd >= parseInt(aCluster.seq_start[i]) && aResEnd <= parseInt(aCluster.seq_end[i])) { // eslint-disable-line
                  console.log('A cluster is Start:' + aCluster.seq_start[i] + ' End:' + aCluster.seq_end[i])
                  if (!Object.prototype.hasOwnProperty.call(matchingClusters, aRes)) {
                    matchingClusters[aRes] = []
                  }
                  matchingClusters[aRes].push(aClusterI)
                } else if (aResStart >= parseInt(aCluster.seq_start[i]) && aResStart <= parseInt(aCluster.seq_end[i])) {
                  // Add to dict
                  if (!Object.prototype.hasOwnProperty.call(matchingClusters, aRes)) {
                    matchingClusters[aRes] = []
                  }
                  matchingClusters[aRes].push(aClusterI)
                }
              // })
              })
            }
            if (aClusterI === matches.clusters.length - 1) {
              console.log('The MatchingClusters are: ')
              console.log(matchingClusters)
              getTheBestCluster(matchingClusters, sortedKeys).then(function(intersectList) { // eslint-disable-line
                console.log('Yes, it resovles')
                if (intersectList) {
                  if (Object.prototype.hasOwnProperty.call(varRes[sortedKeys[0]], 'newAas')) {
                    filterByExactResPos(intersectList, sortedKeys[0], varRes[sortedKeys[0]].newAas, uniprotId, matchingClusters).then(function (arrMatchingPdbs) {
                      console.log('The intersecting position is ')
                      console.log(arrMatchingPdbs)

                      if (arrMatchingPdbs && arrMatchingPdbs.length > 0) {
                        // console.log(matches.cluster[arrMatchingPdbs[0].clusNum])
                        getVariantPosCovered(matches.clusters[arrMatchingPdbs[0].clusNum].seq_start, matches.clusters[arrMatchingPdbs[0].clusNum].seq_end, sortedKeys)
                        matches.Selected_PDB.cluster_number = arrMatchingPdbs[0].clusNum
                        matches.Selected_PDB.member_number = arrMatchingPdbs[0].memNum
                        matches.Selected_PDB.pdb_chain = arrMatchingPdbs[0].pdbChain
                        matches.Selected_PDB.pdb_id = arrMatchingPdbs[0].pdbId

                        resolve(['matching structures - update the pd'])
                      } else {
                        getVariantPosCovered(matches.clusters[intersectList[0]].seq_start, matches.clusters[intersectList[0]].seq_end, sortedKeys)
                        matches.Selected_PDB.cluster_number = intersectList[0]
                        matches.Selected_PDB.member_number = 0
                        matches.Selected_PDB.pdb_chain = matches.clusters[intersectList[0]].pdb_chain
                        matches.Selected_PDB.pdb_id = matches.clusters[intersectList[0]].pdb_id

                        resolve(['matching structures - update the pd'])
                      }
                    })
                  } else {
                    getVariantPosCovered(matches.clusters[intersectList[0]].seq_start, matches.clusters[intersectList[0]].seq_end, sortedKeys)
                    matches.Selected_PDB.cluster_number = intersectList[0]
                    matches.Selected_PDB.member_number = 0
                    matches.Selected_PDB.pdb_chain = matches.clusters[intersectList[0]].pdb_chain
                    matches.Selected_PDB.pdb_id = matches.clusters[intersectList[0]].pdb_id

                    resolve(['matching structures - update the pd'])
                  }
                } else {
                  getVariantPosCovered(matches.clusters[0].seq_start, matches.clusters[0].seq_end, sortedKeys)
                  matches.Selected_PDB.cluster_number = 0
                  matches.Selected_PDB.member_number = 0
                  matches.Selected_PDB.pdb_chain = matches.clusters[0].pdb_chain
                  matches.Selected_PDB.pdb_id = matches.clusters[0].pdb_id

                  resolve(['matching structures - update the pd'])
                }
              })
            }
          })
          // console.log(matchingClusters)
          /*
          let toAdd = true

          // to help choose the first maximal.
          for (let i = 0; i < item.seq_start.length; i++) {
            // console.log(item)
            if (Object.prototype.hasOwnProperty.call(allMatchingClus, itemI)) {
              var startToAdd = Math.min(parseInt(allMatchingClus[itemI][0]), parseInt(item.seq_start[i]))
              var endToAdd = Math.max(parseInt(allMatchingClus[itemI][1]), parseInt(item.seq_end[i]))
              allMatchingClus[itemI] = [startToAdd, endToAdd]

              toAdd = false
            }

            for (let cr = 0; cr < sortedKeys.length; cr++) {
              // console.log('The maxNumResFit clust is ' + cr + ' ' + maxNumResFit + ' ' + item.pdb_id + ' ' + sortedKeys[cr] + ' ' + item.seq_start[i] + ':' + item.seq_end[i])

              if ((toAdd === true && sortedKeys[cr] >= parseInt(item.seq_start[i]) && sortedKeys[cr] <= parseInt(item.seq_end[i])) || (toAdd === false && sortedKeys[cr] >= allMatchingClus[itemI][0] && sortedKeys[cr] <= allMatchingClus[itemI][1])) {
                // if (isSelectedPdb === false) {
                //   isSelectedPdb = true

                if (cr > maxNumResFit) {
                  maxNumResFit = maxNumResFit + 1
                  matches.Selected_PDB.cluster_number = itemI
                  matches.Selected_PDB.member_number = 0
                  matches.Selected_PDB.pdb_chain = item.pdb_chain
                  matches.Selected_PDB.pdb_id = item.pdb_id
                  // }
                }

                if (toAdd === true) {
                  allMatchingClus[itemI] = [parseInt(item.seq_start[i]), parseInt(item.seq_end[i])]
                }
                // console.log('matching cluster ' + item.seq_start[i] + ' ' + item.seq_end[i] + ' ' + item.pdb_id + ' ' + item.pdb_chain + ' ' + itemI)
              } else {
                break
              }
            }
          }

          // console.log('The total arrAllClusters is ' + arrAllClusters)
          if (itemI === matches.clusters.length - 1) {
            console.log(allMatchingClus)
            resolve(['matching structures - update the pd'])
          }
          */

          // console.log('matching cluster ' + arrAllClusters)
          // console.log('clusters found in matching cluster')
        }
      })
    } else {
      console.log('no need to choose a new best matching cluster now')
      resolve(['matching structures - nothing to show'])
    }
  })
}

function getTheBestCluster (matchingClusters, sortedKeys) {
  return new Promise(function(resolve, reject) { // eslint-disable-line
    var theFirstWithData = []; var theFirstPos = -1
    for (let i = 0; i < sortedKeys.length; i++) {
      if (matchingClusters.hasOwnProperty(sortedKeys[i])) { // eslint-disable-line

        // console.log(matchingClusters[sortedKeys[i]])
        theFirstWithData = matchingClusters[sortedKeys[i]]
        console.log('The intersecting list is (1) ' + theFirstWithData)
        theFirstPos = i
        break
      }
    }

    if (theFirstPos > -1) {
      // console.log('theFirstPos ' + theFirstPos + ' sortedKeys.len ' + sortedKeys.length)
      if (theFirstPos + 1 < sortedKeys.length) {
        for (let i = theFirstPos + 1; i < sortedKeys.length; i++) {
          if (matchingClusters.hasOwnProperty(sortedKeys[i])) { // eslint-disable-line
            // Check intersection
            var intersectList = intersect(theFirstWithData, matchingClusters[sortedKeys[i]])
            // console.log('The intersecting list is ' + intersectList)
            if (intersectList.length > 0) {
              theFirstWithData = intersectList
            }
          }
          if (i == sortedKeys.length - 1) { // eslint-disable-line
            resolve(theFirstWithData)
          }
        }
      } else {
        resolve(theFirstWithData)
      }
    } else {
      resolve()
    }
  })
}

function intersect (a, b) {
  return a.filter(Set.prototype.has, new Set(b))
}
