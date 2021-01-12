// var Highcharts = require('highcharts');
var Highcharts = require('./highstocks.js');
var checkIfValInSnpResAndAdd = require('./variantResiduesDesc');
var variantResFeats = ['Structural domain', 'Functional domain'];

// "https://www.cathdb.info/version/latest/superfamily/" 2.60.40.720
// http://www.cathdb.info/version/v4_2_0/superfamily/4.10.170.10/funfam/100

module.exports = {
	handleCathData: handleCath,
	url_funfamInfo: url_funfamInfo,
	url_superfamInfo: url_superfamInfo,
	url_go: url_go,
	url_ec: url_ec,
	url_species: url_species,
	url_ancestors: url_ancestors,
	getFromLocation: getFromLocation,
	handlePromiseData_hc: handlePromiseData_hc,
	handlePromiseData_ancestor: handlePromiseData_ancestor,
	handlePromiseData_sfAndRel: handlePromiseData_sfAndRel,
	// handlePromiseData_ff: handlePromiseData_ff,
	handleEcGoSpecies: handleEcGoSpecies,
	handleResidues_funFam: handleResidues_funFam,

}

function handleCath(jsonObj1, getFeatures, validateAgainstSchema, primary_accession, featureCallback, variantResidues){

	 // console.log("$$$$$$$ Requesting CATH :)");
	 // console.log(jsonObj1);

	// Stage 1:
	let convertedFeatures = {};
	let dataArr_hc = [];
	let hcDataObj = {};// {name}{ec|go|species} = data.
	let featureNames = [];
	let ancestorDataObj = {}; // {superFam} => [class, arch, top, homo, classId, archId, topId, homoId];

	let funFamFeatureSet = [];
	let superFamFeatureSet = [];




	// array of residues; // Map of residues, {FunFam_number} => residues
	if (!jsonObj1.hasOwnProperty('data') || jsonObj1.data.length < 1){
		validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH');
	}


	sendTheMultipleRequests(jsonObj1).then(function(thePromises){
	//Promise.all(promises_funFamInfo).then(function(theData){

		Promise.all(thePromises.promisesGo).then(function(theData){
			return new Promise(function(resolve, reject){
				handlePromiseData_hc(theData, dataArr_hc).then(function(){
					resolve();
				});
			});
		})
		.then(function(){
			return new Promise(function(resolve, reject){
				Promise.all(thePromises.ancestor).then(function(ancestorData){
					handlePromiseData_ancestor(ancestorData, ancestorDataObj).then(function(){
						resolve();
					});
				});
			});
		})
		.then(function(){
			// Superfamilies
			return new Promise(function(resolve, reject){
				Promise.all(thePromises.cathDomains).then(function(superFamRequests){

					handlePromiseData_sfAndRel(superFamRequests, convertedFeatures, ancestorDataObj, dataArr_hc, hcDataObj, thePromises.residues, superFamFeatureSet, variantResidues).then(function(resObj){
						superFamFeatureSet = resObj.superFamFeatureSet;
						convertedFeatures = resObj.convertedFeatures;

						console.log("The hcDataObj is ");
						console.log(hcDataObj);

						resolve();
					});

				});
			});
		})
		.then(function(){
				// functional familes (and send data for validation against schema)
			return new Promise(function(resolve, reject){
				Promise.all(thePromises.funFamInfo).then(function(funFamData){
					handlePromiseData_ff(funFamData, dataArr_hc, hcDataObj, thePromises.residues, superFamFeatureSet, funFamFeatureSet, convertedFeatures, variantResidues).then(function(){

						console.log("The hcDataObj is ");
						console.log(hcDataObj);

						resolve();
					});
				});
			});
		})
		.then(function(){

			validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH', hcDataObj);
		})
		.catch(function(error){
			console.log(" ============= There is an error with CATH features ");
			console.log(error);

			validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH', null);
		});

	});

}


function getAsUrl_sf(name, sf_id){
	console.log("<a href=\"https://www.cathdb.info/version/latest/superfamily/" + sf_id +"\">" + name + "</a>");
	return ("<a href=\"https://www.cathdb.info/version/latest/superfamily/" + sf_id +"\" target=\"_blank\">" + name + "</a>");
}

