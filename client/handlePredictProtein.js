const url = require('url');

module.exports = function (jsonObj, primary_accession, featureCallback, validateAgainstSchema){

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
				convertedFeature = convertTheFeature(feature);
				addToAquariaFeatures(convertedFeature, aquariaJsonObj);
			});
		}

		else{
			// Ignore
			// aquariaJsonObj[key] = jsonObj[key];
		}
	});
	console.log(aquariaJsonObj)
	validateAgainstSchema(aquariaJsonObj, primary_accession, featureCallback, 'PredictProtein')
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

function convertTheFeature(feature){
	let featureKey = '';
	let convertedFeature = {};
	let source_evidence = [];
	let url_evidence = [];

	let residue = [-1, -1]
	// console.log(feature);
	Object.keys(feature).forEach(function(key){
		if (key == 'type'){
			featureKey = feature[key];
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


	if (residue[0] == residue[1]){
		convertedFeature['Residue'] = residue[0];
	}
	else{
		convertedFeature['Residues'] = [(residue[0] + '-' + residue[1])];
		console.log("Predict protein " + convertedFeature['Residues'])
		// console.log(residue);
	}

	/* Added this because ftId is not present in the normal API e.g. https://api.predictprotein.org/v1/results/molart/Q15084 */
	if (!convertedFeature.hasOwnProperty('Name')) {
		convertedFeature['Name'] = convertedFeature.Description
	}

	return ({'featureKey': featureKey, "convertedFeature": convertedFeature, 'urls': url_evidence, 'sources': source_evidence});
}

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
