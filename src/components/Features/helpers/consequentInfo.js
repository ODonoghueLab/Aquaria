// var grantham = require('./getGranthamConservation.js');

exports.getConsInfo = getConsInfo

function getConsInfo (featStr) {
  let theOrigFeatStr = featStr;
  let consequentStr = ''
  const newResidues = {} // {resPos (or resPos-seqLen)} => {newAas} => [newAa1, newAa2, .. newAaN]; {consequent} => consequentStr;
  let isOne = true

  // Remove any spaces
  featStr = featStr.replace(/[\s ]+/, '')

  // Remove the last \=\", i.e. the description.
  featStr = featStr.replace(/\=\"[^\=]$/, '')

  // Replace %3F to ?
  featStr = featStr.replace(/\%3F/g, '?')

  // Replace %2F to /
  featStr = featStr.replace(/\%2F/g, '/')

  // Replace to %3B to ;
  featStr = featStr.replace(/\%3B/g, ';')

  // Remove p.
  featStr = featStr.replace(/^p\./, '')

  // if \( or \) Prepend 'Predicted';
  if (featStr.match(/[\(\)]+/)) {
    consequentStr = 'Predicted '
    featStr = featStr.replace(/[\(\)]+/g, '')
  }
  // Check if amino acid is specified as isOne (ret. True) or isThree (ret. False);
  isOne = isOneTOrThreeF(featStr)

  isAllele = false

  // Allele
  if (featStr.match(/^\[.*\]$/)) {
    isAllele = true
    // Recursively get the sub-patterns for each allele
    // consequentStr = consequentStr + "Allele ";

    if (featStr.match(/^\[[a-zA-Z]+[0-9]+[a-zA-Z\_\*\?\^0-9]+\;[a-zA-Z]+[0-9]+[a-zA-Z\_\*\?\^0-9]+\]$/)) {
      consequentStr = consequentStr + 'Same allele '
    } else if (featStr.match(/^\[[a-zA-Z]+[0-9]+[a-zA-Z\_\*\?\^0-9]+\]\;\[[a-zA-Z]+[0-9]+[a-zA-Z\_\*\?\^0-9]+\]$/)) {
      consequentStr = consequentStr + 'Different allele'

      const isHomoTisHetroF = isHomoOrHeteroZygous(featStr)

      if (isHomoTisHetroF) {
        consequentStr = consequentStr + ', homozygous. '
      } else {
        consequentStr = consequentStr + ', heterozygous. '
      }
    } else if (featStr.match(/^\[[a-zA-Z]+[0-9]+[a-zA-Z\_\*\?\^0-9]+\,[a-zA-Z]+[0-9]+[a-zA-Z\_\*\?\^0-9]+\]$/)) {
      consequentStr = consequentStr + 'One allele encoding two proteins '
    } else {
      consequentStr = consequentStr + 'Allele '
    }

    // For each sub-pattern recursively get the sub-pattern consequentStr
    featStr = featStr.replace(/[\[\]]+/g, '')
    const sub_variants = featStr.split(/[\;\,]+/)

    for (let i = 0; i < sub_variants.length; i++) {
      const consInfoRes = getConsInfo(sub_variants[i])
      const consInfo = consInfoRes.newResidues

      console.log("The recursive featStr is " + consInfoRes.theOrigFeatStr + " orig is " + sub_variants[i])
      theOrigFeatStr = theOrigFeatStr.replace(sub_variants[i], consInfoRes.theOrigFeatStr)

      const keys = Object.keys(consInfo)
      for (let k = 0; k < keys.length; k++) {
        if (!newResidues.hasOwnProperty(keys[k])) {
          newResidues[keys[k]] = {}
          newResidues[keys[k]].newAas = []
          newResidues[keys[k]].consStr = consequentStr

          if (consInfo[keys[k]].hasOwnProperty('oldRes')) {
            newResidues[keys[k]].oldRes = consInfo[keys[k]].oldRes
          }
        }

        if (consInfo[keys[k]].hasOwnProperty('newAas')){
          for (let l = 0; l < consInfo[keys[k]].newAas.length; l++) {
            if (!newResidues[keys[k]].newAas.includes(consInfo[keys[k]].newAas[l])) {
              newResidues[keys[k]].newAas.push(consInfo[keys[k]].newAas[l])
            }
          }
        }

        newResidues[keys[k]].consStr = newResidues[keys[k]].consStr + consInfo[keys[k]].consStr + '; '
      }
    }
    console.log('The features is combined')
    console.log(newResidues)
    // console.log("The feature is sub_variants " + sub_variants);
  }
  // Deletion-insertion
  else if (featStr.match(/[dD][eE][lL][iI][nN][sS]/)) {
    const resPos = getResPos_simple(featStr)
    let thePos = resPos




    let range_deleted = {}; let range_inserted = []
    // resPositions.push(resPos);

    consequentStr = consequentStr + 'Deletion-insertion '
    if (featStr.match(/^[a-zA-Z]+[0-9]+[dD][eE][lL][iI][nN][sS]/)) {
      // single amino acid deletion
      consequentStr = consequentStr + 'single deletion '
    } else if (featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[dD][eE][lL][iI][nN][sS]/)) {
      // muliple amino acid deletion
      consequentStr = consequentStr + 'multiple deletion '
      range_deleted = getTheRange(featStr)
      thePos = range_deleted.startPos + '-' + range_deleted.endPos
    }

    if (featStr.match(/[dD][eE][lL][iI][nN][sS][a-zA-Z]+$/)) {
      const res = getFirstNewRes_delinsAndIsSingleAa(featStr, isOne)

      newResidues[thePos] = {}
      addToObj(newResidues[thePos], 'newAas', res.firstRes)

      if (res.isSingleAa) {
        // single amino acid insertion
        consequentStr = consequentStr + 'single insertion '
      } else {
        consequentStr = consequentStr + 'multiple insertion '
      }

      range_inserted = getAllNewRes_delins(featStr, isOne)
    } else if (featStr.match(/[dD][eE][lL][iI][nN][sS][0-9\*]+$/)) {
      // Muliple amino acid insertion
      consequentStr = consequentStr + 'multiple insertion '
      newResidues[thePos] = {}
      addToObj(newResidues[thePos], 'newAas', 'X')
    } else {
      newResidues[thePos] = {}
      addToObj(newResidues[thePos], 'newAas', 'X')
    }


    if (!newResidues.hasOwnProperty(thePos)){
      newResidues[thePos] = {}
    }

    const oldRes = getOldRes(featStr)
    newResidues[thePos]['oldRes'] = oldRes;

    // getAndAddRange_newResAsX(range_deleted, range_inserted, newResidues, consequentStr, 'X')
    newResidues[thePos].consStr = consequentStr
  }

  // Deletion
  else if (featStr.match(/[dD][eE][lL]/)) {
    const resPos = getResPos_simple(featStr)
    let thePos = resPos
    // resPositions.push(resPos);

    consequentStr = consequentStr + 'Deletion '

    if (featStr.match(/^[A-Za-z]+[0-9]+[dD][eE][lL]$/)) {
      consequentStr = consequentStr + 'of a single amino acid '

    } else if (featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[dD][eE][lL]$/)) {
      consequentStr = consequentStr + 'of multiple amino acids '

      const range_deleted = getTheRange_del(featStr)
      // Changing to single segment: getAndAddRange_newResAsX(range_deleted, [], newResidues, consequentStr, 'X')
      thePos = range_deleted.startPos + '-' + range_deleted.endPos


    }

    newResidues[thePos] = {}

    const oldRes = getOldRes(featStr)
    newResidues[thePos]['oldRes'] = oldRes;

    addToObj(newResidues[thePos], 'newAas', 'X')
    newResidues[thePos].consStr = consequentStr
  }

  // Duplication
  else if (featStr.match(/[dD][uU][pP]/)) {
    const resPos = getResPos_simple(featStr)
    let thePos = resPos
    // resPositions.push(resPos);

    consequentStr = consequentStr + 'Duplication '
    if (featStr.match(/^[a-zA-Z]+[0-9]+[dD][uU][pP]$/)) {
      consequentStr = consequentStr + 'of single amino acid '
    } else if (featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[dD][uU][pP]$/)) {
      consequentStr = consequentStr + 'of multiple amino acids '

      const range_deleted = getTheRange_del(featStr)
      thePos = range_deleted.startPos + '-' + range_deleted.endPos
      // Change to a single amino acid: getAndAddRange_newResAsX(range_deleted, [], newResidues, consequentStr, 'X')
    }
    newResidues[thePos] = {}

    const oldRes = getOldRes(featStr)
    newResidues[thePos].oldRes = oldRes

    addToObj(newResidues[thePos], 'newAas', 'X')
    newResidues[thePos].consStr = consequentStr
  }

  // Insertion
  else if (featStr.match(/[iI][nN][sS]/)) {
    const resPos = getResPos_simple(featStr)
    let thePos = resPos
    // resPositions.push(resPos);

    consequentStr = consequentStr + 'Insertion '
    if (featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[iI][nN][sS][a-zA-Z\*]+$/) || featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[iI][nN][sS][0-9\*]+$/)) {
      // get first and second residue;
      const twoPos = getTheTwoPositions(featStr)
      console.log('The feature is , aminoAcidRes ' + twoPos.posStart + ' ' + twoPos.posEnd)
      if (twoPos.posStart + 1 == twoPos.posEnd) {
        consequentStr = consequentStr + 'between consecutive amino acids'
        // getAndAddRange_newResAsX(featStr, newResidues, consequentStr);
      } else {
        consequentStr = consequentStr + 'in-frame'
        // getAndAddRange_newResAsX(featStr, newResidues, consequentStr);
      }


      const range_deleted = getTheRange_del(featStr)
      thePos = range_deleted.startPos + "-" + range_deleted.endPos
      // Changing to segment: getAndAddRange_newResAsX(range_deleted, [], newResidues, consequentStr, 'X')
    }
    newResidues[thePos] = {}

    const oldRes = getOldRes(featStr)
    newResidues[thePos]['oldRes'] = oldRes;

    addToObj(newResidues[thePos], 'newAas', 'X')
    newResidues[thePos].consStr = consequentStr
  }

  // Repeated sequences
  else if (featStr.match(/^[^\[].*?\[[0-9\;\_]+\]$/)) {
    const resPos = getResPos_simple(featStr)
    newResidues[resPos] = {}

    const oldRes = getOldRes(featStr)
    newResidues[resPos]['oldRes'] = oldRes;
    // resPositions.push(resPos);

    consequentStr = consequentStr + 'Repeated sequences '
    if (featStr.match(/^[a-zA-Z]+[0-9]+\[[0-9]+\]$/)) {
      consequentStr = consequentStr + 'single amino acid'
    } else if (featStr.match(/^[a-zA-Z]+[0-9]+\[[0-9]+\]\;\[[0-9]+\]$/)) {
      consequentStr = consequentStr + 'multiple alleles'
    } else if (featStr.match(/^[a-zA-Z]+[0-9]+\[[0-9]+\_[0-9]+\]$/)) {
      consequentStr = consequentStr + 'estimated range of repeat'
    }
    addToObj(newResidues[resPos], 'newAas', 'X')
    newResidues[resPos].consStr = consequentStr
  }

  // Frame shift
  else if (featStr.match(/[fF][sS]/)) {
    const resPos = getResPos_simple(featStr)
    let thePos = resPos + '-' + AQUARIA.showMatchingStructures.sequence.length // default as full length.

    // resPositions.push(resPos);

    consequentStr = consequentStr + 'Frame shift '
    if (featStr.match(/^[a-zA-Z]+[0-9]+[a-zA-Z]+[fF][Ss]([Tt][eE][rR]|\*)[0-9]+$/)) { // [a-zA-Z0-9\*\?]+$/)){
      // extract new amino acid;
      const terPos = getTerminatingPos_fs(featStr)
      // thePos = resPos + '-' + terPos // update the Pos
      consequentStr = consequentStr + ' with protein terminating at position ' + terPos
      const res = getFirstNewRes_ext(featStr, isOne)

      newResidues[thePos] = {}
      addToObj(newResidues[thePos], 'newAas', res.firstRes)
    } else if (featStr.match(/^[a-zA-Z]+[0-9]+[a-zA-Z]+[fF][Ss]\*\?/)) {
      consequentStr = consequentStr + ' no terminating codon encountered.'

      const res = getFirstNewRes_ext(featStr, isOne)

      newResidues[thePos] = {}
      addToObj(newResidues[thePos], 'newAas', res.firstRes)
    } else {
      newResidues[thePos] = {}
      addToObj(newResidues[thePos], 'newAas', 'X')
    }


    newResidues[thePos].consStr = consequentStr
    const oldRes = getOldRes(featStr)
    newResidues[thePos]['oldRes'] = oldRes
  }

  // Extension
  else if (featStr.match(/[eE][xX][tT]/)) {
    const resPos = getResPos_simple(featStr)
    newResidues[resPos] = {}

    // resPositions.push(resPos);

    consequentStr = consequentStr + 'Extension '
	 	if (featStr.match(/^[mM][eE][tT]1[eE][xX][tT][\_\-0-9a-zA-Z]+$/)) {
      consequentStr = consequentStr + 'N-terminal '
      addToObj(newResidues[resPos], 'newAas', 'X')
    } else if (featStr.match(/^[Tt][eE][rR][0-9]+[a-zA-Z]+[eE][xX][tT][\*\?a-zA-Z0-9]+/)) {
      consequentStr = consequentStr + 'C-terminal '
      const res = getFirstNewRes_ext(featStr, isOne)
      addToObj(newResidues[resPos], 'newAas', res.firstRes)
    }

    newResidues[resPos].consStr = consequentStr
    const oldRes = getOldRes(featStr)
    newResidues[resPos]['oldRes'] = oldRes
  }

  // Substitution

  else if (featStr.match(/^[A-Za-z]+[0-9]+\*$/) || featStr.match(/[A-Za-z]+[0-9]+[tT][eE][rR]$/)) {
    const resPos = getResPos_simple(featStr)

    const thePos = resPos + '-' + AQUARIA.showMatchingStructures.sequence.length

    newResidues[thePos] = {}
    // const oldAa_rightOne = checkAndGetRightAa(featStr, isOne)
    const oldRes = getOldRes(featStr)

    newResidues[thePos].oldRes = oldRes
    // resPositions.push(resPos);

    consequentStr = consequentStr + 'Nonsense '
    addToObj(newResidues[thePos], 'newAas', '*')
    newResidues[thePos].consStr = consequentStr

    // console.log("The sequence length is " + AQUARIA.showMatchingStructures.sequence.length);
  } else if (featStr.match(/^[A-Za-z]+[0-9]+[A-Za-z]+$/)) {
    const resPos = getResPos_simple(featStr)
    newResidues[resPos] = {}
    // resPositions.push(resPos);

    // const oldAa_rightOne = checkAndGetRightAa(featStr, isOne)
    const oldRes = getOldRes(featStr) // Getting the original amino acid (for later replacement);

    consequentStr = consequentStr + 'Missense '
    const newRes = getNewRes(featStr)

    addToObj(newResidues[resPos], 'newAas', newRes.newRes)

    // GRANTHAM
    // let granthamStr = grantham.getGranthamIsCons(newRes.oldRes, newRes.newRes);
    newResidues[resPos].consStr = consequentStr // + " " + granthamStr;
    newResidues[resPos].oldRes = oldRes
  }

  // Substitution - translation initiation codon
  /* else if (featStr.match(/^0$/)){
		consequentStr = consequentStr + "No protein ";
	} */
  else if (featStr.match(/^Met1\?$/) || featStr.match(/^M1\?$/)) {
    const resPos = getResPos_simple(featStr)
    const oldRes = getOldRes(featStr)

    newResidues[resPos] = {}
    newResidues[resPos]['oldRes'] = oldRes;
    consequentStr = consequentStr + 'Unknown consequence '
    addToObj(newResidues[resPos], 'newAas', '?')
    newResidues[resPos].consStr = consequentStr
  }
  // Substitution - uncertain
  else if (featStr.match(/^[A-Za-z]+[0-9]+[A-Za-z]+(\^[A-Za-z]+)+$/)) {
    const resPos = getResPos_simple(featStr)
    const oldRes = getOldRes(featStr)

    newResidues[resPos] = {}
    newResidues[resPos]['oldRes'] = oldRes;
    consequentStr = consequentStr + 'Uncertain consequence '
    // get all new residues
    concatToObj(newResidues[resPos], 'newAas', getAllNewRes(featStr))
    newResidues[resPos].consStr = consequentStr
  }
  // Allele - chimeric
  else if (featStr.match(/^[A-Za-z]+[0-9]+\=\/\/[A-Za-z]+$/)) {
    const resPos = getResPos_simple(featStr)
    newResidues[resPos] = {}

    consequentStr = consequentStr + 'Chimeric '
    const oldAndNew = getFirstNewRes_chimeric(featStr)

    newResidues[resPos]['oldRes'] = oldAndNew.old
    addToObj(newResidues[resPos], 'newAas', oldAndNew.new)
    newResidues[resPos].consStr = consequentStr
  }
  // Substitution - mosaic
  else if (featStr.match(/^[A-Za-z]+[0-9]+\=\/[A-Za-z]+$/)) {
    const resPos = getResPos_simple(featStr)
    newResidues[resPos] = {}
    // resPositions.push(resPos);

    consequentStr = consequentStr + 'Mosaic (somatic case) '
    const oldAndNew = getFirstNewRes_mosaic(featStr)

    newResidues[resPos].oldRes = oldAndNew.old
    addToObj(newResidues[resPos], 'newAas', oldAndNew.new)
    newResidues[resPos].consStr = consequentStr
  } else {
    const resPos = getResPos_simple(featStr)
    console.log('The resPos is not recognized ' + resPos)

    if (!isNaN(resPos)) {
      newResidues[resPos] = {}

      addToObj(newResidues[resPos], 'newAas', resPos)

      consequentStr = 'Variant is not recognized.'
      newResidues[resPos].consStr = consequentStr
    }
  }

  // Convert new Aas to is One, and validate isOne (not doing the isOne validation - will do individ. validation during scraping).
  // convertNewResTo1Letter(newResidues);


  for (let rP in newResidues){
    let theRightOldAa = checkAndGetRightAa_fromAa(rP)
    theOrigFeatStr = updateFeatStr(theOrigFeatStr, theRightOldAa,  newResidues[rP].oldRes, isOne)


    // Get the right oldAa based on the sequence position;
    newResidues[rP].oldRes = theRightOldAa;


    if (newResidues[rP].hasOwnProperty('newAas') && isOne == false){
      for (let i=0; i< newResidues[rP]['newAas'].length; i++){
        if (threeToOneResMap.hasOwnProperty(newResidues[rP]['newAas'][i])){
          newResidues[rP]['newAas'][i] = threeToOneResMap[newResidues[rP]['newAas'][i]];
        }
      }
    }

  }

  console.log('The feature is ' + featStr + ',  consequentStr is ' + consequentStr + ', newRes are ' + theOrigFeatStr)
  console.log(newResidues)

  return {newResidues: newResidues, theOrigFeatStr: theOrigFeatStr}
}

