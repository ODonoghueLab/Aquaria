exports.getConsInfo = getConsInfo;

// module.exports = function (featStr){
function getConsInfo(featStr){
	let consequentStr = "";
	let newResidues = {}; // {resPos} => {newAas} => [newAa1, newAa2, .. newAaN]; {consequent} => consequentStr;
	let isOne = true;

	// Remove any spaces
	featStr = featStr.replace(/[\s ]+/, '');

	// Remove the last \=\", i.e. the description.
	featStr = featStr.replace(/\=\"[^\=]$/, '');

	// Replace %3F to ?
	featStr = featStr.replace(/\%3F/g, '?');

	// Replace %2F to /
	featStr = featStr.replace(/\%2F/g, '/');

	// Replace to %3B to ;
	featStr = featStr.replace(/\%3B/g, ';');

	// Remove p.
	featStr = featStr.replace(/^p\./, '');


	// if \( or \) Prepend 'Predicted';
	if (featStr.match(/[\(\)]+/)){
		consequentStr = 'Predicted ';
		featStr = featStr.replace(/[\(\)]+/g, '');
	}
	// Check if amino acid is specified as isOne (ret. True) or isThree (ret. False);
	isOne = isOneTOrThreeF(featStr);


	// Allele
	if (featStr.match(/^\[.*\]$/)){
		// Recursively get the sub-patterns for each allele
		// consequentStr = consequentStr + "Allele ";

		if (featStr.match(/^\[[a-zA-Z]+[0-9]+[a-zA-Z]+\;[a-zA-Z]+[0-9]+[a-zA-Z]+\]/)){
			consequentStr = consequentStr + "Same allele "
		}
		else if (featStr.match(/^\[[a-zA-Z]+[0-9]+[a-zA-Z]+\]\;\[[a-zA-Z]+[0-9]+[a-zA-Z]+\]$/)){
			consequentStr = consequentStr + "Different allele";

			let isHomoTisHetroF = isHomoOrHeteroZygous(featStr);

			if (isHomoTisHetroF){
				consequentStr = consequentStr + ", homozygous. ";
			}
			else {
				consequentStr = consequentStr + ", heterozygous. ";
			}

		}
		else if (featStr.match(/^\[[a-zA-Z]+[0-9]+[a-zA-Z]+\,[a-zA-Z]+[0-9]+[a-zA-Z]+\]$/)){
			consequentStr = consequentStr + "One allele encoding two proteins ";
		}
		else {
			consequentStr = consequentStr + "Allele ";
		}


		featStr = featStr.replace(/[\[\]]+/g, '');
		let sub_variants = featStr.split(/[\;\,]+/);

		for (let i=0; i<sub_variants.length; i++){
			let consInfo = getConsInfo(sub_variants[i]);

			let keys = Object.keys(consInfo);
			for (let k =0; k<keys.length; k++){

				if (!newResidues.hasOwnProperty(keys[k])){
					console.log("The features is guys taken care of " + keys[k]);
					newResidues[keys[k]] = {};
					newResidues[keys[k]]['newAas'] = [];
					newResidues[keys[k]]['consStr'] = consequentStr;
				}

				for (let l=0; l < consInfo[keys[k]]['newAas'].length; l++){
						if (!newResidues[keys[k]]['newAas'].includes(consInfo[keys[k]]['newAas'][l])){
							newResidues[keys[k]]['newAas'].push(consInfo[keys[k]]['newAas'][l]);
						}
				}

				newResidues[keys[k]]['consStr'] = newResidues[keys[k]]['consStr'] + consInfo[keys[k]]['consStr'] + "; ";


			}


		}
		console.log("The features is combined");
		console.log(newResidues);
		// console.log("The feature is sub_variants " + sub_variants);

	}
	// Deletion-insertion
	else if (featStr.match(/[dD][eE][lL][iI][nN][sS]/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};

		// resPositions.push(resPos);


		consequentStr = consequentStr + 'Deletion-insertion ';
		if (featStr.match(/^[a-zA-Z]+[0-9]+[dD][eE][lL][iI][nN][sS]/)){
			// single amino acid deletion
			consequentStr = consequentStr + 'single aa. deletion '
		}
		else if (featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[dD][eE][lL][iI][nN][sS]/)){
			// muliple amino acid deletion
			consequentStr = consequentStr + 'multiple aa. deletion '
		}

		if (featStr.match(/[dD][eE][lL][iI][nN][sS][a-zA-Z]+$/)){
			let res = getFirstNewRes_delinsAndIsSingleAa(featStr, isOne);
			addToObj(newResidues[resPos], 'newAas', res.firstRes);

			if (res.isSingleAa) {
				// single amino acid insertion
				consequentStr = consequentStr + 'single aa. insertion ';
			}
			else {
				consequentStr = consequentStr + 'multiple aa. insertion ';
			}
		}
		else if (featStr.match(/[dD][eE][lL][iI][nN][sS][0-9\*]+$/)){
			// Muliple amino acid insertion
			consequentStr = consequentStr + 'multiple aa. insertion '
			addToObj(newResidues[resPos], 'newAas', 'X');
		}
		else{
			addToObj(newResidues[resPos], 'newAas', 'X');
		}

		newResidues[resPos]['consStr'] = consequentStr;
	}

	// Deletion
	else if (featStr.match(/[dD][eE][lL]/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};
		// resPositions.push(resPos);


		consequentStr = consequentStr + 'Deletion ';

		if (featStr.match(/^[A-Za-z]+[0-9]+[dD][eE][lL]$/)){
			consequentStr = consequentStr + 'single amino acid ';
		}
		else if (featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[dD][eE][lL]$/)) {
			consequentStr = consequentStr + 'multiple amino acids ';
			// New translation initiation site (downstream);
			// get second residue,
		}
		addToObj(newResidues[resPos], 'newAas', 'del');
		newResidues[resPos]['consStr'] = consequentStr;
	}

	// Duplication
	else if (featStr.match(/[dD][uU][pP]/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};
		// resPositions.push(resPos);


		consequentStr = consequentStr + 'Duplication '
		if (featStr.match(/^[a-zA-Z]+[0-9]+[dD][uU][pP]$/)){
			consequentStr = consequentStr + 'single amino acid '
		}
		else if(featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[dD][uU][pP]$/)){
			consequentStr = consequentStr + 'multiple amino acid ';
		}
		addToObj(newResidues[resPos], 'newAas', 'X');
		newResidues[resPos]['consStr'] = consequentStr;
	}

	// Insertion
	else if (featStr.match(/[iI][nN][sS]/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};
		// resPositions.push(resPos);


		consequentStr = consequentStr + 'Insertion ';
		if (featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[iI][nN][sS][a-zA-Z\*]+$/) || featStr.match(/^[a-zA-Z]+[0-9]+\_[a-zA-Z]+[0-9]+[iI][nN][sS][0-9\*]+$/)){
			// get first and second residue;
			let twoPos = getTheTwoPositions(featStr);
			console.log("The feature is , aminoAcidRes " + twoPos.posStart + " " + twoPos.posEnd);
			if (twoPos.posStart+1 == twoPos.posEnd){
				consequentStr = consequentStr + 'between consecutive amino acids';
			}
			else {
				consequentStr = consequentStr + 'in-frame';
			}
		}
		addToObj(newResidues[resPos], 'newAas', 'X');
		newResidues[resPos]['consStr'] = consequentStr;
	}

	// Repeated sequences
	else if (featStr.match(/^[^\[].*?\[[0-9\;\_]+\]$/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};
		// resPositions.push(resPos);


		consequentStr = consequentStr + 'Repeated sequences ';
		if (featStr.match(/^[a-zA-Z]+[0-9]+\[[0-9]+\]$/)){
			consequentStr = consequentStr + 'single amino acid';
		}
		else if (featStr.match(/^[a-zA-Z]+[0-9]+\[[0-9]+\]\;\[[0-9]+\]$/)){
			consequentStr = consequentStr + 'multiple amino acid';
		}
		else if (featStr.match(/^[a-zA-Z]+[0-9]+\[[0-9]+\_[0-9]+\]$/)){
			consequentStr = consequentStr + 'repeated range';
		}
		addToObj(newResidues[resPos], 'newAas', 'X');
		newResidues[resPos]['consStr'] = consequentStr;
	}

	// Frame shift
	else if (featStr.match(/[fF][sS]/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};
		// resPositions.push(resPos);


		consequentStr = consequentStr + "Frame shift ";
		if (featStr.match(/^[a-zA-Z]+[0-9]+[a-zA-Z]+[fF][Ss][a-zA-Z0-9\*\?]+$/)){
			// extract new amino acid;
			let res = getFirstNewRes_ext(featStr, isOne);
			addToObj(newResidues[resPos], 'newAas', res.firstRes);
		}
		newResidues[resPos]['consStr'] = consequentStr;
	}

	// Extension
	else if (featStr.match(/[eE][xX][tT]/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};
		// resPositions.push(resPos);


		consequentStr = consequentStr + 'Extension ';
	 	if (featStr.match(/^[mM][eE][tT]1[eE][xX][tT][\_\-0-9a-zA-Z]+$/)){
			consequentStr = consequentStr + 'N-terminal ';
			addToObj(newResidues[resPos], 'newAas', 'X');
		}
		else if (featStr.match(/^[Tt][eE][rR][0-9]+[a-zA-Z]+[eE][xX][tT][\*\?a-zA-Z0-9]+/)){
			consequentStr = consequentStr + 'C-terminal ';
			let res = getFirstNewRes_ext(featStr, isOne);
			addToObj(newResidues[resPos], 'newAas', res.firstRes);
		}

		newResidues[resPos]['consStr'] = consequentStr;
	}


	// Substitution

	else if (featStr.match(/^[A-Za-z]+[0-9]+\*$/)|| featStr.match(/[A-Za-z]+[0-9]+[tT][eE][rR]$/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};
		// resPositions.push(resPos);


		consequentStr = consequentStr + "Nonsense ";
		addToObj(newResidues[resPos], 'newAas', '*');
		newResidues[resPos]['consStr'] = consequentStr;
	}
	else if (featStr.match(/^[A-Za-z]+[0-9]+[A-Za-z]+$/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};
		// resPositions.push(resPos);

		consequentStr = consequentStr + "Missense ";
		let newRes = getNewRes(featStr);

		addToObj(newResidues[resPos], 'newAas', newRes.newRes);
		newResidues[resPos]['consStr'] = consequentStr;
	}

	// Substitution - translation initiation codon
	/* else if (featStr.match(/^0$/)){
		consequentStr = consequentStr + "No protein ";
	} */
	else if (featStr.match(/^Met1\?$/) || featStr.match(/^M1\?$/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};


		consequentStr = consequentStr + 'Unknown consequence ';
		addToObj(newResidues[resPos], 'newAas', res.firstRes);
		newResidues[resPos]['consStr'] = consequentStr;
	}
	// Substitution - uncertain
	else if (featStr.match(/^[A-Za-z]+[0-9]+[A-Za-z]+(\^[A-Za-z]+)+$/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};


		consequentStr = consequentStr + 'Uncertain consequence ';
		// get all new residues
		concatToObj(newResidues[resPos], 'newAas', getAllNewRes(featStr));
		newResidues[resPos]['consStr'] = consequentStr;
	}
	// Allele - chimeric
	else if (featStr.match(/^[A-Za-z]+[0-9]+\=\/\/[A-Za-z]+$/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};

		consequentStr = consequentStr + 'Chimeric ';
		let newRes = getFirstNewRes_chimeric(featStr);

		addToObj(newResidues[resPos], 'newAas', newRes);
		newResidues[resPos]['consStr'] = consequentStr;

	}
	// Substitution - mosaic
	else if (featStr.match(/^[A-Za-z]+[0-9]+\=\/[A-Za-z]+$/)){
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};
		// resPositions.push(resPos);

		consequentStr = consequentStr + 'Mosaic (somatic case) ';
		let newRes = getFirstNewRes_mosaic(featStr);

		addToObj(newResidues[resPos], 'newAas', newRes);
		newResidues[resPos]['consStr'] = consequentStr;
	}
	else{
		let resPos = getResPos_simple(featStr);
		newResidues[resPos] = {};

		addToObj(newResidues[resPos], 'newAas', newRes);

		consequentStr = 'Variant is not recognized.';
		newResidues[resPos]['consStr'] = consequentStr;
	}



	// Convert new Aas to is One, and validate isOne.




	console.log("The feature is " + featStr + ",  consequentStr is " + consequentStr + ', newRes are ');
	console.log(newResidues);

	return (newResidues);
}

