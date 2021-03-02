/* eslint-disable camelcase */

//  Main client script that defines the AQUARIA namespace and primary functions.
//  Page initialisation functions are at the end of this file.
//  These functions try to follow code conventions specified in http://javascript.crockford.com/code.html
//
//  Copyright (c) CSIRO (2010-2017) and Garvan Institute of Medical Research (2010-)
//
//  Authors:
//  Stuart Anderson <Stuart.Anderson@data61.csiro.au>
//  Julian Heinrich <julian.heinrich@gmail.com>
//  Sean O'Donoghue <sean@odonoghuelab.org>
//  Kenny Sabir <traksewt@gmail.com>
//  Neblina Sikta <n.sikta@garvan.org.au>
//  Christian Stolte <christian.stolte@gmail.com>
//
//  Jenny Vuong <vuong.jenny@gmail.com>
//  Michael Joss <michael.joss@gmail.com>
//  Vivian Ho <veeveearnh@gmail.com>
//
// This work is licensed under the terms of the GNU GPL version 2.

window.AQUARIA = {}
var AQUARIA = window.AQUARIA
var jQuery = require('jquery')
var domready = require('domready')
var Applet3DPanel = require('../../StructureViewer/helpers/applet3DPanel')
var PV3DPanel = require('../../StructureViewer/helpers/pv3DPanel')
var JoleculePanel = require('../../StructureViewer/helpers/joleculePanel')
var IDRPanel = require('../../StructureViewer/helpers/IDRPanel')
var ShowMatchingStructures = require('../../MatchingStructures/helpers/show_matching_structures')
var show_expanded_cluster = require('../../MatchingStructures/helpers/show_expanded_clusters')
var featurelist = require('../../Features/helpers/featurelist')
var fetch_das_annotations = require('../../Features/helpers/fetch_features')
var textpanel = require('../../InfoAbout/helpers/textpanels')
var TopTen = require('./topten')
var d3 = require('d3')
var axios = require('axios')
// var resize_app = require('./resize_app')
var aquariaRemote = require('../../../utils/url')
import * as LoadAQUARIA from '../../../utils/loadData'

require('./utilities')

var MAX_PROTEIN_HISTORY = 5;

(function ($) {

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

        // ABOUT PDB PANEL
        var url = `${window.BACKEND}/getPubMedForPDB/${pdb_id}/${(window.AQUARIA.prefferedChain[0] ? window.AQUARIA.prefferedChain[0] : pdb_chain[0])}`
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
            pdb_id + '/' + (window.AQUARIA.prefferedChain[0] ? window.AQUARIA.prefferedChain[0] : pdb_chain[0]) + urlParams)
            
            function findPDBMember (pdbid, chain) {
              var pdbMember = []
              for (var clusterID in window.AQUARIA.structures2match.clusters) {
                for (var memberID in window.AQUARIA.structures2match.clusters[clusterID].members) {
                  if (window.AQUARIA.structures2match.clusters[clusterID].members[memberID].pdb_chain[0].includes(chain) && window.AQUARIA.structures2match.clusters[clusterID].members[memberID].pdb_id.includes(pdbid)) {
                    pdbMember.cluster = parseInt(clusterID)
                    pdbMember.member = parseInt(memberID)
                    return pdbMember
                  }
                }
              }
            }

            window.AQUARIA.PDBIndex = findPDBMember(window.AQUARIA.currentMember.pdb_id, window.AQUARIA.currentMember.pdb_chain)
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
      // resize_app.startLogoSpin()
      // AQUARIA.e_value = member.E_value;
      AQUARIA.currentMember = member
      AQUARIA.updateDocumentTitle(AQUARIA.preferred_protein_name,
        member.alignment_identity_score, member.pdb_id,
        (window.AQUARIA.prefferedChain[0] ? window.AQUARIA.prefferedChain[0] : member.pdb_chain[0]))

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
        selectChain: window.AQUARIA.prefferedChain[0] ? window.AQUARIA.prefferedChain[0] : this.member.pdb_chain[0]
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
      // resize_app.stopLogoSpin()
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
          Store.commit('setErrorTitle', 'Cannot find protein.')
          textpanel.updateUniprotInfo(null)
          AQUARIA.showMatchingStructures.removeAll()
        }
        /// console.log("AQUARIA.display_member error: cannot find matching structures.");
      }
    }
  } catch (error) {
    alert('Error with displaying structures: ' + error.message)
  }

  //
  // Functions to run immediately after home page DOM first finishes loading.
  //
  // Authors: Sean O'Donoghue, Kenny Sabir, Christian Stolte, Julian Heinrich
  //
  AQUARIA.initialisePanels = function (hasUrl) {
    hasUrl = (typeof hasUrl === 'undefined') ? false : hasUrl
    // the rest was commented out
  }

  domready(function () {
    if (window.threedViewer === 'applet') {
      AQUARIA.panel3d = new Applet3DPanel('#threeDSpan')
    } else if (window.threedViewer === 'jolecule') {
      AQUARIA.panel3d = new JoleculePanel('#threeDSpan', LoadAQUARIA.chainSelected)
    } else if (window.threedViewer === 'webgl') {
      AQUARIA.panel3d = new PV3DPanel('#threeDSpan')
    } else if (window.threedViewer === 'idr') {
      AQUARIA.panel3d = new IDRPanel('#threeDSpan')
    } else {
      console.log('AQUARIA.domready cannot find viewer: ' + window.threedViewer)
    }
    // AQUARIA.gesture = new molecularControlToolkitJS.Leap(AQUARIA.panel3d.gestures())
    // remoteSuccess()
    aquariaRemote.remoteSuccess()
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

window.AQUARIA.chainSelected = LoadAQUARIA.chainSelected
// AQUARIA.chainSelected = function (primaryAccession, pdbId, chainId) {
//   /// console.log('AQUARIA.chainSelected ' + primaryAccession + ', for pdb chain: ' + pdbId + ":" + chainId);
//   const uniprot_accession = []
//   uniprot_accession.push(primaryAccession)
//   AQUARIA.currentChain = chainId

//   // TODO THis shouldn't call load Accession because that loads everything as if it is the first time.
//   // in this case, we just want to load matching structures and the protein, and leave the 3d context.
//   LoadAQUARIA.loadAccession(uniprot_accession, pdbId, chainId, true)

//   if ('pdb_data' in AQUARIA) {
//     textpanel.updatePDBChain(pdbId, chainId, AQUARIA.currentMember.alignment_identity_score, AQUARIA.pdb_data.Organism[primaryAccession])
//   }
// }

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