/// ////////////////////////////////// AUX
function updateFeatStr(theOrigFeatStr, theRightOldAa, theUserOldAa, isOne){

  if (theUserOldAa.match(/ter/i)){
    return theOrigFeatStr
  }
  if (isOne == false){

    let tmp = getThreeLetterCode(theRightOldAa);
    console.log("The featureStr ssays its one " + tmp + " " + theRightOldAa);
    if (tmp != '-'){
      theRightOldAa = tmp
    }
  }

  let arr = theOrigFeatStr.split(/[0-9]+/);

  if (!arr[0].match(theRightOldAa)){
    console.log("Does not match the right oldAa " + theOrigFeatStr)
    var theNewFeatStr = theOrigFeatStr.replace(theUserOldAa, theRightOldAa)

    var oldUrl = window.location.toString()
    var newUrl = oldUrl.replace(theOrigFeatStr, theNewFeatStr)
    window.history.pushState({path:newUrl},'',newUrl);

    theOrigFeatStr = theNewFeatStr;

  }

  return theOrigFeatStr
}


function checkAndGetRightAa_fromAa(resPos){
  if (resPos.match("-")){
    let arr = resPos.split("-")
    resPos = arr[0]
  }

  let theRightAa = ''
  if (AQUARIA.hasOwnProperty('showMatchingStructures') && AQUARIA.showMatchingStructures.hasOwnProperty('sequence') && AQUARIA.showMatchingStructures.sequence.hasOwnProperty('sequence')) {
    theRightAa = AQUARIA.showMatchingStructures.sequence.sequence[parseInt(resPos) - 1]
  }

  return theRightAa
}

