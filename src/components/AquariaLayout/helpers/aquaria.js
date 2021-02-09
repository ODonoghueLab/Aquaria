/* eslint-disable camelcase */
// A collection of functions for Aquaria.ws - page initialisation functions are at the end of this file.
// These functions try to follow code conventions specified in http://javascript.crockford.com/code.html

window.AQUARIA = {}
var AQUARIA = window.AQUARIA
var jQuery = require('jquery')
var domready = require('domready')
var Applet3DPanel = require('../../StructureViewer/helpers/applet3DPanel')
var PV3DPanel = require('../../StructureViewer/helpers/pv3DPanel')
var JoleculePanel = require('../../StructureViewer/helpers/joleculePanel')
var IDRPanel = require('../../StructureViewer/helpers/IDRPanel')
// var molecularControlToolkitJS = require('./molecular-control-toolkit-js')
// var leapConnector = require('./leapConnector');
var ShowMatchingStructures = require('../../MatchingStructures/helpers/show_matching_structures')
var show_expanded_cluster = require('../../MatchingStructures/helpers/show_expanded_clusters')
var featurelist = require('../../Features/helpers/featurelist')
var fetch_das_annotations = require('../../Features/helpers/fetch_features')
var textpanel = require('../../InfoAbout/helpers/textpanels')
// History
var TopTen = require('./topten')
// var cache = require('../common/cache');
var d3 = require('d3')
var axios = require('axios')
var resize_app = require('./resize_app')

require('./utilities')

var MAX_PROTEIN_HISTORY = 5;

