//A collection of functions for Aquaria.ws - page initialisation functions are at the end of this file.
//These functions try to follow code conventions specified in http://javascript.crockford.com/code.html

window.AQUARIA = {};

var domready = require('domready');
var dnode = require('dnode');
var shoe = require('shoe');
var Applet3DPanel = require('./applet3DPanel');
var PV3DPanel = require('./pv3DPanel');
var JoleculePanel = require('./joleculePanel');
var IDRPanel = require('./IDRPanel');
var featurelist = require('./featurelist');
//var leapConnector = require('./leapConnector');
var molecularControlToolkitJS = require('molecular-control-toolkit-js');


//History 
var TopTen = require('./topten');
//var cache = require('../common/cache');
var ShowMatchingStructures = require('./show_matching_structures');
var fetch_das_annotations = require('./fetch_features');

var MAX_PROTEIN_HISTORY = 5;

//show_matching_structures.set(AQUARIA);
(function($) {
  // History

  var proteinSubmitListeners = [];
  var addProteinSubmitListener = function(listener) {
    proteinSubmitListeners.push(listener);
  };

  AQUARIA.fireProteinSubmitListeners = function(proteinName, primary_accession, pdb_id) {
    proteinSubmitListeners.forEach(function(listener) {
      listener.submitFired(proteinName, primary_accession, pdb_id);
      // if (proteinName !== "localhost") { listener.submitFired(proteinName, primary_accession); }
    });
  };

  var proteinTopTen = new TopTen("protein_top_ten", MAX_PROTEIN_HISTORY);
  addProteinSubmitListener(proteinTopTen);


  // Moved 2D structure rendering to separate file (show_matching_structures.js)
  // -- Christian
  //
  // Simple cache with automatic removal of oldest values.
  //
  // Authors: Sean O'Donoghue
  //
  var currentBiounit = 1;
  var initialised = false;
  var currentData = null;

  if (!window.console)
    console = {
      log: function() {}
    };
  try {
    function cache() {
      var cache = {};
      var last_access = {};
      var value;
      var size;
      var maximum_cache_size = 10;
      var oldest_key;
      var oldest_date;

      return function(key, callback) {
        last_access[key] = Date();

        if (key in cache && cache[key]) {
          // use cached value if available
          console.log('Read ' + key + ' from cache');
          return cache[key];
        } else {
          // get new value if not in cache
          value = callback(key);

          // store in cache
          cache[key] = value;
          console.log('AQUARIA.constructor stored ' + key + ' in cache (size = ' + size + ')');

          // if cache size is too large, remove oldest key
          size = Object.keys(cache).length;
          if (size > maximum_cache_size) {
            // find and delete oldest key
            oldest_date = last_access[key];
            for (key in cache) {
              console.log('AQUARIA.constructor checking key = ' + key);
              if (last_access[key] <= oldest_date) {
                console.log('AQUARIA.constructor key is older: ' + last_access[key]);
                oldest_key = key;
                oldest_date = last_access[key];
              }
            }
            console.log('AQUARIA.constructor final oldest key = ' + oldest_key);
            delete cache[oldest_key];
            delete last_access[oldest_key];
            console.log('AQUARIA.constructor deleted ' + oldest_key + ' from cache');
          }
          return value;
        }
      }
    }
  } catch (error) {
    alert('AQUARIA.constructor error with cache(): ' + error.message);
  }

  //
  // Display best structure (in 3D) and matching structures (in 2D)
  //
  // Authors: Sean O'Donoghue, Kenny Sabir
  //
  try {
    // Display 3D structure
    window.aquariaReady = function() {};

    var switcherText = '';
    if (window.threedViewer === 'applet') {
      switcherText = 'simple';
    } else if (window.threedViewer === 'webgl' || window.threedViewer === 'jolecule') {
      switcherText = 'detailed';
    }
    $("span#threedSwitcher a").attr('title', switcherText);
    $("span#threedSwitcher").click(function() {
      if (window.threedViewer === 'applet') {
        //window.threedViewer = 'webgl';
        window.threedViewer = 'jolecule';
      } else if (window.threedViewer === 'webgl' || window.threedViewer === 'jolecule') {
        window.threedViewer = 'applet';
      }
      localStorage.setItem("3DViewer", window.threedViewer);
      location.reload();
    });



    $('#biounitLeft').click(function() {
      currentBiounit = currentBiounit - 1;
      AQUARIA.display_3D_structure(currentData);
    });

    $('#biounitRight').click(function() {
      currentBiounit = currentBiounit + 1;
      AQUARIA.display_3D_structure(currentData);
    });

    /**
     * Asserts the transform to be a right-handed coordinate system.
     * @param transform	The transform as a string of the format "1:0:0:0:0:1:0:0:0:0:1:0"
     * @returns	A transform as a string of the format "1:0:0:0:0:1:0:0:0:0:1:0"
     */
    function assert_orientation(transform) {
      m = transform.split(":").map(function(c) {
        return parseFloat(c);
      });
      det = (m[0] * m[5] * m[10] + m[1] * m[6] * m[8] + m[2] * m[4] * m[9]) - (m[2] * m[5] * m[8] + m[1] * m[4] * m[10] + m[0] * m[6] * m[9]);
      if (det < 0) {
        // flip any one axis
        m[0] = -m[0];
        m[4] = -m[4];
        m[8] = -m[8];
      }

      return m.join(":");
    }

    AQUARIA.display_3D_structure = function(data, member) {
      currentData = data;
      AQUARIA.currentChain = data.pdb_chain; // might change in chainSelected!
      var alignment = data.alignment; // alignment of UniProt to 1 pdb chain
      // var features = data.uniprot_features; // features of the UniProt
      // sequence (SNPs etc)
      var pdb_chain = data.pdb_chain; // chain ID of displayed 3D structure
      var pdb_id = data.pdb_id; // ID of displayed 3D structure
      var sequences = data.sequences;
      var transform = assert_orientation(data.transforms[0]);
      var common_names = data.common_names;
      var biounits = data.biounits;
      var source_primary_accession = data.source_primary_accession;
      var conservations = data.conservations;
      if (pdb_id.match(/^\d\w\w\w$/)) {
        var threeDWidth = $("#threeD").width();
        var threeDHeight = threeDWidth;
        threeDHeight = $("#threeDSpan").innerHeight();
        if (threeDHeight < 570) {
          threeDHeight = 570;
        }
        // $("#threeD").html('');
        if (biounits == 0) {
          currentBiounit = 0;
        }
        var attributes = AQUARIA.panel3d.generateAttributes(threeDWidth, threeDHeight,
          pdb_id, pdb_chain, currentBiounit, source_primary_accession,
          sequences, common_names, alignment, '', transform, conservations, AQUARIA.structures2match.version_string);

        console.log('AQUARIA.display_3D_structure', AQUARIA.structures2match.Selected_PDB, pdb_id, pdb_chain[0], attributes)

        AQUARIA.remote.getPubMedForPDB(pdb_id, pdb_chain[0], function(pdbData) {
          if (biounits > 0 && typeof pdbData.Experimental_Method !== 'undefined' && pdbData.Experimental_Method !== null && pdbData.Experimental_Method.toLowerCase().indexOf('x-ray') > -1) {
            if (currentBiounit > biounits) {
              currentBiounit = 0;
            } else if (currentBiounit < 0) {
              currentBiounit = biounits;
            }
            if (currentBiounit === 0) {
              $('#biounitType').text('Asymmetric Unit');
              $('#biounitCount').hide();
            } else {
              $('#biounitType').text('Biological Assembly');
              if (biounits > 1) {
                $('#biounitCount').show();
              } else {
                $('#biounitCount').hide();
              }
            }
            $("#biounitDisplay").show();
            $("#biounitCount").text(currentBiounit + "/" + biounits);

            if (currentBiounit !== biounits) {
              $('#biounitRight').show();
            } else {
              $('#biounitRight').hide();
            }

            if (currentBiounit > 0) {
              $('#biounitLeft').show();
            } else {
              $('#biounitLeft').hide();
            }

          } else {
            $("#biounitDisplay").hide();
            currentBiounit = 0;
          }
          AQUARIA.pdb_data = pdbData;
          updatePDBPanel(pdbData, common_names[0], member.alignment_identity_score);

          //deselect feature tracks that may still be active
          d3.selectAll("svg.loaded rect.feature").attr("fill", "#a4abdf");
          d3.selectAll("svg.loaded").classed("loaded", false);

        });
        $("#jnlp_app_attributes").val(JSON.stringify(attributes));

        // $("#launchJalviewLink").click(function () {
        // console.log("Jalview on click executed: " +
        // top.frames['jalViewFrame'].loadJalviewApplet);
        // top.frames['jalViewFrame'].loadJalviewApplet(primary_accession,
        // attributes.pdb_id, uniprot_sequence, attributes.instanceId);
        // });
        if (window.hide3DViewer) {
          AQUARIA.panel3d.blankApplet(true, "Applet is not enabled for this browser. Launch Application instead.");
          AQUARIA.remote.createAppJNLP(attributes, function(jnlpLink) {
            $(".launchApplicationLink").attr('href', jnlpLink);
            $("#waitingFrame").contents().find(".launchApplicationLink").attr('href', jnlpLink);
          });

        } else {
          AQUARIA.remote.createAppJNLP(attributes, function(jnlpLink) {
            $(".launchApplicationLink").attr('href', jnlpLink);
          });

          var interactive = attributes['interactive'] ? '/' +
            attributes['interactive'] : '';
          var urlParams = window.location.search;
          history.pushState(null, sequences[0].primary_accession,
            window.location.protocol + '//' + window.location.host +
            "/" + sequences[0].primary_accession + "/" +
            pdb_id + "/" + pdb_chain[0] + urlParams);
          if (AQUARIA.panel3d.initialised) {
            AQUARIA.panel3d.reload(attributes);
          } else if (AQUARIA) {
            // first time
            AQUARIA.panel3d.load(attributes);
            // DISABLED: Connection to Leap Connector
            // if (AQUARIA.gesture) {
            //   AQUARIA.gesture.start();
            // }

          } else {
            console.log("AQUARIA.display_3D_structure Error: Cannot load the applet!");
            alert('Cannot load the Applet!');
          }
          // setup the leap motion link
          //					attributes['interactive'] = 'leap';
          //					AQUARIA.remote.createToolkitAppJNLP(attributes, function(jnlpLink) {
          //						$("#launchToolkitApplicationLink").attr('href', jnlpLink);
          //					});
          //					delete attributes['interactive'];
        }

      } else {
        console.log("AQUARIA.display_3D_structure Error: Invalid PDB identifier");
      }

    };

    AQUARIA.display_features = function(sequences) {

      var primary_accession = [];
      var uniprot_sequence_MD5_hash = [];

      sequences.forEach(function(sequence) {
        primary_accession.push(sequence.primary_accession);
        uniprot_sequence_MD5_hash.push(sequence.uniprot_hash);
      });
      console.log("AQUARIA.display_features new features", primary_accession);

      if (typeof(fetch_das_annotations) !== "undefined") {
        AQUARIA.blankPanel("#featurelist", true);
        startSpin();
        fetch_das_annotations(primary_accession,
          function(featureInfo) {
            featurelist.updateFeatureUI(featureInfo);
            AQUARIA.blankPanel("#featurelist", false);
            //console.log('the feature info is: ' + featureInfo);
          },
          function(sequenceInfo) {
            //					console.log('the sequence info is: ' + sequenceInfo);
          });
      } else {
        alert('Could not find fetch_das_annotations.');
      }

    };

    var startSpin = function() {

      //$("#featureExplanation").text(" for " + AQUARIA.preferred_protein_name);

      $("#featureCounter").show();
      $("#waitForFeatures").show();

    };

    AQUARIA.updateDocumentTitle = function(protein_name, score, pdbid, chain) {
      document.title = "Aquaria: " +
        protein_name + ", " + score +
        "% Sequence Identity to PDB " + pdbid + ", chain " + chain;
      featurelist.updateFeatureTabTitle(protein_name);
    };

    //updates the 3D viewer title
    // this is a hack and requires the function to be called once before the proper HTML code is being generated.
    //TODO move html code to home_page.ejs?
    AQUARIA.update3DTitle = function(accession, pdbId, chainId, molecule_name, score) {

      if (chainId && molecule_name) {

        var short_name = molecule_name;
        if (short_name.indexOf("(") != -1) {
          short_name = molecule_name.substring(0, molecule_name.indexOf("(")).trim();
        }

        AQUARIA.short_molecule_name = short_name;

        // if (accession && pdbId && score) {
        //   $("#structureviewerexplanation").html("<a id='accession_link' href='https://www.uniprot.org/uniprot/" + AQUARIA.protein_primary_accession + "' title='Go to UniProt'>" + AQUARIA.preferred_protein_name +
        //     "</a> sequence aligned onto <a href='/" + accession + "' title='View the structure for " + short_name + " in Aquaria'>" + short_name +
        //     "</a> structure from <a href='http://www.rcsb.org/pdb/explore.do?structureId=" + pdbId + "' title='Go to PDB'>PDB " + pdbId + "-" + chainId + "</a> (" + score +
        //     "% sequence identity)&nbsp;&nbsp;<a href='javascript:;'  data-intro='Model Quality' data-position='top'><span id='help3D' class='help roundButton'>&nbsp;</span></a>");

        //   var evalue = AQUARIA.currentMember.E_value; // e-value from pssh2
        //   $("#help3D").show().parent().attr("onmouseenter", "AQUARIA.explainTitle('" + accession + "','" + AQUARIA.preferred_protein_name + "','" + short_name + "','" + pdbId + "','" + chainId +
        //     "','" + score + "','" + evalue + "');");
        // } else { // DNA or RNA (no accession)
        //   $("#structureviewerexplanation").html(short_name + "</a> structure from <a href='http://www.rcsb.org/pdb/explore.do?structureId=" + pdbId + "' title='Go to PDB'>PDB " + pdbId + "-" +
        //     chainId + "</a> (" + score + "% sequence identity)");
        // }

        //NEBLINA's Scripts
        if (accession && pdbId && score) {
          $("#structureviewerexplanation").html("<a id='accession_link' title='About Uniprot ID'>" + AQUARIA.preferred_protein_name +
            "</a> sequence aligned onto <a href='/" + accession + "' title='View the structure for " + short_name + " in Aquaria'>" + short_name +
            "</a> structure from <a id='pdb_link' title='About PDB ID'>PDB " + pdbId + "-" + chainId + "</a> (" + score +
            "% sequence identity)&nbsp;&nbsp;<a href='javascript:;'  data-intro='Model Quality' data-position='top'><span id='help3D' class='help roundButton'>&nbsp;</span></a>");

          var evalue = AQUARIA.currentMember.E_value; // e-value from pssh2
          $("#help3D").show().parent().attr("onmouseenter", "AQUARIA.explainTitle('" + accession + "','" + AQUARIA.preferred_protein_name + "','" + short_name + "','" + pdbId + "','" + chainId +
            "','" + score + "','" + evalue + "');");

            if ($('#title3D').is(':visible')) {
              $('#accession_link').on('click', function () {
                if ($('#gallery').is(':visible')) {
                  $('#gallery').hide()
                  $('#searchByName').hide()
                  $('#uniprot').show()
                } else if ($('#uniprot').is(':visible')) {
                  $('#searchByName').show()
                  $('#uniprot').hide()
                } else {
                  $('#uniprot').show()
                  $('#searchByName').hide()
                }
              })
              $('#about_pdb').on('click', function () {
                if ($('#uniprot').is(':visible')) {
                  $('#uniprot').hide()
                  $('#searchByName').hide()
                  $('#gallery').show()
                } else if ($('#gallery').is(':visible')) {
                  $('#searchByName').show()
                  $('#gallery').hide()
                } else {
                  $('#gallery').show()
                  $('#searchByName').hide()
                }
              })
            }

        } else { // DNA or RNA (no accession)
          $("#structureviewerexplanation").html(short_name + "</a> structure from <a title='About PDB ID'>PDB " + pdbId + "-" +
            chainId + "</a> (" + score + "% sequence identity)");
        }

      } else {

        $("#accession_link").text(AQUARIA.preferred_protein_name);
        //$("#help3D").hide();

      }


    };

    AQUARIA.explainTitle = function(accession, uniprotName, pdbName, pdbId, chainId, score, evalue) {
      var precisiontxt, quality, qualClass, Log10E, evalueString;
      Log10E = -Math.log(evalue) / Math.LN10;
      var precision = (BioScience_PlantDisease_Weibull_model(Log10E) * 100);
      precision = Math.round(precision);
      console.log("AQUARIA.explainTitle -Log10e: " + Log10E + " precision: " + precision);
      evalueString = evalue.replace(/e(.*)$/, " &times <nobr>10<sup>$1</sup></nobr>");
      if (evalue == 0 && precision == 1) {
        precisiontxt = "close to 100";
      } else {
        precisiontxt = "&#8805; " + precision;
      }
      if (evalue > 10E-72) {
        quality = "in the twilight zone";
        qualClass = "twilight";
      } else {
        quality = "high quality";
        qualClass = "high";
      }
      var msgTxt = "<p>What you see in the 3D viewer is the experimentally-determined structure of " + pdbName + " from <a href='http://www.rcsb.org/pdb/explore.do?structureId=" + pdbId +
        "' target='_blank'>PDB entry " + pdbId + "</a>, chain " + chainId + ".</p>";
      msgTxt += "<p>The full-length sequence of the protein you specified (" + uniprotName + ") has been aligned onto the sequence used to determine this PDB structure.</p>";
      msgTxt += "Overall, the two sequences align with " + score + "% identity; any amino acid substitutions are indicated using dark coloring (see legend).</p>";
      msgTxt += "<p class='quality " + qualClass + "'>This alignment has an HHblits E-value of " + evalueString + ", which is considered to be " + quality +
        ". Based on cross-validation, the likelihood that your specified protein (" + uniprotName + ") adopts a structure similar to that shown is estimated to be " + precisiontxt + "%.</p>";
      msgTxt += "<p>Note that the structure shown is taken directly from the PDB; it has not been derived by ab-initio or comparative modeling.</p>";
      showBubble(msgTxt);
    };

    // To the best of my knowledge this code is correct.
    // If you find any errors or problems please contact
    // me directly using zunzun@zunzun.com.
    //
    //		      James

    function BioScience_PlantDisease_Weibull_model(x_in) {
      var temp;
      temp = 0.0;

      // coefficients
      var a = -2.9039350989124828E+00;
      var b = 7.9846661459228132E+00;
      var c = 4.4780238831200248E-01;

      temp = 1.0 - Math.exp(-1.0 * Math.pow((x_in - a) / b, c));
      return temp;
    }


    function showBubble(msgHtml) {

      $('body').append('<div class="dimmer" style="opacity: 0.08; -moz-opacity: 0.08;"></div>');
      $("span#help3D.roundButton").css("background-position", "0 -21px");
      $("div.dimmer").on("click", function() {
        $("div.popup, div.dimmer").fadeOut().remove();
        $("span#help3D.roundButton").css("background-position", "0 0");
      });

      var balloon = "<div class='balloon'><h3>3D View Explained<span class='x'>&nbsp;</span></h3>";

      balloon = balloon + msgHtml + "</div>";
      d3.select("body")
        .append("div")
        .attr("class", "popup top")
        .html(balloon);

      var popheight = $("div.popup").innerHeight();

      var fpos = $("#help3D").offset();

      var bleft = parseInt(fpos.left - 230);
      var btop = parseInt(fpos.top + 30);

      $("div.popup").css({
        "left": bleft + "px",
        "top": btop + "px"
      }).draggable().fadeIn(600);


      $("span.x").click(function() {
        $("div.popup, div.dimmer").fadeOut().remove();
        $("span#help3D.roundButton").css("background-position", "0 0");
      });
      /*
      $("div.popup").hover(function() {
      	clearTimeout(s);
      }, function() {
      	s = setTimeout(function() {
      		$("div.popup").fadeOut();
      	}, 500);
      });
      */
    }

    AQUARIA.refresh = function() {
      if (typeof AQUARIA.showMatchingStructures !== 'undefined') {
        AQUARIA.showMatchingStructures.refresh();
        featurelist.updateFeatureUI();
      }

    };

    AQUARIA.load3DAlignment = function(member, sequence) {
      //AQUARIA.e_value = member.E_value;
      AQUARIA.currentMember = member;
      AQUARIA.updateDocumentTitle(AQUARIA.preferred_protein_name,
        member.alignment_identity_score, member.pdb_id,
        member.pdb_chain[0]);

      startLogoSpin();

      //      History
      AQUARIA.fireProteinSubmitListeners(AQUARIA.preferred_protein_name, sequence.primary_accession, member.pdb_id);
      // if (AQUARIA.uniqueId !== [sequence.primary_accession, member.pdb_id, member.pdb_chain[0], currentBiounit].join('-')) {
      //   AQUARIA.panel3d.blankApplet(true, "Waiting for PDB...");
      //   AQUARIA.blankPanel("#vis", true);
      // }
      AQUARIA.panel3d.blankApplet(true, "Waiting for PDB...");
      AQUARIA.blankPanel("#featurelist", true);
      AQUARIA.blankPanel("#aboutPDB", true);
      //AQUARIA.blankPanel("#uniProtDesc", true);
      AQUARIA.remote.get_3D_alignment(member, sequence, function(newData) {
        currentBiounit = this.currentBiounit;
        console.log('AQUARIA.remote.get_3D_alignment', newData)
        AQUARIA.display_3D_structure(newData, member);

        AQUARIA.blankPanel("#vis", false);
        AQUARIA.blankPanel("#aboutPDB", false);
        AQUARIA.blankPanel("#uniProtDesc", false);
        AQUARIA.blankPanel("#featurelist", false);
        stopLogoSpin();
      });
    };

    
    // Retrieve matching structures from server or local cache
    var cache_matching_structures = cache();

    AQUARIA.display_member = function(selectedMember) {
      var data = AQUARIA.structures2match;
      // matching structures finished
      if (data.clusters && data.clusters.length > 0) {
        if (typeof selectedMember === 'undefined') {
          selectedMember = data.clusters[data.Selected_PDB.cluster_number].members[data.Selected_PDB.member_number];
        }
        AQUARIA.member = selectedMember;

        AQUARIA.load3DAlignment(selectedMember, data.sequences[0]);
      } else {
        if (typeof data.pdb_id === 'undefined') {
          AQUARIA.blankAll(true);
          //					AQUARIA.blankPanel("#aboutPDB", true);
          updateUniprotInfo(null);
          //					AQUARIA.blankPanel("#uniProtDesc", true);
          AQUARIA.showMatchingStructures.removeAll();
          //					AQUARIA.blankPanel("#vis", true);
        } else {
          AQUARIA.blankAll(true, "Cannot find protein.");
          //					AQUARIA.blankPanel("#aboutPDB", false);
          updateUniprotInfo(null);
          //					AQUARIA.blankPanel("#uniProtDesc", true);
          AQUARIA.showMatchingStructures.removeAll();
          //					AQUARIA.blankPanel("#vis", true, "Cannot find matching structures.");
        }
        console.log("AQUARIA.display_member error: cannot find matching structures.");
      }

    };
    var sequenceCallback = function(loadRequest, sequences) {
      // matching structures added found the sequence! This is the first
      // callback
      //			console.log('got sequences:' + sequences);
      if (loadRequest.primary_accession === AQUARIA.structures2match.initialLoadRequest.primary_accession) {
        AQUARIA.structures2match.sequences = sequences;
        // Somewhere here, we inappropriately clear the
        // matching structures before they are loaded
        console.log('AQUARIA.sequenceCallback initialise matching structures')
        AQUARIA.showMatchingStructures.initialise(sequences[0]);
        AQUARIA.blankPanel('#vis', true, 'Loading clusters...')
        console.log('AQUARIA.sequenceCallback update Uniprot')
        updateUniprotInfo(sequences[0]);
        console.log('AQUARIA.sequenceCallback display features')
        AQUARIA.display_features(sequences);
      } else {
        console.log('AQUARIA.sequenceCallback error: received old data for sequence callback: ' + loadRequest.primary_accession + ', which does not match requested: ' + AQUARIA.structures2match.initialLoadRequest.primary_accession);
      }
    };

    var clusterCallback = function(loadRequest, newClusters) {
      AQUARIA.structures2match.clusters = AQUARIA.structures2match.clusters.concat(newClusters);
      //			console.log('got newcluster:' + newCluster);
      // matching structures added a new cluster, lets draw it!
      // for each doesn't work on these wierd dnode arrays
      var i;
      if (loadRequest.primary_accession === AQUARIA.structures2match.initialLoadRequest.primary_accession) {

        for (i = 0; i < newClusters.length; i++) {
          AQUARIA.showMatchingStructures.addCluster(newClusters[i]);
        }
      } else {
        console.log('AQUARIA.clusterCallback error: received old data for cluster callback: ' + loadRequest.primary_accession + ', which does not match requested: ' + AQUARIA.structures2match.initialLoadRequest.primary_accession);
      }
    };


    var isLoadRequestsEqual = function(primary_accession) {
      var isEqual = false;

      if (typeof AQUARIA.structures2match !== 'undefined' && typeof AQUARIA.structures2match.initialLoadRequest !== 'undefined') {

        if (primary_accession instanceof Array && AQUARIA.structures2match.initialLoadRequest.selector instanceof Array) {
          if (primary_accession.length === AQUARIA.structures2match.initialLoadRequest.selector.length) {
            var i;
            isEqual = true;
            for (i = 0; i < primary_accession.length; i++) {
              if (primary_accession[i] !== AQUARIA.structures2match.initialLoadRequest.selector[i]) {
                isEqual = false;
                break;
              }
            }
          }
        }
      }
      return isEqual;

    };

    var onTextClick = function(d, cluster) {
      return expand_cluster(d, cluster, AQUARIA.structures2match.sequences[0]);
    };

    var loadAndUpdateHistory = function() {
      uniprot_accession = [];
      uniprot_accession.push(accessionObject.Accession);

      AQUARIA.loadAccession(uniprot_accession, null, null, false, uniprot_accession);

    }

    AQUARIA.loadAccession = function(primary_accession, autoSelectPDB,
      autoSelectChain, skip3DView, preferredProteinName) {
      preferredProteinName = preferredProteinName || "unknown";
      skip3DView = skip3DView || false;

      if (primary_accession === null) {
        //TODO here we want to revert to the initial state, e.g. no structure in the viewer
        AQUARIA.blankAll(true);
        AQUARIA.structures2match = {};
        AQUARIA.blankCount = {};
        delete AQUARIA.preferred_protein_name;
        return;
      }

      if (isLoadRequestsEqual(primary_accession)) {
        AQUARIA.blankAll(false);
        console.log('AQUARIA.loadAccession skipping: already loaded', primary_accession)
        return;
      }
      console.log('AQUARIA.loadAccession load', primary_accession)

      pdbParam = autoSelectPDB ? "/" + autoSelectPDB : "";
      var urlParams = window.location.search;
      history.pushState(primary_accession, document.title, '/' +
        primary_accession + pdbParam + urlParams);


      AQUARIA.blankPanel("#vis", true);
      AQUARIA.blankPanel("#uniProtDesc", true);

      AQUARIA.preferred_protein_name = preferredProteinName;
      AQUARIA.protein_primary_accession = primary_accession;

      //TODO this is currently being called again once the
      // structures come back (in updateUniprotInfo), but
      // is required to be called now in order to make sure
      // that AQUARIA.preferred_protein_name is being set.
      fetchSynonyms(primary_accession);

      AQUARIA.showMatchingStructures = new ShowMatchingStructures(onTextClick);

      var loadRequest = {
        selector: primary_accession,
        selectPDB: autoSelectPDB,
        selectChain: autoSelectChain
      };
      AQUARIA.structures2match = {
        initialLoadRequest: loadRequest,
        clusters: [],
        sequences: [],
        source_primary_accession: primary_accession
      };

      cache_matching_structures(primary_accession, function(primary_accession) {
        AQUARIA.remote.get_matching_structures(loadRequest, sequenceCallback, clusterCallback, function(err, loadRequest, Selected_PDB, finalClusters, cachedHit, version_string) {
          if (loadRequest.primary_accession === AQUARIA.structures2match.initialLoadRequest.primary_accession) {
            //					  AQUARIA.updateIssueEnvironment();

            if (typeof err !== undefined && err !== null) {
              if (skip3DView && err.name === "MatchingStructuresError") {
                AQUARIA.blankPanel("#vis", true, err.message);
              } else {
                AQUARIA.blankAll(true, err.message, false);
              }
            } else {
              if (finalClusters) {
                if (cachedHit) {
                  // cached hit doesn't call the callback (to avoid packet out of order), so call it manually
                  clusterCallback(loadRequest, finalClusters);
                } else {
                  AQUARIA.structures2match.clusters = finalClusters;
                }
              }

              AQUARIA.showMatchingStructures.updateSizes(AQUARIA.structures2match.clusters);
              AQUARIA.blankPanel("#vis", false);

              AQUARIA.structures2match.Selected_PDB = Selected_PDB;
              console.log('AQUARIA.cache_matching_structures applet version: ' + version_string, Selected_PDB
                );
              AQUARIA.structures2match.version_string = version_string;
              var clusterNumber = Selected_PDB.cluster_number;
              var cluster = AQUARIA.structures2match.clusters[clusterNumber];
              AQUARIA.showMatchingStructures.selectCluster(cluster,
                clusterNumber);

              if (!skip3DView) {
                if (window.threedView === 'IDR') {
                  var threeDWidth = $("#threeD").width();
                  var threeDHeight = threeDWidth;
                  threeDHeight = $("#threeDSpan").innerHeight();
                  if (threeDHeight < 570) {
                    threeDHeight = 570;
                  }
                  AQUARIA.panel3d.display_cluster(cluster, threeDWidth, threeDHeight);
                }
                AQUARIA.display_member();
              }

            }
          } else {
            console.log('AQUARIA.loadAccession error: received old data for Best PDB: ' + loadRequest.primary_accession + ', which does not match requested: ' + AQUARIA.structures2match.initialLoadRequest.primary_accession);
          }

        });
      });
    };

  } catch (error) {
    alert('Error with displaying structures: ' + error.message);
  }

  //
  // Functions to run immediately after home page DOM first finishes loading.
  //
  // Authors: Sean O'Donoghue, Kenny Sabir, Christian Stolte, Nelson Pereira, Julian Heinrich
  //

  AQUARIA.initialisePanels = function(hasUrl) {

    hasUrl = (typeof hasUrl === 'undefined') ? false : hasUrl;

    // expand and collapse UI panels
    $("div.panel.collapsible h3").click(function() {
      $(this).next("span").slideToggle(300);
      $(this).parent().toggleClass("closed");
    });
    // search tabs
    $("#tabs").tabs({
      active: 0
    }).buttonset();

    // structures/interactions/features
    $("h3.sub").click(function() {
      var panel = $(this).attr("rel"); // console.log("turning on
      // "+panel);
      $("h3.sub").addClass("inactive");
      $(this).toggleClass("inactive");
      $(".toggled").hide();
      $("#" + panel + ".toggled").toggle();
    });
    // highlight percentage sequence identity when hovering over
    // matching structure
    $(".outer_container").hover(function() {
      $(this).next("text").attr("fill", "#333");
    }, function() {
      $(this).next("text").attr("fill", "#777");
    });

    // // expand and collapse UI panels
    // $("div.panel.collapsible h3").click(function() {
    //   $(this).next("span").slideToggle(300);
    //   $(this).parent().toggleClass("closed");
    // });
    // // search tabs
    // $("#tabs").tabs({
    //   active: 0
    // }).buttonset();
    //
    // // structures/interactions/features
    // $("h3.sub").click(function() {
    //   var panel = $(this).attr("rel"); // console.log("turning on
    //   // "+panel);
    //   $("h3.sub").addClass("inactive");
    //   $(this).toggleClass("inactive");
    //   $(".toggled").hide();
    //   $("#" + panel + ".toggled").toggle();
    // });
    // // highlight percentage sequence identity when hovering over
    // // matching structure
    // $(".outer_container").hover(function() {
    //   $(this).next("text").attr("fill", "#333");
    // }, function() {
    //   $(this).next("text").attr("fill", "#777");
    // });

    $(".resizable").resizable({
      handles: "s",
      distance: 30
    });
    //$("div#psyns").html("<p>(example: <a href=\"javascript:fillin('BLK');\">BLK</a> or <a href=\"javascript:fillin('P51451');\">P51451</a>)</p>");

    // set preferred organism and synonyms, default to human (9606)
    // organism_id is used to get synonyms, preferred name is what the user
    // typed in the search field (e.g. human vs. homo sapiens)

    if (localStorage.organism_id == undefined) {
      localStorage.organism_id = 9606; // default
    }

    if (localStorage.preferred_organism_name == undefined) {
      localStorage.preferred_organism_name = "Human"; // default
    }

    if (!hasUrl) {
      AQUARIA.remote.getOrganismSynonyms([{
        "organism_id": localStorage.organism_id
      }], displayOrgSynonyms);
    }

    // set up autocomplete for organism names
    var cache_organism_synonyms = {};
    $("#organism_syn_input").autocomplete({
      source: function(request, response) {
        var labelValues;
        var term = request.term;
        if (term in cache_organism_synonyms) {
          response(cache_organism_synonyms[term]);
          return;
        };
        startLogoSpin();
        AQUARIA.remote.queryOrganism(term, function(data) {
          stopLogoSpin();
          if (data.length > 0) {

            labelValues = $.map(data, function(item) {
              return {
                label: item.Synonym,
                value: item.Synonym,
                id: item.Organism_ID
              };
            });

            cache_organism_synonyms[term] = labelValues;
          } else {
            labelValues = {
              label: "No organisms for: " + term,
              value: 0
            };
          }
          response(labelValues);
        });
      },
      //focus : function() {
      //AQUARIA.blankAll(true);
      //},
      close: function(event, ui) {
        if (event.handleObj.type === 'menuselect') { // user selected an item
          // handled in select()
        } else if (event.handleObj.type === 'keydown' && event.keyCode === $.ui.keyCode.ESCAPE) { // user escaped
          $(this).val("");
          AQUARIA.blankAll(false);
        }
      },
      minLength: 1,
      delay: 100,
      mustMatch: true,
      autoFocus: true,
      // still to add: an 'autoFill function - See
      // http://www.pengoworks.com/workshop/jquery/autocomplete.htm
      // focus: function autoFill(event, ui){
      // if the last user key pressed was backspace, don't
      // autofill
      // if( lastKeyPressCode != 8 ){
      // // fill in the value (keep the case the user has typed)
      // $input.val($input.val() + sValue.substring(prev.length));
      // // select the portion of the value not typed by the user
      // (so the next character will erase)
      // createSelection(prev.length, ui.item.value.length);
      // }
      // };
      // should use syntax like below
      // focus: function(event, ui) {
      // var:
      // $('#organism_syn_input').val(ui.item.value);
      // },
      select: function(event, ui) {
        if (ui.item.value &&
          ui.item.value.indexOf("No organisms for: ") !== 0) {
          if (ui.item.id !== localStorage.organism_id) {
            AQUARIA.remote.getOrganismSynonyms([{
              "organism_id": ui.item.id
            }], function(orgNames) {
              localStorage.organism_id = ui.item.id;
              localStorage.preferred_organism_name = ui.item.value;
              displayOrgSynonyms(orgNames);
            });

            AQUARIA.loadAccession(null);
            $("#protein_syn_input").focus();
          }
        } else {
          event.preventDefault();
        }
      }
    }).on('focus', function() {
      $("#organism_syn_input").val(localStorage.preferred_organism_name);
      AQUARIA.blankAll(true, "Please specify an organism.");
      //					$(this).autocomplete("search");
      $(this).select();
    }).on('input', function() {
      AQUARIA.blankAll(true, "Please specify an organism.");
    });

    //		$("#organism_syn_input").autocomplete();
    // set up autocomplete for protein names
    var cache_protein_synonyms = {};

    /*
     * //History // get last input from localStorage $(
     * "#protein_syn_input" ).focus( function(){
     * $(this).autocomplete({ source: proteinTopTen.getTop(),
     * minLength:0, delay:0 }) });
     */

    $.widget("custom.catcomplete", $.ui.autocomplete, {
      _create: function() {
        this._super();
        this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
      },
      _renderMenu: function(ul, items) {
        var that = this,
          currentCategory = "";
        $.each(items, function(index, item) {
          var li;
          if (item.category && item.category != currentCategory) {
            ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
            currentCategory = item.category;
          }
          li = that._renderItemData(ul, item);
          if (item.category) {
            li.attr("aria-label", item.category + " : " + item.label);
          }
        });
      },
      _renderItem: function(ul, item) {
        var label = item.label;
        if (item.suffix) {
          label += ' <span class="auto_complete_identifier">(' + item.suffix + ")</span>";
        }
        return $("<li>")
          .append("<a>" + label + "</a>")
          .appendTo(ul)
      }
    });
    var proteinAutocomplete = $("#protein_syn_input");
    proteinAutocomplete.catcomplete({
      source: function(request, response) {
        var term = request.term;

        var getLRU = function() {
          return proteinTopTen.getAll().map(function(item) {
            return {
              label: item.name,
              suffix: item.primary_accession + ", " + item.pdb_id,
              value: item.name,
              type: 'LRU',
              category: 'Recent',
              id: item.primary_accession + "/" + item.pdb_id
            }
          })
        }

        var callbackData = {
          names: [],
          ids: [],
          pdbIDs: [],
          LRU: getLRU()
        }

        var collectResponse = function() {
          var lruMatches = callbackData.LRU;
          if (lruMatches.length > 0 && term && term.length > 0) {
            lruMatches = lruMatches.filter(function(val) {
              return val.label.toLowerCase().startsWith(term.toLowerCase());
            });
          }
          var showPopup = true;
          var allValues = lruMatches.concat(callbackData.names).concat(callbackData.ids).concat(callbackData.pdbIDs);
          if (allValues.length === 0) {
            if (term && term.length > 0) {

              allValues = [{
                label: "No structures for: " + term,
                value: 0
              }];
            } else {
              showPopup = false;
            }
          }
          console.log('AQUARIA.proteinAutocomplete received', allValues)
          cache_protein_synonyms[protein_synonym_plus_organism_id] = allValues;
          if (showPopup) {
            response(allValues);
          }

        }

        console.log('AQUARIA.proteinAutocomplete searching "' + term + '"')

        if (term == "") {
          collectResponse();
          // History
          /*
          		 console.log("focussed: "+proteinTopTen.getTop());
          		 labelValues = $.map(proteinTopTen.getTop(),
          		 function (item) { return { label: item.name,
          		 value: item.name, id: item.primary_accession };
          		 }); response(labelValues);
           */
          //AQUARIA.blankAll(true);
        } else {
          var protein_synonym_plus_organism_id = term + '%' +
            localStorage.organism_id;
          if (protein_synonym_plus_organism_id in cache_protein_synonyms) {
            response(cache_protein_synonyms[protein_synonym_plus_organism_id]);
            return;
          };
          startLogoSpin();


          AQUARIA.remote
            .queryProtein(
              term,
              localStorage.organism_id,
              function(nameData) {
                var labelValues;
                stopLogoSpin();
                labelValues = $.map(nameData,
                  function(item) {
                    return {
                      label: item.Synonym,
                      suffix: null,
                      value: item.Synonym,
                      type: 'Synonym',
                      category: "Names",
                      id: item.Primary_Accession
                    };
                  });
                labelValues.sort(function(a, b) {
                  return a.label > b.label ? 1 : -1;
                });
                labelValues.reduce(function(previous, current) {
                  var a = previous;
                  var b = current;
                  if (a && a.value === b.value) {
                    if (a.dup) {} else {
                      a.suffix = a.id,

                        a.dup = true;
                    }
                    if (b.dup) {} else {
                      b.suffix = b.id,
                        b.dup = true;
                    }
                  }
                  return current;
                }, null);
                callbackData.names = labelValues;
                collectResponse();
              },
              function(idData) {
                var labelValues;
                stopLogoSpin();
                labelValues = $.map(idData,
                  function(item) {
                    var suffix = item.Source_Field;
                    if (suffix === 'AC' || suffix === 'ID') {
                      suffix = 'UniProt';
                    }
                    return {
                      label: item.Synonym,
                      suffix: suffix,
                      value: item.Synonym,
                      type: suffix,
                      category: "Identifiers",
                      id: item.Primary_Accession
                    };
                  });
                labelValues.sort(function(a, b) {
                  return a.label > b.label ? 1 : -1;
                });
                //                    labelValues.reduce(function (previous, current) {
                //                      var a = previous;
                //                      var b = current;
                //                      if (a && a.value === b.value) {
                //                        if (a.dup) {} else {
                //                          a.suffix = a.id,
                //
                //                          a.dup = true;
                //                        }
                //                        if (b.dup) {} else {
                //                          b.suffix = b.id,
                //                          b.dup = true;
                //                        }
                //                      }
                //                      return current;
                //                    }, null);
                callbackData.ids = labelValues;
                collectResponse();
              },
              function(pdbData) {
                var labelValues;
                stopLogoSpin();
                labelValues = $.map(pdbData,
                  function(item) {
                    return {
                      label: item.Synonym,
                      suffix: 'PDB',
                      type: 'PDB',
                      value: item.Synonym,
                      category: item.Category,
                      id: item.Synonym
                    };
                  });
                callbackData.pdbIDs = labelValues;
                collectResponse();
              });

        }
      },

      close: function(event, ui) {
        if (event.handleObj.type === 'menuselect') { // user selected an item
          // handled in select()
        } else if (event.handleObj.type === 'keydown' && event.keyCode === $.ui.keyCode.ESCAPE) { // user escaped
          $("#organism_syn_input").val("");
          if (typeof AQUARIA.structures2match.Selected_PDB === 'undefined') { // no structure loaded yet, keep panels blanked
            AQUARIA.blankAll(true);
          } else {
            AQUARIA.blankAll(false);
          }
        }
        $(this).val("");
      },
      //focus : function() {
      //AQUARIA.blankAll(true);
      //},
      /*
      		search : function(event, ui) {
      			if ($(this).val().length > 0) {
      				AQUARIA.blankAll(true);
      			} else {
      				AQUARIA.blankAll(false);
      			}
      		},
       */
      minLength: 0,
      autoFocus: true,
      delay: 300,
      // user has selected an item from the autocomplete list
      select: function(event, ui) {
        if (ui.item.value &&
          ui.item.value.indexOf("No structures for: ") !== 0) {
          var primaryAccession = ui.item.id;
          var pdb_id = null;
          if (primaryAccession.indexOf('/') > -1) {
            var parts = primaryAccession.split('/');
            primaryAccession = parts[0];
            pdb_id = parts[1];
          }
          if (ui.item.type === 'PDB') {
            console.log('AQUARIA.proteinAutocomplete.select pdb', ui.item.value);
            AQUARIA.blankAll(true, "Waiting for data...");
            var chain = null;
            AQUARIA.remote.getAccessionForPDB(ui.item.value, chain, function(accessionObject) {
              AQUARIA.loadAccession([accessionObject.Accession], ui.item.value, null, false, accessionObject.Accession);

            })
          } else if (ui.item.id == AQUARIA.protein_primary_accession) {

            if (ui.item.value == AQUARIA.preferred_protein_name) {
              AQUARIA.blankAll(false);
              // do nothing
              return;
            } else {
              console.log('AQUARIA.proteinAutocomplete.select same protein, different name', ui.item.value);

              AQUARIA.preferred_protein_name = ui.item.value;
              AQUARIA.remote.getProteinSynonyms(AQUARIA.protein_primary_accession, localStorage.organism_id, displayProtSynonyms, null);
              AQUARIA.update3DTitle(AQUARIA.structures2match.source_primary_accession,
                currentData.pdb_id, AQUARIA.currentChain, AQUARIA.molecule_name, AQUARIA.currentMember.alignment_identity_score);
              AQUARIA.updateDocumentTitle(AQUARIA.currentMember.alignment_identity_score, currentData.pdb_id, AQUARIA.currentChain);
              featurelist.updateFeatureTabTitle(AQUARIA.preferred_protein_name);
            }
          } else {
            console.log('AQUARIA.proteinAutocomplete.select new protein', ui.item.value);
            AQUARIA.blankAll(true, "Waiting for data...");
            AQUARIA.loadAccession([primaryAccession], pdb_id, null, false, ui.item.value);
          }


          $("#organism_syn_input").val("");
          $(this).val("");



        } else {
          event.preventDefault();
        }
      }
    }).on('input', function(event) {
      if ($(this).val().length > 0 || typeof AQUARIA.structures2match.Selected_PDB === 'undefined') {
        AQUARIA.blankAll(true);
        $("#organism_syn_input").val(localStorage.preferred_organism_name);
      } else {
        AQUARIA.blankAll(false);
      }

    }).on('focus', function() { // blank on initial focus
      if ($(this).val().length > 0 || typeof AQUARIA.structures2match.Selected_PDB === 'undefined') {
        AQUARIA.blankAll(true);
      }
      $(this).data('customCatcomplete').search('');
    });

    //		proteinAutocomplete.on('focus', );
    if (!hasUrl) {
      $("#protein_syn_input").focus();
    }

    // Aquaria page view model
    /* NOT USED ? 
    var ViewModel = function(protein_syn, organism_syn, organism) {
    	this.protein_synonym = ko.observable('', {
    		persist : 'protein_synonym'
    	});
    	this.organism_synonym = ko.observable('Human', {
    		persist : 'organism_synonym'
    	});
    	this.organism_id = ko.observable('9606', {
    		persist : 'organism_id'
    	});
    };
    // ko.applyBindings(new ViewModel()); // This makes Knockout get
    // to work
     */

  }; /* AQUARIA.initialisePanels() */


  //
  // Functions to run the first time the nowjs socket connection is ready.
  //
  //

  var remoteSuccess = function(remote) {
    AQUARIA.remote = remote;
    if (initialised) {
      console.debug("domready.ready called again!");
      return;
    }

    console.log("AQUARIA.remoteSuccess socket connection is ready");

    initialised = true;

    if (!window.console)
      console = {
        log: function() {}
      };
    var uniprot_accession;
    // when 'now' socket is ready, fetch structures if URL specifies
    // a Primary_Accession
    var pathname = document.URL.split('?')[0];
    if (typeof window.initialParams !== 'undefined') {
      AQUARIA.initialisePanels(true);
      uniprot_accession = [];
      uniprot_accession.push(window.initialParams.primary_accession);
      AQUARIA.loadAccession(uniprot_accession, window.initialParams.pdb_id, window.initialParams.pdb_chain);
    } else if (pathname
      .match(/\/(?:leap\/)?([A-Z][0-9][A-Z,0-9][A-Z,0-9][A-Z,0-9][0-9])\/?$/)) {
      uniprot_accession = [];
      uniprot_accession.push(RegExp.$1);
      AQUARIA.initialisePanels(true);
      AQUARIA.blankAll(true, "Waiting for data...")
      AQUARIA.loadAccession(uniprot_accession);
    } else if (pathname
      .match(/\/(?:leap\/)?([a-zA-Z0-9]{30,})\/?$/)) {
      uniprot_accession = RegExp.$1;
      AQUARIA.initialisePanels(true);
      AQUARIA.blankAll(true, "Waiting for data...")
      AQUARIA.loadAccession(uniprot_accession);
      // primary accession and pdb
    } else if (pathname
      .match(/\/(?:leap\/)?([A-Z][0-9][A-Z,0-9][A-Z,0-9][A-Z,0-9][0-9])\/([0-9]([a-z,0-9][a-z,0-9])[a-z,0-9])\/?$/)) {
      uniprot_accession = [];
      uniprot_accession.push(RegExp.$1);
      var pdb = RegExp.$2;
      AQUARIA.initialisePanels(true);
      AQUARIA.blankAll(true, "Waiting for data...")
      AQUARIA.loadAccession(uniprot_accession, pdb);
      // primary accession and pdb and chain
    } else if (pathname
      .match(/\/(?:leap\/)?([A-Z][0-9][A-Z,0-9][A-Z,0-9][A-Z,0-9][0-9])\/([0-9]([a-z,0-9][a-z,0-9])[a-z,0-9])\/([a-zA-Z,0-9])?$/)) {
      uniprot_accession = [];
      uniprot_accession.push(RegExp.$1);
      var pdb = RegExp.$2;
      var chain = RegExp.$4;
      console.log('AQUARIA.remoteSuccess inside chain selection');
      AQUARIA.initialisePanels(true);
      AQUARIA.blankAll(true, "Waiting for data...")
      AQUARIA
        .loadAccession(uniprot_accession, pdb, chain);
    } else if (pathname.match(/\/([A-Za-z]+)/)) {
      //uniprot_accession = RegExp.$1;
      // History: 
      // [JH] matches the URL and tries to load it as accession
      // not sure if we need this for the history in the search box?
      //AQUARIA.loadAccession(uniprot_accession);
      AQUARIA.initialisePanels(false);
    } else {
      AQUARIA.initialisePanels(false);
    }


  };

  var setupDNode = function() {
    var url = window.location.protocol + '//' + window.location.hostname + ':8010/dnode'
    var stream = shoe(url)
    try {
      var dnodeConnection = dnode();
      dnodeConnection.on('end', function(end) {
        console.log("AQUARIA.setupDNode dnodeConnection LOST!");
        setTimeout(setupDNode, 1000);
      });
      dnodeConnection.on('error', function(end) {
        console.log("AQUARIA.setupDNode dnodeConnection ERROR! Will retry in 1 second. " + end);
        setTimeout(setupDNode, 1000);
      });
      dnodeConnection
        .on(
          'remote', remoteSuccess
        );
      dnodeConnection.pipe(stream).pipe(dnodeConnection);
    } catch (error) {
      alert('AQUARIA.setupDNode error: setting up dnode.ready(). Will retry in 10 seconds: ' + error.message);
      setTimeout(setupDNode, 10000);
    }

  }

  domready(function() {
    if (window.threedViewer === 'applet') {
      AQUARIA.panel3d = new Applet3DPanel('#threeDSpan');
    } else if (window.threedViewer === 'jolecule') {
      AQUARIA.panel3d = new JoleculePanel('#threeDSpan', AQUARIA.chainSelected);
      console.log("THIS WORK: AQUARIA.JS 1", AQUARIA.panel3d);
    } else if (window.threedViewer === 'webgl') {
      AQUARIA.panel3d = new PV3DPanel('#threeDSpan');
    } else if (window.threedViewer === 'idr') {
      AQUARIA.panel3d = new IDRPanel('#threeDSpan');
    } else {
      console.log('AQUARIA.domready cannot find viewer: ' + window.threedViewer);
    }
    AQUARIA.gesture = new molecularControlToolkitJS.leap(AQUARIA.panel3d.gestures());

    setupDNode();
  });

})(jQuery);
AQUARIA.margin = {
  top: 10,
  right: 20,
  bottom: 20,
  left: 10
};