function checkAndGetRightAa (featStr, isOne) {
  const arr = featStr.split(/[0-9]+/)
  const oldAa = arr[0]

  let resPos = featStr.replace(/^[^\d]+/, '')
  resPos = resPos.replace(/[^\d].*$/, '')

  let theRightAa = ''
  if (AQUARIA.hasOwnProperty('showMatchingStructures') && AQUARIA.showMatchingStructures.hasOwnProperty('sequence') && AQUARIA.showMatchingStructures.sequence.hasOwnProperty('sequence')) {
    theRightAa = AQUARIA.showMatchingStructures.sequence.sequence[parseInt(resPos) - 1]
  }

  /*
		if (isOne){
			return theRightAa
		}
		else {
			theRightAa = Object.keys(threeToOneResMap).find(key => threeToOneResMap[key] === theRightAa);
		}
		*/
  console.log('The old Aa and resPos are ' + oldAa + ' ' + resPos + ' ' + theRightAa)

  return theRightAa
}

function getTerminatingPos_fs (featStr) {
  const terPos = featStr.replace(/^[a-zA-Z]+[0-9]+[a-zA-Z]+[fF][Ss]([Tt][eE][rR]|\*)/, '')

  return terPos
}

function getTheRange (featStr) {
  const tmpStr = featStr.replace(/[dD][eE][lL][iI][nN][sS].*$/, '')
  const arr = tmpStr.split(/\_/)
  arr[0] = arr[0].replace(/[^0-9]+/g, '')
  arr[1] = arr[1].replace(/[^0-9]+/g, '')

  return { startPos: arr[0], endPos: arr[1] }
}

