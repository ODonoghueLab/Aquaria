var counter_complete = 0

module.exports = function (resStart_pp, resEnd_pp, variantResidues, featureType, description, serverName, variants_featTypesOfInt) {
  if (variants_featTypesOfInt.includes(featureType)) {
    Object.keys(variantResidues).forEach(function (resSnp, i) {
      // console.log("The new residue is " + variantResidues[resSnp].newResidue);

      let pos_mut = resSnp
      if (resSnp.match(/\-/)) {
        pos_mut = resSnp.split(/\-/)[0]
      }

      if (parseInt(pos_mut) >= parseInt(resStart_pp) && parseInt(pos_mut) <= parseInt(resEnd_pp)) {
        const obj_featType = {}
        if (serverName == 'PredictProtein' && featureType == 'Conservation') {
          const varInfo = []
          const pp_urlInfo = cleanData_pp(description, varInfo)

          let pp_urlInfo_complete = 'PredictProtein'
          if (pp_urlInfo != '') {
            pp_urlInfo_complete = "<a href='" + pp_urlInfo + "' target='blank'>PredictProtein</a>"
          }
          addToVariantResidues(variantResidues, resSnp, [], varInfo, [], pp_urlInfo_complete)
        } else if (serverName == 'SNAP2') {
          // 1. Check if object exists with name Mutational sensitivity
          const varInfo = []; const posInfo = []; const otherResInfo = [] // get from variant inof if it exists;

          if (featureType == 'Mutational sensitivity (SNAP2 ratio of effect mutations)') {
            cleanData_snap2_effects(description, variantResidues[resSnp].newResidues, posInfo, otherResInfo)
            addToVariantResidues(variantResidues, resSnp, [], posInfo, otherResInfo, '<a href="https://rostlab.org/owiki/index.php/Snap2" target="blank"> SNAP2</a>')
          } else if (featureType.match(/^Mutation to /)) {
            console.log()
            cleanData_aaMutScore_snap2(variantResidues[resSnp], description)
          } else if (featureType == 'Mutation score (average SNAP2 score)') {
            cleanData_snap2_getAvgScore_v2(description, posInfo, variantResidues[resSnp].newResidues, variantResidues[resSnp])
            addToVariantResidues(variantResidues, resSnp, [], posInfo, [], "<a href='https://rostlab.org/owiki/index.php/Snap2' target='blank'><i>SNAP2</i></a>")
          }
        } else if (serverName == 'CATH') {
          const cath_infoUrl = "<a href='https://www.cathdb.info/wiki' target='blank'>CATH</a>"
          const posInfo = []

          if (featureType == 'Functional domain') {
            cleanData_cath(description, posInfo, 'functional family')
          } else if (featureType == 'Structural domain') {
            cleanData_cath(description, posInfo, 'superfamily')
          }

          addToVariantResidues(variantResidues, resSnp, [], posInfo, [], cath_infoUrl)
          // variantResidues[resSnp][serverName].push(obj_featType);
        } else if (serverName == 'UniProt') {
          // console.log('uniprot featuretype is ' + featureType)
          // console.log('uniprot feature description is ' + description)
          const uniprot_infourl = "<a href='https://www.uniprot.org/help/about' target='blank'>UniProt</a>"
          description = description.replace(/[\s]+$/, '')
          if (featureType == 'Metal ion-binding site') {
            const posInfo = []
            posInfo.push(description + ' metal ion-binding site')
            addToVariantResidues(variantResidues, resSnp, [], posInfo, [], uniprot_infourl)
          }
          if (featureType == 'Binding site') {
            const posInfo = []
            posInfo.push(description + ' binding site')
            addToVariantResidues(variantResidues, resSnp, [], posInfo, [], uniprot_infourl)
          } else if (featureType == 'Site') {
            const posInfo = []
            posInfo.push(description + ' site')
            addToVariantResidues(variantResidues, resSnp, [], posInfo, [], uniprot_infourl)
          } else if (featureType == 'Modified residue') {
            const posInfo = []
            posInfo.push('Modified residue ' + description)
            addToVariantResidues(variantResidues, resSnp, [], posInfo, [], uniprot_infourl)
          } else if (featureType == 'Cross-link') {
            const posInfo = []
            posInfo.push('Cross-link ' + description)
            addToVariantResidues(variantResidues, resSnp, [], posInfo, [], uniprot_infourl)
          } else if (featureType == 'Sequence variant' || featureType == 'Mutagenesis site') {
            const varInfo = []; const otherResInfo = []; const posInfo = []

            // check for the right residue;
            // cleanData_uniprot_seqVar(description, variantResidues[resSnp].newResidues, varInfo, otherResInfo, posInfo);
            cleanData_uniprot_seqVar_v2(description, variantResidues[resSnp], posInfo, featureType, uniprot_infourl)

            // addToVariantResidues(variantResidues, resSnp, varInfo, posInfo, otherResInfo, 'UniProt ' + featureType);
          }
        } else if (serverName == 'COSMIC') {
          const varInfo = []; const posInfo = []; const otherResInfo = []
          const cosmic_infoUrl = "<a href='https://cancer.sanger.ac.uk/cosmic/help/mutation/overview' target='blank'>COSMIC</a>"
          // console.log('The newAas are ')
          // console.log(variantResidues[resSnp])
          cleanData_cosmic(description, variantResidues[resSnp], posInfo, cosmic_infoUrl)

          addToVariantResidues(variantResidues, resSnp, varInfo, posInfo, otherResInfo, cosmic_infoUrl)
          // console.log('The cosmic description is ' + description)
        } else if (serverName == 'FunVar') {
          const varInfo = []; const otherResInfo = []

          // console.log('The funVar description is 111 ' + description)
          cleanData_funVar(description, variantResidues[resSnp])

          // addToVariantResidues(variantResidues, resSnp, varInfo, [], otherResInfo, 'FunVar')
        }


      }
    })
  }


}

