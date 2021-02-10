var counter_complete = 0;

module.exports = function (resStart_pp, resEnd_pp, variantResidues, featureType, description, serverName, variants_featTypesOfInt){


	if (variants_featTypesOfInt.includes(featureType)){

		Object.keys(variantResidues).forEach(function(resSnp, i){
			// console.log("The new residue is " + variantResidues[resSnp].newResidue);

			let pos_mut = resSnp;
			if (resSnp.match(/\-/)){
				pos_mut = resSnp.split(/\-/)[0];
			}

			if (parseInt(pos_mut) >= parseInt(resStart_pp) && parseInt(pos_mut) <= parseInt(resEnd_pp)){

				if (serverName == 'COSMIC'){
						console.log("cosmic 3 pass");
				}

				let obj_featType = {};
				if (serverName == 'PredictProtein' && featureType == 'Conservation'){
					let varInfo = [];
					cleanData_pp(description, varInfo);

					addToVariantResidues(variantResidues, resSnp, [], varInfo, [], 'PredictProtein');
				}

				else if (serverName == 'SNAP2'){
					// 1. Check if object exists with name Mutational sensitivity
					let varInfo = []; let posInfo = []; let otherResInfo = []; // get from variant inof if it exists;

					if (featureType == 'Mutational sensitivity (SNAP2 ratio of effect mutations)'){

						cleanData_snap2_effects(description, variantResidues[resSnp].newResidues, posInfo, otherResInfo);
						addToVariantResidues(variantResidues, resSnp, [], posInfo, otherResInfo, 'SNAP2');
					}
					else if (featureType == 'Mutation score (average SNAP2 score)'){
						cleanData_snap2_getAvgScore(description, varInfo, variantResidues[resSnp].newResidues, variantResidues[resSnp]);
						// addToVariantResidues(variantResidues, resSnp, varInfo, [], [], 'SNAP2 prediction');
					}



				}
				else if (serverName == 'CATH') {
					let posInfo = [];

					if (featureType == 'Functional domain'){
						cleanData_cath(description, posInfo, 'functional family');
					}
					else if (featureType == 'Structural domain'){
						cleanData_cath(description, posInfo, 'domain')
					}


					addToVariantResidues(variantResidues, resSnp, [], posInfo, [], 'CATH');
					// variantResidues[resSnp][serverName].push(obj_featType);
				}

				else if (serverName == 'UniProt'){
					console.log('uniprot featuretype is ' + featureType);
					console.log("uniprot feature description is "  + description);

					description = description.replace(/[\s]+$/, '');
					if (featureType == 'Metal ion-binding site' ){

						let posInfo = [];
						posInfo.push(description + " metal ion-binding site");
						addToVariantResidues(variantResidues, resSnp, [], posInfo, [], 'UniProt');

					}
					if (featureType == 'Binding site' ){

						let posInfo = [];
						posInfo.push(description + " binding site");
						addToVariantResidues(variantResidues, resSnp, [], posInfo, [], 'UniProt');

					}
					else if (featureType == 'Site'){
						let posInfo = [];
						posInfo.push(description + ' site');
						addToVariantResidues(variantResidues, resSnp, [], posInfo, [], 'UniProt');
					}

					else if (featureType == 'Modified residue'){
						let posInfo = [];
						posInfo.push("Modified residue " + description);
						addToVariantResidues(variantResidues, resSnp, [], posInfo, [], 'UniProt');
					}

					else if (featureType == 'Cross-link'){
						let posInfo = [];
						posInfo.push("Cross-link " + description);
						addToVariantResidues(variantResidues, resSnp, [], posInfo, [], 'UniProt');
					}

					else if (featureType == 'Sequence variant' || featureType == 'Mutagenesis site'){
						let varInfo = []; let otherResInfo = []; let posInfo = [];

						// check for the right residue;
						//cleanData_uniprot_seqVar(description, variantResidues[resSnp].newResidues, varInfo, otherResInfo, posInfo);
						cleanData_uniprot_seqVar_v2(description, variantResidues[resSnp], posInfo, featureType);

						addToVariantResidues(variantResidues, resSnp, varInfo, posInfo, otherResInfo, 'UniProt ' + featureType);

					}


				}
				else if (serverName == 'COSMIC'){

					let varInfo = []; let posInfo = []; let otherResInfo = [];

					console.log("The newAas are ")
					console.log(variantResidues[resSnp]);
					cleanData_cosmic(description, variantResidues[resSnp].newResidues, varInfo, posInfo, otherResInfo);

					addToVariantResidues(variantResidues, resSnp, varInfo, posInfo, otherResInfo, 'COSMIC')
					console.log("The cosmic description is " + description);
				}

				else if (serverName == 'FunVar'){
					let varInfo = []; let otherResInfo = [];

					console.log("The funVar description is 111 " + description);
					cleanData_funVar(description, variantResidues[resSnp]);

					// addToVariantResidues(variantResidues, resSnp, varInfo, [], otherResInfo, 'FunVar')
				}




				/*
				if (serverName == 'SNAP2'){
					description = getSubstringOfInterest(description, variantResidues[resSnp].newResidue);
				}
				else if (serverName == 'CATH'){
					description = getSubstringOfInterest_cath(description);
				}
				// console.log("The counter is " + counter_complete);
				let aDesc =  "<span class=\"teaser\"> <i> " + featureType + "</i> </span> <span id=\"complete" + counter_complete + "\" style=\"display: none\"> " + description + " </span><span id=\"more\" class=\"more\" onclick=\"(function(){ " + generateShowHideFnStr("complete"+counter_complete) + "  })();\"> more... </span>";

				if (!variantResidues[resSnp].hasOwnProperty(serverName)){
					variantResidues[resSnp][serverName] = [];
					console.log("over here! " + serverName);
				}
				variantResidues[resSnp][serverName].push(aDesc);

				console.log("restart " + resStart_pp + " resEnd " + resEnd_pp + " featuretype " + featureType + " description " + description + " serverNameSet " + serverName);

				counter_complete = counter_complete + 1;
				*/
			}
		});
	}






	/* Previously (to changing the variant residues function):
	if (variants_featTypesOfInt.includes(featureType)){
		Object.keys(variantResidues).forEach(function(resSnp, i){
			if (parseInt(resSnp) >= parseInt(resStart_pp) && parseInt(resSnp) <= parseInt(resEnd_pp)){

				if (serverName == 'SNAP2'){
					description = getSubstringOfInterest(description, variantResidues[resSnp].newResidue);
				}
				else if (serverName == 'CATH'){
					description = getSubstringOfInterest_cath(description);
				}
				// console.log("The counter is " + counter_complete);
				let aDesc =  "<span class=\"teaser\"> <i> " + featureType + "</i> </span> <span id=\"complete" + counter_complete + "\" style=\"display: none\"> " + description + " </span><span id=\"more\" class=\"more\" onclick=\"(function(){ " + generateShowHideFnStr("complete"+counter_complete) + "  })();\"> more... </span>";

				if (!variantResidues[resSnp].hasOwnProperty(serverName)){
					variantResidues[resSnp][serverName] = [];
					console.log("over here! " + serverName);
				}
				variantResidues[resSnp][serverName].push(aDesc);

				console.log("restart " + resStart_pp + " resEnd " + resEnd_pp + " featuretype " + featureType + " description " + description + " serverNameSet " + serverName);

				counter_complete = counter_complete + 1;
			}
		});
	}
	*/
}



