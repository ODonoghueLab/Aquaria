const url = require('url');

var variants_featTypesOfInt = ['Conservation'];
var checkIfValInSnpResAndAdd = require('./variantResiduesDesc');

var fs_nameMap = {
	"SECONDARY_STRUCTURE_(REPROF)": "Secondary structure",
	"SOLVENT_ACCESSIBILITY_(REPROF)":"Solvent accessibility",
	"RELATIVE_B-VALUE_(PROF-BVAL)": "Flexibility",
	"CONSERVATION_(CONSEQ)": "Conservation",
	"PROTEIN_BINDING_(PRONA)": "Protein binding",
	"DNA_BINDING_(PRONA)": "DNA binding",
	"DISORDERED_REGION_(META-DISORDER)": "Disorder",
	"NON-REGULAR_SECONDARY_STRUCTURE_(NORS-NET)": "Non-regular secondary structure",
}

module.exports = function (jsonObj, primary_accession, featureCallback, validateAgainstSchema, variantResidues, requestedFeature){


	console.log('variantResidues ' + requestedFeature);
	console.log(variantResidues);



	let aquariaJsonObj = {};

	const features_rost = 'features';

	let convertedFeature = undefined;

	Object.keys(jsonObj).forEach(function(key){
		// console.log(key);

		if (key == features_rost){
			// first; create the 'Feature' property in aquariaJson if not present
			/* if (!aquariaJsonObj.hasOwnProperty(features_od)){
				aquariaJsonObj[features_od] = [];
			} */



			// go through each feature
			jsonObj[key].forEach(function(feature){
				// console.log(feature);
				convertedFeature = convertTheFeature(feature, variantResidues, requestedFeature);
				addToAquariaFeatures(convertedFeature, aquariaJsonObj);

			});
		}

		else{
			// Ignore
			// aquariaJsonObj[key] = jsonObj[key];
		}
	});
	//console.log("Converted PredictProtein")
	//console.log(aquariaJsonObj)

	console.log("The variantResidues ");
	console.log(variantResidues);

	validateAgainstSchema(aquariaJsonObj, primary_accession, featureCallback, 'PredictProtein'); 
	// console.log(aquariaJsonObj);
	//return (aquariaJsonObj);
}

function addToAquariaFeatures(convertedFeature, aquariaJsonObj){
	if (! aquariaJsonObj.hasOwnProperty(convertedFeature.featureKey)){
		aquariaJsonObj[convertedFeature.featureKey] =  {}; // [];
		aquariaJsonObj[convertedFeature.featureKey]['Features'] = [];
	}

	if (convertedFeature.sources.length > 0 && !aquariaJsonObj[convertedFeature.featureKey].hasOwnProperty('Source')){
		aquariaJsonObj[convertedFeature.featureKey]['Source'] = convertedFeature.sources[0];
	}

	if (convertedFeature.urls.length >0 && !aquariaJsonObj[convertedFeature.featureKey].hasOwnProperty('URL')){
		aquariaJsonObj[convertedFeature.featureKey]['URL'] = convertedFeature.urls[0];
	}

	aquariaJsonObj[convertedFeature.featureKey]['Features'].push(convertedFeature.convertedFeature);
}

function convertTheFeature(feature, variantResidues, requestedFeature){


	let featureKey = '';
	let convertedFeature = {};
	let source_evidence = [];
	let url_evidence = [];

	let residue = [-1, -1]
	// console.log(feature);
	Object.keys(feature).forEach(function(key){


		if (key == 'type'){
			if (fs_nameMap.hasOwnProperty(feature[key])){
				featureKey = fs_nameMap[feature[key]];
			}
			else {
				featureKey = feature[key];
			}
		}

		if (key == 'ftId'){
			convertedFeature['Name'] = feature[key];
		}

		if (key == 'description'){
			convertedFeature['Description'] = feature[key];
		}

		if (key == 'begin'){
			residue[0] = feature[key];
		}

		if (key == 'end'){
			residue[1] = feature[key];
		}

		if (key == 'color'){
			convertedFeature['Color'] = feature[key];
		}

		if (key == 'evidences') {
			let sourceAndUrl = handleTheEvidences(feature[key]);

			if(sourceAndUrl.source != ''){
				source_evidence.push(sourceAndUrl.source);
			}
			if (sourceAndUrl.url != ''){
				url_evidence.push(sourceAndUrl.url);
			}
		}




	});

	checkIfValInSnpResAndAdd(residue[0], residue[1], variantResidues, featureKey, convertedFeature['Description'], requestedFeature, variants_featTypesOfInt);



	if (residue[0] == residue[1]){
		convertedFeature['Residue'] = residue[0];
	}
	else{
		convertedFeature['Residues'] = [(residue[0] + '-' + residue[1])];
		// console.log("Predict protein " + convertedFeature['Residues'])
		// console.log(residue);
	}

	/* Added this because ftId is not present in the normal API e.g. https://api.predictprotein.org/v1/results/molart/Q15084 */
	if (!convertedFeature.hasOwnProperty('Name')) {
		convertedFeature['Name'] = convertedFeature.Description;
	}


	return ({'featureKey': featureKey, "convertedFeature": convertedFeature, 'urls': url_evidence, 'sources': source_evidence});
}

/*
function checkIfValInSnpResAndAdd(resStart_pp, resEnd_pp, variantResidues, featureType, description, requestedFeature){
	if (variants_featTypesOfInt.includes(featureType)){
		Object.keys(variantResidues).forEach(function(resSnp, i){
			if (parseInt(resSnp) >= parseInt(resStart_pp) && parseInt(resSnp) <= parseInt(resEnd_pp)){

				variantResidues[resSnp][requestedFeature] = description;
				console.log("restart " + resStart_pp + " resEnd " + resEnd_pp + " featuretype " + featureType + " description " + description + " requestedFeatureSet " + requestedFeature)
			}
		});

	}
}
*/

/* Function to extract url's if present (will later be added to the feature set itself).
*
*/
function handleTheEvidences(evidencesArr){
	let featureSet_source = '';
	let featureSet_url = '';

	evidencesArr.forEach(function(evidence){
		if (evidence.hasOwnProperty('source')){
			if (evidence.source.hasOwnProperty('name')){
				featureSet_source = evidence.source.name;
			}
			if (evidence.source.hasOwnProperty('url')){
				featureSet_url = url.parse(evidence.source.url).host;
			}

		}
	});

	return ({source: featureSet_source, url: featureSet_url})
}
