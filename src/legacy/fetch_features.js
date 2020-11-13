var axios = require('axios');
const Ajv = require('ajv');

var handlePredictProtein = require('./handlePredictProtein');
var handleSnap2 = require('./handleSnap2');
var handleCath = require('./handleCath');
var handleCath_covid = require('./handleCath_covid');

function getRequestProtocol(){
	let arr = window.location.href.split(/\:+/);
	// console.log("The request protocol is " + arr[0]);
	return (arr[0]);
}

var servers = [
		{
			"id": 'features',
			"Server" : 'Added Features',
			"URL" : '',
			"Categories" : {
				"default" : {
					"track" : "multi_track",
					"color" : "single_color"
				}
			}
		},
		{
			"id": 'PredictProtein',
			"Server": 'PredictProtein',
			"URL": 'https://api.predictprotein.org/v1/results/molart/',
		},
		{
			"id": 'SNAP2',
			"Server": 'SNAP2',
			"URL": 'https://rostlab.org/services/aquaria/snap4aquaria/json.php?uniprotAcc=',
		},
		/* {
			"id": 'CATH',
			"Server": 'CATH',
			"URL": window.location.protocol + '//www.cathdb.info/version/v4_2_0/api/rest/uniprot_to_funfam/',
			"URL_covid": `${window.BACKEND}/covid19cath/`,
			// ?content-type=application/json
		},
		{
			"id": 'myVariant',
			"Server": 'myVariant.info',
			"URL_variantList": 'https:', // POST request
			"URL_variants": 'https:', // GET request
		},*/
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
			"id": "UniprotFeatures",
			"Server" : 'UniProt',
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
var feature_colors = [ "#253494", "#D77D2A",  "#7B87C2", "#8AAAD9", "#E34C94", "#5BC48F",
		"#00AE95", "#76B043", "#AED477", "#E4C8A7", "#734a78", "#FFD64F", "#E6B222", "#1162dc",
		"#818C43",  "#F8AD7C", "#E39FC6",  "#993404" ];
// indicates if currently accessing remote servers
var isFetchingData = false;
// indicates which server is accessed
var isFetchingFromServer = "";
// current server index
var currentServer = -1;
// contains current records of all annotations
var aggregatedAnnotations = [];
var variantResidues = {};

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

	// console.log("POLICY " + hash + " bins " + (hash % bins));
	return Math.abs(hash % bins);
};

AQUARIA.getUrlParameter = function(sParam) {
	if (window.location.search.length > 0) {
	  var sPageURL = window.location.search.substring(1) // no .toLowerCase() here (this affects the value!)
	  var sURLVariables = sPageURL.split('&')
	  sParam = sParam.toLowerCase()
	  for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=')
		if (sParameterName[0].toLowerCase() === sParam) {
		  return decodeURIComponent(sParameterName[1]) // the value might have been encoded
		}
	  }
	}
	return null
  }

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



