const url = require('highcharts');

 module.exports = function (jsonObj1, getFeatures, validateAgainstSchema, primary_accession, featureCallback){

	 console.log("$$$$$$$ Requesting CATH :)")
	 console.log(jsonObj1);

	// Stage 1:
	let convertedFeatures = {};
	let featureNames = []

	let funFamFeatureSet = []
	let superFamFeatureSet = []

	let keyFunFam = "Functional families (CATH-FunFams)"
	let keySuperFam = "Structural domains (CATH-SuperFamilies)"

	// array of residues; // Map of residues, {FunFam_number} => residues
	if (!jsonObj1.hasOwnProperty('data') || jsonObj1.data.length < 1){
		validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH')
	}
	sendTheMultipleRequests(jsonObj1).then(function(thePromises){
	//Promise.all(promises_funFamInfo).then(function(theData){
	Promise.all(thePromises.funFamInfo.concat(thePromises.cathDomains)).then(function(allTheData){

		//console.log("All the data")
		//console.log(allTheData)
		let trueNumOfFeatures = allTheData.length/2;

		// console.log(allTheData.length/2)
		allTheData.forEach(function(theRes, i){

			if (i < trueNumOfFeatures){
				// FunFam name.
				if (theRes.hasOwnProperty('data') && theRes['data'].hasOwnProperty('data') && theRes['data']['data'].hasOwnProperty('name')){

					featureNames.push(theRes.data.data.name)

				}
				else{
					featureNames.push(null)
				}

			}
			else {
				// handle cath domains

				let aConvertedFeature = {}
				let aFunFamFeature = {}
				let aSuperFamFeature = {}
				let aSuperFam_description = ""

				// name
				if (theRes.hasOwnProperty('data') && theRes['data'].hasOwnProperty('data')){
					console.log("The res")
					console.log(theRes);

					if (featureNames[i-trueNumOfFeatures] != null){
						aConvertedFeature['Name'] = "Functional family: " + featureNames[i-trueNumOfFeatures]

						// Add a functional family feature
						aFunFamFeature['Name'] = featureNames[i-trueNumOfFeatures]
					}

					if (theRes.data.data.hasOwnProperty('classification_name') && theRes.data.data.classification_name != null){
						// Add a super family feature
						aConvertedFeature['Name'] = "Superfam classification name: " + theRes.data.data.classification_name

						aSuperFamFeature['Name'] = theRes.data.data.classification_name
					}
					else if (theRes.data.data.hasOwnProperty('superfamily_id') && theRes.data.data.superfamily_id != null){
						aConvertedFeature['Name'] = "Superfamily ID: " + theRes.data.data.superfamily_id

						aSuperFamFeature['Name'] = theRes.data.data.superfamily_id

					}

					/*
					else if (theRes.data.data.hasOwnProperty('cath_id') && theRes.data.data.cath_id != null){
						aConvertedFeature['Name'] = "Superfamily ID: " + theRes.data.data.cath_id
					}
					else{
						aConvertedFeature['Name'] = "Unknown"
					}
					*/





					// description
					if (theRes.hasOwnProperty('data') && theRes['data'].hasOwnProperty('data') && theRes['data']['data'].hasOwnProperty('example_domain_id')){
						aSuperFam_description = "<i>Shown here is example domain:</i> <a href=\"https://www.cathdb.info/version/latest/domain/" +  theRes.data.data.example_domain_id +  "\" target=\"_blank\"> " + theRes.data.data.example_domain_id + " </a> <br> <img src='http://www.cathdb.info/version/v4_1_0/api/rest/id/" + theRes.data.data.example_domain_id + ".png?size=M' width='200' height='200' />"
					}


					if (Object.keys(aFunFamFeature).length > 0){
						let funFameFeat_res = handleResidues(thePromises.residues[i - trueNumOfFeatures], featureNames[i-trueNumOfFeatures], '')

						if (Object.keys(funFameFeat_res).length > 0){
							// add to set.
							funFamFeatureSet = funFamFeatureSet.concat(funFameFeat_res)

						}
					}



					if (Object.keys(aSuperFamFeature).length > 0){
						let superFameFeat_res = handleResidues(thePromises.residues[i - trueNumOfFeatures], featureNames[i-trueNumOfFeatures], aSuperFam_description)

						if (Object.keys(superFameFeat_res).length > 0){
							// add to set.
							superFamFeatureSet = superFamFeatureSet.concat(superFameFeat_res)

						}
					}


					// convertedFeatures = addToConvertedFeature(convertedFeatures, featureNames[i-trueNumOfFeatures], aConvertedFeature)

				}


			}

			// console.log("Counter " + i + " " + allTheData.length)
			if (i == (allTheData.length - 1)){



				convertedFeatures[keyFunFam] = {}
				convertedFeatures[keyFunFam]["Features"] = funFamFeatureSet

				convertedFeatures[keySuperFam] = {}
				convertedFeatures[keySuperFam]["Features"] = superFamFeatureSet


				console.log("The fun fam feature set")
				console.log(funFamFeatureSet)

				console.log("The fun fam feature set")
				console.log(superFamFeatureSet)

				console.log("The converted features are:  ");
				console.log(convertedFeatures);


				validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH')
				// return (convertedFeatures)
			}
		})
	}).catch(function(error){
		console.log("There was an error")
		console.log(error)

		validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH')
	})

	})
	.catch(function(error){
		console.log("Encountered error when sending requests to CATH")
		console.log(error);

		validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH')
	})

	return convertedFeatures

}
// http://www.cathdb.info/version/v4_2_0/superfamily/1.10.8.10/highcharts/ec
function handleResidues(res, featureName, description){

	let features = []


	/* if (theResidue.length == 1){
		// Add to feature set.
		features.append({'Name': featureName, 'Residue':theResidue, 'Description': description})
	}
	else { */
	let re = new RegExp("\-")

	if (!Array.isArray(res)){

		if (re.test(item)){
			let theResToDel = item.split(/\-/).map(Number)
			features.push({'Name': featureName, 'Residues': theResToDel, 'Description': description})
		}
		else{
			features.push({'Name': featureName, 'Residue': item, 'Description': description})
		}
	}
	else {
		res.forEach(function(item, i){
			if (re.test(item)){
				let theResToDel = item.split(/\-/).map(Number)
				features.push({'Name': featureName, 'Residues': theResToDel, 'Description': description})
			}
			else{
				features.push({'Name': featureName, 'Residue': item, 'Description': description})
			}
		});
	}


	// }

	return (features);
}


