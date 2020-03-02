var cache = require('../common/cache')();

var servers = [
		{
			"Server" : 'External Features (JSON)',
			"URL" : '',
			"Categories" : {
				"default" : {
					"track" : "multi_track",
					"color" : "single_color"
				}
			}
		},
//		{
//			"Server" : 'InterPro',
//			"URL" : 'http://www.ebi.ac.uk/das-srv/interpro/das/InterPro-matches-overview/',
//			"Categories" : {
//				"Inferred from InterPro motif similarity" : {
//					"track" : "multi_track",
//					"color" : "multi_color"
//				},
//				"default" : {
//					"track" : "multi_track",
//					"color" : "multi_color"
//				}
//			}
//		},
		{
			"Server" : 'Uniprot',
			"URL" : 'http://uniprot.org/uniprot',
			"Categories" : {
				"Region" : {
					"track" : "multi_track", // possible values:
												// "single_track","multi_track"
					"color" : "multi_color" // possible values:
											// "#RGBcolor","single_color","multi_color"
				},
				"Site" : {
					"track" : "multi_track",
					"color" : "multi_color"
				},
				"Amino acid modification" : {
					"track" : "multi_track",
					"color" : "single_color"
				},
				"Amino acid modification;post translational modification" : {
					"track" : "multi_track",
					"color" : "#993404"
				},
				"sequence variant" : {
					"track" : "multi_track",
					"color" : "single_color"
				},
				"Sequence variation;natural variant site" : {
					"track" : "multi_track",
					"color" : "#FFD64F"
				},
				"Sequence variation;mutated variant site" : {
					"track" : "multi_track",
					"color" : "#E34C94"
				},
				"Experimental information" : {
					"track" : "multi_track",
					"color" : "multi_color"
				},
				"Molecule processing" : {
					"track" : "multi_track",
					"color" : "multi_color"
				},
				"default" : {
					"track" : "multi_track",
					"color" : "multi_color"
				}
			}

		// }, {
		// "Server" : 'SignalP',
		// "URL" : 'http://das.cbs.dtu.dk:9000/das/cbs_sort/',
		// "Categories" : {
		// "Inferred from electronic annotation" : { "track":"multi_track",
		// "color":"multi_color"}
		// }
		// }, {
		// "Server" : 'Pride',
		// "URL" : 'http://www.ebi.ac.uk/pride-das/das/PrideDataSource/',
		// "Categories" : {
		// "coverage" : { "track":"multi_track", "color":"multi_color"}
		// }
		}
		];

// available set of colors
var feature_colors = [ "#253494", "#1162dc", "#7B87C2", "#8AAAD9", "#5BC48F",
		"#00AE95", "#76B043", "#AED477", "#E4C8A7", "#FFD64F", "#E6B222",
		"#818C43", "#D77D2A", "#F8AD7C", "#E39FC6", "#E34C94", "#993404" ];
// indicates if currently accessing remote servers
var isFetchingData = false;
// indicates which server is accessed
var isFetchingFromServer = "";
// current server index
var currentServer = -1;
// contains current records of all annotations
var aggregatedAnnotations;

// color handling
/**
 * This function hashes a string into the color range adapted from
 * http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-
 */
var djb2Code = function(str, bins) {
	var hash = 5381;
	for ( var i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
	}
	return Math.abs(hash % bins);
};

function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

if (typeof String.prototype.startsWith != 'function') {
	// see below for better implementation!
	String.prototype.startsWith = function(str) {
		return this.indexOf(str) == 0;
	};
}

// http://stackoverflow.com/questions/6659351/removing-all-script-tags-from-html-with-js-regular-expression
function stripScripts(s) {
  var div = document.createElement('div');
  div.innerHTML = s;
  var scripts = div.getElementsByTagName('script');
  var i = scripts.length;
  while (i--) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }
  return div.innerHTML;
}

/**
 * This helper function to annotations to the json object - one at a time
 */
