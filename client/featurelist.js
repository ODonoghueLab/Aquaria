var featureSet;
var width;
var height;
var featureCount;
var groupCount;

function createFeatureUI() {
	width = document.getElementById("structureviewer").offsetWidth
			- AQUARIA.margin.right - AQUARIA.margin.left; // console.log("width:
	// "+width);
	height = 40 - AQUARIA.margin.top - AQUARIA.margin.bottom + 35; // height
	// for one
	// structure

};

function updateFeatureTabTitle(preferredProteinName) {
	if (preferredProteinName !== "unknown") {
		// $("#featureExplanation").text(" for " + preferredProteinName);
	}
};

var updateFeatureUI = function(featureList) {
	featureSet = featureList || featureSet;
	console.log("featurelist.updateFeatureUI");

	$("#featurelist div").remove(); // remove old contents
//	$("#featureExplanation").text(" Loading...");
//	$("#featureCounter").html("<img src='/images/89.GIF'/>").show();

	// draw axis ruler
	AQUARIA.showMatchingStructures.drawAxisRuler("featurelist");

	createFeatureUI();
	featureCount = 0;
	groupCount = 0;
	var clusters = [];
	var addedFeatures = [];
	var orderedFeatures = [];
	//Group by feature source
	  var groupedFeatures = _.groupBy(featureSet, function(feature) {
		return feature.Server;
	  });
	
	//Store as an object 
	  groupedFeatures = Object.keys(groupedFeatures).map(function(key) {
		return [String(key), groupedFeatures[key]];
	  });
	
	  for ( var key in featureSet) {
			clusters.push(featureSet[key]);
	  }
	
	//Reorder grouped features
	if((window.localStorage.getItem("featureOrder")) && (window.localStorage.getItem("featureOrder").split(",").length >= groupedFeatures.length)){
	  var featureOrder = window.localStorage.getItem("featureOrder").split(",")
	  for ( var key in featureOrder){
		for(var k = 0; k < groupedFeatures.length; k++){
		  if(groupedFeatures[k][0] == featureOrder[key]){
			orderedFeatures[key] = groupedFeatures[k]
		  }
		}
	  }
	  groupedFeatures = orderedFeatures
	}
	
	
	  var featureDiv = d3.select("#featurelist").append("div").attr("id", "featureContainer").append("div").attr("id", "groupedFeatures")
  
	  for ( var key in groupedFeatures) {
	  //Feature Collection Header
	  var featureHeader = featureDiv.append("div").attr("id", groupedFeatures[key][0]).attr("class", "featureCollection")
	  if(groupedFeatures[key][0] == "UniProt" || groupedFeatures[key][0] == "CATH" || groupedFeatures[key][0] == "SNAP2" || groupedFeatures[key][0] == "PredictProtein"){
		featureHeader = featureHeader.html("<div class='featureHeader'><p class='expand'>►</p><p class='featureName'>" + groupedFeatures[key][0] + "</p><div class='info'>?</div></div><span class='tooltiptext'>" + groupedFeatures[key][1][0]["About"] + "</span>")
	  }
	  else{
		featureHeader = featureHeader.html("<div class='featureHeader'><p class='expand'>►</p><p class='featureName'>" + groupedFeatures[key][0] + "</p><div class='info'>?</div><button id='remove' class='featureButtons'>Remove</button></div><span class='tooltiptext'>" + groupedFeatures[key][1][0]["About"] +"</span>")
	  }
		//Feature tracks
		featureHeader.append("div").attr("class", "featureTrack")
				.selectAll("div")
				.data(groupedFeatures[key][1])
				.enter()
				.append("div")
				.attr("class", "track")
				.html(
						function(d) {
							if (d.Type != ''){
							  if(d.Server == "UniProt" || d.Server == "PredictProtein" || d.Server == "CATH" || d.Server == "SNAP2"){
								  var source = "Curated Features"
				  }
				  else{
					source = d.Server
				  }
								return "<p style='font-size: calc(9px + 0.1vw);'><b>"
									+ d.Category
									+ "</b> ("
									+ d.Type.replace(/_/g, " ")
									+ ") <span class='source'>"
									+ source
									+ "</span></p>";
							} else {
								if(d.Server == "UniProt" || d.Server == "PredictProtein" || d.Server == "CATH" || d.Server == "SNAP2"){
									source = "Curated Features"
				  }
				  else{
					source = d.Server
				  }
								return "<p><b>"
									+ d.Category
									+ "</b> <span class='source'>"
									+ source
									+ "</span></p>";
							}
			  }).each(drawTrack);
			  
	//	if (AQUARIA.preferred_protein_name !== "unknown") {
	//		updateFeatureTabTitle(AQUARIA.preferred_protein_name);
	  }
	  $("#featureCounter").show();
			if (featureCount > 0) {
				$("#featureCounter").text(featureCount);
				$("#featureCounter").digits();
	//			$("#waitForFeatures").hide();
				var scrollToggle = "<p id='scrollToggle'><a href='javascript:$(\"#featureContainer\").toggleClass(\"noscroll\");'>Toggle scrolling</a></p>";
				$("#featureContainer").append(scrollToggle);
			}
			else{
				$("#featureCounter").text(featureCount);
			}
	//		else { $("#featureCounter").html("<img src='/images/89.GIF'/>"); }
	//	}
	
	//Following scripts displays the external URL features on structure
  
	//Style featureHeader elements
	d3.selectAll('.expand').attr("style", "font-size: calc(9px + 0.2vw);color: #848484;margin: 10px -7px 0px 0px;")
	d3.selectAll("#remove")
	.on("click", function(){
	  $(this).parent().parent().remove()
	  })
	$("#groupedFeatures").sortable({axis: 'y'})
	$(".featureTrack").sortable({axis: 'y'}).css({"cursor": "move"})
	$("#groupedFeatures").disableSelection()
	$(".featureHeader").on("click", function () {
		var content = $(this).parent().children().eq(2)	
		content.slideToggle('slow')

		if(content.is(":visible")){
		  $(this).addClass("active")
		}
		if ($(this).children().eq(0).text() == '►') {
			$(this).children().eq(0).text("▼")
			$(this).children("button").css({"visibility": "visible"})
		} else {
			$(this).children().eq(0).text("►")
			$(this).children("button").css({"visibility": "hidden"})
		}

		var notThis = $('div[class*="active"]').not(this)
	
		notThis.children().eq(0).text("►")
		notThis.parent().children().eq(2).slideUp("slow");
		notThis.children("button").css({"visibility": "hidden"})
		notThis.removeClass("active")

		});
	var timer;
	$(".featureHeader").on({
	  mouseenter: function () {
		$(this).css({"background-color":"#BEBEBE", "cursor": "pointer"})
	  },
	  mouseleave: function () {
		$(this).css({"background-color":"#cccccc"})
	  },
	  mousedown: function(){
		var that = this
		timer = setTimeout(function(){
		  $(that).css({"cursor": "move"})
		}, 500);
	  },
	  mouseup: function(){
		$(this).css({"cursor": "pointer"})
	  }
	})
	$('.info').find('span:contains("undefined")').parent().remove()
	d3.selectAll(".info").on({
		mouseenter: function () {
      $(this).css({"background-color":"orange", "color": "white"})
      $(this).parent().parent().children("span.tooltiptext").css({"visibility" : "visible"})
		},
		mouseleave: function () {
      $(this).css({"background-color":"white", "color": "black"})
      $(this).parent().parent().children("span.tooltiptext").css({"visibility" : "hidden"})
	  }
	});

	$(".tooltiptext").on({
		mouseenter: function () {
      $(this).css({"visibility" : "visible"})
    },
    mouseleave: function () {
      $(this).css({"visibility" : "hidden"})
	  }
  	})
	
	//Store ordering of feature source
	var featureOrder = new MutationObserver( function (mutations) {
	  var sources = $('#groupedFeatures .featureCollection').map(function(){
		return $(this).attr('id');
		}).get();
		localStorage.setItem("featureOrder", sources);
	})
	featureOrder.observe(document.getElementById("groupedFeatures"), {
	  attributes:    true,
	  childList: true
	  });
  
	// d3.selectAll("#share").on("click", function() {
	// 	var dummy = document.createElement('input'),
	//   text = window.location.href;
	//   document.body.appendChild(dummy);
	//   dummy.value = text;
	//   dummy.select();
	//   document.execCommand('copy');
	//   document.body.removeChild(dummy);
	// })

  //On external features scripts show features
// 	if($("svg#s_0_0").parent().parent().parent().attr("id") === "Added Features"){
//       	var custom_feature = $("svg#s_0_0")
// 		var oid = custom_feature.attr("id").split("_")[2];
// 		passFeature(clusters[0], oid);
// 		d3.selectAll("svg.loaded rect.feature").attr("fill", "#a4abdf");
// 		d3.select("svg.loaded").classed("loaded", false);
// 		custom_feature.attr("class", "loaded");
//   }

	var document_observer = new MutationObserver( function (mutations) {
		// `mutations` is an array of mutations that occurred
		// `me` is the MutationObserver instance
		if($(location).attr('href').includes("json")){
		  mutations.forEach(function(mutation) {
			if (mutation.attributeName !== 'style') {
			  return none;
			}
			else{
			  var currentValue = mutation.target.style.display;
			  if (currentValue == "none") {
				///console.log("THIS IS CHANGED")
				pdb_chain_observer.observe(document.getElementById("waitingFrame"), {
				  attributes:    true,
				  attributeFilter: ["style"]
				})
			  }
			}
			})
		  }
		})
  
	  var pdb_chain_observer = new MutationObserver(function (m, me) {
		m.forEach( function(mut) {
		  if (mut.attributeName !== 'style') return;
		  var currentValue = mut.target.style.display;
		  if (currentValue == "none") {
			clusters.forEach(function(c){
				if(c.Server == "Added Features"){
					addedFeatures.push(c)
				}
			})
			var custom_feature = $('[id="Added Features"]').children().eq(2).children().eq(0).find("svg")
			custom_feature.attr("class", "loaded");
			var oid = custom_feature.attr("id").split("_")[2];
			// AQUARIA.panel3d.blankApplet(true, "Loading feature...")
			// AQUARIA.panel3d.blankApplet(false)
			passFeature(addedFeatures[0], oid);
			d3.selectAll("svg.loaded rect.feature").attr("fill", "#a4abdf");
			d3.select("svg.loaded").classed("loaded", false);
  
			me.disconnect();     // stop observing
  
		  }
		})
	  })
  
  
  //   start observing structure change
	document_observer.observe(document.getElementById("loading-message"), {
	  attributes:    true,
	  attributeFilter: ["style"],
	  characterDataOldValue: true
	});
};


