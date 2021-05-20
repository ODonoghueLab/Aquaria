var cathFunctions = require('./handleCath.js')
var funVar_pageLimit = 20

var checkIfValInSnpResAndAdd = require('./variantResiduesDesc')
var variantResFeats = ['All variants']

module.exports = function (jsonObj1, getJsonFromUrl, validateAgainstSchema, primary_accession, featureCallback, variantResidues) {
  if (!jsonObj1.hasOwnProperty('data') || jsonObj1.data.length < 1) {
    validateAgainstSchema(convertedFeatures, primary_accession, featureCallback, 'CATH')
  }

  const features = {} // {resPos} => {Mutation} =>
  extractUniqSfFfs(jsonObj1.data).then(function (ids_sfFfs) {
    sendTheFirstUrls(ids_sfFfs).then(function (promises_firstUrls) {
      Promise.all(promises_firstUrls).then(function (firstUrlData) {
        // console.log("FunVar data is ");
        // console.log(firstUrlData);

        extractPosAndFurtherPromises(firstUrlData, ids_sfFfs, features).then(function (promises_nextPages) {
          return new Promise(function (resolve, reject) {
            if (promises_nextPages.length > 0) {
              Promise.all(promises_nextPages).then(function (nextPagesData) {
                processNextPagesData(nextPagesData, features).then(function () {
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
                  aFeature = {}
                  aFeature.Residue = parseInt(resNum)
                  aFeature.Name = aaChange.replace(/\//, '>')
                  // console.log("Funvar a popup would be " + resNum + " " + aaChange);
                  aFeature.Description = '<br><i>Variant type:</i> ' + features[resNum][aaChange].vartype
                  aFeature.Description = aFeature.Description + '<br><i>Variant class:</i> ' + features[resNum][aaChange].varClass
                  aFeature.Description = aFeature.Description + '<br><i>Diseases:</i> ' + features[resNum][aaChange].diseases
                  // aFeature['Description'] =  aFeature['Description'] + "<br><i>Mutation family:</i> " + features[resNum][aaChange]['mutfam'];
                  aFeature.Description = aFeature.Description + '<br><i>Cancer types (Is FunFam domain enriched):</i> '

                  features[resNum][aaChange].cancerType.forEach(function (aCancerType, aCancerType_i) {
                    aFeature.Description = aFeature.Description + aCancerType

                    if (aCancerType_i < features[resNum][aaChange].cancerType.length - 1) {
                      aFeature.Description = aFeature.Description + ', '
                    }
                  })
                  aFeature.Description = aFeature.Description + '<br><i> FunFams (v4_2_0):</i> '
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
  })
}

// Taken from: https://gdc.cancer.gov/resources-tcga-users/tcga-code-tables/tcga-study-abbreviations (TCGA study abbreviations on 2021, Jan 23)
const CancerTypes = {
  LAML:	'Acute Myeloid Leukemia',
  ACC: 'Adrenocortical carcinoma',
  BLCA: 'Bladder Urothelial Carcinoma',
  LGG: 'Brain Lower Grade Glioma',
  BRCA: 'Breast invasive carcinoma',
  CESC: 'Cervical squamous cell carcinoma and endocervical adenocarcinoma',
  CHOL: 'Cholangiocarcinoma',
  LCML: 'Chronic Myelogenous Leukemia',
  COAD: 'Colon adenocarcinoma',
  CNTL: 'Controls',
  ESCA: 'Esophageal carcinoma',
  FPPP: 'FFPE Pilot Phase II',
  GBM: 'Glioblastoma multiforme',
  HNSC: 'Head and Neck squamous cell carcinoma',
  KICH: 'Kidney Chromophobe',
  KIRC: 'Kidney renal clear cell carcinoma',
  KIRP: 'Kidney renal papillary cell carcinoma',
  LIHC: 'Liver hepatocellular carcinoma',
  LUAD: 'Lung adenocarcinoma',
  LUSC: 'Lung squamous cell carcinoma',
  DLBC: 'Lymphoid Neoplasm Diffuse Large B-cell Lymphoma',
  MESO: 'Mesothelioma',
  MISC: 'Miscellaneous',
  OV: 'Ovarian serous cystadenocarcinoma',
  PAAD: 'Pancreatic adenocarcinoma',
  PCPG: 'Pheochromocytoma and Paraganglioma',
  PRAD: 'Prostate adenocarcinoma',
  READ: 'Rectum adenocarcinoma',
  SARC: 'Sarcoma',
  SKCM: 'Skin Cutaneous Melanoma',
  STAD: 'Stomach adenocarcinoma',
  TGCT: 'Testicular Germ Cell Tumors',
  THYM: 'Thymoma',
  THCA: 'Thyroid carcinoma',
  UCS: 'Uterine Carcinosarcoma',
  UCEC: 'Uterine Corpus Endometrial Carcinoma',
  UVM: 'Uveal Melanoma'
}

function processNextPagesData (nextPagesData, featsAsDict) {
  return new Promise(function (resolve, reject) {
    // console.log("FunVar nextPagesData is ");
    // console.log(nextPagesData);

    nextPagesData.forEach(function (anUrlRes, anUrlRes_i) {
      if (anUrlRes.hasOwnProperty('data') && anUrlRes.data.hasOwnProperty('items')) {
        anUrlRes.data.items.forEach(function (item, i) {
          addAnObjIfNotPresent(featsAsDict, item)
        })
      }
    })
    resolve()
  })
}

function extractPosAndFurtherPromises (firstUrlData, ids_sfFfs, features) {
  return new Promise(function (resolve, reject) {
    const promises_nextPages = []

    firstUrlData.forEach(function (dataObj, dataObj_i) {
      if (dataObj.hasOwnProperty('data') && dataObj.data.hasOwnProperty('records_total') && dataObj.data.records_total > 0) {
        // if > 20, get total number of pages;
        const callsToMake = Math.ceil(dataObj.data.records_total / funVar_pageLimit) - 1 // -1 because one call is already done;
        if (callsToMake > 0) {
          addNextPagesToUrl(callsToMake, ids_sfFfs[dataObj_i], promises_nextPages)
        }
        // console.log("Funvar callsToMake " + callsToMake);

        // Process the resiudes;
        if (dataObj.data.hasOwnProperty('items')) {
          dataObj.data.items.forEach(function (item, i) {
            addAnObjIfNotPresent(features, item)
          })
        }
      }
    })

    resolve(promises_nextPages)
  })
}

function addAnObjIfNotPresent (featsAsDict, anFunVarItem) {
  if (anFunVarItem.hasOwnProperty('vm_seq_no') && anFunVarItem.hasOwnProperty('vm_aa_change')) {
    // console.log("FunVar extracted data is " + anFunVarItem.vm_seq_no + " " + anFunVarItem.vm_aa_change + " " + anFunVarItem['cancer_type'] + " " + anFunVarItem['diseases'] + " " + anFunVarItem['variant_type'] + " " + anFunVarItem['variant_class'] + " " + anFunVarItem['mutfam']);

    const resPos = parseInt(anFunVarItem.vm_seq_no)

    if (!featsAsDict.hasOwnProperty(resPos)) {
      featsAsDict[resPos] = {}
    }
    if (!featsAsDict[resPos].hasOwnProperty(anFunVarItem.vm_aa_change)) {
      featsAsDict[resPos][anFunVarItem.vm_aa_change] = {}
      featsAsDict[resPos][anFunVarItem.vm_aa_change].vartype = []
      featsAsDict[resPos][anFunVarItem.vm_aa_change].varClass = []
      featsAsDict[resPos][anFunVarItem.vm_aa_change].diseases = []
      featsAsDict[resPos][anFunVarItem.vm_aa_change].mutfam = []
      featsAsDict[resPos][anFunVarItem.vm_aa_change].cancerType = []
      featsAsDict[resPos][anFunVarItem.vm_aa_change].funfam_id = []
    }

    if (!featsAsDict[resPos][anFunVarItem.vm_aa_change].vartype.includes(anFunVarItem.variant_type)) {
      featsAsDict[resPos][anFunVarItem.vm_aa_change].vartype.push(anFunVarItem.variant_type)
    }

    if (!featsAsDict[resPos][anFunVarItem.vm_aa_change].varClass.includes(anFunVarItem.variant_class)) {
      featsAsDict[resPos][anFunVarItem.vm_aa_change].varClass.push(anFunVarItem.variant_class)
    }

    if (!featsAsDict[resPos][anFunVarItem.vm_aa_change].diseases.includes(anFunVarItem.diseases)) {
      featsAsDict[resPos][anFunVarItem.vm_aa_change].diseases.push(anFunVarItem.diseases)
    }

    /*
		if (!featsAsDict[resPos][anFunVarItem['vm_aa_change']]['mutfam'].includes(anFunVarItem['mutfam'])){
			featsAsDict[resPos][anFunVarItem['vm_aa_change']]['mutfam'].push(anFunVarItem['mutfam']);
		}
		*/
    let asLink = "<a href='http://funvar.cathdb.info/funfam/uid/" + anFunVarItem.funfam_uid + "' target='_blank'>"
    if (anFunVarItem.hasOwnProperty('funfam') && anFunVarItem.funfam.hasOwnProperty('name')) {
      // console.log("nnnnnnnnnoooooooooooooooooooooo "+anFunVarItem['funfam']['name']);

      asLink = asLink + anFunVarItem.funfam.name
    } else {
      asLink = asLink + anFunVarItem.funfam_id
    }
    asLink = asLink + '</a>'

    if (!featsAsDict[resPos][anFunVarItem.vm_aa_change].funfam_id.includes(asLink)) {
      console.log('Funvar as link is ' + asLink)
      featsAsDict[resPos][anFunVarItem.vm_aa_change].funfam_id.push(asLink)
    }

    let cancerTypeVal = anFunVarItem.cancer_type

    if (CancerTypes.hasOwnProperty(anFunVarItem.cancer_type)) {
      cancerTypeVal = CancerTypes[anFunVarItem.cancer_type]
    }

    if (anFunVarItem.hasOwnProperty('mutfam')) {
      cancerTypeVal = cancerTypeVal + ' (' + anFunVarItem.mutfam + ')'
    }

    if (!featsAsDict[resPos][anFunVarItem.vm_aa_change].cancerType.includes(cancerTypeVal)) {
      featsAsDict[resPos][anFunVarItem.vm_aa_change].cancerType.push(cancerTypeVal)
    }
  }
}

function addNextPagesToUrl (callsToMake, id_sfFf, promises_nextPages) {
  for (let i = 0; i < callsToMake; i++) {
    const pageNum = i + 2
    promises_nextPages.push(cathFunctions.getFromLocation(getBaseUrl(id_sfFf) + '&page=' + pageNum))
  }
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
  return (window.location.protocol + '//funvar.cathdb.info/api/nfe/version/v4_2_0?funfam_id=' + id_sfFf)
}

function extractUniqSfFfs (cathV2Data) {
  return new Promise(function (resolve, reject) {
    const ids_sfFfs = []

    if (cathV2Data.hasOwnProperty('data')) {
      cathV2Data.data.forEach(function (item, i) {
        if (item.hasOwnProperty('superfamily_id') && item.hasOwnProperty('funfam_number')) {
          const id = item.superfamily_id + '-FF-' + item.funfam_number
          // console.log("FunVar the id is " + id);
          if (!ids_sfFfs.includes(id)) {
            ids_sfFfs.push(id)
          }
        }
      })
    }

    resolve(ids_sfFfs)
  })
}
