var cathFunctions = require('./handleCath.js')

module.exports = function (jsonObj1, getFeatures, validateAgainstSchema, primary_accession, featureCallback) {
  // Stage 1:
  let convertedFeatures = {}
  const dataArr_hc = []
  const hcDataObj = {}// {name}{ec|go|species} = data.
  const featureNames = []
  const ancestorDataObj = {} // {superFam} => [class, arch, top, homo, classId, archId, topId, homoId];

  const funFamFeatureSet = []
  let superFamFeatureSet = []

  if (!jsonObj1 || jsonObj1 === null || !jsonObj1.hasOwnProperty('data') || jsonObj1.data === null || Object.getOwnPropertyNames(jsonObj1.data).length < 1) { // || jsonObj1.data.length < 1){
    validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH')
  }

  parseAndSendMultipleRequests(jsonObj1).then(function (thePromises) {
    Promise.all(thePromises.promisesGo).then(function (theData) {
      return new Promise(function (resolve, reject) {
        cathFunctions.handlePromiseData_hc(theData, dataArr_hc).then(function () {
          resolve()
        })
      })
    })
      .then(function () {
        return new Promise(function (resolve, reject) {
          Promise.all(thePromises.ancestor).then(function (ancestorData) {
            cathFunctions.handlePromiseData_ancestor(ancestorData, ancestorDataObj).then(function () {
              resolve()
            })
          })
        })
      })
      .then(function () {
        // Superfamilies
        return new Promise(function (resolve, reject) {
          Promise.all(thePromises.cathDomains).then(function (superFamRequests) {
            /*
					console.log("The dataArrHc is - in the next then() ");
					console.log(dataArr_hc);

					console.log("The ancestor data is");
					console.log(ancestorDataObj);
					*/
            cathFunctions.handlePromiseData_sfAndRel(superFamRequests, convertedFeatures, ancestorDataObj, dataArr_hc, hcDataObj, thePromises.residues, superFamFeatureSet).then(function (resObj) {
              superFamFeatureSet = resObj.superFamFeatureSet
              convertedFeatures = resObj.convertedFeatures
              resolve()
            })
          })
        })
      })
      .then(function () {
        return new Promise(function (resolve, reject) {
          // console.log("$$$$$$$$ ");
          // console.log(thePromises.funfamIds);
          handleData_ff(thePromises.funfamIds, dataArr_hc, hcDataObj, thePromises.residues, superFamFeatureSet, funFamFeatureSet, convertedFeatures).then(function () {
            resolve()
          })
        })
      })
      .then(function () {
        validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH', hcDataObj)
      })
      .catch(function (error) {
        console.log(' ============= There is an error with CATH features ')
        console.log(error)

        validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH', null)
      })
  })
  // parse object.

  // Send the multiple requests.
}

function handleData_ff (funFamData, dataArr_hc, hcDataObj, residues_, superFamFeatureSet, funFamFeatureSet, convertedFeatures) {
  return new Promise(function (resolve, reject) {
    const keyFunFam = 'Functional families'

    funFamData.forEach(function (funFam_id, i) {
      const aFunFamFeature = {}

      aFunFamFeature.Name = '<span class=\"popupTitle\"> <i>CATH Functional Family</i>: ' + funFam_id + '</span>'

      hcDataObj = cathFunctions.handleEcGoSpecies(dataArr_hc, i, aFunFamFeature.Name, hcDataObj)

      const funFamFeat_res = cathFunctions.handleResidues_funFam(residues_[i], superFamFeatureSet, aFunFamFeature.Name)

      if (Object.keys(funFamFeat_res).length > 0) {
        // add to set.
        funFamFeatureSet = funFamFeatureSet.concat(funFamFeat_res)
      }

      if (i == (funFamData.length - 1)) {
        convertedFeatures[keyFunFam] = {}
        convertedFeatures[keyFunFam].Features = funFamFeatureSet
        // console.log("@@@@@@@@@@ ");
        // console.log(funFamFeatureSet);
        resolve()
      }
    })
  })
}
function parseAndSendMultipleRequests (jsonObj1) {
  return new Promise(function (resolve, reject) {
    // console.log(Object.getOwnPropertyNames(jsonObj1.data));

    const residuesBySfFf = []
    const promises_superfamilyId = []
    const funFamIds = []

    const promises_ancestors = []
    const promises_go = []

    const encounteredRes_str = []

    Object.getOwnPropertyNames(jsonObj1.data).forEach(function (item, i) {
      // console.log("Object " + item);

      if (item != 'id' && item != '_id') {
        // console.log("########### " + item);
        jsonObj1.data[item].forEach(function (feature, feature_i) {
          let sf_ff_id = {}
          let residues = [] // list of lists.

          // console.log("Features ");
          // console.log(feature);

          if (feature.hasOwnProperty('match-id') && (feature.hasOwnProperty('resolved'))) { // || feature.hasOwnProperty('Discontiguous'))) {
            // extract superfam id, funfam id & residues
            sf_ff_id = extractFunfamSuperfam(feature['match-id'])
            funFamIds.push(sf_ff_id.funfam_id)

            // console.log(sf_ff_id);
            residues = extractResidues(feature.resolved)
            // console.log("In the main function, residues");
            // console.log(residues);

            if (!encounteredRes_str.includes(JSON.stringify(residues))) {
              // Add promises;
              promises_superfamilyId.push(cathFunctions.getFromLocation(cathFunctions.url_superfamInfo(sf_ff_id.superfam_id)))

              residuesBySfFf.push(residues)
              // Add residues
              encounteredRes_str.push(JSON.stringify(residues))

              promises_go.push(cathFunctions.getFromLocation(cathFunctions.url_go(sf_ff_id.superfam_id)))
              promises_go.push(cathFunctions.getFromLocation(cathFunctions.url_ec(sf_ff_id.superfam_id)))
              promises_go.push(cathFunctions.getFromLocation(cathFunctions.url_species(sf_ff_id.superfam_id)))

              promises_ancestors.push(cathFunctions.getFromLocation(cathFunctions.url_ancestors(sf_ff_id.superfam_id)))
            }
          }

          if (feature_i == (jsonObj1.data[item].length - 1)) {
            resolve({ cathDomains: promises_superfamilyId, residues: residuesBySfFf, promisesGo: promises_go, ancestor: promises_ancestors, funfamIds: funFamIds })
          }
        })
      }
    })
  })
}

function extractResidues (arrResidues) {
  const convertedResArr = []

  let resStart = -1
  let resEnd = -1

  arrResidues.forEach(function (item, i) {
    arrResidues[i].forEach(function (val, val_i) {
      if (val_i % 2 == 0) {
        resStart = val
      }
      if (val_i % 2 == 1) {
        resEnd = val
      }

      if (val_i % 2 == 1) {
        convertedResArr.push(resStart + '-' + resEnd)
        // console.log('here!');
      }
    })
  })

  return (convertedResArr)
}

function extractFunfamSuperfam (strWithInfo) {
  const arr = strWithInfo.split(/\-/)
  // console.log("### The funfam superfam info is");
  // console.log(arr);

  let superfam_id = null
  const funFam_id = null
  if (arr.length > 0) {
    superfam_id = arr[0]
  }

  if (arr.length >= 2) {
    funfam_id = arr[1] + '-' + arr[2]
  }

  return ({ funfam_id: funfam_id, superfam_id: superfam_id })
}