///////////////////////////////////// AUX
function addToObj(newResidues, resPos, resAa){
	if (!newResidues.hasOwnProperty(resPos)){
		newResidues[resPos] = [];
	}

	newResidues[resPos].push(resAa);
}

function concatToObj(newResidues, resPos, resAas_list){
	if (!newResidues.hasOwnProperty(resPos)){
		newResidues[resPos] = [];
	}

	newResidues[resPos] = newResidues[resPos].concat(resAas_list);

}


function isOneTOrThreeF(featStr){
	let resStr = featStr.split(/[0-9]+/);

	// console.log('The featStr is, the residueStr ' + resStr[0] + " " +  resStr[0].length);

	if (resStr[0].length == 3){
		return false;
	}

	return true;
}

function getNewRes(featStr){
	let newResStr = featStr.split(/[0-9\_]+/);

	return {newRes: newResStr[1], oldRes: newResStr[0]};
}

function getFirstNewRes_delinsAndIsSingleAa(featStr, isOne){
	let arr = featStr.split(/delins/);
	let firstRes = 'X'; let isSingleAa = false;
	if (isOne){
		firstRes = arr[1].substring(0, 1);
	}
	else{
		firstRes = arr[1].substring(0, 3);
	}

	if (firstRes.length == arr[1].length){
		isSingleAa = true;
	}


	console.log("The feature is delins " + firstRes);

	return {firstRes: firstRes, isSingleAa: isSingleAa};
}

