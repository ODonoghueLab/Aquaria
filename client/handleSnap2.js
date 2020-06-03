const url = require('url');

/* Remove additionalProperties & convert string-numbers to numbers */
module.exports = function (jsonObj, primary_accession, featureCallback, validateAgainstSchema){


	// console.log("In the handleSnap2 function")

	let theKeys = Object.keys(jsonObj);

	console.log(theKeys);

	Object.keys(jsonObj).forEach(function(featureSet){
		if (Object.keys(jsonObj[featureSet]).hasOwnProperty('Features')){

		}

		for (let i=0; i< jsonObj[featureSet]['Features'].length; i++){

			if(jsonObj[featureSet]['Features'][i].hasOwnProperty('Residue')){
				// console.log(jsonObj[featureSet]['Features'][i]['Residue'])

				jsonObj[featureSet]['Features'][i]['Residue'] = parseInt(jsonObj[featureSet]['Features'][i]['Residue'])

			}
			if(jsonObj[featureSet]['Features'][i].hasOwnProperty('Residues')){
				jsonObj[featureSet]['Features'][i]['Residues'] = jsonObj[featureSet]['Features'][i]['Residue'].map(function(x){
					return parseInt(x)
				});
				console.log("Snap2 " + jsonObj[featureSet]['Features'][i]['Residues'])
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
