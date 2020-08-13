var Applet3DPanel = function (attachToDiv) {

	this.initialised = false;
	this.load  =  function(attributes) {

		var parameters = {
				jnlp_href: '/jnlp/' + attributes['versionString'] + '/aquaria.jnlp',
				cache_option:"plugin", 
				cache_archive:"aquaria-bundle.jar",
				cache_version: attributes['versionString'], 
				codebase_lookup: false
		}; 
		if (attributes['interactive'] && attributes['interactive'] == 'leap') {
			parameters['jnlp_href'] = '/jnlp/' + attributes['versionString'] + '/aquaria-leap.jnlp'
		}
		activateApplet(attributes, parameters);
		AQUARIA.uniqueId = [attributes.instanceId, attributes.biounit].join('-');

		// dim background when applet has focus
		var existingOnFocus = document.applets[0].onfocus;
		// var frame = $("#threeDFrame")[0];
		var target = window;
		document.applets[0].onfocus = function() {
			$(".infocus").removeClass("infocus"); 
			$("#structureviewer").addClass("infocus");
			if (existingOnFocus) {
				existingOnFocus();
			}
			console.log('setup window keydown');
			$(target).keydown(function(e) {
				console.log("key down: " + e);
				// e.preventDefault();
			});
			$(target).keypress(function(e) {
				console.log("key press: " + e);
				// e.preventDefault();
			});
		};

		// brighten background when applet does not have focus
		document.applets[0].onblur = function() {
			$("#structureviewer").removeClass("infocus");
			console.log('clear window keydown');
			$(target).keydown(null);
			$(target).keypress(null);
		};
		
		//return focus to applet when header bar is clicked
		$("div#structureviewer.panel").click( function() { $("applet#AquariaApplet").focus(); });
		
		
		this.initialised = true;
	};

	this.reload =  function(attributes) {
	  var newUniqueId = [attributes.instanceId, attributes.biounit].join('-');
;
		if (AQUARIA.uniqueId !== newUniqueId) {

			if (attributes.annotations) {
				document.applets[0].loadNew(attributes.pdb_id, attributes.structures, attributes.instanceId, attributes.sequenceAlignments, attributes.annotations);
			}
			else {
				document.applets[0].loadNewPlain(attributes.pdb_id, attributes.structures, attributes.instanceId, attributes.sequenceAlignments);

			}
			AQUARIA.uniqueId = newUniqueId;
		}
		else {
		  this.blankApplet(false);

			console.log('redisplaying PDB: ' + AQUARIA.uniqueId);
		}
	};


	this.addAnnotation = function(id, annotationName, featureColours,		featureNames, featureDescriptions, featurePositions, featureURLs, featureURLTexts) {
		document.applets[0].addAnnotation(id, annotationName, featureColours,		featureNames, featureDescriptions, featurePositions, featureURLs, featureURLTexts);
	};

	this.removeAnnotation = function(id, annotationName) {
		document.applets[0].removeAnnotation(id, annotationName);
	};


	this.gestures = function () {
	  var functions = ['triggerPan', 'triggerRotate', 'triggerZoom', 'point', 'reset', 'zoomToSelection', 'selectMouseCursor'];
	  var ret = {};
	  functions.forEach(function (funcName) {
	    ret[funcName] = function () {
	      var newArgs = [funcName];
	      newArgs.push(Array.prototype.slice.call(arguments));
	      if (funcName === 'triggerRotate') {
	        console.log('about to call: ' + newArgs);
	      }
	      if (document.applets[0]) {
	        document.applets[0].molecularControlToolkit.apply(document.applets[0], newArgs);
	      }
	    }
	  })
	  return ret;
	}


	//see https://forums.oracle.com/message/5523095
	function activateApplet(attributes, parameters)
	{ 
		var intercepted = ''; 
		var got = document.write;
		document.write = function(arg){intercepted += arg;};
		deployJava.runApplet(attributes, parameters, '1.6');
		document.write = got;
		$(attachToDiv).html(intercepted);
	}


	AQUARIA.modelFinishedLoading = function() {
		console.log('model finished loading!');
		AQUARIA.panel3d.blankApplet(false);
		$("#wait").hide(); 
		// tweek for safari on mac. the sequence & annotation 3D hangs otherwise
		// setTimeout(function() {
		// 	AQUARIA.changeAppletSize();
		// }, 500);
	};

	AQUARIA.appletResiduesSelected = function() {
		console.log('residues selected');
	};

	this.blankApplet = function(isOn, message, clear) {
	  // AQUARIA.changeAppletSize();
		var name = "applet";
		var appletMessage = $('#waitingFrame').contents().find('#appletMessage');
		var clearMessage = typeof clear === 'undefined' ? true : clear;
		message = message || "Please wait...";
		
		if (isOn) {
			console.log("blanking " + name + " with message: " + message);
			if (clearMessage) {
				appletMessage.html(message);
			} else {
				appletMessage.html(appletMessage.html() + "<br>" + message);
			}
			if (!$('#waitingFrame').is(":visible")) {
				$('#waitingFrame').hide();
				$('#waitingFrame').fadeIn("fast");
			}
		}
		else {
			console.log("unblanking " + name);
			$('#waitingFrame').fadeOut("slow");
		}
	};
	

	this.generateAttributes = function(threeDWidth, threeDHeight, pdb_id, pdb_chain, biounit, source_primary_accession, sequences, common_names, pssh_alignment, links, transform, conservations, versionString) {

		var instanceIds = [];
		var sequencesText = [];
		var annotations = [];
		var accessionsUsed = {};
		$("#threeD").css("visibility", "visible");
		console.log('common_names: ' + common_names);
		for (var i in pdb_chain) {
			var primary_accession = sequences[i].primary_accession;
			var instanceId = primary_accession + '-' + pdb_id + '-' + pdb_chain[i];
			instanceIds.push(instanceId);
			if ( accessionsUsed[primary_accession]) {
				// already have annotations for this accession skip it!
			}
			else {
				accessionsUsed[primary_accession] = 1; 
				var sequenceText = primary_accession + ',' + common_names[i] + ',REFERENCE,' + sequences[i].sequence;
				sequencesText.push(sequenceText);

			}
		}
		var interactive = null;
		if (document.URL.indexOf('/leap') > -1) {
			interactive = 'leap';
		}
		var url = "https://files.rcsb.org/download/" + pdb_id + ".pdb.gz";
		if (biounit > 0) {
			url = "https://files.rcsb.org/download/" + pdb_id + ".pdb" + biounit + ".gz";
		}

		var attributes = {
				structures: 'structures{' + pdb_id + "," + url + ",," + transform + ";}", // NEED THIS
				width:threeDWidth, 
				height:threeDHeight,

				pdb_id: pdb_id,
				//      		source_primary_accession: source_primary_accession,
				interactive: 'leapjs',
				instanceId: instanceIds[0],
				sequenceAlignments: 'sequences{' + sequencesText.join(';') + '} matches{' + pssh_alignment +"}", // NEED THIS
				code:'Capture',  
				biounit: biounit,
				java_arguments: '-Dsun.java2d.noddraw=true',
				scriptable: 'false',
				cache_option:"plugin", 
				cache_archive:"aquaria-bundle.jar",
				cache_version:"0.1", 
				gl_swap_interval: '1',
				gl_debug: 'false',
				transform: transform,
				gl_trace: 'false',
				id: 'AquariaApplet',
				annotationView: 'on',
				toolbar: 'off',
				versionString: versionString,
				sequenceView: 'on',
				expertMode: 'on',
				defaultStyle: 'Homology', // NEED THIS
				// applet.links = 'SWISSPROT,SWS:http:wgetz?-id+PERMtest+-e+[swissprot-acc:###];PIR:http://pir.georgetown.edu:80/cgi-bin/nbrfget?xref=1&id=###';
		};
		if (annotations.length > 0) {
			attributes['annotations'] = annotations.join(' ');
		}

		console.log("ATTRIBUTES");
		for (var key in attributes) {
			console.log(key + '="' + attributes[key] +'"');
		}
		return attributes;
	};


	var oldWidth = $('#threeD').width();
	//changeAppletSize(oldWidth,570);



	function redrawSVG(wi) {
		if (wi != oldWidth) { 
			console.log("redrawing SVG to "+wi+ " wide");
			oldWidth = wi;  // keep track of width, so we don't redraw too often
			AQUARIA.refresh();


		}	
	}

	
	this.changeViewerSize = function(w, h) {

	  var threed = $("#threeDSpan");
	  var applet = $(threed).find("applet"); 
	  applet.css('width', w);
	  applet.css('height', h);
	  applet.attr('width', parseInt(w));
	  applet.attr('height', parseInt(h));
	  threed.css("width",  w);
	  threed.css("height",  h);
	}
};




module.exports = Applet3DPanel;