function drawTrack(datum, i) {
	var features = datum.Tracks;

	for ( var o in features) {

		d3
				.select(this)
				.append("svg")
				.attr("width", width + AQUARIA.margin.left)
				.attr("height", 25)
				.attr("viewBox", "0 0 " + (width + AQUARIA.margin.left) + " 25")
				.attr("preserveAspectRatio", "none")
				.attr("id", "s_" + groupCount + "_" + o)
				.attr("title",
						"Click to load feature into 3D view; hover over features to see detailed info.")

				.on("click", function() {
					if(d3.select(this).attr("class") == "loaded") { // deselect feature (it's already displayed)
						d3.select("svg.loaded").classed("loaded", false);
						AQUARIA.panel3d.blankApplet(true, "Removing feature...")
						AQUARIA.panel3d.blankApplet(false)
						removeCurrentAnnotationFrom3DViewer();
					}
					else { //console.log("clicked to display feature");
						var oid = d3.select(this).attr("id").split("_")[2];
						AQUARIA.panel3d.blankApplet(true, "Loading feature...")
						AQUARIA.panel3d.blankApplet(false)
						passFeature(datum, oid, this);
						d3.selectAll("svg.loaded rect.feature").attr("fill", "#a4abdf");
						d3.select("svg.loaded").classed("loaded", false);
						d3.select(this).attr("class", "loaded");	//console.log("it's " + d3.select(this).attr("class"));
						}
					})
				.on("mouseover", function() {
							d3.select(this).selectAll("rect.feature").attr(
									"fill", function() {
										return d3.select(this).attr("color");
									});
						})
				.on("mouseout", function() {
							if(d3.select(this).attr("class") != "loaded"){
								d3.select(this).selectAll("rect.feature")
								.attr("fill", "#a4abdf");
							}
						})
					// add background for highlighting
				.append("rect")
					.attr("width", width + AQUARIA.margin.left)
					.attr("height", 25)
					.attr("class", "bg")
					.attr("fill", "none");

			d3.select("svg#s_" + groupCount + "_" + o)
				.append("g")
					.attr("transform", "translate(" + AQUARIA.margin.left + ",0)")
					// add center line
				.append("rect")
					.attr("width", width)
					.attr("height", 1)
					.attr("transform", "translate(0,13)")
					.attr("class", "insertion");
					// add features
		for ( var p in features[o]) {
			featureCount++;
			d3
					.select("#s_" + groupCount + "_" + o + " g")
					.append("rect")
					.attr(
							"width",
							function() {
								return (/*parseInt*/((features[o][p].size + 1)
										* AQUARIA.srw) > 2) ? /*parseInt*/((features[o][p].size + 1)
										* AQUARIA.srw)
										: 2;
							}).attr("height", 14).attr("id",
							"r_" + groupCount + "_" + o + "_" + p).attr(
							"transform",
							"translate("
									+ /*parseInt*/(features[o][p].start
											* AQUARIA.srw) + ",6)").attr(
							"color", features[o][p].color).attr("fill",
							"#a4abdf").attr("fill-opacity", function() {
						return (datum.Class == "single_track") ? 0.3 : 1;
					}).attr("class", "feature").on("mouseover",
							createMouseOverCallback(features[o][p])).on(
							"mouseout",
							function() {
								var ID = d3.select(this).attr("id");
								return d3.select(this)
										.call(mouseoutFeature, ID);
							});
		}
	}
	groupCount++;
}