var add_external_annotation = function(primary_accession, json_object, ann, das_server,
		category) {
	var ann_key;
	var categorytype = category.trim().replace(")","").split("(");
	// add emtpy category
	if (categorytype.length == 1){
		categorytype.push("");
	}
	var ann_key = das_server + "|:|" + categorytype[0] + "|:|" + categorytype[1];
	var ann_track = ann["track"] || "multi_track";
	var ann_color = ann["color"] || "single_color";
	
	for ( var i = 0; i < ann.Features.length; i++) {
		var f = ann.Features[i];

		var feat_name = f.Name;
		var feat_label = f.Name.replace(/_/g, ' ');
		var feat_desc = stripScripts(f.Description);
		var feat_start;
		var feat_end;
		var feat_color;

		if (f.Color){
			// if the JSON file specifies a color for this individual feature, then use it
			feat_color = f.Color;
		} else if (ann.Color){
			// if the JSON file specifies a feature set color, then use it for all features
			feat_color = ann.Color;
		} else {
			feat_color = feature_colors[djb2Code(feat_label, feature_colors.length)];
		}

		if (typeof f.Residues == "object"){
			// assume array
			feat_start = parseInt( f.Residues[0]);
			feat_end = parseInt( f.Residues[1]);
		} else if (typeof f.Residue !== 'undefined'){
	        feat_start = parseInt( f.Residue);
	        feat_end = parseInt( f.Residue);
		} else {
			feat_start = parseInt( f.Residues);
			feat_end = parseInt( f.Residues);
		}

		var feat_url = [];
		if (ann.Source) {
			feat_url.push({
				"href" : ann.URL,
				"text" : ann.Source
			});
		}

		var new_region = {
				"color" : feat_color,
				"name" : feat_name,
				"label" : feat_label,
				"desc" : feat_desc,
				"start" : feat_start,
				"end" : feat_end,
				"size" : feat_end - feat_start,
				"urls" : feat_url,
				"show" : true
			};

		if (!(ann_key in json_object)) {
			// add new annotation type
			json_object[ann_key] = {
				"ProteinID" : primary_accession,
				"Server" : das_server,
				"Category" : categorytype[0],
				"Type" : categorytype[1],
				"Method" : "",
				"Tracks" : [ new_region ],
				"track" : ann_track,
				"color" : ann_color
			};
		} else {
			// add new region to existing annotation category
			cur_ann_type = json_object[ann_key];
			cur_ann_type["Tracks"].push(new_region);
		}
	}
}

/**
 * This helper function to annotations to the json object - one at a time
 */
var add_annotation = function(primary_accession, json_object, ann, das_server,
		categories) {
	var filter_key;

	if (ann.TYPE.category !== undefined){
		var categorytype = capitaliseFirstLetter(ann.TYPE.category.replace(
				/ *\(.*?\) */g, ""));
		var categorytext = ann.TYPE.textContent.replace(/_/g, " ");
	} else {
		// category not defined
		return
	}

	if (hasOwnProperty(categories, categorytype + ";" + categorytext)) {
		filter_key = categorytype + ";" + categorytext;
	} else if (hasOwnProperty(categories, categorytype)) {
		filter_key = categorytype;
	} else if (hasOwnProperty(categories, categorytext)) {
		filter_key = categorytext;
	} else {
		// no match
		return;
	}
	// console.log(categorytype + " found in " + categories);

	var ann_key = das_server + "|:|" + categorytype + "|:|"
			+ ann.TYPE.textContent;

	var feat_name = ann.id;
	var feat_label = ann.label.replace(/_/g, ' ');

	var feat_desc = [];
	if (ann.NOTE) {
		for ( var i = 0; i < ann.NOTE.length; i++) {
			// replace non-informative labels with non-empty note entry
			if (feat_label.toUpperCase().startsWith("UNIPROTKB")
					&& ann.NOTE[i].textContent != "") {
				feat_label = ann.NOTE[i].textContent;
			// skip redundant information in the notes
			} else if (ann.NOTE[i].textContent != feat_label){
				feat_desc.push(ann.NOTE[i].textContent);
			}
		}
	}

	var feat_color;
	if (categories.hasOwnProperty(filter_key)
			&& categories[filter_key]["color"] == "multi_color") {
		// multi-color features have a color per feature
		feat_color = feature_colors[djb2Code(feat_label, feature_colors.length)];

	} else if (categories.hasOwnProperty(filter_key)
			&& categories[filter_key]["color"] == "single_color") {
		// single-color features based on category text key hash
		feat_color = feature_colors[djb2Code(categorytext,
				feature_colors.length)];
	} else {
		// single-color features based on given color
		feat_color = categories[filter_key]["color"];
	}

	var feat_start = (ann.START) ? parseInt(ann.START.textContent) : 0;
	var feat_end = (ann.END) ? parseInt(ann.END.textContent) : 0;

	var feat_url = [];
	if (ann.LINK) {
		for ( var i = 0; i < ann.LINK.length; i++) {
			feat_url.push({
				"href" : ann.LINK[i].href,
				"text" : ann.LINK[i].textContent
			});
		}
	}

	var new_region = {
		"color" : feat_color,
		"name" : feat_name,
		"label" : feat_label,
		"desc" : feat_desc.join('\n'),
		"start" : feat_start,
		"end" : feat_end,
		"size" : feat_end - feat_start,
		"urls" : feat_url,
		"show" : true
	};

	if (!(ann_key in json_object)) {
		// add new annotation type
		json_object[ann_key] = {
			"ProteinID" : primary_accession,
			"Server" : das_server,
			"Category" : categorytype,
			"Type" : ann.TYPE.textContent.replace(/_/g, ' '),
			"Method" : ann.METHOD.textContent,
			"Tracks" : [ new_region ]
		};
	} else {
		// add new region to existing annotation category
		cur_ann_type = json_object[ann_key];
		cur_ann_type["Tracks"].push(new_region);
	}
};