function getColorForFeat(assignedColors, feat_name, idx){
	if (assignedColors.hasOwnProperty(feat_name)){
		return (assignedColors[feat_name]);
	}

	assignedColors[feat_name] = feature_colors[(idx % feature_colors.length)];

	return(assignedColors[feat_name]);
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

	let assignedColors = {};

	for ( var i = 0; i < ann.Features.length; i++) {
		var f = ann.Features[i];

		var feat_name = f.Name;
		var feat_label = f.Name; // f.Name.replace(/_/g, ' ');
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

			// first check if something with same name has been assigned a colour (and use it); otherwise use 'mod' color.

			feat_color = getColorForFeat(assignedColors, feat_name, i);

			// feat_color = feature_colors[(i % feature_colors.length)];
			//  feature_colors[djb2Code(feat_label, feature_colors.length)];
		}

		var setResidueRange = function(resRange){
			var res = resRange.toString().split("-")
			if (res.length > 1){
			  feat_start = parseInt( res[0]);
			  feat_end = parseInt( res[1]);
			}
			else{
			  feat_start = parseInt( res[0]);
			  feat_end = parseInt( res[0]);
			}
		  }

		  var apiConvert = function(Residues){
			if(Residues.length < 1){
			  setResidueRange(Residues[0])
			}
			else{
			  Residues.forEach(function(r){
			  setResidueRange(r)
				})
			}
		}

		if (typeof f.Residues === "object"){
	      if(das_server === "PredictProtein"){
	        apiConvert(f.Residues)
	      }
	      else{
	        feat_start = parseInt( f.Residues[0]);
				  feat_end = parseInt( f.Residues[1]);
	      }
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
function clusterRegions(sequence_annotations, categories, aboutFeaturesource, hcDataObj) {
	var clusters = new Array();

	//sequence_annotations.forEach(function(annotation, annotation_i){

	// let annotation_counter = 0;

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
				"About"	: aboutFeaturesource,
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
				"About"	: aboutFeaturesource,
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


	let counter_goEc = 0;
	for (let i =0; i< clusters.length; i++){
		// console.log('A track set is ');
		// console.log(clusters[i]);

		if (clusters[i].Tracks[0][0].desc.match(/CATH/i)){
			for (let j = 0; j<clusters[i].Tracks[0].length; j++){

				// pos_hcDataArr = counter_goEc
				// dataArr_hc[0]


				if(typeof hcDataObj != "undefined" &&  hcDataObj != null &&  hcDataObj.hasOwnProperty(clusters[i].Tracks[0][0].name)){
					console.log(hcDataObj[clusters[i].Tracks[0][0].name]);

				}

				if (hcDataObj.hasOwnProperty(clusters[i].Tracks[0][j].name) ){
					clusters[i].Tracks[0][j]['hc_go'] = hcDataObj[clusters[i].Tracks[0][j].name].go;

					clusters[i].Tracks[0][j]['hc_ec'] = hcDataObj[clusters[i].Tracks[0][j].name].ec;

					clusters[i].Tracks[0][j]['hc_species'] = hcDataObj[clusters[i].Tracks[0][j].name].species;


					clusters[i].Tracks[0][j].label = clusters[i].Tracks[0][j].label.split(/\$\$/)[0];

					// clusters[i].Tracks[0][j].name = 'Testing';
				}



				//  hcDataObj[cluster] dataArr_hc[counter_goEc];
				//counter_goEc = counter_goEc + 1;

				//clusters[i].Tracks[0][j]['hc_ec'] = dataArr_hc[counter_goEc];
				//counter_goEc = counter_goEc + 1;

				//clusters[i].Tracks[0][j]['hc_species'] = dataArr_hc[counter_goEc];
				//counter_goEc = counter_goEc + 1;
			}
		}
	}

	//console.log('$$$ clusters');
	//console.log(clusters);

	/* clusters.forEach(function(item, i){
		console.log("A track is");
		console.log(item.Tracks);

		if (item.Tracks[0][0].desc.match(/CATH/i)){

			item.Tracks[0].forEach(function(aTrack, aTrack_i){

			});

		}



		// if (item.Tracks[0].desc)
	});
	*/

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

function getAllFeatureNamesRequested(primary_accession){
	let features = []

	// URL
	if(AQUARIA.getUrlParameter("features") != ''){
		features.push("features");
	};


	// Uniprot
	if(AQUARIA.getUrlParameter("UniprotFeatures") != ''){
		features.push("UniprotFeatures");
	};


	// PredictProtein
	if(AQUARIA.getUrlParameter("PredictProtein") != ''){
		features.push("PredictProtein");
	};

	// Snap2
	if(AQUARIA.getUrlParameter("SNAP2") != ''){
		features.push("SNAP2");
	};


	features.push('CATH')


	// Cath

	// BindPredict


	return (features)
}

function fetch_annotations(primary_accession,
		featureCallback) {

	// get fresh set of annotations as well
	console.log("fetch_features.fetch_annotations: reset DAS annotations");
	resetDASAnnotations();

	processNextServer(primary_accession,
			featureCallback);
};

function getCurrentUrl(){
	/* console.log("CURRENT URL IS ");
	console.log(window.location.search.substring(1));
	console.log(window.location.href);
	console.log(window.location.href.split(/\/+/)); */
	let arr = window.location.href.split(/\/+/);

	return (arr[0] + "//" + arr[1]);
}

function getJsonFromUrl(requestedFeature, url, primary_accession, featureCallback){
	let featuresFromExtServer = {};

	axios({
		method: 'get',
		url: url,
	})
	.then(function (response) {
		// handle success
		// console.log("Success");
		// console.log(response.data);
		console.log("fetch_features.getJsonFromUrl data recieved successfully for " + primary_accession )
		// featuresFromExtServer['status'] = "success";
		// featuresFromExtServer['data'] = response.data;

		if (requestedFeature == 'PredictProtein'){
			// convert feature first
			handlePredictProtein(response.data, primary_accession, featureCallback, validateAquariaFeatureSet, variantResidues, requestedFeature);
		}
		if (requestedFeature == 'SNAP2'){
			console.log(response);
			handleSnap2(response.data, primary_accession, featureCallback, validateAquariaFeatureSet, variantResidues, requestedFeature);
		}
		if (requestedFeature == 'CATH'){
			// console.log("####################### Cath features obtained successfully! ")
			// console.log(response.data)
			//console.log(getCurrentUrl());
			//console.log(servers[3].URL_covid);
			handleCath.handleCathData(response.data, getJsonFromUrl, validateAquariaFeatureSet, primary_accession, featureCallback);


		}
		if (requestedFeature == 'CathCovid'){
			// console.log("!!!! The cath covid response data is ");
			// console.log(response);
			handleCath_covid(response, getJsonFromUrl, validateAquariaFeatureSet, primary_accession, featureCallback);
		}

		// return featuresFromExtServer
	})
	.catch(function (error) {
		// handle error
		console.log("###################### Error " + requestedFeature);
		console.log(error);


		finishServer(new Array(), primary_accession,
			featureCallback)

		// return featuresFromExtServer
	});


	return featuresFromExtServer
}





/**
 * Process the next annotation resource and add their annotations
 */
var processNextServer = function(primary_accession,
		featureCallback) {

	currentServer += 1;
	isFetchingData = true;

	// get DAS servers first
	if (currentServer < servers.length) {

			// is feature requested by user

		console.log("fetch_features.processNextServer isFetchingFromServer = ", servers[currentServer]['Server']);

		if (servers[currentServer]['Server'] == "Added Features"){
			// check URL for json url
			try {
				checkURLForFeatures(primary_accession, servers[currentServer], featureCallback);
			} catch (error) {
				console.error(error);
			}
			finally {
				processNextServer(primary_accession,
					featureCallback);
			}
		}
		else if (servers[currentServer]['Server'] == "UniProt"){

			console.log("The aggregatedAnnotations are: ");
			console.log(aggregatedAnnotations);

			fetch_uniprot(primary_accession, servers[currentServer], featureCallback);
			featureCallback(aggregatedAnnotations);

		}
		else if (servers[currentServer]['id'] == 'PredictProtein'){


			getJsonFromUrl(servers[currentServer]['id'], servers[currentServer]['URL'] + primary_accession, primary_accession, featureCallback, validateAquariaFeatureSet)

			featureCallback(aggregatedAnnotations);



		}
		else if (servers[currentServer]['id'] == 'SNAP2'){


			getJsonFromUrl(servers[currentServer]['id'], servers[currentServer]['URL'] + primary_accession, primary_accession, featureCallback, validateAquariaFeatureSet)
			// featureCallback(aggregatedAnnotations);



		}
		else if (servers[currentServer]['id'] == 'CATH'){
			console.log('############################ Requesting Cath features')

			if (primary_accession == 'P0DTC1' || primary_accession == 'P0DTC2'|| primary_accession == 'P0DTC7' || primary_accession == 'P0DTD1'){
				// console.log("!!!!!!!!!! A COVID PROTEIN ENCOUNTERED");
				getJsonFromUrl('CathCovid',servers[currentServer]['URL_covid'] + primary_accession, primary_accession, featureCallback, validateAquariaFeatureSet);
				// handleCath_covid(primary_accession);
	 		}
			else {
				// console.log('^^ Failed to fetch item: err=', err);
				getJsonFromUrl(servers[currentServer]['id'], servers[currentServer]['URL'] + primary_accession + "?content-type=application/json", primary_accession, featureCallback, validateAquariaFeatureSet);
				featureCallback(aggregatedAnnotations);
			}



		}



	}
	else {
		console.log("fetch_features.processNextServer finish DAS");
		toDescAndAddToAdedFeat();
		featureCallback(aggregatedAnnotations);
	}
};


function toDescAndAddToAdedFeat(){ // convert to description and add to added feature's description
	// return new Promise(function(resolve, reject) {
	console.log("Convert the variant features to description, and update added feature's description");
	// });

	console.log(variantResidues);



	//Variant residues
	for (let residue in variantResidues){
		console.log("Variant residues " + residue);
		let description = "";

		for (let serverName in variantResidues[residue]){

			console.log('Server name is ' + serverName);
			if (serverName != 'newResidue'){
				variantResidues[residue][serverName].forEach(function(anDesc, anDesc_i){
					description = description + "<br><b>" + serverName + "</b>" + anDesc;
				});
			}


			// description = description + "<tr>";

			// description = description + "</tr>";
		}
		// Aggregated Annotations
		for (let i =0; i < aggregatedAnnotations.length; i++){


			if (aggregatedAnnotations[i].hasOwnProperty('Server')  && aggregatedAnnotations[i].Server == 'Added Features'){

				if (aggregatedAnnotations[i].hasOwnProperty('Tracks') ){
					// console.log("An aggregate annotation of interest is ");
					// console.log(aggregatedAnnotations[i].Tracks);

					for (j = 0; j < aggregatedAnnotations[i].Tracks.length; j++){
						for (k = 0; k < aggregatedAnnotations[i].Tracks[j].length; k++){
							console.log(aggregatedAnnotations[i].Tracks[j][k]);

							if (parseInt(residue) >= parseInt(aggregatedAnnotations[i].Tracks[j][k].start) &&  parseInt(residue) <= parseInt(aggregatedAnnotations[i].Tracks[j][k].end)){
								aggregatedAnnotations[i].Tracks[j][k].desc =  aggregatedAnnotations[i].Tracks[j][k].desc  + description;

								// console.log("The complete description is: " + aggregatedAnnotations[i].Tracks[j][k].desc );
							}
						}
					}
				}
			}
		}

	}
}

var finishServer = function(clustered_annotations, primary_accession,
		  featureCallback) {

	// add to existing annotation record
	try{
		aggregatedAnnotations.push.apply(aggregatedAnnotations,
				clustered_annotations);
	}
	catch(error){
		console.log("Error during pushing")
		console.log(error)
	}


	// get next server
	processNextServer(primary_accession,
			featureCallback);
};






function validateAquariaFeatureSet(convertedFeatureSet, primary_accession, featureCallback, featureId, cathDataArr_hc){

	const ajv = new Ajv({
  		verbose: true
	});

	var schema = {
		"type": "object",
		"minProperties": 1,
		"properties":{
			"About": {
				"type": "object",
				"properties": {
					"Title": {"type": "string"},
					"DOI": {"type": "string"},
					"Description": {"type": "string"},
					"Sequence_hash": {"type": "string"},
				},
				additionalProperties: false,
			},
			additionalProperties: false,
		},
		"patternProperties": {
			"^.+$": {
				"type": "object",
				"properties": {
					"Features": {
						"type": "array",
						"items": {
							"type": "object",
							"properties": {
								"Name": {'type': "string"},
								'Residue': {
									'type': "integer",
									'minimum': 1,
								},
								'Residues': {
									'type': 'array',
									'items':{
										'type': ['integer',
										'string'],
										'minimum': 1,
									},
									"minItems": 1,
								},
								'Color': {'type': 'string'},
								'Description': {'type': 'string'},
								'Connected': {'type': ['boolean', 'array']}
							},
							additionalProperties: false,
							"required": ["Name"],
							'oneOf': [
								{'required': ['Residue']},
								{'required': ['Residues']},
							],

						},
						minProperties: 1,
					},
					"Source": {"type": "string"},
					"URL": {"type": "string"},
					"Description": {"type": "string"},
					additionalProperties: false,
				},
				"required": ['Features'],
				additionalProperties: false,
			},
		},
		additionalProperties: false
	}

	var isValid = ajv.validate(schema, convertedFeatureSet);

	if (isValid){
		// continue
		// console.log("fetch_features.validateAquariaFeatureSet appending validated features " + 'PredictProtein')

		parseFeatures(primary_accession, '', featureId,featureCallback, convertedFeatureSet, '', cathDataArr_hc);
		// finishServer(convertedFeatureSet, primary_accession, featureCallback);
	}
	else {
		// cannot display these features
		console.log("fetch_features.validateAquariaFeatureSet " + ajv.errorsText());
		finishServer(new Array(), primary_accession,
			featureCallback);
	}



	// ajv.addMetaSchema(require());
	// console.log(ajv.validate(schema, convertedFeatureSet).errors)
	// console.log('ERRORS: ', this.ajv.errors)
	//return (isValid)
}




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
	return new Promise(function(resolve, reject) {
		let data = {};

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
				data[type] = {"Source" : "UniProt", "URL" : "https://www.uniprot.org", "Features" : []};
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

		resolve(data);
	});


}

function parseFeatures(primary_accession, categories, server, featureCallback, data, sourceURL, cathDataArr_hc){
	var sequence_annotations = {};
	var aboutSource = {};
	var description = "";

	for (var category in data) {
		  if (data.hasOwnProperty(category)) {
			if (category === "About"){
				var aboutSource = data[category];
				for (var attr in aboutSource) {
					if(attr === "Title"){
            			description = description.concat("<h3 class='infoHeader'><b>" + aboutSource[attr] + "</b></h3>")
					}
					else if (attr === "DOI"){
						description = "<a href=" + aboutSource[attr] + ">" + description + "</a>"
						description = description.concat("</br>")
					}
          			else if (attr === "Description"){
						description = description.concat("<p>" + aboutSource[attr] + "</p>")
					}
					else{
						description = description.concat("<p>" + aboutSource[attr] + "</p>")
          			}
				}
			}
			else if (server === "UniProt"){
				description = "For each protein, <a href='https://www.uniprot.org/'>UniProt</a> provides a comprehensive set of \
				carefully curated features, typically including domains, sequence variants, post-translational modifications (PTMs), \
				active sites, and binding sites."
			}
			else if (server === "PredictProtein"){
				description = "<a href='https://predictprotein.org/'>PredictProtein</a> provides computational predictions of \
				structural annotations, such as \
				<a href='https://rostlab.org/owiki/index.php/PredictProtein_-_Documentation#Secondary_structure_.28PROF.29'>\
				secondary structures</a>, \
				<a href='https://rostlab.org/owiki/index.php/NORSp_-_predictor_of_NOn-Regular_Secondary_Structure'> \
				non-regular secondary structures </a>, \
				<a href='https://rostlab.org/owiki/index.php/PredictProtein_-_Documentation#Solvent_accessibility_.28PHDacc.29'>\
				solvent accessibility</a>, <a href='https://rostlab.org/owiki/index.php/Metadisorder'> intrinsically disordered regions \
				</a>, <a href='https://rostlab.org/owiki/index.php/PROFbval'> residue mobility </a> and \
				<a href='https://github.com/Rostlab/ConSurf'> evolutionary conservation of amino acid positions </a>. \
				Additionally, predictions may also be included for \
				<a href='https://rostlab.org/owiki/index.php/PROFphd_-_Secondary_Structure,_Solvent_Accessibility_and_Transmembrane_Helices_Prediction'> \
				transmembrane helices </a>, trans-membrane beta barrel structures, disulphide bridges and \
				<a href='https://rostlab.org/owiki/index.php/PredictProtein_-_Documentation#Contact_Prediction_.28PROFcon.29'>\
				inter-residue contacts</a>."
			}
			else if (server === "SNAP2"){
				description = "<a href='https://www.rostlab.org/services/snap/'>SNAP2</a> provides computational predictions of the \
				effect of amino acid changes upon protein function."
			}
			else if (server === "CATH") {
				description = "<a href='http://www.cathdb.info/wiki'>CATH</a> provides domain information for proteins based on \
				functional similarity (‘FunFams’), as well as domains based only on structural similarity (‘CATH superfamilies’). \
				CATH provides extensive information for each domain, including functional annotations, species diversity, and enzyme \
				classifications."
			}
			else{
				description = description
			}

			if (category !== "About"){
				add_external_annotation(primary_accession, sequence_annotations, data[category], server , category);
			}
		  }
	}
	if(description === ""){
		description = description.concat("<p>This feature collection currently has no description. To add one, ask the author of the JSON file below to add an ‘About’ property (described <a href='http://bit.ly/aquaria-features'>here</a>).</p>")
	}
	else{
		description = description.concat("<p><a href='" + sourceURL + "'>Source</a></p>")
	}

	var clustered_annotations = clusterRegions(sequence_annotations, categories, description, cathDataArr_hc);


	console.log("The clustered annotations are: ");
	console.log(clustered_annotations);

	finishServer(clustered_annotations, primary_accession, featureCallback);

}

function checkURLForFeatures(primary_accession, server, featureCallback){
	var featureRegex = new RegExp(/[A-Z a-z]+[0-9]+[A-za-z]+/)
	var searchParam = decodeURI(window.location.search.split('?')[1])
	// searchParam = searchParam.split('=')[0]

	console.log("The search param is " + searchParam);
	var url = AQUARIA.getUrlParameter("features");
	if (url){
		axios({
			method: 'get',
			url: url
		  })
		.then(function (responseJSON) {
			if(typeof(responseJSON["data"]) != "object"){
				processNextServer(primary_accession,
					featureCallback);
			}
			else{
				parseFeatures(primary_accession, server['Categories'], server['Server'], featureCallback, responseJSON["data"], url)
			}
		})
		//$.getJSON( url, function (responseJSON) { //After load, parse data returned by xhr.responseText
		// parseFeatures(primary_accession, server['Categories'], server['Server'], featureCallback, responseJSON, url);
		// });
	}
	else if (featureRegex.test(searchParam)) {
		// console.log("over here!");
		var data = {}
		var residue;
		var features = searchParam.split('&')
		data['AddedFeatures'] = {}
		data['AddedFeatures'].Features = []
		features.forEach(function(feature){
			if(featureRegex.test(feature)){
				var featureAttributes = {}
				var description = feature.split('=')[1]

				if(description && description.includes('"')){
					description = description.split('"')[1]

				}
				feature = feature.split('=')[0]
				residue = feature.replace(/[A-Za-z$-]/g, "")
				residue = parseInt(residue)
				featureAttributes.Color = "#F73C3C"

				if(description){
					if(description.includes('"')){
						description = description.split('"')[1]
					}
					featureAttributes.Description = description.replace(/%22/g, "")
				}
				else{
					featureAttributes.Description = feature
				}


				featureAttributes.Name =  feature.split(residue)[0][0] + " > " + feature.split(residue)[1][0];



				// console.log(feature.split(residue)[1][0]);
				if(feature.split(residue)[1].toLowerCase() == 'ter'){
					featureAttributes.Residues = [residue, AQUARIA.showMatchingStructures.sequence.length]

					// variantResidues[featureAttributes.Residues[0] + '-' + featureAttributes.Residues[0]] = "";
				}
				else{
					featureAttributes.Residue = residue;
					variantResidues[featureAttributes.Residue] = {};
					variantResidues[featureAttributes.Residue] = {'newResidue': feature.split(residue)[1][0]};
				}
				data['AddedFeatures'].Features.push(featureAttributes)

				// data[feature].URL = feature
			}
		})


		parseFeatures(primary_accession, server['Categories'], server['Server'], featureCallback, data, searchParam)
	}
	else {
		// finishServer(new Array(), primary_accession,
		// 	featureCallback);
		processNextServer(primary_accession,
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
			error: function() {
				var url = `${window.BACKEND}/get_features/${window.location.pathname.split('/')[1]}`;
				axios({
				method: 'get',
				url: url,
				})
				.then(function (response) {
					let orgNames = response.data
					parseFeatures(primary_accession, server['Categories'], server['Server'], featureCallback, JSON.parse(orgNames[0].Features), url)
				})
				// data = AQUARIA.remote.get_features(window.location.pathname.split('/')[1], function(orgNames) {
				// console.log("features.displayOrgSynonyms: " + orgNames[0].Features)
				// })
			  },
			success: function(xml) {
				parseUniprot(xml).then(function(data){
					console.log("The uniprot data are: ");
					console.log(data);

					// Step 1. Get list of variants
					// Step 2.
					// extractVariantInfo(aggregatedAnnotations, data);

					extractVariantInfoFromUniprot(data);
					parseFeatures(primary_accession, server['Categories'], server['Server'], featureCallback, data, url)
				});

			}
	});

};


var checkIfValInSnpResAndAdd = require('./variantResiduesDesc');

function extractVariantInfoFromUniprot(uniprotData){
	console.log("extractVariantInfoFromUniprot");
	let variants_featTypesOfInt = ['Modified residue', 'Mutagenesis site', 'Sequence conflict', 'Sequence variant'];

	for (let featureType in uniprotData){
		console.log("Uniprot: Feature type " + featureType);
		if (uniprotData[featureType].hasOwnProperty('Features')){
			for (let i =0; i< uniprotData[featureType]['Features'].length; i++){
				if (uniprotData[featureType]['Features'][i].hasOwnProperty('Residue')){
					checkIfValInSnpResAndAdd(uniprotData[featureType]['Features'][i]['Residue'][0], uniprotData[featureType]['Features'][i]['Residue'][0], variantResidues, featureType, uniprotData[featureType]['Features'][i]['Name'] + " " + uniprotData[featureType]['Features'][i]['Description'], 'UniProt', variants_featTypesOfInt);
				}
			}
		}
	}

}


module.exports = fetch_annotations;