function getAsUrl_ff(name, sf_id, ff_id){

	let url_ff = 'https://www.cathdb.info/version/v4_3_0/superfamily/' + sf_id + '/funfam/' + ff_id;
	console.log("<a href=\'" + url_ff + "\'>" + name + "</a>");
	return ("<a href=\'" + url_ff + "\' target=\"_blank\" >" + name + "</a>");
}


function getRequestProtocol(){
	let arr = window.location.href.split(/\:+/);
	// console.log("The request protocol is " + arr[0]);
	return (arr[0]);
}
function url_funfamInfo(superfam_id, funfam_id){

	return (getRequestProtocol() + "://www.cathdb.info/version/v4_3_0/api/rest/superfamily/" + superfam_id + "/funfam/" + funfam_id);
}


function url_superfamInfo(superfam_id){
	return (getRequestProtocol() +  "://www.cathdb.info/version/v4_3_0/api/rest/superfamily/" + superfam_id);
}

function url_go(superfam_id){
	return (getRequestProtocol() + "://www.cathdb.info/version/v4_3_0/superfamily/" + superfam_id + "/highcharts/go");
}

function url_ec(superfam_id){
	return (getRequestProtocol() + "://www.cathdb.info/version/v4_3_0/superfamily/" + superfam_id + "/highcharts/ec");
}

function url_species(superfam_id){
	return (getRequestProtocol() + "://www.cathdb.info/version/v4_3_0/superfamily/" + superfam_id + "/highcharts/species");
}

function url_ancestors(superfam_id){
	return (getRequestProtocol() + "://www.cathdb.info/version/v4_3_0/api/rest/cathtree/cath_id_ancestors/" + superfam_id);
}

function handlePromiseData_ff(funFamData, dataArr_hc, hcDataObj, residues_, superFamFeatureSet, funFamFeatureSet, convertedFeatures, variantResidues){
	return new Promise(function(resolve, reject){

		let keyFunFam = "Functional families";

		funFamData.forEach(function(aFunFam, i){


			let aFunFamFeature = {};

			// let aSuperFamFeature = {};

			if (aFunFam.hasOwnProperty('data') && aFunFam.data.hasOwnProperty('data')){

				// name
				if (aFunFam.data.data.hasOwnProperty('name')){
					aFunFamFeature['Name'] = '<span class=\"popupTitle\"> <i>CATH Functional Family</i>: ';

					if (aFunFam.data.data.hasOwnProperty('superfamily_id') && aFunFam.data.data.hasOwnProperty('funfam_number') ){
						aFunFamFeature['Name'] = aFunFamFeature['Name']  + 	getAsUrl_ff(aFunFam.data.data.name, aFunFam.data.data.superfamily_id, aFunFam.data.data.funfam_number)
					}
					else{
						aFunFamFeature['Name'] = aFunFamFeature['Name']  + aFunFam.data.data.name;
					}
					aFunFamFeature['Name'] = aFunFamFeature['Name']  + "</span>";

					aFunFamFeature['Name'] = aFunFamFeature['Name'] + '$$' + i;
				}
				else if (aFunFam.data.data.hasOwnProperty('funfam_number')) {
					aFunFamFeature['Name'] = '<span class=\"popupTitle\"> <i>CATH Functional Family</i>: ';

					if (aFunFam.data.data.hasOwnProperty('superfamily_id')) {
						aFunFamFeature['Name'] = aFunFamFeature['Name']  + getAsUrl_ff(aFunFam.data.data.funfam_number, aFunFam.data.data.superfamily_id, aFunFam.data.data.funfam_number);
					}
					else{
						aFunFamFeature['Name'] = aFunFamFeature['Name'] + aFunFam.data.data.funfam_number;
					}

					aFunFamFeature['Name'] = aFunFamFeature['Name'] + "</span>";

					aFunFamFeature['Name'] = aFunFamFeature['Name'] + '$$' + i;
				}




				if (Object.keys(aFunFam).length > 0){

					hcDataObj = handleEcGoSpecies(dataArr_hc, i, aFunFamFeature['Name'], hcDataObj);
					// find a superFam with same residue ranges.
					let funFamFeat_res = handleResidues_funFam(residues_[i], superFamFeatureSet, aFunFamFeature['Name'], variantResidues);


					if (Object.keys(funFamFeat_res).length > 0){
						// add to set.
						funFamFeatureSet = funFamFeatureSet.concat(funFamFeat_res);

					}
				}

			}


			if (i == (funFamData.length - 1)){
				convertedFeatures[keyFunFam] = {};
				convertedFeatures[keyFunFam]["Features"] = funFamFeatureSet;
				// console.log("@@@@@@@@@@ ");
				// console.log(funFamFeatureSet);
				resolve();
			}
		});

	});
}