AQUARIA.launchURL = function(url) {
  window.open(url, '_blank');
};

AQUARIA.chainSelected = function(primaryAccession, pdbId, chainId) {
  console.log('AQUARIA.chainSelected ' + primaryAccession + ', for pdb chain: ' +
    pdbId + ":" + chainId);
  uniprot_accession = [];
  uniprot_accession.push(primaryAccession);
  AQUARIA.currentChain = chainId;

  // TODO THis shouldn't call load Accession because that loads everything as if it is the first time.
  // in this case, we just want to load matching structures and the protein, and leave the 3d context.
  AQUARIA.loadAccession(uniprot_accession, pdbId, chainId, true);

  if ("pdb_data" in AQUARIA) {
    updatePDBChain(pdbId, chainId, AQUARIA.currentMember.alignment_identity_score, AQUARIA.pdb_data.Organism[primaryAccession]);
  }
};

AQUARIA.structures2match = {};
AQUARIA.blankCount = {};
AQUARIA.currentMember = null;


AQUARIA.blankPanel = function(panel, isOn, message) {
  var name = panel + ' .blank';

  if (isOn) {
    if ($(name).length === 0) {
      console.log("AQUARIA.blankPanel " + panel + ": " + isOn);
      if (message) {
        $(panel).append(
          '<div class="blank hidden"><br><p class="centered">' + message +
          '</p></div>');

      } else {
        $(panel).append('<div class="blank hidden"></div>');
      }
      $(name).fadeIn("fast");
      $(name).css('height', $(panel).css('height'));
    }
  } else {
    console.log("AQUARIA.blankPanel " + panel + ": " + isOn);
    $(name).fadeOut("slow", function(obj) {
      $(name).remove();
    });
  }

};

