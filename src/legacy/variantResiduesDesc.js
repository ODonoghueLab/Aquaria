var counter_complete = 0;

module.exports = function (resStart_pp, resEnd_pp, variantResidues, featureType, description, serverName, variants_featTypesOfInt){

	// console.log("restart " + resStart_pp + " resEnd " + resEnd_pp + " featuretype " + featureType + " description " + description + " serverNameSet " + serverName);

	if (variants_featTypesOfInt.includes(featureType)){
		Object.keys(variantResidues).forEach(function(resSnp, i){
			// console.log("The new residue is " + variantResidues[resSnp].newResidue);

			if (parseInt(resSnp) >= parseInt(resStart_pp) && parseInt(resSnp) <= parseInt(resEnd_pp)){

				/* if (!variantResidues[resSnp].hasOwnProperty(serverName)){


					variantResidues[resSnp][serverName] = [];


				} */

				let obj_featType = {};
				if (serverName == 'PredictProtein' && featureType == 'Conservation'){
					let varInfo = [];
					cleanData_pp(description, varInfo);
					// obj_featType[featureType] = obj_inFeatType;
					// console.log(' does come in here ... ');
					// console.log(obj_inFeatType);

					// variantResidues[resSnp][serverName].push(obj_featType);
					addToVariantResidues(variantResidues, resSnp, varInfo, [], [], 'PredictProtein Conservation');
				}

				else if (serverName == 'SNAP2'){
					// 1. Check if object exists with name Mutational sensitivity
					let varInfo = []; let posInfo = []; let otherResInfo = []; // get from variant inof if it exists;

					if (featureType == 'Mutational sensitivity (SNAP2 ratio of effect mutations)'){
						cleanData_snap2_effects(description, variantResidues[resSnp].newResidue, varInfo, otherResInfo);
					}
					else if (featureType == 'Mutation score (average SNAP2 score)'){
						cleanData_snap2_getAvgScore(description, posInfo);
					}

					addToVariantResidues(variantResidues, resSnp, varInfo, posInfo, otherResInfo, 'SNAP2');

				}
				else if (serverName == 'CATH') {
					let varInfo = [];
					cleanData_cath(description, varInfo);

					addToVariantResidues(variantResidues, resSnp, varInfo, [], [], 'CATH ' + featureType);
					// variantResidues[resSnp][serverName].push(obj_featType);
				}

				else if (serverName == 'UniProt'){
					console.log('uniprot featuretype is ' + featureType);
					console.log("uniprot feature description is "  + description);

					description = description.replace(/[\s]+$/, '');
					if (featureType == 'Metal ion-binding site' ){

						let varInfo = [];
						varInfo.push(description);
						addToVariantResidues(variantResidues, resSnp, varInfo, [], [], 'UniProt metal ion-binding site');

					}
					else if (featureType == 'Site'){
						let varInfo = [];
						varInfo.push(description);
						addToVariantResidues(variantResidues, resSnp, varInfo, [], [], 'UniProt site');
					}

					else if (featureType == 'Modified residue'){
						let varInfo = [];
						varInfo.push(description);
						addToVariantResidues(variantResidues, resSnp, varInfo, [], [], 'UniProt modified residue');
					}

					else if (featureType == 'Cross-link'){
						let varInfo = [];
						varInfo.push(description);
						addToVariantResidues(variantResidues, resSnp, varInfo, [], [], 'UniProt cross-link');
					}

					else if (featureType == 'Sequence variant' || featureType == 'Mutagenesis site'){
						let varInfo = []; let otherResInfo = [];
						// check for the right residue;
						cleanData_uniprot_seqVar(description, variantResidues[resSnp].newResidue, varInfo, otherResInfo);

						addToVariantResidues(variantResidues, resSnp, varInfo, [], otherResInfo, 'UniProt ' + featureType);

						// let idx = checkAndRetIdx(variantResidues[resSnp][serverName], featureType);
						/*
						if (idx == -1){
							obj_featType[featureType] = {};
							if (objWithInfo.hasOwnProperty('mainToShow')){
								obj_featType[featureType]['mainToShow'] = objWithInfo.mainToShow;
							}
							if (objWithInfo.hasOwnProperty('otherResidues')){
								obj_featType[featureType]['otherResidues'] = "<li>" + objWithInfo.otherResidues + "</li>";
							}
							// obj_featType[featureType]['mainToShow'] = objWithInfo.mainToShow;
							variantResidues[resSnp][serverName].push(obj_featType);
						}
						else { // already exists, hence append;

							if (objWithInfo.hasOwnProperty('mainToShow')){
								variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] = variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] + objWithInfo.mainToShow;
							}
							if (objWithInfo.hasOwnProperty('otherResidues')){
								variantResidues[resSnp][serverName][idx][featureType]['otherResidues'] = variantResidues[resSnp][serverName][idx][featureType]['otherResidues'] + "<li>" + objWithInfo.otherResidues + "</li>";
							}
							// variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] = variantResidues[resSnp][serverName][idx][featureType]['mainToShow']  + '. ' + description;
						}*/
					}


				}
				else if (serverName == 'COSMIC mutations'){
					console.log("The cosmic description is " + description);
				}







				console.log("over here! " + serverName);

				console.log("restart " + resStart_pp + " resEnd " + resEnd_pp + " featuretype " + featureType + " description " + description + " serverNameSet " + serverName);


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
			console.log(' IF YOU WANT MORE ' + serverName + " here1");
			variantResidues[resSnp]['variantInfo'][serverName] = varInfo;
		}
		else {
			variantResidues[resSnp]['variantInfo'][serverName] = variantResidues[resSnp]['variantInfo'][serverName].concat(varInfo);
			console.log(variantResidues[resSnp]['variantInfo'][serverName])
		}
	}


	if (posInfo.length > 0){
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
	varInfo.push(arr_1[1] + " (score:" + arr_1[0] + ")")

	console.log("The pridict protein value is: " + arr_1[1] + " (score:" + arr_1[0] + ")")

	// return obj_inFeatType;
}



function cleanData_uniprot_seqVar(desc, newAa, varInfo, otherResInfo){
	// main to show, other residues;

	desc = desc.replace(/^[\s]+/, "");
	desc = desc.replace(/\.$/, '');
	desc = desc.replace(/\>/, '&#8594;')
	let arr = desc.split(/[\s]+/);
	if (arr[1] == '&#8594;'){
		if (arr[2] == newAa){
			varInfo.push(desc);
		}
		else {
			otherResInfo.push(desc);
		}
	}
	else {
		varInfo.push(desc);
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

function cleanData_snap2_getAvgScore(desc, arr_posInfo){
	// console.log ('snap2 desc is ' + desc);
	desc = desc.replace(/^[^\;]+\;/, '');
	desc = desc.replace(/\;.*$/, '');

	let arr = desc.split(/\:/);

	arr_posInfo.push("Average score: " + arr[1]);


	/*
	if (!obj_featType.hasOwnProperty('Mutational sensitivity')) {
		obj_featType['Mutational sensitivity'] = {};
	}

	if (! obj_featType['Mutational sensitivity'].hasOwnProperty('mainToShow')){
		obj_featType['Mutational sensitivity']['mainToShow'] = mainToShow;
	}
	else {
		obj_featType['Mutational sensitivity']['mainToShow'] =  obj_featType['Mutational sensitivity']['mainToShow'] + "<br>" + mainToShow;
	}
	*/
	// let obj_inFeatType = {mainToShow: "Average score: " + arr[1]};
	// return obj_inFeatType;
}


function cleanData_cath(desc, varInfo){
	desc = desc.replace(/\<span[^\>]*\>/, '');
	desc = desc.replace(/\<i\>/, '');
	desc = desc.replace(/\<\/i\>/, '');
	desc = desc.replace(/\<\/span\>/, '');
	desc = desc.replace(/\$.*$/, '');

	let arr = desc.split(/\:\s/);
	arr[0] = arr[0].replace(/CATH/, '');


	varInfo.push(arr[1]);

	// let obj_featType = {};

	// obj_featType[arr[0]] = {'mainToShow': arr[1]};
	// {mainToShow: arr_1[1], mainToHide: "Score: " + arr_1[0]};

	// console.log('cleaned cath desc is ' + desc + " arr[0]" + arr[0] + " arr[1]:" + arr[1]);
	// return (obj_featType);
}

function cleanData_snap2_effects(desc, newAa, arr_varInfo, arr_otherResInfo){
	console.log("now the snap2 desc is " + desc);

	let arr = desc.split("\;");
	let toAdd_varInfo = ''; let toAdd_otherResInfo = '';

	console.log(arr[0]);
	toAdd_varInfo = arr[0];

	if (arr.length > 2){
		// individual residue values are present
		// Search for newResidue; // Data is in mainToHide, otherResidues;

		arr[2] = arr[2].replace(/^[^\:]+:/, '');
		let arr_1 = arr[2].split("\,");

		toAdd_otherResInfo = arr_1.length + "/20 residues add to change. " + 'Additional residues adding to mutational sensitivity ';

		let isNewResFound = false;

		let regex = new RegExp("^[\\s]*" + newAa);
		let foundIdx = -1;
		console.log("regex is " + regex);
		arr_1.forEach(function(item, i){
			item = item.replace(/\s/g, '');
			if (item.match(regex)){
				// console.log("found ! " + item);
				isNewResFound = true;
				toAdd_varInfo =  toAdd_varInfo + ". Residue's specific score " + item;
				foundIdx = i;

			}
			else {
				toAdd_otherResInfo = toAdd_otherResInfo + " " + item;
			}
			// console.log(item + " " + newRes);
		});

		if (isNewResFound == false){
			// This residue does not add to change;
			toAdd_varInfo = toAdd_varInfo + ". This residue does not add to mutational sensitivity";
		}

		// console.log("Testing 123: " + toAdd_varInfo + "| " + toAdd_otherResInfo);
	}

	if (toAdd_varInfo != ''){
		arr_varInfo.push(toAdd_varInfo);
	}
	if (toAdd_otherResInfo != ''){
		arr_otherResInfo.push(toAdd_otherResInfo);
	}


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
