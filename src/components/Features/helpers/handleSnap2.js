const url = require('url')
var checkIfValInSnpResAndAdd = require('./variantResiduesDesc')

var variants_featTypesOfInt = ['Mutational sensitivity (SNAP2 ratio of effect mutations)', 'Mutation score (average SNAP2 score)', 'Mutation to Y score (SNAP2)', 'Mutation to W score (SNAP2)', 'Mutation to V score (SNAP2)', 'Mutation to T score (SNAP2)', 'Mutation to S score (SNAP2)', 'Mutation to R score (SNAP2)', 'Mutation to Q score (SNAP2)', 'Mutation to P score (SNAP2)', 'Mutation to N score (SNAP2)', 'Mutation to M score (SNAP2)', 'Mutation to L score (SNAP2)', 'Mutation to K score (SNAP2)', 'Mutation to I score (SNAP2)', 'Mutation to H score (SNAP2)', 'Mutation to G score (SNAP2)', 'Mutation to F score (SNAP2)', 'Mutation to E score (SNAP2)', 'Mutation to D score (SNAP2)', 'Mutation to C score (SNAP2)', 'Mutation to A score (SNAP2)']

/* Remove additionalProperties & convert string-numbers to numbers */
module.exports = function (jsonObj, primary_accession, featureCallback, validateAgainstSchema, variantResidues, requestedFeature) {
  // console.log("In the handleSnap2 function")

  const theKeys = Object.keys(jsonObj)

  console.log(jsonObj)

  Object.keys(jsonObj).forEach(function (featureSet) {
    // console.log("%%%% ");
    // console.log("Feature set is " + featureSet);

    if (Object.keys(jsonObj[featureSet]).hasOwnProperty('Features')) {

    }

    for (let i = 0; i < jsonObj[featureSet].Features.length; i++) {
      if (jsonObj[featureSet].Features[i].hasOwnProperty('Residue')) {
        // console.log(jsonObj[featureSet]['Features'][i]['Residue'])

        jsonObj[featureSet].Features[i].Residue = parseInt(jsonObj[featureSet].Features[i].Residue)

        // console.log('SNAP2: featureSet ' + featureSet + " description " + jsonObj[featureSet]['Features'][i]['Description']);

        // console.log("SNAP2 description is " + jsonObj[featureSet]['Features'][i]['Description'] + " " + featureSet);

        // let descToDisp = getSubstringOfInterest(, variantResidues);
        checkIfValInSnpResAndAdd(jsonObj[featureSet].Features[i].Residue, jsonObj[featureSet].Features[i].Residue, variantResidues, featureSet, jsonObj[featureSet].Features[i].Name + ';' + jsonObj[featureSet].Features[i].Description, requestedFeature, variants_featTypesOfInt)
      }
      if (jsonObj[featureSet].Features[i].hasOwnProperty('Residues')) {
        jsonObj[featureSet].Features[i].Residues = jsonObj[featureSet].Features[i].Residue.map(function (x) {
          return parseInt(x)
        })
        // console.log("Snap2 " +  jsonObj[featureSet]['Features'][i]['Residues'])

        // checkIfValInSnpResAndAdd(jsonObj[featureSet]['Features'][i]['Residue'], jsonObj[featureSet]['Features'][i]['Residue'], variantResidues, featureSet, descToDisp, requestedFeature, variants_featTypesOfInt);
      }
      /* if (jsonObj[featureSet]['Features'][i].hasOwnProperty('Residue')){
				//jsonObj[featureSet]['Features'][i].Residue = parseInt(jsonObj[featureSet]['Features'][i].Residue)
			} */
    }
  })

  // Remove all the objects with keys which start with "Mutation to"
  for (const i in theKeys) {
    if (theKeys[i].match(/^Mutation to/)) {
      // console.log ("snap2 a key is " + theKeys[i]);
      delete jsonObj[theKeys[i]]
    }
  }

  validateAgainstSchema(jsonObj, primary_accession, featureCallback, 'SNAP2')
  // return (jsonObj)
}

// module.exports = { handleSnap2 };