function addToVariantResidues (variantResidues, resSnp, varInfo, posInfo, otherResInfo, serverName) {
  if (!variantResidues[resSnp].hasOwnProperty('variantInfo')) {
    variantResidues[resSnp].variantInfo = {}
  }

  if (!variantResidues[resSnp].hasOwnProperty('positionInfo')) {
    variantResidues[resSnp].positionInfo = {}
  }

  if (!variantResidues[resSnp].hasOwnProperty('otherResInfo')) {
    variantResidues[resSnp].otherResInfo = {}
  }

  if (varInfo.length > 0) {
    // console.log('The VAR INFO IS ' + varInfo)
    // console.log(varInfo)
    if (!variantResidues[resSnp].variantInfo.hasOwnProperty(serverName)) {
      variantResidues[resSnp].variantInfo[serverName] = varInfo
    } else {
      variantResidues[resSnp].variantInfo[serverName] = variantResidues[resSnp].variantInfo[serverName].concat(varInfo)
      // console.log(variantResidues[resSnp].variantInfo[serverName])
    }
  }

  if (posInfo.length > 0) {
    // console.log('snap2 the positionInfo is ' + posInfo)
    if (!variantResidues[resSnp].positionInfo.hasOwnProperty(serverName)) {
      variantResidues[resSnp].positionInfo[serverName] = posInfo
    } else {
      variantResidues[resSnp].positionInfo[serverName] = variantResidues[resSnp].positionInfo[serverName].concat(posInfo)
    }
  }

  if (otherResInfo.length > 0) {
    // console.log('The OTHERRES INFO IS ' + otherResInfo)
    if (!variantResidues[resSnp].otherResInfo.hasOwnProperty(serverName)) {
      variantResidues[resSnp].otherResInfo[serverName] = otherResInfo
    } else {
      // console.log('THE OTHERRES INFO appending')
      variantResidues[resSnp].otherResInfo[serverName] = variantResidues[resSnp].otherResInfo[serverName].concat(otherResInfo)
      // console.log(variantResidues[resSnp].otherResInfo[serverName])
    }
  }

  /*
	if (varInfo.length > 0){
		variantResidues[resSnp]['variantInfo'][serverName] = varInfo;
	}

	if (posInfo.length > 0){
		variantResidues[resSnp]['positionInfo'][serverName] = posInfo;
	}

	if (otherResInfo.length > 0){
		variantResidues[resSnp]['otherResInfo'][serverName] = otherResInfo;
	}
	*/
}

