var cathFunctions = require('./handleCath.js')
var funVar_pageLimit = 20

var checkIfValInSnpResAndAdd = require('./variantResiduesDesc')
var variantResFeats = ['All variants']

var funvarFns = require('./handleFunVar_cancer')

module.exports = function (jsonObj1, getJsonFromUrl, validateAgainstSchema, primary_accession, featureCallback, variantResidues) {
  // if no response
  if (!jsonObj1 || jsonObj1 === null || !jsonObj1.hasOwnProperty('data') || jsonObj1.data === null || Object.getOwnPropertyNames(jsonObj1.data).length < 1){
    validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'FunVar')
  }
  console.log("Efficient 1")

  const features = {} // {resPos} => {Mutation} =>
  extractIds_SfFfs(jsonObj1.data).then(function (ids_sfFfs) {
    console.log("Efficient 2")
    console.log(ids_sfFfs)


    sendTheFirstUrls(ids_sfFfs).then(function (promises_firstUrls) {
      Promise.all(promises_firstUrls).then(function (firstUrlData) {
        // console.log("FunVar data is ");
        // console.log(firstUrlData);

        funvarFns.extractPosAndFurtherPromises(firstUrlData, ids_sfFfs, features, getBaseUrl).then(function (promises_nextPages) {
          return new Promise(function (resolve, reject) {
            if (promises_nextPages.length > 0) {
              Promise.all(promises_nextPages).then(function (nextPagesData) {
                funvarFns.processNextPagesData(nextPagesData, features).then(function () {
                  resolve()
                })
              })
            } else {
              resolve()
            }
          })
        })
          .then(function () {
            return new Promise(function (resolve, reject) {
              const aquariaFeatObj = {}
              const arr_feats = []

              // console.log('FunVar features are ')
              // console.log(features)

              // Convert to AquariaFeatObj format;

              for (const resNum in features) {
                for (const aaChange in features[resNum]) {
                  console.log("Over here - pizza!!");
                  console.log(features[resNum][aaChange]);
                  aFeature = {}
                  aFeature.Residue = parseInt(resNum)
                  aFeature.Name = aaChange.replace(/\//, '>')
                  // console.log("Funvar a popup would be " + resNum + " " + aaChange);
                  aFeature.Description = '<br><i>Variant type:</i> ' + features[resNum][aaChange].vartype
                  aFeature.Description = aFeature.Description + '<br><i>Variant class:</i> ' + features[resNum][aaChange].varClass
                  /*
                  aFeature.Description = aFeature.Description + '<br><i>Diseases:</i> ' + features[resNum][aaChange].diseases
                  */ 
                  // aFeature['Description'] =  aFeature['Description'] + "<br><i>Mutation family:</i> " + features[resNum][aaChange]['mutfam'];


                  /*
                  aFeature.Description = aFeature.Description + '<br><i>Cancer types (Is FunFam domain enriched):</i> '

                  features[resNum][aaChange].cancerType.forEach(function (aCancerType, aCancerType_i) {
                    aFeature.Description = aFeature.Description + aCancerType

                    if (aCancerType_i < features[resNum][aaChange].cancerType.length - 1) {
                      aFeature.Description = aFeature.Description + ', '
                    }
                  })
                  */

                  aFeature.Description = aFeature.Description + '<br><i> FunFams (v4_3_0):</i> '
                  features[resNum][aaChange].funfam_id.forEach(function (afunfam, afunfam_i) {
                    aFeature.Description = aFeature.Description + afunfam

                    if (afunfam_i < features[resNum][aaChange].funfam_id.length - 1) {
                      aFeature.Description = aFeature.Description + ', '
                    }
                  })

                  checkIfValInSnpResAndAdd(resNum, resNum, variantResidues, 'All variants', aFeature.Name + '|' + aFeature.Description, 'FunVar', variantResFeats)

                  arr_feats.push(aFeature)
                }
              }
              if (arr_feats.length > 0) {
                aquariaFeatObj['All variants'] = {}
                aquariaFeatObj['All variants'].Color = '#FF0000'
                aquariaFeatObj['All variants'].Features = arr_feats
              }
              resolve(aquariaFeatObj)
            })
          })
          .then(function (aquariaFeatObj) {
            // console.log('FunVar aquariaFeatObj is - blah blah ')
            // console.log(aquariaFeatObj)
            validateAgainstSchema(aquariaFeatObj, primary_accession, featureCallback, 'FunVar', null)
          })
      })
    })
  });

}


function sendTheFirstUrls (ids_sfFfs) {
  return new Promise(function (resolve, reject) {
    const promises_firstUrls = []

    ids_sfFfs.forEach(function (id_sfFf, i) {
      const url = getBaseUrl(id_sfFf)

      promises_firstUrls.push(cathFunctions.getFromLocation(url))
    })

    resolve(promises_firstUrls)
  })
}

function getBaseUrl (id_sfFf) {
  return (window.location.protocol + '//funvar.cathdb.info/api/nfe/version/v4_3_0?funfam_id=' + id_sfFf)
}


function extractIds_SfFfs(mongodbData){
  return new Promise(function (resolve, reject){
    let ids_sfFfs = []
    // console.log(mongodbData)

    for (let topLvl in mongodbData){
      if (!topLvl.match(/id$/)){
        console.log("The key is " + topLvl)
        mongodbData[topLvl].forEach(function(item, i){
          // console.log("Efficient: ");
          // console.log(item['match-id'])
          if (!ids_sfFfs.includes(item['match-id'])){
            ids_sfFfs.push(item['match-id'])
          }
        });
      }

    }

    resolve(ids_sfFfs);
  })
}