function handlePromiseData_sfAndRel(superFamRequests, convertedFeatures, ancestorDataObj, dataArr_hc, hcDataObj, residues_, superFamFeatureSet, variantResidues){
	return new Promise(function(resolve, reject){

		let keySuperFam = "Structural domains";

		superFamRequests.forEach(function(aSuperFam, i){
			// console.log(aSuperFam);

			let aSuperFamFeature = {};
			let aSuperFam_description = "";

			if (aSuperFam.hasOwnProperty('data') && aSuperFam.data.hasOwnProperty('data')){

				// name
				if (aSuperFam.data.data.hasOwnProperty('classification_name') && aSuperFam.data.data.classification_name != null){
					aSuperFamFeature['Name'] = '<span class=\"popupTitle\"> <i> CATH Superfamily</i>: ';

					if (aSuperFam.data.data.hasOwnProperty('classification_name')){
						aSuperFamFeature['Name'] = aSuperFamFeature['Name']  + getAsUrl_sf(aSuperFam.data.data.classification_name, aSuperFam.data.data.superfamily_id);
					}
					else {
						aSuperFamFeature['Name'] = aSuperFamFeature['Name']  + aSuperFam.data.data.classification_name;
					}
					aSuperFamFeature['Name'] = aSuperFamFeature['Name']  + "</span>";



				}
				else if (aSuperFam.data.data.hasOwnProperty('superfamily_id') && aSuperFam.data.data.superfamily_id != null){
					aSuperFamFeature['Name'] = '<span class=\"popupTitle\"> <i>CATH Superfamily</i>: ' + getAsUrl_sf(aSuperFam.data.data.superfamily_id, aSuperFam.data.data.superfamily_id)  + "</span>";
				}
				else{
					aSuperFamFeature['Name'] = "<span class=\"popupTitle\"><i>CATH Superfamily</i>: Unknown</span>";
				}


				// description
				if ( aSuperFam.data.data.hasOwnProperty('example_domain_id')){
					// console.log("Coming here!");
					// console.log(aSuperFam.data.data.superfamily_id);
					// console.log(ancestorDataObj[aSuperFam.data.data.superfamily_id]);

					if (aSuperFam.data.data.hasOwnProperty('superfamily_id') && aSuperFam.data.data.superfamily_id != null && ancestorDataObj.hasOwnProperty(aSuperFam.data.data.superfamily_id)){
						let theCath = ancestorDataObj[aSuperFam.data.data.superfamily_id];

						if (theCath[4] != ''){
							aSuperFam_description =  "<br><i>Topology</i>: " + theCath[4] + "<br>";
						}
						else {
							aSuperFam_description = aSuperFam_description + "<i>Topology</i>: " + theCath[4] + "<br>";
						}

						if (theCath[2] != ''){
							aSuperFam_description = aSuperFam_description + "<i>Architecture</i>: " + theCath[2] + "<br>";
						}
						else{
							aSuperFam_description = aSuperFam_description + "<i>Architecture</i>: " + theCath[3] + "<br>";
						}


						if (theCath[0] != ''){
							aSuperFam_description = aSuperFam_description + "<i>Class</i>: " + theCath[0] + "<br>";
						}
						else {
							aSuperFam_description = "<br> <i>Class</i>: " + theCath[1] + "<br>";
						}




						if (theCath[6] != ''){
							// Update name, because this one seems much more correct.
							aSuperFamFeature['Name'] = '<span class=\"popupTitle\"> <i> CATH Superfamily </i>: ' +  getAsUrl_sf(theCath[6], aSuperFam.data.data.superfamily_id) + "</span>";

							// aSuperFam_description = aSuperFam_description + "<i>Homologous superfamily</i>: " + theCath[6] + "<br>";
						}
						/*
						else {
							aSuperFam_description = aSuperFam_description + "<i>Homologous superfamily</i>: " + aSuperFam.data.data.superfamily_id + "<br>";

						}
						*/






					}

					aSuperFam_description = aSuperFam_description + " <br>  <div style='height:150px; width:445px;'> <div class='row'> <div class='column' id='hc_go'> <center> <p class='popupText'> Gene annotation </p>  </center> </div> <div class='column' id='hc_ec'> <center> <p class='popupText'> Enzymatic class  </p> </center> </div> <div class='column' id='hc_species'> <center> <p class='popupText'> Species diversity  </p> </center> </div> <div class='column'> <center> <img src='" + getRequestProtocol()  + "://www.cathdb.info/version/v4_3_0/api/rest/id/" + aSuperFam.data.data.example_domain_id + ".png?size=M' width='100' height='100' /> <a href=\"https://www.cathdb.info/version/latest/domain/" +  aSuperFam.data.data.example_domain_id +  "\"  target=\"_blank\"> Example structure </a> </center> </div> </div>";



				}

				if (Object.keys(aSuperFamFeature).length > 0){
					hcDataObj = handleEcGoSpecies(dataArr_hc, i, aSuperFamFeature['Name'], hcDataObj);
					let superFameFeat_res = handleResidues(residues_[i], aSuperFamFeature['Name'], aSuperFam_description, variantResidues);
					// console.log("The converted array is");
					// console.log(dataArr_hc);


					if (Object.keys(superFameFeat_res).length > 0){
						// add to set.
						superFamFeatureSet = superFamFeatureSet.concat(superFameFeat_res);
					}

				}
			}


			if (i == (superFamRequests.length - 1)){


				convertedFeatures[keySuperFam] = {};
				convertedFeatures[keySuperFam]["Features"] = superFamFeatureSet;


				resolve({'convertedFeatures': convertedFeatures, superFamFeatureSet: superFamFeatureSet});
				// resolve({convertedFeatures: convertedFeatures, superFamFeatureSet: superFamFeatureSet, });
				/* SuperFams only yet!
				console.log("The hc dataObj is");
				console.log(hcDataObj);
				validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH', hcDataObj); */
			}
		});

	});
}