/// Cleaning descriptions;
function cleanData_pp (desc, varInfo) {
  const arr_pre = desc.split('|')
  arr_pre[0] = arr_pre[0].replace(/\s+/g, '')

  const arr = arr_pre[0].split(/\:/)
  const arr_1 = arr[1].split(/\(/)
  arr_1[1] = arr_1[1].replace(/\)/, '')

  // let obj_inFeatType = {mainToShow: arr_1[1], mainToHide: "Score: " + arr_1[0]};
  varInfo.push(arr_1[1] + ' conservation (score = ' + arr_1[0] + ')')

  // console.log("The pridict protein value is: " + arr_1[1] + " (score:" + arr_1[0] + ")")

  // return obj_inFeatType;

  if (arr_pre.length > 1) {
    return (arr_pre[1])
  } else {
    return ''
  }
}

function cleanData_funVar (desc, variantResidues_res) {
  const arr = desc.split(/\|/)
  const arr_aa = arr[0].split(/\>/)

  const funvar_infoUrl = "<a href='https://funvar.cathdb.info/help' target='blank'>FunVar:</a>"

  if (arr_aa.length > 1) {
    const arr_aa = arr[0].split(/\>/) // .replace(/\>/, "&#8594;");
    const arr_desc = arr[1].split('<br>')

    let toAdd = '<i>' + funvar_infoUrl + ' </i>'
    if (arr_desc.length >= 5) {
      arr_desc[5] = arr_desc[5].replace(/\<[^\>\>]+\>/g, '')
      arr_desc[5] = arr_desc[5].replace(/.*\: /, '')
      console.log('The funvar desc newAa is ' + arr_aa[1] + ' ' + arr_desc[5])

      const yesAndNoObjs = getCancerTypesSplit(arr_desc[4])
      if (yesAndNoObjs.yes.length > 0) {
        toAdd = toAdd + " Predicted to disrupt '" + arr_desc[5] + "'"
        toAdd = toAdd + getToAddStr_funVar(yesAndNoObjs.yes)

        if (yesAndNoObjs.no.length > 0) {
          toAdd = toAdd + '. But not'
          toAdd = toAdd + getToAddStr_funVar(yesAndNoObjs.no)
        }
      } else {
        toAdd = toAdd + " Predicted not to disrupt '" + arr_desc[5] + "'"
        toAdd = toAdd + getToAddStr_funVar(yesAndNoObjs.no)
      }
      variantResidues_res[arr_aa[1]].push(toAdd)
    }
  }
}

function getCancerTypesSplit (cTypeDesc) {
  cTypeDesc = cTypeDesc.replace('<i>Cancer types (Is FunFam domain enriched):</i>', '')

  const arr_yes = []
  const arr_no = []

  const arr = cTypeDesc.split(',')
  for (let i = 0; i < arr.length; i++) {
    const arr_indiv = arr[i].split('(')
    arr_indiv[1] = arr_indiv[1].replace(/[\)\s\t]+/g, '')
    // console.log('Funvar desc here is |' + arr_indiv[1] + '| ' + arr_indiv[0])

    arr_indiv[0] = arr_indiv[0].replace(/^[\s]+/, '')
    arr_indiv[0] = arr_indiv[0].replace(/[\s]+$/, '')

    if (arr_indiv[1] == 'Y') {
      arr_yes.push(arr_indiv[0].toLowerCase())
    } else {
      arr_no.push(arr_indiv[0].toLowerCase())
    }
  }

  return { yes: arr_yes, no: arr_no }
}