/**
 * optimize color handling for multi-track features
 *
 * @param category
 * @param multitracks
 */
function optimizeColors(category, multitracks) {
	// catalog all labels
	var labels = {};
	for ( var track_num = 0; track_num < multitracks.length; ++track_num) {
		for ( var j = 0; j < multitracks[track_num].length; j++) {
			if (hasOwnProperty(labels, multitracks[track_num][j]["label"])) {
				labels[labels, multitracks[track_num][j]["label"]] += 1
			} else {
				labels[labels, multitracks[track_num][j]["label"]] = 1
			}
		}
	}

	var num_terms = Object.size(labels);
	var term_arr = Object.keys(labels);
	// get color set offset from feature category to allow diverse color sets
	var offset = djb2Code(category, feature_colors.length);

	// calculate color
	for ( var track_num = 0; track_num < multitracks.length; ++track_num) {
		for ( var j = 0; j < multitracks[track_num].length; j++) {
			i = term_arr.indexOf(multitracks[track_num][j]["label"]);
			multitracks[track_num][j]["color"] = feature_colors[(offset + Math
					.round(i * feature_colors.length / num_terms))
					% feature_colors.length];
		}
	}
}

/**
 * cluster region features into tracks with non-overlapping features
 */
function clusterRegions(sequence_annotations, categories) {
	var clusters = new Array();

	for (var annotation in sequence_annotations) {

		var feat_class = sequence_annotations[annotation]["track"];//categories[filter_key]["track"];
		if (feat_class == "multi_track") {
			// multi-line features

			var new_tracks = new Array();
			var tracks = sequence_annotations[annotation]["Tracks"];

			// sort tracks by size of the region spanned
			tracks.sort(compareAnnotationRegions);

			// detect collisions
			while (tracks.length > 0) {
				var region = tracks.pop();

				var found_spot = false;
				var track_num = 0;
				var collision = false;

				while (track_num < new_tracks.length & !found_spot) {
					for ( var j = 0; j < new_tracks[track_num].length; j++) {
						if ((new_tracks[track_num][j].start <= region.start && region.start <= new_tracks[track_num][j].end)
								|| (new_tracks[track_num][j].start <= region.end && region.end <= new_tracks[track_num][j].end)) {
							// collision found in this track, stop and start
							// checking next track
							track_num += 1;
							collision = true;
							break;
						}
					}
					if (!collision) {
						found_spot = true;
						break;
					}
					collision = false;
				}

				if (found_spot) {
					new_tracks[track_num].push(region);
				} else {
					new_tracks.push(new Array(region));
				}
			}

			if (sequence_annotations[annotation]["color"] == "multi_color") {
				optimizeColors(sequence_annotations[annotation]["Category"],
						new_tracks);
			}

			clusters.push({
				"ProteinID" : sequence_annotations[annotation]["ProteinID"],
				"Server" : sequence_annotations[annotation]["Server"],
				"Class" : {
					track : sequence_annotations[annotation]["track"],
					color : sequence_annotations[annotation]["color"]
				},
				"Category" : sequence_annotations[annotation]["Category"],
				"Method" : sequence_annotations[annotation]["Method"],
				"Type" : sequence_annotations[annotation]["Type"],
				"Tracks" : new_tracks
			});

		} else if (feat_class == "single_track") {
			// single-line features
			clusters.push({
				"ProteinID" : sequence_annotations[annotation]["ProteinID"],
				"Server" : sequence_annotations[annotation]["Server"],
				"Class" : sequence_annotations[annotation]["track"],
				"Category" : sequence_annotations[annotation]["Category"],
				"Method" : sequence_annotations[annotation]["Method"],
				"Type" : sequence_annotations[annotation]["Type"],
				"Tracks" : [ sequence_annotations[annotation]["Tracks"] ]
			});

		} else {
			console.log("ERROR: Feature class not known");
		}
	}
	return clusters;
}