function handlePromiseData_ancestor(ancestorData, ancestorDataObj){
	return new Promise(function(resolve, reject){
		ancestorData.forEach(function(anAncestor, i){
			let class_cath = '';
			let architechture_cath = '';
			let topology_cath = '';
			let homologousSuperfam_cath = '';

			let classId_cath = '';
			let architechtureId_cath = '';
			let topologyId_cath = '';
			let homologousSuperfamId_cath = '';

			if (anAncestor.hasOwnProperty('data') && anAncestor.data.hasOwnProperty('ROOT') && anAncestor.data.ROOT.hasOwnProperty('children') && anAncestor.data.ROOT.children.length > 0){


				if (anAncestor.data.ROOT.children[0].hasOwnProperty('name')){
					class_cath = anAncestor.data.ROOT.children[0].name;
				}
				if (anAncestor.data.ROOT.children[0].hasOwnProperty('cath_id')){
					classId_cath = anAncestor.data.ROOT.children[0].cath_id;
				}

				if (anAncestor.data.ROOT.children[0].hasOwnProperty('children') && anAncestor.data.ROOT.children[0].children.length > 0 && anAncestor.data.ROOT.children[0].children[0].hasOwnProperty('name')){
					architechture_cath = anAncestor.data.ROOT.children[0].children[0].name;
				}
				if (anAncestor.data.ROOT.children[0].hasOwnProperty('children') && anAncestor.data.ROOT.children[0].children.length > 0 && anAncestor.data.ROOT.children[0].children[0].hasOwnProperty('cath_id')){
					architechtureId_cath = anAncestor.data.ROOT.children[0].children[0].cath_id;
				}

				if (anAncestor.data.ROOT.children[0].children[0].hasOwnProperty('children') && anAncestor.data.ROOT.children[0].children[0].children.length > 0 && anAncestor.data.ROOT.children[0].children[0].children[0].hasOwnProperty('name')){
					topology_cath = anAncestor.data.ROOT.children[0].children[0].children[0].name;
				}
				if (anAncestor.data.ROOT.children[0].children[0].hasOwnProperty('children') && anAncestor.data.ROOT.children[0].children[0].children.length > 0 && anAncestor.data.ROOT.children[0].children[0].children[0].hasOwnProperty('cath_id')){
					topologyId_cath = anAncestor.data.ROOT.children[0].children[0].children[0].cath_id;
				}

				if (anAncestor.data.ROOT.children[0].children[0].children[0].hasOwnProperty('children') && anAncestor.data.ROOT.children[0].children[0].children[0].children.length > 0 && anAncestor.data.ROOT.children[0].children[0].children[0].children[0].hasOwnProperty('name')){
					homologousSuperfam_cath = anAncestor.data.ROOT.children[0].children[0].children[0].children[0].name;
				}
				if (anAncestor.data.ROOT.children[0].children[0].children[0].hasOwnProperty('children') && anAncestor.data.ROOT.children[0].children[0].children[0].children.length > 0 && anAncestor.data.ROOT.children[0].children[0].children[0].children[0].hasOwnProperty('cath_id')){
					homologousSuperfamId_cath = anAncestor.data.ROOT.children[0].children[0].children[0].children[0].cath_id;
				}
			}

			/*
			console.log("Class " + class_cath + " " + classId_cath);
			console.log("Architechture " + architechture_cath + " " + architechtureId_cath);
			console.log("Topology " + topology_cath + " " + topologyId_cath);
			console.log("Homologous superfamily " + homologousSuperfam_cath + " " + homologousSuperfamId_cath);
			*/


			ancestorDataObj = addToDict_sfToArray(ancestorDataObj, class_cath, classId_cath, architechture_cath, architechtureId_cath, topology_cath, topologyId_cath, homologousSuperfam_cath, homologousSuperfamId_cath);

			if (i == (ancestorData.length - 1)){
				// console.log("ANCESTORY DATA OBJ IS ");
				// console.log(ancestorDataObj);
				resolve();
			}

		});
	});
}