function createMouseOverCallback(feature) {
	return function() {
		var ID = d3.select(this).attr("id");
		d3.select(this).call(mouseoverFeature, feature, ID);
	};
}

function passFeature(trk, nr, elmt) {

		//console.log("featurelist.passFeature " + trk.Category + " " + trk.Type + ", Track " + nr, trk); //console.log(elmt);

		sentAnnotationTo3DViewer(trk, parseInt(nr));

}

var t, s;
function mouseoverFeature(el, f, eid) {
	t = setTimeout(function() {
		showAnnotation(f, eid);
	}, 500);
	d3.select("#" + eid).attr("stroke-width", "2px").attr("stroke", "white");

}

function mouseoutFeature(el, eid) {
	clearTimeout(t);
	d3.select("#" + eid).attr("stroke-width", "0px");
	s = setTimeout(function() {
		$("div.popup").fadeOut();
	}, 500);
}

function showAnnotation(f, eid) {
	// console.log("Hovered "+f.name+" "+f.start+"-"+f.end+": "+f.desc);
	var urlhtml = "";
	if (f.urls.length > 0) {
		// var lnx = f.urls.split(";");
		urlhtml = "<p>";
		for ( var i = 0; i < f.urls.length; i++) {
			urlhtml += "<a href='" + f.urls[i].href + "' target='_blank'>"
					+ f.urls[i].text + "</a><br>";
		}
		urlhtml += "</p>";
	}
	$("div.popup").remove();
	var balloon = "<div class='balloon'><span class='x'>&nbsp;</span><p>"
			+ f.label + " (";
	if (f.start == f.end){
		balloon = balloon + "Residue "+f.start;
	} else {
		balloon = balloon + "Residues "+f.start+"-"+f.end;
	}

	balloon = balloon + ")<br/>"
			+ f.desc + "</p>"
			+ urlhtml + "</div>";
	d3.select("body")
		.append("div")
			.attr("class", "popup")
			.html(balloon);

	var popheight = $("div.popup").innerHeight();

	var fpos = $("#" + eid).offset();
	var fwidth = $("#" + eid).attr("width");

	var bleft = parseInt(fpos.left + fwidth / 2 - 160);
	var btop = parseInt(fpos.top - popheight);

	$("div.popup").css({
		"left" : bleft + "px",
		"top" : btop + "px"
	}).fadeIn(600);

	$("span.x").click(function() {
		$("div.popup").fadeOut();
	});

	$("div.popup").hover(function() {
		clearTimeout(s);
	}, function() {
		s = setTimeout(function() {
			$("div.popup").fadeOut();
		}, 500);
	});

}

