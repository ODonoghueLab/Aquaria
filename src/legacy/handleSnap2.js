const url = require('url');
var checkIfValInSnpResAndAdd = require('./variantResiduesDesc');


var variants_featTypesOfInt = ['Mutational sensitivity (SNAP2 ratio of effect mutations)', 'Mutation score (average SNAP2 score)'];

/* Remove additionalProperties & convert string-numbers to numbers */
module.exports = function (jsonObj, primary_accession, featureCallback, validateAgainstSchema, variantResidues, requestedFeature){


	// console.log("In the handleSnap2 function")

	let theKeys = Object.keys(jsonObj);

	console.log(jsonObj);

	Object.keys(jsonObj).forEach(function(featureSet){
		console.log("%%%% ");
		console.log(featureSet);

		if (Object.keys(jsonObj[featureSet]).hasOwnProperty('Features')){

		}

		for (let i=0; i< jsonObj[featureSet]['Features'].length; i++){

			if(jsonObj[featureSet]['Features'][i].hasOwnProperty('Residue')){
				// console.log(jsonObj[featureSet]['Features'][i]['Residue'])

				jsonObj[featureSet]['Features'][i]['Residue'] = parseInt(jsonObj[featureSet]['Features'][i]['Residue'])

				// console.log('SNAP2: featureSet ' + featureSet + " description " + jsonObj[featureSet]['Features'][i]['Description']);

				// console.log("SNAP2 description is " + jsonObj[featureSet]['Features'][i]['Description'] + " " + featureSet);

				// let descToDisp = getSubstringOfInterest(, variantResidues);
				checkIfValInSnpResAndAdd(jsonObj[featureSet]['Features'][i]['Residue'], jsonObj[featureSet]['Features'][i]['Residue'], variantResidues, featureSet, jsonObj[featureSet]['Features'][i]['Description'], requestedFeature, variants_featTypesOfInt);


			}
			if(jsonObj[featureSet]['Features'][i].hasOwnProperty('Residues')){
				jsonObj[featureSet]['Features'][i]['Residues'] = jsonObj[featureSet]['Features'][i]['Residue'].map(function(x){
					return parseInt(x)
				});
				console.log("Snap2 " +  jsonObj[featureSet]['Features'][i]['Residues'])

				// checkIfValInSnpResAndAdd(jsonObj[featureSet]['Features'][i]['Residue'], jsonObj[featureSet]['Features'][i]['Residue'], variantResidues, featureSet, descToDisp, requestedFeature, variants_featTypesOfInt);
			}
			/* if (jsonObj[featureSet]['Features'][i].hasOwnProperty('Residue')){
				//jsonObj[featureSet]['Features'][i].Residue = parseInt(jsonObj[featureSet]['Features'][i].Residue)
			} */
		}
	})

	validateAgainstSchema(jsonObj, primary_accession, featureCallback, 'SNAP2')
	// return (jsonObj)
}


// module.exports = { handleSnap2 };