/**
 * This function compares two regions based of their size
 *
 * @param a
 *            region 1
 * @param b
 *            region 2
 * @returns {Number}
 */
function compareAnnotationRegions(a, b) {
	if (a.size < b.size)
		return -1;
	if (a.size > b.size)
		return 1;
	return 0;
}

/**
 *
 * This function calculates the size of an object
 *
 * @param obj
 * @returns {Number}
 */
Object.size = function(obj) {
	var size = 0;
	for ( var key in obj) {
		if (obj.hasOwnProperty(key))
			size++;
	}
	return size;
};

/**
 * This function checks if an object has a given property
 *
 * @param obj
 *            object
 * @param prop
 *            property
 * @returns {Boolean} true if object has property, false otherwise
 */
function hasOwnProperty(obj, prop) {
	var proto = obj.__proto__ || obj.constructor.prototype;
	return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
}

/**
 * reset current DAS annotation set
 */
function resetDASAnnotations() {

	isFetchingData = false;
	isFetchingFromServer = "";
	currentServer = -1;
	aggregatedAnnotations = new Array();
}

function fetch_annotations(primary_accession,  
		featureCallback) {
	
	// reset annotations

	// blah blah HANDLE CACHE HERE
	var key = "FEATURE_" + primary_accession + getUrlParameter("features");
	var cacheValue = cache.read(key);

	if (cacheValue) {
		// return cache result for immediate display
		featureCallback(cacheValue);
	}
	
	// get fresh set of annotations as well
	console.log("fetch_features.fetch_annotations: reset DAS annotations");
	resetDASAnnotations();

	processNextServer(primary_accession,
			featureCallback);
};

/**
 * Process the next annotation resource and add their annotations
 */
var processNextServer = function(primary_accession,  
		featureCallback) {

	currentServer += 1;
	isFetchingData = true;
	// get DAS servers first
	if (currentServer < servers.length) {
		isFetchingFromServer = servers[currentServer]['Server'];

		console.log("fetch_features.processNextServer isFetchingFromServer =", isFetchingFromServer);
		if (isFetchingFromServer == "External Features (JSON)"){
			// check URL for json url
			checkURLForFeatures(primary_accession, servers[currentServer], featureCallback);

		} else if (isFetchingFromServer == "Uniprot"){
			console.log("fetch_features.processNextServer process " + isFetchingFromServer);
			fetch_uniprot(primary_accession, servers[currentServer], featureCallback);
		}
	}
	else {
		console.log("fetch_features.processNextServer finish DAS");
		var key = "FEATURE_" + primary_accession + getUrlParameter("features");
		cache.write(key, aggregatedAnnotations);
		featureCallback(aggregatedAnnotations);
	}
};