function isHomoOrHeteroZygous(featStr){
	let tmp = featStr;
	tmp = tmp.replace(/[\[\]]+/g, '');
	let arr = tmp.split(/\;/);

	console.log("The features are " + tmp + " " + arr);

	let theResAa1 = getNewRes(arr[0]);
	let theResAa2 = getNewRes(arr[1])

	let theResPos1 = getResPos_simple(arr[0])
	let theResPos2 = getResPos_simple(arr[1]);

	if (theResAa1.oldRes == theResAa2.oldRes && theResPos1 == theResPos2){
		return true;
	}
	else {
		return false;
	}
}

function getFirstNewRes_ext(featStr, isOne){
	let arr = featStr.split(/[0-9]+/);
	let firstRes = 'X'; let isSingleAa = false;
	if (isOne){
		firstRes = arr[1].substring(0, 1);
	}
	else{
		firstRes = arr[1].substring(0, 3);
	}

	if (firstRes.length == arr[1].length){
		isSingleAa = true;
	}


	console.log("The feature is delins " + firstRes);

	return {firstRes: firstRes, isSingleAa: isSingleAa};
}

function getAllNewRes(featStr){
	let arr = featStr.split(/[0-9]+/);
	let arr_1 = arr[1].split(/\^/);

	return arr_1;
}