// DAS annotation handling

var currentAnnotationsIn3DViewer = new Array();

/**
 * removes the current annotation track from the 3D viewer
 */
function removeCurrentAnnotationFrom3DViewer() {
	// remove existing Annotation

	if (currentAnnotationsIn3DViewer !== undefined) {
		for ( var i in currentAnnotationsIn3DViewer) {
			// API call
			AQUARIA.panel3d.removeAnnotation(currentAnnotationsIn3DViewer[i].id,
					currentAnnotationsIn3DViewer[i].annotationName);
		}
		currentAnnotationsIn3DViewer.length = 0;
	}
}

/**
 * send the annotation track to the 3D viewer
 */
function sentAnnotationTo3DViewer(annotations, trackNumber) {

	// default is to send of all track lines unless trackNumber has been
	// specified
	trackNumber = typeof trackNumber !== 'undefined' ? trackNumber : -1;

	// remove existing Annotation
	removeCurrentAnnotationFrom3DViewer();

	// send specific track if requested
	if (trackNumber >= 0) {
		reformatAndAddFeatureTo3DViewer(annotations, trackNumber);
	} else {
		// send all tracks
		for (trackNumber in annotations.Tracks) {
			reformatAndAddFeatureTo3DViewer(annotations, trackNumber);
		}
	}
}