function getTheRange_del (featStr) {
  const tmpStr = featStr.replace(/[dD][eE][lL].*$/, '')
  const arr = tmpStr.split(/\_/)
  arr[0] = arr[0].replace(/[^0-9]+/g, '')
  arr[1] = arr[1].replace(/[^0-9]+/g, '')
  console.log('Foetal surgeon ' + arr[1])

  return { startPos: arr[0], endPos: arr[1] }
}

function getAndAddRange_newResAsX (range_deleted, range_inserted, newResidues, consStr, defaultAa, oldAa) {
  console.log('Comes in here 1')

  let counter_ins = 1
  if (range_deleted.hasOwnProperty('startPos') && range_deleted.hasOwnProperty('endPos')) {
    console.log('Comes in here 2')

    for (let i = parseInt(range_deleted.startPos) + 1; i <= parseInt(range_deleted.endPos); i++) {
      newResidues[i] = {}
      newResidues[i].consStr = consStr
      newResidues[i].newAas = []

      if (counter_ins < range_inserted.length) {
        newResidues[i].newAas.push(range_inserted[counter_ins])
      } else {
        newResidues[i].newAas.push(defaultAa)
      }

      counter_ins = counter_ins + 1
    }
  }
}

function addToObj (newResidues, resPos, resAa) {
  if (!newResidues.hasOwnProperty(resPos)) {
    newResidues[resPos] = []
  }

  newResidues[resPos].push(resAa)
}