function cleanData_cosmic (desc, variantResidues_res, posInfo, cleanData_cosmic) {
  const arr = desc.split(/\|/)
  arr[0] = arr[0].replace(/^p\./, '')
  arr_aas = arr[0].split(/[0-9]+/)

  // console.log('Cosmic 1 ' + arr_aas[1])
  if (arr_aas.length >= 1 && arr_aas[1] != 'fs') {
    let cosmic_newAa = arr_aas[1]
    let cosmic_oldAa = arr_aas[0]

    const val = checkIfInKey_ig(cosmic_newAa)
    if (val != '-') {
      cosmic_newAa = val
    }

    const val_old = checkIfInKey_ig(cosmic_oldAa)
    if (val_old != '-') {
      cosmic_oldAa = val_old
    }

    if (oneAaCodes.includes(cosmic_newAa)) {
      if (!variantResidues_res.hasOwnProperty(cosmic_newAa)) {
        variantResidues_res[cosmic_newAa] = []
      }
      arr[2] = arr[2].replace(/\_/g, ' ')

      let toAddStr = '<i>' + cleanData_cosmic + ':</i> In tumors from '
      arr_tissue = arr[2].split(',')

      for (let i = 0; i < arr_tissue.length; i++) {
        if (i == 0) {
          // toAddStr = toAddStr + ', '; // + arr_tissue
        } else if (i == arr_tissue.length - 1) {
          toAddStr = toAddStr + ', and '
        } else {
          toAddStr = toAddStr + ', '
        }

        arr_tissue[i] = arr_tissue[i].replace('(', '(freq = ')
        // arr_tissue[i] = arr_tissue[i].replace(';', '; freq = ')
        toAddStr = toAddStr + arr_tissue[i]
      }

      // variantResidues_res[cosmic_newAa].push('<i>COSMIC:</i> In tumors from ' + arr[2]);
      variantResidues_res[cosmic_newAa].push(toAddStr)

      // console.log('The cosmic arr[2] is ' + arr[2])
    }
  } else {
    arr[2] = arr[2].replace('(', '(freq = ')
    posInfo.push(arr[1] + ' ' + arr[2])
  }
}

function cleanData_uniprot_seqVar_v2 (desc, variantResidues_res, posInfo, featureType, uniprot_infourl) {
  // main to show, other residues;

  // console.log('The Uniprot seqVar desc are ' + desc)

  desc = desc.replace(/^[\s]+/, '')
  desc = desc.replace(/\.$/, '')
  desc = desc.replace(/\>/, '&#8594;')
  let arr = desc.split(/[\s]+/)

  // console.log("The Uniprot seqVar desc 2 are " + arr);

  if (arr[1] == '&#8594;') {
    if (oneAaCodes.includes(arr[2])) {
      const newAa = arr[2]
      if (!variantResidues_res.hasOwnProperty(newAa)) {
        variantResidues_res[newAa] = []
      }
      arr = arr.slice(3, arr.length)

      variantResidues_res[newAa].push('<i>' + uniprot_infourl + ':</i> ' + featureType + ' ' + arr.join(' '))
    } else {
      posInfo.push(featureType + ' ' + desc)
    }
    /* let isDescPushed = false;
			if (newAas){
				newAas.forEach(function(newAa, newAa_i){
						if (oneAaCodes.includes(newAa)){
								if (arr[2] == newAas[0]){
									varInfo.push(desc);
									isDescPushed = true;
								}
						}
				});
			}
			if (isDescPushed == false){
				otherResInfo.push(desc);
			} */
  } else {
    // add to posInfo
    posInfo.push(featureType + ' ' + desc)
  }
}

function cleanData_uniprot_seqVar (desc, newAas, varInfo, otherResInfo, posInfo) {
  // main to show, other residues;

  // console.log("The Uniprot seqVar desc are " + desc);

  desc = desc.replace(/^[\s]+/, '')
  desc = desc.replace(/\.$/, '')
  desc = desc.replace(/\>/, '&#8594;')
  const arr = desc.split(/[\s]+/)
  if (arr[1] == '&#8594;') {
    let isDescPushed = false
    if (newAas) {
      newAas.forEach(function (newAa, newAa_i) {
        if (oneAaCodes.includes(newAa)) {
          if (arr[2] == newAas[0]) {
            varInfo.push(desc)
            isDescPushed = true
          }
        }
      })
    }
    if (isDescPushed == false) {
      otherResInfo.push(desc)
    }
  } else {
    // add to posInfo
    posInfo.push(desc)
  }

  /*
	let objToReturn = {};

	if (mainToShow != ''){
		objToReturn['mainToShow'] = mainToShow;
	}
	if (otherResidues != ''){
		objToReturn['otherResidues'] = otherResidues;
	}

	return (objToReturn)
	*/
}