function sendTheMultipleRequests(jsonObj1){
	// also extracts residues,

	return new Promise(function(resolve, reject){

		let promises_funFamInfo = []
		let promises_superfamilyId = []
		let residues = [];
		let encountered_str = [];

		jsonObj1.data.forEach(function(funFam, i){
			if (funFam.hasOwnProperty('member_id') &&  funFam.hasOwnProperty('funfam_number') && funFam.hasOwnProperty('superfamily_id')){

				let aResidue = funFam.member_id.split('/')[1];

				if (!encountered_str.includes(aResidue)){
					// FunFam info
					promises_funFamInfo.push(getFromLocation("http://www.cathdb.info/version/v4_1_0/api/rest/superfamily/" + funFam.superfamily_id + "/funfam/" + funFam.funfam_number))

					// Cath domain info.
					promises_superfamilyId.push(getFromLocation("http://www.cathdb.info/version/v4_1_0/api/rest/superfamily/" + funFam.superfamily_id))

					encountered_str.push(aResidue)

					residues.push(aResidue.split(/\_+/))
					console.log("a residue is:" + aResidue)

				}


			}


			if (i == (jsonObj1.data.length -1)){
				/* Promise.all(arrPromises_funFamInfo).then(function(theData){
					resolve(theData);
				}) */
				//console.log(" i is " + i)
				//console.log(jsonObj1.data.length)

				resolve({'funFamInfo': promises_funFamInfo, 'cathDomains': promises_superfamilyId, 'residues': residues});
			}
		});
		//console.log(promises_funFamInfo)
		//return (promises_funFamInfo)
	});

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
	console.log(featureKey)
	if(!convertedFeatures.hasOwnProperty(featureKey)){
		convertedFeatures[featureKey] = {}
		convertedFeatures[featureKey]['Features'] = []
	}

	convertedFeatures[featureKey]['Features'].push(aFeature)

	return (convertedFeatures)
}