// show_matching_structures.set(AQUARIA);
(function ($) {
  // History

  var proteinSubmitListeners = []
  var addProteinSubmitListener = function (listener) {
    proteinSubmitListeners.push(listener)
  }

  AQUARIA.overlay = function () {
    var elemDiv = document.createElement('div')
    elemDiv.className = 'dimmer'
    document.body.append(elemDiv)
  }

  AQUARIA.fireProteinSubmitListeners = function (proteinName, primary_accession, pdb_id) {
    proteinSubmitListeners.forEach(function (listener) {
      listener.submitFired(proteinName, primary_accession, pdb_id)
      // if (proteinName !== "localhost") { listener.submitFired(proteinName, primary_accession); }
    })
  }

  AQUARIA.proteinTopTen = new TopTen('protein_top_ten', MAX_PROTEIN_HISTORY)
  addProteinSubmitListener(AQUARIA.proteinTopTen)

  // Moved 2D structure rendering to separate file (show_matching_structures.js)
  // -- Christian
  //
  // Simple cache with automatic removal of oldest values.
  //
  // Authors: Sean O'Donoghue
  //
  var currentBiounit = 1
  var initialised = false
  var currentData = null

  //
  // Display best structure (in 3D) and matching structures (in 2D)
  // Authors: Sean O'Donoghue, Kenny Sabir
  //
  try {
    // Display 3D structure
    window.aquariaReady = function () {}
    var switcherText = ''
    if (window.threedViewer === 'applet') {
      switcherText = 'simple'
    } else if (window.threedViewer === 'webgl' || window.threedViewer === 'jolecule') {
      switcherText = 'detailed'
    }
    $('span#threedSwitcher a').attr('title', switcherText)
    $('span#threedSwitcher').click(function () {
      if (window.threedViewer === 'applet') {
        // window.threedViewer = 'webgl';
        window.threedViewer = 'jolecule'
      } else if (window.threedViewer === 'webgl' || window.threedViewer === 'jolecule') {
        window.threedViewer = 'applet'
      }
      localStorage.setItem('3DViewer', window.threedViewer)
      location.reload()
    })

    $('#biounitLeft').click(function () {
      currentBiounit = currentBiounit - 1
      AQUARIA.display_3D_structure(currentData)
    })

    $('#biounitRight').click(function () {
      currentBiounit = currentBiounit + 1
      AQUARIA.display_3D_structure(currentData)
    })

    /**
     * Asserts the transform to be a right-handed coordinate system.
     * @param transform The transform as a string of the format "1:0:0:0:0:1:0:0:0:0:1:0"
     * @returns A transform as a string of the format "1:0:0:0:0:1:0:0:0:0:1:0"
     */
    const assert_orientation = function (transform) {
      const m = transform.split(':').map(function (c) {
        return parseFloat(c)
      })
      const det = (m[0] * m[5] * m[10] + m[1] * m[6] * m[8] + m[2] * m[4] * m[9]) - (m[2] * m[5] * m[8] + m[1] * m[4] * m[10] + m[0] * m[6] * m[9])
      if (det < 0) {
        // flip any one axis
        m[0] = -m[0]
        m[4] = -m[4]
        m[8] = -m[8]
      }

      return m.join(':')
    }

    AQUARIA.display_3D_structure = function (data, member) {
      currentData = data
      AQUARIA.currentChain = data.pdb_chain // might change in chainSelected!
      var alignment = data.alignment // alignment of UniProt to 1 pdb chain
      // var features = data.uniprot_features; // features of the UniProt
      // sequence (SNPs etc)
      var pdb_chain = data.pdb_chain // chain ID of displayed 3D structure
      var pdb_id = data.pdb_id // ID of displayed 3D structure
      var sequences = data.sequences
      var transform = assert_orientation(data.transforms[0])
      var common_names = data.common_names
      var source_primary_accession = data.source_primary_accession
      var conservations = data.conservations
      /// console.log("(biounits, currentBiounit) = (" + biounits + ", " + currentBiounit + ")");
      if (!data.biounits || data.biounits < 1) {
        // if the database PDB table has biounit = 0 or undefined
        currentBiounit = 0
      } else {
        currentBiounit = data.biounits
      }

      if (pdb_id.match(/^\d\w\w\w$/)) {
        var threeDWidth = $('#threeD').width()
        var threeDHeight = threeDWidth
        threeDHeight = $('#threeDSpan').innerHeight()
        if (threeDHeight < 570) {
          threeDHeight = 570
        }
        // $("#threeD").html('');
        /// console.log('display_3D_structure: currentBiounit =' + currentBiounit + "\n" + 'And biounits =' + biounits)

        /// console.log('AQUARIA.display_3D_structure', AQUARIA.structures2match.Selected_PDB, pdb_id, pdb_chain[0], attributes)

        // ABOUT PDB PANEL
        var url = `${window.BACKEND}/getPubMedForPDB/${pdb_id}/${pdb_chain[0]}`
        axios({
          method: 'get',
          url: url
        })
          .then(function (response) {
            var pdbData = response.data[0]
            var biounits = pdbData.Biounits
            if (!biounits || biounits < 1) {
            // if the database PDB table has biounit = 0 or undefined
              currentBiounit = 0
              pdbData.Biounits = 0
            }

            if (biounits > 0 && typeof pdbData.experimental_method !== 'undefined' && pdbData.experimental_method !== null && pdbData.experimental_method.toLowerCase().indexOf('x-ray') > -1) {
              if (member) {
                currentBiounit = 1
                textpanel.updatePDBPanel(pdbData, common_names[0], member.alignment_identity_score)
              }
              if (currentBiounit > biounits) {
                currentBiounit = 0
              } else if (currentBiounit < 0) {
                currentBiounit = biounits
              }
              if (currentBiounit === 0) {
                $('#biounitType').text('Asymmetric Unit')
                $('#biounitCount').hide()
              } else {
                $('#biounitType').text('Biological Assembly ')
                if (biounits > 1) {
                  $('#biounitCount').show()
                } else {
                  $('#biounitCount').hide()
                }
              }
              $('#biounitDisplay').show()
              $('#biounitCount').text(currentBiounit + '/' + biounits)

              if (currentBiounit !== biounits) {
                $('#biounitRight').show()
              } else {
                $('#biounitRight').hide()
              }

              if (currentBiounit > 0) {
                $('#biounitLeft').show()
              } else {
                $('#biounitLeft').hide()
              }
            } else {
              if (pdbData) {
                textpanel.updatePDBPanel(pdbData, common_names[0], member.alignment_identity_score)
              }
              $('#biounitDisplay').hide()
              currentBiounit = 0
            }
            AQUARIA.pdb_data = pdbData
            // if(pdbData){
            //   textpanel.updatePDBPanel(pdbData, common_names[0], member.alignment_identity_score);
            // }
            // else { console.log("textpanels.updatePDBPanel error: PDBData not available"); }

            // deselect feature tracks that may still be active
            d3.selectAll('svg.loaded rect.feature').attr('fill', '#a4abdf')
            d3.selectAll('svg.loaded').classed('loaded', false)

            var attributes = AQUARIA.panel3d.generateAttributes(threeDWidth, threeDHeight,
              pdb_id, pdb_chain, currentBiounit, source_primary_accession,
              sequences, common_names, alignment, '', transform, conservations, AQUARIA.structures2match.version_string)
            $('#jnlp_app_attributes').val(JSON.stringify(attributes))

            if (window.hide3DViewer) {
              AQUARIA.panel3d.blankApplet(true, 'Applet is not enabled for this browser. Launch Application instead.')
            } else {
              // var interactive = attributes.interactive ? '/' + attributes.interactive : ''
              var urlParams = window.location.href.substr(window.location.origin.length + window.location.pathname.length)
              history.pushState(null, sequences[0].primary_accession,
                window.location.protocol + '//' + window.location.host +
            '/' + sequences[0].primary_accession + '/' +
            pdb_id + '/' + pdb_chain[0] + urlParams)
              if (AQUARIA.panel3d.initialised) {
                // intiaties the refresh of the 3D panel
                AQUARIA.panel3d.reload(attributes)
              } else if (AQUARIA) {
                // intiaties the first loading of the 3D panel
                AQUARIA.panel3d.load(attributes)
                // DISABLED: Connection to Leap Connector
                // if (AQUARIA.gesture) {
                //   AQUARIA.gesture.start();
                // }
              } else {
                console.log('AQUARIA.display_3D_structure Error: Cannot load the applet!')
                alert('Cannot load the Applet!')
              }
              // setup the leap motion link
              // attributes['interactive'] = 'leap';
              // AQUARIA.remote.createToolkitAppJNLP(attributes, function(jnlpLink) {
              // $("#launchToolkitApplicationLink").attr('href', jnlpLink);
              // });
              // delete attributes['interactive'];
            }
          })
      } else {
        console.log('AQUARIA.display_3D_structure Error: Invalid PDB identifier')
      }
    }

    AQUARIA.display_features = function (sequences) {
      var primary_accession = []
      var uniprot_sequence_MD5_hash = []

      sequences.forEach(function (sequence) {
        primary_accession.push(sequence.primary_accession)
        uniprot_sequence_MD5_hash.push(sequence.uniprot_hash)
      })
      /// console.log("AQUARIA.display_features new features", primary_accession);

      if (typeof (fetch_das_annotations) !== 'undefined') {
        AQUARIA.blankPanel('#featurelist', true)
        startSpin()
        fetch_das_annotations(primary_accession,
          function (featureInfo) {
            featurelist.updateFeatureUI(featureInfo)
            AQUARIA.blankPanel('#featurelist', false)
            /// console.log('the feature info is: ')
            /// console.log(featureInfo);
          },
          function (sequenceInfo) {
            // console.log('the sequence info is: ' + sequenceInfo);
          })
      } else {
        alert('Could not find fetch_das_annotations.')
      }
    }

    var startSpin = function () {
      // $("#featureExplanation").text(" for " + AQUARIA.preferred_protein_name);

      $('#featureCounter').show()
      $('#waitForFeatures').show()
    }

    AQUARIA.updateDocumentTitle = function (protein_name, score, pdbid, chain) {
      document.title = 'Aquaria: ' +
        protein_name + ', ' + score +
        '% Sequence Identity to PDB ' + pdbid + ', chain ' + chain
      featurelist.updateFeatureTabTitle(protein_name)
    }

    AQUARIA.refresh = function () {
      if (typeof AQUARIA.showMatchingStructures !== 'undefined') {
        AQUARIA.showMatchingStructures.refresh()
        featurelist.updateFeatureUI()
      }
    }

    AQUARIA.load3DAlignment = function (member, sequence) {
      resize_app.startLogoSpin()
      // AQUARIA.e_value = member.E_value;
      AQUARIA.currentMember = member
      AQUARIA.updateDocumentTitle(AQUARIA.preferred_protein_name,
        member.alignment_identity_score, member.pdb_id,
        member.pdb_chain[0])

      //      History
      AQUARIA.fireProteinSubmitListeners(AQUARIA.preferred_protein_name, sequence.primary_accession, member.pdb_id)
      // if (AQUARIA.uniqueId !== [sequence.primary_accession, member.pdb_id, member.pdb_chain[0], currentBiounit].join('-')) {
      //   AQUARIA.panel3d.blankApplet(true, "Waiting for PDB...");
      //   AQUARIA.blankPanel("#vis", true);
      // }
      AQUARIA.panel3d.blankApplet(true, 'Waiting for PDB...')
      AQUARIA.blankPanel('#featurelist', true)
      AQUARIA.blankPanel('#aboutPDB', true)
      // AQUARIA.blankPanel("#uniProtDesc", true);
      // member["sequence"] = sequence["sequence"];

      var loadRequest = {
        selector: [sequence.primary_accession],
        selectPDB: this.member.pdb_id,
        selectChain: this.member.pdb_chain[0]
      }

      var url = `${window.BACKEND}/get_3D_alignment`
      axios({
        method: 'get',
        url: url,
        params: loadRequest
      })
        .then(function (response) {
          const newData = response.data
          //   })

          // AQUARIA.remote.get_3D_alignment(member, sequence, function(newData) {
          /// console.log('AQUARIA.remote.get_3D_alignment', newData)
          // currentBiounit = 1;
          AQUARIA.display_3D_structure(newData, member)
          AQUARIA.blankPanel('#vis', false)
          AQUARIA.blankPanel('#aboutPDB', false)
          AQUARIA.blankPanel('#uniProtDesc', false)
          AQUARIA.blankPanel('#featurelist', false)
        })
      resize_app.stopLogoSpin()
    }

    // Retrieve matching structures from server or local cache
    // var cache_matching_structures = cache();

    AQUARIA.display_member = function (selectedMember) {
      var data = AQUARIA.structures2match
      // matching structures finished
      if (data.clusters && data.clusters.length > 0) {
        if (typeof selectedMember === 'undefined') {
          selectedMember = data.clusters[data.Selected_PDB.cluster_number].members[data.Selected_PDB.member_number]
        }
        AQUARIA.member = selectedMember

        AQUARIA.load3DAlignment(selectedMember, data.sequences[0])
      } else {
        if (typeof data.pdb_id === 'undefined') {
          AQUARIA.blankAll(true)
          textpanel.updateUniprotInfo(null)
          AQUARIA.showMatchingStructures.removeAll()
        } else {
          AQUARIA.blankAll(true, 'Cannot find protein.')
          textpanel.updateUniprotInfo(null)
          AQUARIA.showMatchingStructures.removeAll()
        }
        /// console.log("AQUARIA.display_member error: cannot find matching structures.");
      }
    }
    var sequenceCallback = function (loadRequest, sequences) {
      // matching structures added found the sequence! This is the first
      // callback
      // console.log('got sequences:' + sequences);
      if (loadRequest.primary_accession === AQUARIA.structures2match.initialLoadRequest.primary_accession) {
        AQUARIA.structures2match.sequences = sequences
        // Somewhere here, we inappropriately clear the
        // matching structures before they are loaded
        /// console.log('AQUARIA.sequenceCallback initialise matching structures')
        AQUARIA.showMatchingStructures.initialise(sequences[0])
        AQUARIA.blankPanel('#vis', true, 'Loading clusters...')
        /// console.log('AQUARIA.sequenceCallback update Uniprot')
        textpanel.updateUniprotInfo(sequences[0])
        /// console.log('AQUARIA.sequenceCallback display features')
        AQUARIA.addedFeature = false
        AQUARIA.display_features(sequences)
      } else {
        /// console.log('AQUARIA.sequenceCallback error: received old data for sequence callback: ' + loadRequest.primary_accession + ', which does not match requested: ' + AQUARIA.structures2match.initialLoadRequest.primary_accession);
      }
    }

    var clusterCallback = function (loadRequest, newClusters) {
      AQUARIA.structures2match.clusters = AQUARIA.structures2match.clusters.concat(newClusters)
      // console.log('got newcluster:' + newCluster);
      // matching structures added a new cluster, lets draw it!
      // for each doesn't work on these wierd dnode arrays
      var i
      if (loadRequest.primary_accession === AQUARIA.structures2match.initialLoadRequest.primary_accession) {
        for (i = 0; i < newClusters.length; i++) {
          AQUARIA.showMatchingStructures.addCluster(newClusters[i])
        }
      } else {
        /// console.log('AQUARIA.clusterCallback error: received old data for cluster callback: ' + loadRequest.primary_accession + ', which does not match requested: ' + AQUARIA.structures2match.initialLoadRequest.primary_accession);
      }
      // AQUARIA.showMatchingStructures.showMap(newClusters[0])
    }

    var isLoadRequestsEqual = function (primary_accession) {
      var isEqual = false

      if (typeof AQUARIA.structures2match !== 'undefined' && typeof AQUARIA.structures2match.initialLoadRequest !== 'undefined') {
        if (primary_accession instanceof Array && AQUARIA.structures2match.initialLoadRequest.selector instanceof Array) {
          if (primary_accession.length === AQUARIA.structures2match.initialLoadRequest.selector.length) {
            var i
            isEqual = true
            for (i = 0; i < primary_accession.length; i++) {
              if (primary_accession[i] !== AQUARIA.structures2match.initialLoadRequest.selector[i]) {
                isEqual = false
                break
              }
            }
          }
        }
      }
      return isEqual
    }

    var onTextClick = function (d, cluster) {
      return show_expanded_cluster.expand_cluster(d, cluster, AQUARIA.structures2match.sequences[0])
    }

    // var loadAndUpdateHistory = function() {
    //   uniprot_accession = [];
    //   uniprot_accession.push(accessionObject.Accession);

    //   AQUARIA.loadAccession(uniprot_accession, null, null, false, uniprot_accession);

    // }

    AQUARIA.loadAccession = function (primary_accession, autoSelectPDB,
      autoSelectChain, skip3DView, preferredProteinName) {
      preferredProteinName = preferredProteinName || 'unknown'
      skip3DView = skip3DView || false

      if (primary_accession === null) {
        // TODO here we want to revert to the initial state, e.g. no structure in the viewer
        AQUARIA.blankAll(true)
        AQUARIA.structures2match = {}
        AQUARIA.blankCount = {}
        delete AQUARIA.preferred_protein_name
        return
      }

      if (isLoadRequestsEqual(primary_accession)) {
        AQUARIA.blankAll(false)
        /// console.log('AQUARIA.loadAccession skipping: already loaded', primary_accession)
        return
      }
      /// console.log('AQUARIA.loadAccession load', primary_accession)

      const pdbParam = autoSelectPDB ? '/' + autoSelectPDB : ''
      const chainParam = autoSelectChain ? '/' + autoSelectChain : ''
      var urlParams = window.location.href.substr(window.location.origin.length + window.location.pathname.length)
      if (AQUARIA.orgName) {
        history.pushState(primary_accession, document.title, '/' +
        AQUARIA.orgName + '/' + AQUARIA.gene + pdbParam + chainParam + urlParams)
      } else {
        history.pushState(primary_accession, document.title, '/' +
        primary_accession + pdbParam + urlParams)
      }

      AQUARIA.blankPanel('#vis', true)
      AQUARIA.blankPanel('#uniProtDesc', true)

      AQUARIA.preferred_protein_name = preferredProteinName
      AQUARIA.protein_primary_accession = primary_accession

      // TODO this is currently being called again once the
      // structures come back (in updateUniprotInfo), but
      // is required to be called now in order to make sure
      // that AQUARIA.preferred_protein_name is being set.
      textpanel.fetchSynonyms(primary_accession)

      AQUARIA.showMatchingStructures = new ShowMatchingStructures(onTextClick)

      var loadRequest = {
        selector: primary_accession,
        selectPDB: autoSelectPDB,
        selectChain: autoSelectChain
      }
      AQUARIA.structures2match = {
        initialLoadRequest: loadRequest,
        clusters: [],
        sequences: [],
        source_primary_accession: primary_accession
      }

      // cache_matching_structures(primary_accession, function(primary_accession) {
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
          // AQUARIA.remote.get_matching_structures(loadRequest, sequenceCallback, clusterCallback, function(err, loadRequest, Selected_PDB, finalClusters, cachedHit, version_string) {
          if (loadRequest.primary_accession === AQUARIA.structures2match.initialLoadRequest.primary_accession) {
            // AQUARIA.updateIssueEnvironment();
            const err = matches.err
            if (err !== undefined && err !== null) {
              if (skip3DView && err.name === 'MatchingStructuresError') {
                AQUARIA.blankPanel('#vis', true, err.message)
              } else {
                AQUARIA.blankAll(true, err.message, false)
              }
            } else {
              if (matches.clusters) {
                // if (matches.cachedHit) {
                //   // cached hit doesn't call the callback (to avoid packet out of order), so call it manually
                //   clusterCallback(loadRequest, matches.clusters);
                // } else {
                AQUARIA.structures2match.clusters = matches.clusters
                // }
              }

              AQUARIA.showMatchingStructures.updateSizes(AQUARIA.structures2match.clusters)
              AQUARIA.blankPanel('#vis', false)

              AQUARIA.structures2match.Selected_PDB = matches.Selected_PDB
              /// console.log('AQUARIA.cache_matching_structures applet version: ' + version_string, Selected_PDB);

              AQUARIA.structures2match.version_string = matches.viewer
              var clusterNumber = matches.Selected_PDB.cluster_number
              var cluster = AQUARIA.structures2match.clusters[clusterNumber]
              AQUARIA.showMatchingStructures.selectCluster(cluster,
                clusterNumber)
              if (!skip3DView) {
                if (window.threedView === 'IDR') {
                  var threeDWidth = $('#threeD').width()
                  var threeDHeight = threeDWidth
                  threeDHeight = $('#threeDSpan').innerHeight()
                  if (threeDHeight < 570) {
                    threeDHeight = 570
                  }
                  AQUARIA.panel3d.display_cluster(cluster, threeDWidth, threeDHeight)
                }
                AQUARIA.display_member()
              }
              AQUARIA.showMatchingStructures.drawCoverageMap(cluster)
            }
          } else {
            /// console.log('AQUARIA.loadAccession error: received old data for Best PDB: ' + loadRequest.primary_accession + ', which does not match requested: ' + AQUARIA.structures2match.initialLoadRequest.primary_accession);
          }
        })
      // });
    }
  } catch (error) {
    alert('Error with displaying structures: ' + error.message)
  }

  //
  // Functions to run immediately after home page DOM first finishes loading.
  //
  // Authors: Sean O'Donoghue, Kenny Sabir, Christian Stolte, Nelson Pereira, Julian Heinrich
  //
  AQUARIA.initialisePanels = function (hasUrl) {
    hasUrl = (typeof hasUrl === 'undefined') ? false : hasUrl
    // the rest was commented out
  }
  //
  // Functions to run the first time the nowjs socket connection is ready.
  //

  var remoteSuccess = function () {
    if (initialised) {
      console.debug('domready.ready called again!')
      return
    }

    /// console.log("AQUARIA.remoteSuccess socket connection is ready");

    initialised = true;

    // Avoid `console` errors in browsers that lack a console.
    (function () {
      var method
      var noop = function () {}
      var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
      ]
      var length = methods.length
      var console = (window.console = window.console || {})

      while (length--) {
        method = methods[length]

        // Only stub undefined methods.
        if (!console[method]) {
          console[method] = noop
        }
      }
    }())

    var uniprot_accession
    // when 'now' socket is ready, fetch structures if URL specifies
    // a Primary_Accession
    var pathname = document.location.origin + document.location.pathname // document.URL.split('?')[0];
    if (typeof window.initialParams !== 'undefined') {
      AQUARIA.initialisePanels(true)
      uniprot_accession = []
      uniprot_accession.push(window.initialParams.primary_accession)
      AQUARIA.loadAccession(uniprot_accession, window.initialParams.pdb_id, window.initialParams.pdb_chain)
    } else if (pathname
      .match(/\/(?:leap\/)?([A-Z a-z][0-9][A-Z a-z,0-9][A-Z a-z,0-9][A-Z a-z,0-9][0-9])\/?$/)) {
      uniprot_accession = []
      uniprot_accession.push(RegExp.$1.toUpperCase())
      AQUARIA.initialisePanels(true)
      AQUARIA.blankAll(true, 'Waiting for data...')
      AQUARIA.loadAccession(uniprot_accession)
    } else if (pathname
      .match(/\/(?:leap\/)?([a-zA-Z0-9]{30,})\/?$/)) {
      uniprot_accession = RegExp.$1.toUpperCase()
      AQUARIA.initialisePanels(true)
      AQUARIA.blankAll(true, 'Waiting for data...')
      AQUARIA.loadAccession(uniprot_accession)
      // primary accession and pdb
    } else if (pathname
      .match(/\/(?:leap\/)?([A-Z a-z][0-9][A-Z a-z,0-9][A-Z a-z,0-9][A-Z a-z,0-9][0-9])\/([0-9]([A-Z a-z,0-9][A-z a-z,0-9])[A-Z a-z,0-9])\/?$/)) {
      uniprot_accession = []
      uniprot_accession.push(RegExp.$1.toUpperCase())
      var pdb = RegExp.$2.toLowerCase()
      AQUARIA.initialisePanels(true)
      AQUARIA.blankAll(true, 'Waiting for data...')
      AQUARIA.loadAccession(uniprot_accession, pdb)
      // primary accession and pdb and chain
    } else if (pathname
      .match(/\/(?:leap\/)?([A-Z a-z][0-9][A-Z a-z,0-9][A-Z a-z,0-9][A-Z a-z,0-9][0-9])\/([0-9]([A-Z a-z,0-9][A-Z a-z,0-9])[A-Z a-z,0-9])\/([a-zA-Z,0-9])?$/)) {
      uniprot_accession = []
      uniprot_accession.push(RegExp.$1.toUpperCase())
      pdb = RegExp.$2.toLowerCase()
      var chain = RegExp.$4.toUpperCase()
      /// console.log('AQUARIA.remoteSuccess inside chain selection');
      AQUARIA.initialisePanels(true)
      AQUARIA.blankAll(true, 'Waiting for data...')
      AQUARIA.loadAccession(uniprot_accession, pdb, chain)
    } else if (window.location.pathname) {
      var accession = []
      const attr = window.location.pathname.split('/')
      // const organism_gene = attr[1] + '/' + attr[2]
      var url = `${window.BACKEND}/getAccessionbyOrgNameandGene/${attr[1]}/${attr[2]}`
      axios({
        method: 'get',
        url: url
      })
        .then(function (response) {
          AQUARIA.orgName = attr[1]
          AQUARIA.gene = attr[2]
          // const orgID = response.data[0].orgID
          accession.push(response.data[0].Primary_Accession)
          if (attr.length > 4) {
            if (attr[3].match(/([0-9]([A-Z a-z,0-9][A-z a-z,0-9])[A-Z a-z,0-9])/)) {
              pdb = attr[3]
            }
            if (attr[4].match(/([a-zA-Z,0-9])?$/)) {
              chain = attr[4]
            }
            AQUARIA.initialisePanels(true)
            AQUARIA.loadAccession(accession, pdb, chain)
          } else if (attr.length > 3) {
            if (attr[3].match(/([0-9]([A-Z a-z,0-9][A-z a-z,0-9])[A-Z a-z,0-9])/)) {
              pdb = attr[3]
            }
            AQUARIA.initialisePanels(true)
            AQUARIA.loadAccession(accession, pdb)
          } else {
            AQUARIA.initialisePanels(true)
            AQUARIA.loadAccession(accession)
          }
        })
    } else if (pathname.match(/\/([A-Za-z]+)/)) {
      // uniprot_accession = RegExp.$1;
      // History:
      // [JH] matches the URL and tries to load it as accession
      // not sure if we need this for the history in the search box?
      // AQUARIA.loadAccession(uniprot_accession);
      AQUARIA.initialisePanels(false)
    } else {
      AQUARIA.initialisePanels(false)
    }
  }

  domready(function () {
    if (window.threedViewer === 'applet') {
      AQUARIA.panel3d = new Applet3DPanel('#threeDSpan')
    } else if (window.threedViewer === 'jolecule') {
      AQUARIA.panel3d = new JoleculePanel('#threeDSpan', AQUARIA.chainSelected)
    } else if (window.threedViewer === 'webgl') {
      AQUARIA.panel3d = new PV3DPanel('#threeDSpan')
    } else if (window.threedViewer === 'idr') {
      AQUARIA.panel3d = new IDRPanel('#threeDSpan')
    } else {
      console.log('AQUARIA.domready cannot find viewer: ' + window.threedViewer)
    }
    // AQUARIA.gesture = new molecularControlToolkitJS.Leap(AQUARIA.panel3d.gestures())
    remoteSuccess()
  })
})(jQuery)