function cleanData_aaMutScore_snap2 (variantResidues_pos, desc) {
  const snap2_infoUrl = "<a href='https://rostlab.org/owiki/index.php/Snap2' target='blank'><i>SNAP2:</i></a>"

  const arr = desc.split(';')
  let theAa = arr[0].replace(/[\s]+/g, '')
  theAa = theAa.replace(/^[A-Z]\>/, '')

  const score = arr[1].replace(/[^\-0-9]+/, '')

  if (!variantResidues_pos.hasOwnProperty(theAa)) {
    variantResidues_pos[theAa] = []
  }

  if (parseInt(score) > 40) {
    variantResidues_pos[theAa].push(snap2_infoUrl + ' Predicted to change function (score = ' + score + ')')
  } else if (parseInt(score) < -40) {
    variantResidues_pos[theAa].push(snap2_infoUrl + ' Predicted not to change function (score = ' + score + ')')
  } else {
    variantResidues_pos[theAa].push(snap2_infoUrl + ' May or may not change function (score = ' + score + ')')
  }

  // console.log("snap2 the new aa thing is " + arr[0] + " " + arr[1] + " " + score + " |" + theAa);
}

function cleanData_snap2_getAvgScore_v2 (desc, arr_posInfo, newAas, variantResidues_pos) {
  const snap2_infoUrl = "<a href='https://rostlab.org/owiki/index.php/Snap2' target='blank'><i>SNAP2:</i></a>"

  // console.log('snap2 desc 2 mutation something something is ' + desc)

  const arr = desc.split(/\;/)

  if (arr.length >= 3){
    arr[2] = arr[2].replace(/[\s\t]+/g, '')
    arr[2] = arr[2].replace(/functionchangingare\:/, '')
    arr_scores = arr[2].split(",")

    let total = 0; // 1 if val > 40; -1 if < -40 else 0. Then sum to get which condition.

    arr_scores.forEach(function(item, item_i){
      let indivScore = item.replace(/[^\d]/, '').replace(/\:/, '')

      if (parseFloat(indivScore) > 40){
        // arrCounts.push(1)
        total = total + 1
      }
      else if (parseFloat(indivScore) <-40){
        // arrCounts.push(-1)
        total = total - 1
      }
      else {
        // arrCounts.push(0)
        // total = total + 0
      }
      // console.log('SNAP indiv score is ' + indivScore)
    });

    let avgScore = total / arr_scores.length;
    // console.log('SNAP AVG score is ' + total);

    if (avgScore > 11){ // 11 is based on the number of amino acids (from Andrea's slides)

    }
    else if ( avgScore < 11){

    }
    else{
      arr_posInfo.push('Average sensitivity to mutation')
    }

  }
  else if (arr.length >= 2) {
    let score = arr[1].replace(/^.*\:/, '')
    score = score.replace(/[\s]+/g, '')

    if (parseFloat(score) >= -40 && parseFloat(score) <= 40) {
      // console.log("SNAP this case is " + parseFloat(score) + ". Length is " + arr.length);
      // console.log("SNAP this case is " + desc)
      arr_posInfo.push('Average sensitivity to mutation')
    }
    // console.log('snap2 desc 2 mutation ' + arr.length + ' ' + arr[1] + ' ' + score)
  }
}