function handlePromiseData_hc(theData, dataArr_hc){
	// 1. Add data to hidden div.
	return new Promise(function(resolve, reject){
		theData.forEach(function(theRes, i){
			// let newChartId = null;
			dataArr_hc.push(theRes);
			if(i == theData.length - 1){
				resolve();
			}
		});
	});
}


function addToDict_sfToArray(ancestorDataObj, class_cath, classId_cath, architechture_cath, architechtureId_cath, topology_cath, topologyId_cath, homologousSuperfam_cath, homologousSuperfamId_cath){

	if (homologousSuperfamId_cath !== ''){
		ancestorDataObj[homologousSuperfamId_cath] = [class_cath, classId_cath, architechture_cath, architechtureId_cath, topology_cath, topologyId_cath, homologousSuperfam_cath];
	}

	return ancestorDataObj;
}

// http://www.cathdb.info/version/v4_2_0/superfamily/1.10.8.10/highcharts/ec
function handleResidues(res, featureName, description, variantResidues){

	let features = [];

	let re = new RegExp("\-");

	if (!Array.isArray(res)){
		console.log("HERE HERE HERE HERE HERE ");
		console.log(res);
		if (re.test(res)){
			let theResToDel = res.split(/\-/).map(Number)
			features.push({'Name': featureName, 'Residues': theResToDel, 'Description': description});

			checkIfValInSnpResAndAdd(theResToDel[0], theResToDel[1], variantResidues, 'Structural domain', featureName, 'CATH', variantResFeats);
		}
		else{
			features.push({'Name': featureName, 'Residue': res, 'Description': description});
			checkIfValInSnpResAndAdd(item, item, variantResidues, 'Structural domain', featureName, 'CATH', variantResFeats);

		}
	}
	else {
		res.forEach(function(item, i){
			console.log("HERE HERE HERE HERE HERE ");
			console.log(item);
			if (re.test(item)){
				let theResToDel = item.split(/\-/).map(Number)
				features.push({'Name': featureName, 'Residues': theResToDel, 'Description': description});

				checkIfValInSnpResAndAdd(theResToDel[0], theResToDel[1], variantResidues, 'Structural domain', featureName, 'CATH', variantResFeats);
			}
			else{
				features.push({'Name': featureName, 'Residue': item, 'Description': description});

				checkIfValInSnpResAndAdd(item, item, variantResidues, 'Structural domain', featureName, 'CATH', variantResFeats);
			}
		});
	}

	return (features);
}