function concatToObj (newResidues, resPos, resAas_list) {
  if (!newResidues.hasOwnProperty(resPos)) {
    newResidues[resPos] = []
  }

  newResidues[resPos] = newResidues[resPos].concat(resAas_list)
}

function isOneTOrThreeF (featStr) {
  const resStr = featStr.split(/[0-9]+/)

  // console.log('The featStr is, the residueStr ' + resStr[0] + " " +  resStr[0].length);

  if (resStr[0].length == 3) {
    return false
  }

  return true
}

function getOldRes (featStr) {
  const oldRes = featStr.replace(/[0-9]+.*$/, '')
  return oldRes
}
function getNewRes (featStr) {
  const newResStr = featStr.split(/[0-9\_]+/)

  const oldAa = checkIfInKey_ig(newResStr[0])
  if (oldAa != '-') {
    newResStr[0] = oldAa
  }

  const newAa = checkIfInKey_ig(newResStr[1])
  if (newAa != '-') {
    newResStr[1] = newAa
  }

  return { newRes: newResStr[1], oldRes: newResStr[0] }
}

function getFirstNewRes_delinsAndIsSingleAa (featStr, isOne) {
  const arr = featStr.split(/delins/)
  let firstRes = 'X'; let isSingleAa = false
  if (isOne) {
    firstRes = arr[1].substring(0, 1)
  } else {
    firstRes = arr[1].substring(0, 3)
  }

  if (firstRes.length == arr[1].length) {
    isSingleAa = true
  }

  console.log('The feature is delins ' + firstRes)

  return { firstRes: firstRes, isSingleAa: isSingleAa }
}