function cleanData_snap2_getAvgScore (desc, arr_posInfo, newAas, variantResidues_pos) {
  const snap2_infoUrl = "<a href='https://rostlab.org/owiki/index.php/Snap2' target='blank'><i>SNAP2:</i></a>"

  // console.log("snap2 desc 2 is " + desc);

  const arr = desc.split(/\;/)

  if (arr.length > 2) {
    // console.log('snap2 desc is ' + arr.length + " |" +  arr[2] + "|");
    arr[2] = desc.replace('function changing are:', '')
    arr[2] = desc.replace(/[\s]+/g, '')
    arr_indivRes = arr[2].split(/\,/)
    // console.log ('snap2 desc is 3 ' + arr_indivRes);
    const aasAddingToFn = []

    arr_indivRes.forEach(function (anAaAndScore, anAaAndScore_i) {
      const arr_aaScore = anAaAndScore.split(/\:/)
      if (oneAaCodes.includes(arr_aaScore[0].toUpperCase())) {
        if (!variantResidues_pos.hasOwnProperty(arr_aaScore[0])) {
          variantResidues_pos[arr_aaScore[0]] = []
        }

        if (parseInt(arr_aaScore[1]) > 40) {
          variantResidues_pos[arr_aaScore[0]].push(snap2_infoUrl + ' Predicted to change function (score = ' + arr_aaScore[1] + ')')
        } else if (parseInt(arr_aaScore[1]) < -40) {
          variantResidues_pos[arr_aaScore[0]].push(snap2_infoUrl + ' Predicted not to change function (score = ' + arr_aaScore[1] + ')')
        }
        // variantResidues_pos[arr_aaScore[0]].push(snap2_infoUrl + " Predicted to change function (score = " + arr_aaScore[1] + ")")

        aasAddingToFn.push(arr_aaScore[0].toUpperCase())
        // scores[arr_aaScore[0]] = arr_aaScore[1];
      }
      // console.log("snap2 desc 4 is " + anAaAndScore);
    })

    oneAaCodes.forEach(function (item, i) {
      if (!aasAddingToFn.includes(item)) {
        if (!variantResidues_pos.hasOwnProperty(item)) {
          variantResidues_pos[item] = []
        }
        variantResidues_pos[item].push(snap2_infoUrl + ' Not predicted to change function')
      }
    })

    /*
		if (newAas){
			newAas.forEach(function(newAa, newAa_i){
					let isAddingToChange = false;
					if (oneAaCodes.includes(newAa)){
						if (!variantResidues_pos.hasOwnProperty(newAa)){
							variantResidues_pos[newAa] = [];
							variantResidues_pos[newAa].push('<i>SNAP2:<i> ' + "Predicted to change function (score = " + +")");
						}

						/*
						let re = new RegExp("^" + newAa, 'i');
						for (let i=0; i<arr_indivRes.length; i++){
								// console.log('snap2 desc is 5 ' + arr[i]);
								if (arr_indivRes[i].match(re)){
										let score = arr_indivRes[i].split(/\:/);
										arr_posInfo.push('Mutation (' + newAa + ') will change function (score=' + score[1] + ')');
										//console.log("snap2 desc is 4 " + score[1] + " " + arr_indivRes[i]);
										isAddingToChange = true;
								}
								// if (arr[i].toUpperCase().match(/^))
						}
						if (isAddingToChange == false){
							arr_posInfo.push('Mutation (' + newAa + ') will not change function');
						}

					}

			});
		} */
  }
}

function cleanData_cath (desc, varInfo, partOf) {
  desc = desc.replace(/\<span[^\>]*\>/, '')
  desc = desc.replace(/\<i\>/, '')
  desc = desc.replace(/\<\/i\>/, '')
  desc = desc.replace(/\<\/span\>/, '')
  desc = desc.replace(/\$.*$/, '')

  const arr = desc.split(/\:\s/)
  arr[0] = arr[0].replace(/CATH/, '')

  // console.log('The cath arr thingo is ' + arr[1])
  varInfo.push("Part of '" + arr[1] + "' " + partOf)

  // let obj_featType = {};

  // obj_featType[arr[0]] = {'mainToShow': arr[1]};
  // {mainToShow: arr_1[1], mainToHide: "Score: " + arr_1[0]};

  // console.log('cleaned cath desc is ' + desc + " arr[0]" + arr[0] + " arr[1]:" + arr[1]);
  // return (obj_featType);
}

function cleanData_snap2_effects (desc, newAas, arr_posInfo, arr_otherResInfo) {
  // console.log('snap2 desc 1 ' + desc)
  const arr = desc.split(/\;/)

  let posInfoDesc = ''
  if (arr.length >= 1) {
    posInfoDesc = arr[0] + ' to mutation. '
  }

  if (arr.length >= 2) {
    arr[1] = arr[1].replace(/[\s]+$/, '')
    posInfoDesc = posInfoDesc + arr[1]
  }

  if (posInfoDesc != '') {
    arr_posInfo.push(posInfoDesc)
    // console.log("snap2 desc ..... why not here???? " + posInfoDesc);
  }

  /*
	if (arr.length >= 3){
		arr[2] = arr[2].replace('function changing are:', '');
		arr[2] = arr[2].replace(/[\s]+/g, '');
		arr_indivRes = arr[2].split(/\,/);

		let posToRm = [];
		for (let i =0; i<arr_indivRes.length; i++){
			let aa = arr_indivRes[i].split("\:")[0];
			if (newAas.includes(aa.toUpperCase())){
				posToRm.push(i);
			}
		}
		posToRm.sort(function(a, b){
			return b - a;
		});

		posToRm.forEach(function(pos, pos_i){
			arr_indivRes.splice(pos, 1);
		});

		if (arr_indivRes.length > 0){
			let otherInfoDesc = "Additional residues changing function are:";

			arr_indivRes.forEach(function(indivRes, indivRes_i){
				otherInfoDesc = otherInfoDesc + " " + indivRes;
			});

			arr_otherResInfo.push(otherInfoDesc);
		}

		console.log("snap2 posToRm is " + posToRm);
	}
	*/
}