function addToArray_features(features, resKey, superFamArr, idx_superFam, funFamName){


	let desc = superFamArr[idx_superFam].Name.replace('CATH ', '');
	// Replace span open and close tags
	desc = desc.replace(/\<span[^\>\<]*\>/g, '');
	desc = desc.replace(/\<\/span\>/g, '');
	//desc = desc.replace('Superfamily', '<i>Superfamily</i>');

	desc = '<br>' + desc + superFamArr[idx_superFam].Description;

	let newObj = {};
	newObj['Name'] = funFamName;
	newObj[resKey] = superFamArr[idx_superFam][resKey];
	newObj['Description'] = desc;

	features.push(newObj);

	return (features);
}


function handleResidues_funFam(res, superFamArr, funFamName, variantResidues){
	console.log("In the funfam handle residues " + funFamName);
	let features = [];

	let re = new RegExp("\-");
	if (!Array.isArray(res)){

		if (re.test(res)){
			let theResToDel = res.split(/\-/).map(Number);
			let idx_superFam = findSuperFamWithRes(theResToDel, superFamArr);

			checkIfValInSnpResAndAdd(theResToDel[0], theResToDel[1], variantResidues, 'Functional domain', funFamName, 'CATH', variantResFeats);

			if (idx_superFam > -1){
				// to add now.

				features = addToArray_features(features, 'Residues', superFamArr, idx_superFam, funFamName);


			}
			//features.push({'Name': featureName, 'Residues': theResToDel, 'Description': description});
		}
		else{
			let idx_superFam = findSuperFamWithRes(res, superFamArr);
			//features.push({'Name': featureName, 'Residue': item, 'Description': description});

			checkIfValInSnpResAndAdd(res, res, variantResidues, 'Functional domain', funFamName, 'CATH', variantResFeats);

			if (idx_superFam > -1){
				// to add now.

				features = addToArray_features(features, 'Residue', superFamArr, idx_superFam, funFamName);
			}
		}
	}
	else {
		res.forEach(function(item, i){
			if (re.test(item)){

				let theResToDel = item.split(/\-/).map(Number);
				let idx_superFam = findSuperFamWithRes(theResToDel, superFamArr);

				checkIfValInSnpResAndAdd(theResToDel[0], theResToDel[1], variantResidues, 'Functional domain', funFamName, 'CATH', variantResFeats);
				//features.push({'Name': featureName, 'Residues': theResToDel, 'Description': description});
				if (idx_superFam > -1){
					// to add now.
					features = addToArray_features(features, 'Residues', superFamArr, idx_superFam, funFamName);
				}
			}
			else{

				checkIfValInSnpResAndAdd(item, item, variantResidues, 'Functional domain', funFamName, 'CATH', variantResFeats);
				//features.push({'Name': featureName, 'Residue': item, 'Description': description});
				if (idx_superFam > -1){
					// to add now.
					features = addToArray_features(features, 'Residue', superFamArr, idx_superFam, funFamName);
				}
			}
		});
	}

	return (features);
}

function findSuperFamWithRes(res, superFamArr){

	let toReturnIdx = -1;

	superFamArr.forEach(function(superFam, superFam_i){

		// console.log('Residues ');
		// console.log(res);
		let residue_superFam = "";



		if (superFam.hasOwnProperty('Residue')){
			residue_superFam = superFam.Residue;
		}
		else if (superFam.hasOwnProperty('Residues')){
			residue_superFam = superFam.Residues;
		}

		if (JSON.stringify(res) == JSON.stringify(residue_superFam)){
			toReturnIdx = superFam_i;
		}
	});

	return (toReturnIdx);
}