function addToVariantResidues(variantResidues, resSnp, varInfo, posInfo, otherResInfo, serverName){

	if (!variantResidues[resSnp].hasOwnProperty('variantInfo')){
		variantResidues[resSnp]['variantInfo'] = {};
	}

	if (!variantResidues[resSnp].hasOwnProperty('positionInfo')){
		variantResidues[resSnp]['positionInfo'] = {};
	}

	if (!variantResidues[resSnp].hasOwnProperty('otherResInfo')){
		variantResidues[resSnp]['otherResInfo'] = {};
	}


	if (varInfo.length > 0){
		console.log("The VAR INFO IS " + varInfo);
		console.log(varInfo);
		if (!variantResidues[resSnp]['variantInfo'].hasOwnProperty(serverName)){
			variantResidues[resSnp]['variantInfo'][serverName] = varInfo;
		}
		else {
			variantResidues[resSnp]['variantInfo'][serverName] = variantResidues[resSnp]['variantInfo'][serverName].concat(varInfo);
			console.log(variantResidues[resSnp]['variantInfo'][serverName])
		}
	}

	if (posInfo.length > 0){
		console.log("snap2 the positionInfo is " + posInfo);
		if (!variantResidues[resSnp]['positionInfo'].hasOwnProperty(serverName)){
			variantResidues[resSnp]['positionInfo'][serverName] = posInfo;
		}
		else {
			variantResidues[resSnp]['positionInfo'][serverName] = variantResidues[resSnp]['positionInfo'][serverName].concat(posInfo);
		}
	}

	if (otherResInfo.length > 0){
		console.log("The OTHERRES INFO IS " + otherResInfo);
		if (!variantResidues[resSnp]['otherResInfo'].hasOwnProperty(serverName)){
			variantResidues[resSnp]['otherResInfo'][serverName] = otherResInfo;
		}
		else {
			console.log("THE OTHERRES INFO appending");
			variantResidues[resSnp]['otherResInfo'][serverName] = variantResidues[resSnp]['otherResInfo'][serverName].concat(otherResInfo);
			console.log(variantResidues[resSnp]['otherResInfo'][serverName])
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
function cleanData_pp(desc, varInfo){
	desc = desc.replace(/\s+/g, '');

	let arr = desc.split(/\:/);
	let arr_1 = arr[1].split(/\(/);
	arr_1[1] = arr_1[1].replace(/\)/, '');

	// let obj_inFeatType = {mainToShow: arr_1[1], mainToHide: "Score: " + arr_1[0]};
	varInfo.push(arr_1[1] + " conservation (score = " + arr_1[0] + ")")

	console.log("The pridict protein value is: " + arr_1[1] + " (score:" + arr_1[0] + ")")

	// return obj_inFeatType;
}


function cleanData_funVar(desc, variantResidues_res){


	let arr = desc.split(/\|/);
	let arr_aa = arr[0].split(/\>/);

	if (arr_aa.length > 1){

		let arr_aa = arr[0].split(/\>/); //.replace(/\>/, "&#8594;");
		let arr_desc = arr[1].split("<br>");

		let toAdd = "<i>FunVar: </i>";
		if (arr_desc.length >= 5){
			arr_desc[5] = arr_desc[5].replace("<i> FunFams (v4_2_0):</i> ", '');
			console.log("The funvar desc newAa is " + arr_aa[1] + " " + arr_desc[5]);
			toAdd = toAdd + "Disrupts " + arr_desc[5] + '. ';
		}

		if (arr_desc.length >= 4){
			arr_desc[4] = arr_desc[4].replace("<i>Cancer types (Is FunFam domain enriched):</i>", "");

			toAdd = toAdd + "In " + arr_desc[4];
		}




		variantResidues_res[arr_aa[1]].push(toAdd);


		// console.log("The arr_desc is " + arr_desc);


		// variantResidues_res[arr_aa[1]].push("<i>FunVar: </i>");
		/*
		let isFoundInNewAas = false;
		newAas.forEach(function(newAa, newAa_i){
			if (arr_aa[1] == newAa){

				varInfo.push(aaChange + " " + arr_desc[4] + " " + arr_desc[5]);
				isFoundInNewAas = true;
			}
		});

		if (isFoundInNewAas == false){
				otherResInfo.push(aaChange + " " + arr_desc[4] + " " + arr_desc[5]);
		}
		*/

	}

}


function cleanData_cosmic(desc, newAas, varInfo, posInfo, otherResInfo){
	let arr = desc.split(/\|/);
	arr[0] = arr[0].replace(/^p\./, '');
	arr_aas = arr[0].split(/[0-9]+/);

	console.log("Cosmic 1 " + arr_aas[1]);
	if (arr_aas.length >= 1 && arr_aas[1] != 'fs'){
		let cosmic_newAa = arr_aas[1];
		let cosmic_oldAa = arr_aas[0];

		let val = checkIfInKey_ig(cosmic_newAa);
		if (val != '-'){
			cosmic_newAa = val;
		}

		let val_old= checkIfInKey_ig(cosmic_oldAa);
		if (val_old != '-'){
			cosmic_oldAa = val_old;
		}

		if (newAas){
			let isFoundInNewAas = false;
			newAas.forEach(function(newAa, newAa_i){
				if (cosmic_newAa == newAa){
					varInfo.push( cosmic_oldAa + "&#8594;" +  cosmic_newAa + " " + arr[1] + " " + arr[2]);
					isFoundInNewAas = true;
				}
			});

			if (isFoundInNewAas == false){
				otherResInfo.push(cosmic_oldAa + "&#8594;" +  cosmic_newAa + " " + arr[1] + " " + arr[2]);
			}
		}


	}
	else{
		posInfo.push(arr[1] + " " + arr[2]);
	}

}

function cleanData_uniprot_seqVar_v2(desc, variantResidues_res, posInfo, featureType){
	// main to show, other residues;

	console.log("The Uniprot seqVar desc are " + desc);


	desc = desc.replace(/^[\s]+/, "");
	desc = desc.replace(/\.$/, '');
	desc = desc.replace(/\>/, '&#8594;')
	let arr = desc.split(/[\s]+/);

	console.log("The Uniprot seqVar desc 2 are " + arr);

	if (arr[1] == '&#8594;'){
		if (oneAaCodes.includes(arr[2])){
			let newAa = arr[2];
			if (!variantResidues_res.hasOwnProperty(newAa)){
				variantResidues_res[newAa] = [];
			}
			arr = arr.slice(3, arr.length);

			variantResidues_res[newAa].push('<i>UniProt:</i> ' + featureType + " "  + arr.join(" "));
		}
		else{
			posInfo.push(featureType + " " + desc);
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
	}
	else {
		// add to posInfo
		posInfo.push(featureType + " " + desc);
	}

}



function cleanData_uniprot_seqVar(desc, newAas, varInfo, otherResInfo, posInfo){
	// main to show, other residues;

	console.log("The Uniprot seqVar desc are " + desc);


	desc = desc.replace(/^[\s]+/, "");
	desc = desc.replace(/\.$/, '');
	desc = desc.replace(/\>/, '&#8594;')
	let arr = desc.split(/[\s]+/);
	if (arr[1] == '&#8594;'){
			let isDescPushed = false;
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
			}
	}
	else {
		// add to posInfo
		posInfo.push(desc);
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

function cleanData_snap2_getAvgScore(desc, arr_posInfo, newAas, variantResidues_pos){

	console.log("snap2 desc 2 is " + desc);

	let arr = desc.split(/\;/);

	if (arr.length > 2){
		//console.log('snap2 desc is ' + arr.length + " |" +  arr[2] + "|");
		arr[2] = desc.replace('function changing are:', '');
		arr[2] = desc.replace(/[\s]+/g, '');
		arr_indivRes = arr[2].split(/\,/);
		// console.log ('snap2 desc is 3 ' + arr_indivRes);

		arr_indivRes.forEach(function(anAaAndScore, anAaAndScore_i){
			let arr_aaScore = anAaAndScore.split(/\:/);
			if (oneAaCodes.includes(arr_aaScore[0].toUpperCase())){
				if (!variantResidues_pos.hasOwnProperty(arr_aaScore[0])){
					variantResidues_pos[arr_aaScore[0]] = [];
				}
				variantResidues_pos[arr_aaScore[0]].push('<i>SNAP2:</i> ' + "Predicted to change function (score = " + arr_aaScore[1] + ")")
			}
			// console.log("snap2 desc 4 is " + anAaAndScore);
		});


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


function cleanData_cath(desc, varInfo, partOf){
	desc = desc.replace(/\<span[^\>]*\>/, '');
	desc = desc.replace(/\<i\>/, '');
	desc = desc.replace(/\<\/i\>/, '');
	desc = desc.replace(/\<\/span\>/, '');
	desc = desc.replace(/\$.*$/, '');

	let arr = desc.split(/\:\s/);
	arr[0] = arr[0].replace(/CATH/, '');

	console.log("The cath arr thingo is " + arr[1]);
	varInfo.push("Part of " + partOf + " '" + arr[1] + "'");

	// let obj_featType = {};

	// obj_featType[arr[0]] = {'mainToShow': arr[1]};
	// {mainToShow: arr_1[1], mainToHide: "Score: " + arr_1[0]};

	// console.log('cleaned cath desc is ' + desc + " arr[0]" + arr[0] + " arr[1]:" + arr[1]);
	// return (obj_featType);
}

function cleanData_snap2_effects(desc, newAas, arr_posInfo, arr_otherResInfo){
	console.log("snap2 desc 1 " + desc);
	let arr = desc.split(/\;/);

	let posInfoDesc = "";
	if (arr.length >= 1){
		posInfoDesc = arr[0] +" to mutation. ";
	}

	if (arr.length >= 2){
		arr[1] = arr[1].replace(/[\s]+$/, '');
		posInfoDesc = posInfoDesc + arr[1];
	}

	if (posInfoDesc != ''){
		arr_posInfo.push(posInfoDesc);
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



function checkAndRetIdx(arrOfObjs, key){
	let idx = -1;
	for (let i = 0; i< arrOfObjs.length; i++){
		if (arrOfObjs[i].hasOwnProperty(key)){
			idx =  i;
		}
	}

	return idx;
}

/////////

function generateShowHideFnStr(id_complete){
	returnStr = "elem = document.getElementById('" + id_complete + "');";

	returnStr = returnStr + "if (elem.style.display == ''){elem.style.display = 'none'; console.log('Next sibling is'); console.log(elem.nextSibling.innerHTML); elem.nextSibling.innerHTML = 'more...';}";


	returnStr = returnStr + "else{ elem.style.display = ''; elem.nextSibling.innerHTML = 'less...';}; ";


	return (returnStr);
}


$('.more').toggle(function(){
    $(this).text('less..').siblings('.complete').show();
}, function(){
    $(this).text('more..').siblings('.complete').hide();
});




function getSubstringOfInterest(description, newResidue){

	console.log('SNAP2 the newResidue is ' + newResidue );
	let arr = description.split(/\;/);
	description = arr[0];

	// to see if the new residue does anything;
	arr[1] = arr[1].replace('function changing are:', '');


	arr_res = arr[1].split(/\,/);

	console.log('SNAP2 the rest of the array is ');
	console.log(arr_res);


	for (let i = 0; i < arr_res.length; i++){
		if (arr_res[i].includes(newResidue)){
			description = description + ". Specific score " +  arr_res[i] + ".";
		}
	}


	return description;
}


function getSubstringOfInterest_cath(description){
	let desc = description.replace(/\<[^\<\>]+\>/g, '');
	desc = desc.replace(/\$\$.*$/, '');
	desc = desc.replace(/^.+\:/, '');

	return desc;
}

const oneAaCodes = ['A',	'R',	'N',	'D',	'C',	'Q',	'E',	'G',	'H',	'I',	'L',	'K',	'M',	'F',	'P',	'S',	'T',	'W',	'Y',	'V'];


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
	Thr: 'T',
};

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