AQUARIA.margin = {
  top: 10,
  right: 80,
  bottom: 20,
  left: 40
}

AQUARIA.launchURL = function (url) {
  window.open(url, '_blank')
}

AQUARIA.chainSelected = function (primaryAccession, pdbId, chainId) {
  /// console.log('AQUARIA.chainSelected ' + primaryAccession + ', for pdb chain: ' + pdbId + ":" + chainId);
  const uniprot_accession = []
  uniprot_accession.push(primaryAccession)
  AQUARIA.currentChain = chainId

  // TODO THis shouldn't call load Accession because that loads everything as if it is the first time.
  // in this case, we just want to load matching structures and the protein, and leave the 3d context.
  AQUARIA.loadAccession(uniprot_accession, pdbId, chainId, true)

  if ('pdb_data' in AQUARIA) {
    textpanel.updatePDBChain(pdbId, chainId, AQUARIA.currentMember.alignment_identity_score, AQUARIA.pdb_data.Organism[primaryAccession])
  }
}

AQUARIA.structures2match = {}
AQUARIA.blankCount = {}
AQUARIA.currentMember = null
const $ = jQuery

AQUARIA.blankPanel = function (panel, isOn, message) {
  var name = panel + ' .blank'
  if (isOn) {
    if ($(name).length === 0) {
      /// console.log("AQUARIA.blankPanel " + panel + ": " + isOn);
      if (message) {
        $(panel).append(
          '<div class="blank hidden"><br><p class="centered">' + message +
          '</p></div>')
      } else {
        $(panel).append('<div class="blank hidden"></div>')
      }
      $(name).fadeIn('fast')
      $(name).css('height', $(panel).css('height'))
    }
  } else {
    /// console.log("AQUARIA.blankPanel " + panel + ": " + isOn);
    $(name).fadeOut('slow', function (obj) {
      $(name).remove()
    })
  }
}