function handleEcGoSpecies(dataArr_hc, idx, name, hcDataObj){

	if (!hcDataObj.hasOwnProperty(name)){
		hcDataObj[name] = {};
		hcDataObj[name]['go'] = dataArr_hc[(idx * 3)];
		hcDataObj[name]['ec'] = dataArr_hc[((idx * 3) + 1)];
		hcDataObj[name]['species'] = dataArr_hc[((idx * 3) + 2)];;
	}

	return(hcDataObj);
}


// http://www.cathdb.info/version/v4_2_0/superfamily/1.10.8.10/highcharts/go
// http://www.cathdb.info/version/v4_2_0/superfamily/1.10.8.10/highcharts/ec
function sendTheMultipleRequests(jsonObj1){
	// also extracts residues,

	return new Promise(function(resolve, reject){

		let promises_funFamInfo = [];
		let promises_superfamilyId = [];
		let promises_ancestors = [];
		let residues = [];
		let encountered_str = [];

		let promises_go = [];

		jsonObj1.data.forEach(function(funFam, i){
			if (funFam.hasOwnProperty('member_id') &&  funFam.hasOwnProperty('funfam_number') && funFam.hasOwnProperty('superfamily_id')){

				let aResidue = funFam.member_id.split('/')[1];

				if (!encountered_str.includes(aResidue)){
					// FunFam info (part 1)
					promises_funFamInfo.push(getFromLocation(url_funfamInfo(funFam.superfamily_id, funFam.funfam_number)));

					// Highchart plots (part 2_1)
					// console.log("The superfamily id is: " + funFam.superfamily_id);
					promises_go.push(getFromLocation(url_go(funFam.superfamily_id)));

					promises_go.push(getFromLocation(url_ec(funFam.superfamily_id)));

					promises_go.push(getFromLocation(url_species(funFam.superfamily_id)));
					// part2_2


					// Cath domain info. (part 1)
					promises_superfamilyId.push(getFromLocation(url_superfamInfo(funFam.superfamily_id)));

					// Cath ancestor info. (i.e. class, architechture & topology);
					promises_ancestors.push(getFromLocation(url_ancestors(funFam.superfamily_id)));

					encountered_str.push(aResidue);

					residues.push(aResidue.split(/\_+/));
					// console.log("a residue is:" + aResidue);

				}


			}


			if (i == (jsonObj1.data.length -1)){
				/* Promise.all(arrPromises_funFamInfo).then(function(theData){
					resolve(theData);
				}) */
				//console.log(" i is " + i)
				//console.log(jsonObj1.data.length)

				resolve({'funFamInfo': promises_funFamInfo, 'cathDomains': promises_superfamilyId, 'residues': residues, 'promisesGo': promises_go, 'ancestor': promises_ancestors});
			}
		});
		//console.log(promises_funFamInfo)
		//return (promises_funFamInfo)
	});

}

function createADiv(rootDiv, newDivId){
	let newDiv = document.createElement('div');
	newDiv.id = newDivId;
	newDiv.style = "width: 100px; height: 100px; margin: 0 auto";

	document.getElementById(rootDiv).appendChild(newDiv);

	return (newDivId)
}



var axios = require('axios')
function getFromLocation(url){
	return new Promise(function(resolve, reject){
		let featuresFromExtServer = {};

		axios({
			method: 'get',
			url: url,
		})
		.then(function (response) {
			// handle success
			// console.log("Success");
			// console.log(response.data);
			featuresFromExtServer['status'] = "success";
			featuresFromExtServer['data'] = response.data;
			resolve(featuresFromExtServer)
		})
		.catch(function (error) {
			// handle error
			console.log("Error");
			console.log(error);

			featuresFromExtServer['status'] = "error";
			resolve(featuresFromExtServer)
		});
	})
}



function addToConvertedFeature(convertedFeatures, featureKey, aFeature){
	// console.log(featureKey)
	if(!convertedFeatures.hasOwnProperty(featureKey)){
		convertedFeatures[featureKey] = {}
		convertedFeatures[featureKey]['Features'] = []
	}

	convertedFeatures[featureKey]['Features'].push(aFeature)

	return (convertedFeatures)
}