AQUARIA.blankAll = function(isOn, message) {
  console.log("AQUARIA.blankAll", isOn, message);
  var messageDisplay = message || "Please specify a " + localStorage.preferred_organism_name + " protein.<br><br>Or, specify a new default organism.";
  AQUARIA.panel3d.blankApplet(isOn, messageDisplay);
  AQUARIA.blankPanel("#vis", isOn);
  AQUARIA.blankPanel("#aboutPDB", isOn);
  AQUARIA.blankPanel("#uniProtDesc", isOn);
  AQUARIA.blankPanel("#featurelist", isOn);
};

window.ATL_JQ_PAGE_PROPS = {
  //  window.ATL_JQ_PAGE_PROPS = $.extend(window.ATL_JQ_PAGE_PROPS, {
  '0add5080': {
    "triggerFunction": function(showCollectorDialog) {
      //Requries that jQuery is available! 
      jQuery("#issuesButton").click(function(e) {
        e.preventDefault();
        showCollectorDialog();
      });
    },
    environment: function() {
      var version = window.AQUARIA.structures2match ? window.AQUARIA.structures2match.version_string : 'unknown';
      return {
        'Applet Version': "" + version,
        'Location': window.location.href
      };
    }

  },
  '5ee9f010': {
    "triggerFunction": function(showCollectorDialog) {
      //Requries that jQuery is available! 
      jQuery("#feedbackButton").click(function(e) {
        e.preventDefault();
        showCollectorDialog();
      });
    }
  }
};
//};