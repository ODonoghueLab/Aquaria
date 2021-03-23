var checkIfValInSnpResAndAdd = require('./variantResiduesDesc')
var variantResFeats = ['All variants']
module.exports = function (geneInfoObj, getJsonFromUrl, validateAgainstSchema, primary_accession, featureCallback, variantResidues) {
  // console.log("The Cosmic geneInfoObj");
  // console.log(geneInfoObj);

  const featuresObj = {}

  const cosmicData = {} // cosmicData{theMutation} => {theEffect} => [tumor_site(freq;mut_nt), tumor_site2(freq2;mut_nt)]

  if (geneInfoObj.hasOwnProperty('data') && geneInfoObj.data.hasOwnProperty('hits') && geneInfoObj.data.hits.length > 0 && geneInfoObj.data.hits[0].hasOwnProperty('symbol')) {
    genename = geneInfoObj.data.hits[0].symbol
    getFromLocation(url_myVariantInfo(genename, 1000, 0))
      .then(function (response) {
        return new Promise(function (resolve, reject) {
          const promises_ = []
          if (response.hasOwnProperty('data') && response.data.hasOwnProperty('total')) {
            const total = parseInt(response.data.total)
            const callsToMake = Math.ceil(total / 1000) - 1

            for (let i = 0; i < callsToMake; i++) {
              const from = 1000 * (i + 1)
              promises_.push(getFromLocation(url_myVariantInfo(genename, 1000, from)))

              if (i == (callsToMake - 1)) {
                resolve({ response: response, promises_: promises_ })
              }
            }
          } else {
            resolve({ response: response, promises_: promises_ })
          }
        })
      })
      .then(function (data) {
        return new Promise(function (resolve, reject) {
          handleCosmicData(data.response, cosmicData, variantResidues)
            .then(function () {
              resolve(data.promises_)
            })
        })
      })
      .then(function (promises_) {
        return new Promise(function (resolve, reject) {
          Promise.all(promises_)
            .then(function (theResults) {
              const promises_processing = []

              theResults.forEach(function (aRes, aRes_i) {
                if (aRes.status == 'success' && aRes.hasOwnProperty('data') && aRes.data.hasOwnProperty('hits')) {
                  promises_processing.push(handleCosmicData(aRes, cosmicData, variantResidues))
                }
              })

              Promise.all(promises_processing).then(function () {
                // console.log("Now the cosmicData is ");
                // console.log(cosmicData);
                resolve()
              })
            })
        })
      })
      .then(function () {
        // Reduce the variants;
        rmSyn(cosmicData)
      })
      .then(function () {
        // console.log("Cosmic now convert to featureObj and handle feature lengths");
        convertToAquariaObj(cosmicData, variantResidues).then(function (features) {
          featuresObj['All variants'] = {}
          featuresObj['All variants'].Color = '#FF0000'
          featuresObj['All variants'].Features = features

          // console.log("COSMIC over here over here ");
          // console.log(featuresObj);
          validateAgainstSchema(featuresObj, primary_accession, featureCallback, 'COSMIC')
        })
      })
  } else {
    validateAgainstSchema(featuresObj, primary_accession, featureCallback, 'COSMIC')
  }
}

function convertToAquariaObj (cosmicData, variantResidues) {
  return new Promise(function (resolve, reject) {
    const features = []

    for (const aMut in cosmicData) {
      for (const effect in cosmicData[aMut]) {
        const aFeature = {}
        aFeature.Name = aMut

        let theResPos = aMut.replace(/^p\.[^0-9]+/, '')
        theResPos = theResPos.replace(/[^0-9]+$/, '')

        if (effect.match('stop_gained') || effect.match('frameshift_variant') || effect.match('start_lost')) {
          aFeature.Residues = [parseInt(theResPos), parseInt(AQUARIA.showMatchingStructures.sequence.length)]
        } else {
          aFeature.Residue = parseInt(theResPos)
        }

        aFeature.Description = '<br><i>Effect:</i> ' + effect + '<br>' + '<i>Tumor_site(frequency; mut_nt):</i> '

        cosmicData[aMut][effect].forEach(function (item, i) {
          aFeature.Description = aFeature.Description + item

          if (i < cosmicData[aMut][effect].length - 1) {
            aFeature.Description = aFeature.Description + ', '
          } else {
            aFeature.Description = aFeature.Description + '.'
          }
        })

        features.push(aFeature)

        checkIfValInSnpResAndAdd(parseInt(theResPos), parseInt(theResPos), variantResidues, 'All variants', (aMut + '|' + effect + '|' + cosmicData[aMut][effect]), 'COSMIC', variantResFeats)
      }
    }

    resolve(features)
  })
}