function getFirstNewRes_mosaic(featStr){
	let arr = featStr.split(/[0-9]+\=\//);
	// let arr_1 = arr[1].split(/\^/);

	return arr[1];
}

function getFirstNewRes_chimeric(featStr){
	let arr = featStr.split(/[0-9]+\=\/\//);
	// let arr_1 = arr[1].split(/\^/);

	return arr[1];
}


function getTheTwoPositions(featStr){
	let arr = featStr.split(/\_/);
	arr[0] = arr[0].replace(/[A-Za-z]/g, '');
	arr[1] = arr[1].replace(/[A-Za-z\*]/g, '');

	arr[0] = parseInt(arr[0]);
	arr[1] = parseInt(arr[1]);

	return {posStart: arr[0], posEnd: arr[1]};
}

function getResPos_simple(featStr){
	let resPos = featStr.replace(/^[a-zA-Z]+/, '');
	// console.log('The feature is resPos ' + resPos);

	resPos = resPos.replace(/[^0-9].*$/, '');


	return (parseInt(resPos));
}


// 1, 3 letter code handling

function checkIfInKey_ig(threeLetterCode){
	let key = Object.keys(threeToOneResMap).find(k => k.toLowerCase() === threeLetterCode.toLowerCase());
	console.log("The key is " + key);
	if (key){
		return (threeToOneResMap[key]);
	}
	else {
		return '-';
	}
}


function checkIfInVal_ig(oneLetterCode){
	// let isFound = false;
	let newRes = '-';
	Object.keys(threeToOneResMap).forEach(function(item, i){
		if (threeToOneResMap[item].toLowerCase() === oneLetterCode.toLowerCase()){
			newRes = oneLetterCode.toUpperCase();
		}
	});
	return newRes;
    /* for (var prop in threeToOneResMap) {
        if (threeToOneResMap.hasOwnProperty(prop) && threeToOneResMap[prop].toLowerCase() === oneLetterCode.toLowerCase()) {
            return threeToOneResMap[prop];
        }
    }
    return '-'; */
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
	Try: 'Y',
	His: 'H',
	Arg: 'R',
	Asn: 'N',
	Asp: 'D',
	Thr: 'T',
};