function isHomoOrHeteroZygous (featStr) {
  let tmp = featStr
  tmp = tmp.replace(/[\[\]]+/g, '')
  const arr = tmp.split(/\;/)

  console.log('The features are ' + tmp + ' ' + arr)

  const theResAa1 = getNewRes(arr[0])
  const theResAa2 = getNewRes(arr[1])

  const theResPos1 = getResPos_simple(arr[0])
  const theResPos2 = getResPos_simple(arr[1])

  if (theResAa1.oldRes == theResAa2.oldRes && theResPos1 == theResPos2) {
    return true
  } else {
    return false
  }
}

function getFirstNewRes_ext (featStr, isOne) {
  const arr = featStr.split(/[0-9]+/)
  let firstRes = 'X'; let isSingleAa = false
  if (isOne) {
    firstRes = arr[1].substring(0, 1)
  } else {
    firstRes = arr[1].substring(0, 3)
  }

  if (firstRes.length == arr[1].length) {
    isSingleAa = true
  }

  console.log('The feature is delins ' + firstRes)

  return { firstRes: firstRes, isSingleAa: isSingleAa }
}

function getAllNewRes_delins (featStr, isOne) {
  const arr = featStr.split(/[dD][eE][lL][iI][nN][sS]/)
  arr[1] = arr[1].replace(/[^a-zA-Z]+/g, '')

  let newResEachPos = []
  if (isOne) {
    newResEachPos = arr[1].split('')
  } else {
    newResEachPos = arr[1].match(/.{1,3}/g)
  }

  return (newResEachPos)
}