/**
 * reformat an annotation track into the format required by the API
 */
function reformatAndAddFeatureTo3DViewer(annotations, trackNumber) {
	var featureColours = new Array();
	var featureNames = new Array();
	var featureDescriptions = new Array();
	var featurePositions = new Array();
	var featureURLs = new Array();
	var featureURLtexts = new Array();
	var featureCategories = {};
	var lastColour = '#ffffff';
	if(annotations != undefined){


	if (annotations.featureColours && annotations.featureColours.length > 0) {
	  lastColour = annotations.featureColours[0];
	}
	// send specified track only
	for ( var j in annotations.Tracks[trackNumber]) {
		// only transfer features flagged as visible
		if (annotations.Tracks[trackNumber][j].show) {
			if (annotations.Class.color !== 'multi_color') {
				// 0.3 o
				var alphaColor = "#4d"
						+ annotations.Tracks[trackNumber][j].color.substring(1);
			}
		  if (annotations.Tracks[trackNumber][j].color) {
//		    lastColour = annotations.Tracks[trackNumber][j].color;
	        featureColours.push(annotations.Tracks[trackNumber][j].color);
			}
	    else {
        featureColours.push(lastColour);

	    }

//				else {
//	        featureColours.push(annotations.Tracks[trackNumber][j].color);
//
//				}

			featureNames.push(annotations.Tracks[trackNumber][j].label);
			featureDescriptions.push(annotations.Tracks[trackNumber][j].desc);
			featurePositions.push(annotations.Tracks[trackNumber][j].start
					+ ":" + annotations.Tracks[trackNumber][j].end);

			fURLs = new Array();
			fURLtxts = new Array();

			for ( var k in annotations.Tracks[trackNumber][j].urls) {
				fURLs.push(annotations.Tracks[trackNumber][j].urls[k].href);
				fURLtxts.push(annotations.Tracks[trackNumber][j].urls[k].text);
			}
			featureURLs.push(fURLs);
			featureURLtexts.push(fURLtxts);

		}
		;
	}

	var annotationToAdd = {
		"id" : annotations.ProteinID,
		"annotationName" : annotations.Category
	};

	currentAnnotationsIn3DViewer.push(annotationToAdd);
	// API call
	AQUARIA.panel3d.addAnnotation(annotationToAdd.id[0],
					annotationToAdd.annotationName, featureColours,
					featureNames, featureDescriptions, featurePositions,
					featureURLs, featureURLtexts);
	}
}

module.exports.updateFeatureUI = updateFeatureUI;
module.exports.updateFeatureTabTitle = updateFeatureTabTitle;