var finishServer = function(clustered_annotations, primary_accession,
		  featureCallback) {

	// add to existing annotation record
	aggregatedAnnotations.push.apply(aggregatedAnnotations,
			clustered_annotations);

	// get next server
	processNextServer(primary_accession,  
			featureCallback);
};

// cross Domain access to obtain additional features
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // Otherwise, CORS is not supported by the browser.
    xhr = null;
  }
  return xhr;
}

/**
 * Converts a uniprot xml document to the external JSON format for features, as described here:
 * https://docs.google.com/document/d/1wFJjdyl1OASnsBNkUzUx4ME8YhVybhIWCTr3Z1fBEWQ/pub
 */
function parseUniprot(xml) {
	
	var data = {};
	$(xml).find("feature").each(function() {
		var type = capitaliseFirstLetter($(this).attr("type"));
		var feature = {};
		
		switch(type) {
		case "Helix":
//			feature.Color = "#568AB5";
//			type = "Secondary Structure";
//			break;
		case "Strand":
//			feature.Color = "#FFC900";
//			type = "Secondary Structure";
//			break;
		case "Turn":
//			feature.Color = "#639941";
//			type = "Secondary Structure";
			return;
			break;
			
		}
		
		if (!hasOwnProperty(data, type)) {
			data[type] = {"Source" : "Uniprot", "URL" : "https://www.uniprot.org", "Features" : []};
			if (type == "Sequence variant" ||
					type == "Mutagenesis site" ||
					type == "Modified residue" ||
					type == "Site") {
				data[type]["Color"] = feature_colors[djb2Code(type.replace(/_/g, ' '), feature_colors.length)];
			}
		}
		
		// feature description (optional)
		var description = $(this).attr("description") || "";
		
		// feature name (optional)
		var name = undefined;
		var original = $(this).find("original");
		if (original.length) {
			name = original.first().text();
			var variation = $(this).find("variation");
			if (variation.length) {
				name += " > " + variation.first().text();
			}
		};
		
		var residues = [];
		var loc = $(this).find("location");
		loc.each(function() {	// each location can be either a single position or a range
			// this returns an array of positions
			var pos = $(this).children().map(function() {
				return $(this).attr("position");
			}).get();
			
			residues = residues.concat(pos);
		});
		if (residues.length == 1) {
			feature["Residue"] = residues;
		} else {
			feature["Residues"] = residues;
		}
		
		feature["Name"] = name || description;
		feature["Description"] = name ? description : "";
		
		data[type]["Features"].push(feature);
	});
	
	return data;
	
}

function parseFeatures(primary_accession, categories, server, featureCallback, data){
	var sequence_annotations = {};
	for (var category in data) {
		  if (data.hasOwnProperty(category)) {
			add_external_annotation(primary_accession, sequence_annotations, data[category], server , category);
		  }
	}
	var clustered_annotations = clusterRegions(sequence_annotations, categories);

	finishServer(clustered_annotations, primary_accession, featureCallback);
}

function checkURLForFeatures(primary_accession, server, featureCallback){
	var url = getUrlParameter("features");
	if (url){
	  $.getJSON( url, function (responseJSON) { //After load, parse data returned by xhr.responseText
			parseFeatures(primary_accession, server['Categories'], server['Server'], featureCallback, responseJSON);
	    });
	} else {
		finishServer(new Array(), primary_accession,  
			featureCallback);
	}
}

/**
 * This function collects all annotations for a given protein id from a
 * specified server
 */
fetch_uniprot = function(primary_accession, server, featureCallback) {

	console.log("fetch_features.fetch_uniprot fetching features from uniprot...");
	url = "https://www.uniprot.org/uniprot/" + primary_accession + ".xml";
	$.ajax({url : url, 
			type: "GET",
			dataType: "xml",
			success: function(xml) {
				data = parseUniprot(xml);
				parseFeatures(primary_accession, server['Categories'], server['Server'], featureCallback, data)
			}
	});
	
};

module.exports = fetch_annotations;