function checkAndRetIdx (arrOfObjs, key) {
  let idx = -1
  for (let i = 0; i < arrOfObjs.length; i++) {
    if (arrOfObjs[i].hasOwnProperty(key)) {
      idx = i
    }
  }

  return idx
}

/// //////

function generateShowHideFnStr (id_complete) {
  returnStr = "elem = document.getElementById('" + id_complete + "');"

  returnStr = returnStr + "if (elem.style.display == ''){elem.style.display = 'none'; console.log('Next sibling is'); console.log(elem.nextSibling.innerHTML); elem.nextSibling.innerHTML = 'more...';}"

  returnStr = returnStr + "else{ elem.style.display = ''; elem.nextSibling.innerHTML = 'less...';}; "

  return (returnStr)
}

$('.more').toggle(function () {
  $(this).text('less..').siblings('.complete').show()
}, function () {
  $(this).text('more..').siblings('.complete').hide()
})

function getToAddStr_funVar (yesOrNoArr) {
  let toAddStr = ''

  for (let i = 0; i < yesOrNoArr.length; i++) {
    if (i == 0) {
      toAddStr = toAddStr + ' in '
    } else if (i == yesOrNoArr.length - 1) {
      toAddStr = toAddStr + ', and '
    } else {
      toAddStr = toAddStr + ', '
    }
    toAddStr = toAddStr + ' ' + yesOrNoArr[i]
  }
  return toAddStr
}

function getSubstringOfInterest (description, newResidue) {
  // console.log('SNAP2 the newResidue is ' + newResidue)
  const arr = description.split(/\;/)
  description = arr[0]

  // to see if the new residue does anything;
  arr[1] = arr[1].replace('function changing are:', '')

  arr_res = arr[1].split(/\,/)

  // console.log('SNAP2 the rest of the array is ')
  // console.log(arr_res)

  for (let i = 0; i < arr_res.length; i++) {
    if (arr_res[i].includes(newResidue)) {
      description = description + '. Specific score ' + arr_res[i] + '.'
    }
  }

  return description
}

function getSubstringOfInterest_cath (description) {
  let desc = description.replace(/\<[^\<\>]+\>/g, '')
  desc = desc.replace(/\$\$.*$/, '')
  desc = desc.replace(/^.+\:/, '')

  return desc
}

const oneAaCodes = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']

const threeToOneResMap = {
  Gly: 'G',
  Ala: 'A',
  Leu: 'L',
  Met: 'M',
  Phe: 'F',
  Trp: 'W',
  Lys: 'K',
  Gln: 'Q',
  Glu: 'E',
  Ser: 'S',
  Pro: 'P',
  Val: 'V',
  Ile: 'I',
  Cys: 'C',
  Tyr: 'Y',
  His: 'H',
  Arg: 'R',
  Asn: 'N',
  Asp: 'D',
  Thr: 'T'
}

function checkIfInKey_ig (threeLetterCode) {
  const key = Object.keys(threeToOneResMap).find(k => k.toLowerCase() === threeLetterCode.toLowerCase())
  // console.log('The key is ' + key)
  if (key) {
    return (threeToOneResMap[key])
  } else {
    return '-'
  }
}

function checkIfInVal_ig (oneLetterCode) {
  // let isFound = false;
  let newRes = '-'
  Object.keys(threeToOneResMap).forEach(function (item, i) {
    if (threeToOneResMap[item].toLowerCase() === oneLetterCode.toLowerCase()) {
      newRes = oneLetterCode.toUpperCase()
    }
  })
  return newRes
  /* for (var prop in threeToOneResMap) {
        if (threeToOneResMap.hasOwnProperty(prop) && threeToOneResMap[prop].toLowerCase() === oneLetterCode.toLowerCase()) {
            return threeToOneResMap[prop];
        }
    }
    return '-'; */
}
