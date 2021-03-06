var checkIfValInSnpResAndAdd = require('./variantResiduesDesc')

module.exports = function (geneInfoObj, getJsonFromUrl, validateAgainstSchema, primary_accession, featureCallback, variantResidues) {
  let genename = ''
  const featuresObj = {}

  const features_snpeff = []
  const features_cosmic = []
  const fs_cosmic_byTissue = {}

  const fsName_cosmic = 'All variants'

  // Step 1: get the gene name;
  if (geneInfoObj.hasOwnProperty('data') && geneInfoObj.data.hasOwnProperty('hits') && geneInfoObj.data.hits.length > 0 && geneInfoObj.data.hits[0].hasOwnProperty('symbol')) {
    genename = geneInfoObj.data.hits[0].symbol
    getFromLocation(url_myVariantInfo(genename, 1000, 0))
      .then(function (response) {
        return new Promise(function (resolve, reject) {
          const promises_ = []
          if (response.hasOwnProperty('data') && response.data.hasOwnProperty('total')) {
            // console.log("The total myVariant.info is " + response.data.total);
            const total = parseInt(response.data.total)
            const callsToMake = Math.ceil(total / 1000) - 1
            // console.log("Total calls to make to myVariant.info is " + callsToMake);

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
          const respData = data.response
          const promises_ = data.promises_
          // console.log("Comes in here 1");
          handlePromiseData(respData, featuresObj, fsName_cosmic, fs_cosmic_byTissue, features_snpeff, features_cosmic, variantResidues)
            .then(function () {
              resolve(data.promises_)
            })
        })
      })
      .then(function (promises_) {
        return new Promise(function (resolve, reject) {
          Promise.all(promises_).then(function (theData) {
            // 	return new Promise(function(resolve, reject){
            const promises_processing = []
            theData.forEach(function (item, i) {
              // console.log("Comes in here 2");
              promises_processing.push(handlePromiseData(item, featuresObj, fsName_cosmic, fs_cosmic_byTissue, features_snpeff, features_cosmic, variantResidues))
            })

            Promise.all(promises_processing).then(function () {
              // if (item_i == (respData.data.hits.length - 1)){

              /*
								console.log("Features object is ");
								console.log(featuresObj);
								resolve(); */
              // }
              resolve()
            })
            //	});
          })

          if (promises_.length == 0) {
            resolve()
          }
        })
      })
      .then(function () {
        featuresObj[fsName_cosmic] = {}
        featuresObj[fsName_cosmic].Color = '#FF0000'
        featuresObj[fsName_cosmic].Features = features_cosmic

        // console.log(fs_cosmic_byTissue);
        for (const key in fs_cosmic_byTissue) {
          const key_fs = key
          featuresObj[key_fs] = {}
          featuresObj[key_fs].Color = '#FF0000'
          featuresObj[key_fs].Features = fs_cosmic_byTissue[key]
        }
        validateAgainstSchema(featuresObj, primary_accession, featureCallback, 'COSMIC')
      })
  } else {
    validateAgainstSchema(featuresObj, primary_accession, featureCallback, 'COSMIC')
  }
}
/// /////////////// Handling the different featureSet types

function handlePromiseData (respData, featuresObj, fsName_cosmic, fs_cosmic_byTissue, features_snpeff, features_cosmic, variantResidues) {
  return new Promise(function (resolve, reject) {
    if (respData.hasOwnProperty('data') && respData.data.hasOwnProperty('hits') && respData.data.hits.length > 0) {
      respData.data.hits.forEach(function (item, item_i) {
        if (item.hasOwnProperty('snpeff') && item.snpeff.hasOwnProperty('ann') && item.snpeff.ann.length > 0) {
          const snpEff_obj = handle_snpeff(item.snpeff.ann, features_snpeff)
          if (snpEff_obj.snpPos > -1 && !snpEff_obj.effect.match('synonymous_variant') && item.hasOwnProperty('cosmic')) {
            if (item.hasOwnProperty('dbnsfp')) {
              // console.log('Now also handle the dbnsfp');
              handle_dbnsfp(item.dbnsfp, snpEff_obj)
            }
            handle_cosmic(item.cosmic, features_cosmic, snpEff_obj.snpPos, fs_cosmic_byTissue, variantResidues, snpEff_obj.variant_protFormat, snpEff_obj.effect)
          }
        }

        if (item_i == (respData.data.hits.length - 1)) {
          resolve()
        }
      })
    } else {
      resolve()
    }
  })
}

function handle_dbnsfp (dbnsfpObj, snpEff_obj) {
  let mutFormat = ''
  if (dbnsfpObj.hasOwnProperty('aa')) {
    if (dbnsfpObj.aa.hasOwnProperty('alt') && dbnsfpObj.aa.hasOwnProperty('ref')) {
      mutFormat = dbnsfpObj.aa.ref + '>' + dbnsfpObj.aa.alt
      snpEff_obj.effect = snpEff_obj.effect + ' (' + snpEff_obj.variant_protFormat + ')'
      snpEff_obj.variant_protFormat = mutFormat
    }
  }

  // return mutFormat;
}

function handle_snpeff (snpeffAnn, featureSet) {
  // console.log(snpeffAnn);
  let snpPos = -1
  let variant_protFormat = ''
  let effect = ''

  if (snpeffAnn[0].hasOwnProperty('protein') && snpeffAnn[0].protein.hasOwnProperty('position')) {
    snpPos = parseInt(snpeffAnn[0].protein.position)
  }

  if (snpeffAnn[0].hasOwnProperty('hgvs_p')) {
    variant_protFormat = snpeffAnn[0].hgvs_p
  }

  if (snpeffAnn[0].hasOwnProperty('effect')) {
    effect = snpeffAnn[0].effect
  }

  return ({ snpPos: snpPos, variant_protFormat: variant_protFormat, effect: effect })
}

function handle_cosmic (cosmic, featureSet, snpPos, featSets_cosmic_byTissue, variantResidues, variantProtFmt, effect) {
  // console.log("Snp pos is " + snpPos); // {'Name': , 'Residue(s)': , 'Description': };
  let name = ''; let description = ''
  let byT_fs_name = ''; let byT_desc = ''

  if (effect != '') {
    description = '<br>Effect: ' + effect
  }

  // console.log("Variant in protein format is " + variantProtFmt);
  if (variantProtFmt != '') {
    name = variantProtFmt
    if (cosmic.hasOwnProperty('mut_nt')) {
      description = description + '<br>Mut_nt: ' + cosmic.mut_nt
    }
  } else if (cosmic.hasOwnProperty('mut_nt')) { // This is in dna format;
    name = cosmic.mut_nt
  }

  if (cosmic.hasOwnProperty('mut_freq')) {
    description = description + '<br>Mutation frequency: ' + cosmic.mut_freq
    byT_desc = description
  }
  if (cosmic.hasOwnProperty('tumor_site')) {
    description = description + '<br>Tumor site: ' + cosmic.tumor_site
    byT_fs_name = cosmic.tumor_site
  }

  if (name != '') {
    featureSet.push({ Name: name, Residue: snpPos, Description: description })

    // checkIfValInSnpResAndAdd(snpPos, snpPos, variantResidues, 'All variants', name + ";" + description, 'COSMIC mutations', ['All variants']);

    if (byT_fs_name != '') {
      addToFs(cosmic.tumor_site, featSets_cosmic_byTissue, byT_desc, snpPos, name)
    }
  }
}

function addToFs (fsName, fs, desc, snpPos, featureName) {
  if (!fs.hasOwnProperty(fsName)) {
    fs[fsName] = []
  }

  fs[fsName].push({ Name: featureName, Residue: snpPos, Description: desc })
}

/// /////////////// Getting data from myVariant.info

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
        console.log('Error')
        console.log(error)

        featuresFromExtServer.status = 'error'
        resolve(featuresFromExtServer)
      })
  })
}