function rmSyn (cosmicData) {
  return new Promise(function (resolve, reject) {
    Object.keys(cosmicData).forEach(function (aMut, aMut_i) {
      Object.keys(cosmicData[aMut]).forEach(function (effect, effect_i) {
        if (effect.match('synonymous_variant')) {
					 // delete this effect, and if cosmicData[aMut].keys.length ==0, delete this one.
					 delete cosmicData[aMut][effect]

					 if (Object.keys(cosmicData[aMut]).length == 0) {
						 delete cosmicData[aMut]
					 }
        }
      })

      if (aMut_i == Object.keys(cosmicData).length - 1) {
        resolve()
      }
    })
  })
}

function allSkippingErrors (promises) {
  return Promise.all(
    promises.map(p => p.catch(error => null))
  )
}

/// /////////////// scraping data

function handleCosmicData (dataObj, cosmicData, variantResidues) {
  return new Promise(function (resolve, reject) {
    if (dataObj.hasOwnProperty('data') && dataObj.data.hasOwnProperty('hits')) {
      dataObj.data.hits.forEach(function (anResInfo, anResInfo_i) {
        if (anResInfo.hasOwnProperty('cosmic') && anResInfo.hasOwnProperty('snpeff')) {
          // let theMutation = getTheMutation(anResInfo['dbnsfp']);
          const mutAndEffect = getMutationPos(anResInfo.snpeff, cosmicData)
          addCosmicInfo(mutAndEffect, anResInfo.cosmic, cosmicData)
        }

        if (anResInfo_i == dataObj.data.hits.length - 1) {
          resolve()
        }
      })
    } else {
      resolve()
    }
  })
}

function getMutationPos (snpEffObj, cosmicData) {
  // if (snpEffObj.hasOwnProperty)
  let aMut = ''; let anEffect = ''

  if (snpEffObj.hasOwnProperty('ann') && snpEffObj.ann.length > 0) {
    if (snpEffObj.ann[0].hasOwnProperty('hgvs_p')) {
      aMut = snpEffObj.ann[0].hgvs_p
      // console.log("The hgvs_p is " + snpEffObj['ann'][0]['hgvs_p']);
      if (!cosmicData.hasOwnProperty(aMut)) {
        cosmicData[aMut] = {}
      }
      if (snpEffObj.ann[0].hasOwnProperty('effect')) {
        anEffect = snpEffObj.ann[0].effect
        if (!cosmicData[aMut].hasOwnProperty(anEffect)) {
          cosmicData[aMut][anEffect] = []
        }
      }
    } else {
      if (snpEffObj.ann[0].hasOwnProperty('effect')) {
        // console.log("The no hgvs_p effect is " + snpEffObj['ann'][0]['effect']);
      }
    }
  }
  return ({ aMut: aMut, anEffect: anEffect })
}

function addCosmicInfo (mutAndEffect, cosmicObj, cosmicData) {
  let tumor_site = ''; let freq = ''; let mut_nt = ''
  if (mutAndEffect.aMut != '' && mutAndEffect.anEffect != '') {
    if (cosmicObj.hasOwnProperty('tumor_site')) {
      tumor_site = cosmicObj.tumor_site
    }
    if (cosmicObj.hasOwnProperty('mut_freq')) {
      freq = cosmicObj.mut_freq
    }
    if (cosmicObj.hasOwnProperty('mut_nt')) {
      mut_nt = cosmicObj.mut_nt
    }

    const aStr = tumor_site + ' (' + freq + '; ' + mut_nt + ')'
    if (!cosmicData[mutAndEffect.aMut][mutAndEffect.anEffect].includes(aStr)) {
      cosmicData[mutAndEffect.aMut][mutAndEffect.anEffect].push(aStr)
    }
  }
}

function getTheMutation (dbnsfpObj) {
  const theMut = ''

  // console.log("The dbnsfpObj is ");
  // console.log(dbnsfpObj);
}

/// ///////////////  Getting data from myVariant.info
function url_myVariantInfo (genename, size, from) {
  return ('https://myvariant.info/v1/query?q=' + genename + '&size=' + size + '&from=' + from)
}

var axios = require('axios')
function getFromLocation (url) {
  return new Promise(function (resolve, reject) {
    const featuresFromExtServer = {}

    axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
        // handle success
        // console.log("Success");
        // console.log(response.data);
        featuresFromExtServer.status = 'success'
        featuresFromExtServer.data = response.data
        resolve(featuresFromExtServer)
      })
      .catch(function (error) {
        // handle error
        console.log('Error in the getFromLocation (cosmic)')
        // console.log(error);

        featuresFromExtServer.status = 'error'
        // resolve(featuresFromExtServer)
        // Promise.reject(featuresFromExtServer);
        resolve(featuresFromExtServer)
      })
  })
}