AQUARIA.blankAll = function (isOn, message) {
  /// console.log("AQUARIA.blankAll", isOn, message);
  // var messageDisplay = message || "Please specify a " + localStorage.preferred_organism_name + " protein.<br><br>Or, specify a new default organism.";
  // AQUARIA.panel3d.blankApplet(isOn, messageDisplay);
  AQUARIA.blankPanel('#vis', isOn)
  AQUARIA.blankPanel('#aboutPDB', isOn)
  AQUARIA.blankPanel('#uniProtDesc', isOn)
  AQUARIA.blankPanel('#featurelist', isOn)
}

window.ATL_JQ_PAGE_PROPS = {
  //  window.ATL_JQ_PAGE_PROPS = $.extend(window.ATL_JQ_PAGE_PROPS, {
  '0add5080': {
    triggerFunction: function (showCollectorDialog) {
      // Requries that jQuery is available!
      jQuery('#issuesButton').click(function (e) {
        e.preventDefault()
        showCollectorDialog()
      })
    },
    environment: function () {
      var version = window.AQUARIA.structures2match ? window.AQUARIA.structures2match.version_string : 'unknown'
      return {
        'Applet Version': '' + version,
        Location: window.location.href
      }
    }

  },
  '5ee9f010': {
    triggerFunction: function (showCollectorDialog) {
      // Requries that jQuery is available!
      jQuery('#feedbackButton').click(function (e) {
        e.preventDefault()
        showCollectorDialog()
      })
    }
  }
}
// };