function getAllNewRes (featStr) {
  const arr = featStr.split(/[0-9]+/)
  const arr_1 = arr[1].split(/\^/)

  return arr_1
}

function getFirstNewRes_mosaic (featStr) {
  const arr = featStr.split(/[0-9]+\=\//)
  // let arr_1 = arr[1].split(/\^/);

  return {old:arr[0], new:arr[1]}
}

function getFirstNewRes_chimeric (featStr) {
  const arr = featStr.split(/[0-9]+\=\/\//)
  // let arr_1 = arr[1].split(/\^/);

  return {old:arr[0], new:arr[1]}
}

function getTheTwoPositions (featStr) {
  const arr = featStr.split(/\_/)
  arr[0] = arr[0].replace(/[A-Za-z]/g, '')
  arr[1] = arr[1].replace(/[A-Za-z\*]/g, '')

  arr[0] = parseInt(arr[0])
  arr[1] = parseInt(arr[1])

  return { posStart: arr[0], posEnd: arr[1] }
}

function getResPos_simple (featStr) {
  let resPos = featStr.replace(/^[a-zA-Z]+/, '')
  // console.log('The feature is resPos ' + resPos);

  resPos = resPos.replace(/[^0-9].*$/, '')

  return (parseInt(resPos))
}

// 1, 3 letter code handling

function checkIfInKey_ig (threeLetterCode) {
  const key = Object.keys(threeToOneResMap).find(k => k.toLowerCase() === threeLetterCode.toLowerCase())
  console.log('The key is ' + key)
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

function convertNewResTo1Letter (newResidues) {
  for (const resNum in newResidues) {
    for (let i = 0; i < newResidues[resNum].newAas.length; i++) {
      const theAa = newResidues[resNum].newAas[i]
      console.log('A new residue is ' + theAa)
      if (threeToOneResMap.hasOwnProperty(theAa)) {
        newResidues[resNum].newAas[i] = threeToOneResMap[theAa]
      }
    }
  }
}

function getThreeLetterCode(oneLetterCode){
    let theKeys = Object.keys(threeToOneResMap)

    for (let i =0; i< theKeys.length; i++){

      if (threeToOneResMap[theKeys[i]] == oneLetterCode.toUpperCase()){
        return theKeys[i]
      }
    }

    return '-'
}


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
