var counter_complete = 0;

module.exports = function (resStart_pp, resEnd_pp, variantResidues, featureType, description, serverName, variants_featTypesOfInt){

	// console.log("restart " + resStart_pp + " resEnd " + resEnd_pp + " featuretype " + featureType + " description " + description + " serverNameSet " + serverName);

	if (variants_featTypesOfInt.includes(featureType)){
		Object.keys(variantResidues).forEach(function(resSnp, i){
			// console.log("The new residue is " + variantResidues[resSnp].newResidue);

			if (parseInt(resSnp) >= parseInt(resStart_pp) && parseInt(resSnp) <= parseInt(resEnd_pp)){

				if (!variantResidues[resSnp].hasOwnProperty(serverName)){


					variantResidues[resSnp][serverName] = [];


				}

				let obj_featType = {};
				if (serverName == 'PredictProtein' && featureType == 'Conservation'){
					let obj_inFeatType = cleanData_pp(description);
					obj_featType[featureType] = obj_inFeatType;
					// console.log(' does come in here ... ');
					// console.log(obj_inFeatType);

					variantResidues[resSnp][serverName].push(obj_featType);
				}

				else if (serverName == 'SNAP2'){
					// 1. Check if object exists with name Mutational sensitivity

					let obj_featType = {};
					let idx = checkAndRetIdx(variantResidues[resSnp][serverName], 'Mutational sensitivity') ;
					console.log('snap2 idx is ' + idx);
					if (idx != -1){
						obj_featType = variantResidues[resSnp][serverName][idx];
					}
					if (featureType == 'Mutational sensitivity (SNAP2 ratio of effect mutations)'){
						cleanData_snap2_effects(description, obj_featType, variantResidues[resSnp].newResidue);
					}
					else if (featureType == 'Mutation score (average SNAP2 score)'){
						cleanData_snap2_getAvgScore(description, obj_featType);
					}
					else {
						console.log("feature name is " + featureType);
					}


					if (idx != -1){
						variantResidues[resSnp][serverName][idx] = obj_featType;
					}
					else {
						variantResidues[resSnp][serverName].push(obj_featType);
					}


				}
				else if (serverName == 'CATH') {
					obj_featType = cleanData_cath(description);
					variantResidues[resSnp][serverName].push(obj_featType);
				}

				else if (serverName == 'UniProt'){
					console.log('uniprot featuretype is ' + featureType);
					console.log("uniprot feature description is "  + description);

					if (featureType == 'Metal ion-binding site'){
						let idx = checkAndRetIdx(variantResidues[resSnp][serverName], featureType);

						if (idx == -1){
							obj_featType[featureType] = {};
							obj_featType[featureType]['mainToShow'] = "Binds to " + description;
							variantResidues[resSnp][serverName].push(obj_featType);
						}
						else { // already exists, hence append;
							variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] = variantResidues[resSnp][serverName][idx][featureType]['mainToShow']  + '. ' + description;
						}

					}
					else if (featureType == 'Site'){
						let idx = checkAndRetIdx(variantResidues[resSnp][serverName], featureType);

						if (idx == -1){
							obj_featType[featureType] = {};
							obj_featType[featureType]['mainToShow'] = description;
							variantResidues[resSnp][serverName].push(obj_featType);
						}
						else { // already exists, hence append;
							variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] = variantResidues[resSnp][serverName][idx][featureType]['mainToShow']  + '. ' + description;
						}
					}

					else if (featureType == 'Modified residue'){
						let idx = checkAndRetIdx(variantResidues[resSnp][serverName], featureType);

						if (idx == -1){
							obj_featType[featureType] = {};
							obj_featType[featureType]['mainToShow'] = description;
							variantResidues[resSnp][serverName].push(obj_featType);
						}
						else { // already exists, hence append;
							variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] = variantResidues[resSnp][serverName][idx][featureType]['mainToShow']  + '. ' + description;
						}
					}
					else if (featureType == 'Cross-link'){
						let idx = checkAndRetIdx(variantResidues[resSnp][serverName], featureType);

						if (idx == -1){
							obj_featType[featureType] = {};
							obj_featType[featureType]['mainToShow'] = description;
							variantResidues[resSnp][serverName].push(obj_featType);
						}
						else { // already exists, hence append;
							variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] = variantResidues[resSnp][serverName][idx][featureType]['mainToShow']  + '. ' + description;
						}
					}
					else if (featureType == 'Sequence variant' || featureType == 'Mutagenesis site'){
						// check for the right residue;
						let objWithInfo = cleanData_uniprot_seqVar(description, variantResidues[resSnp].newResidue);
						let idx = checkAndRetIdx(variantResidues[resSnp][serverName], featureType);

						if (idx == -1){
							obj_featType[featureType] = {};
							if (objWithInfo.hasOwnProperty('mainToShow')){
								obj_featType[featureType]['mainToShow'] = objWithInfo.mainToShow;
							}
							if (objWithInfo.hasOwnProperty('otherResidues')){
								obj_featType[featureType]['otherResidues'] = objWithInfo.otherResidues;
							}
							// obj_featType[featureType]['mainToShow'] = objWithInfo.mainToShow;
							variantResidues[resSnp][serverName].push(obj_featType);
						}
						else { // already exists, hence append;

							if (objWithInfo.hasOwnProperty('mainToShow')){
								variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] = variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] + objWithInfo.mainToShow;
							}
							if (objWithInfo.hasOwnProperty('otherResidues')){
								variantResidues[resSnp][serverName][idx][featureType]['otherResidues'] = variantResidues[resSnp][serverName][idx][featureType]['otherResidues'] + objWithInfo.otherResidues;
							}
							// variantResidues[resSnp][serverName][idx][featureType]['mainToShow'] = variantResidues[resSnp][serverName][idx][featureType]['mainToShow']  + '. ' + description;
						}
					}


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


/// Cleaning descriptions;
function cleanData_pp(desc){
	desc = desc.replace(/\s+/g, '');

	let arr = desc.split(/\:/);
	let arr_1 = arr[1].split(/\(/);
	arr_1[1] = arr_1[1].replace(/\)/, '');

	let obj_inFeatType = {mainToShow: arr_1[1], mainToHide: "Score: " + arr_1[0]};

	return obj_inFeatType;
}



function cleanData_uniprot_seqVar(desc, newRes, feat_toObj){
	// main to show, other residues;

	desc = desc.replace(/^[\s]+/, "");
	let arr = desc.split(/[\s]+/);
	let mainToShow = "";
	let otherResidues = "";
	if (arr[1] == '>'){
		if (arr[2] == newRes){
			mainToShow = desc;
		}
		else {
			otherResidues = "<li>" +  desc  + "</li>";
		}
	}
	else {
		mainToShow = desc;
	}

	let objToReturn = {};

	if (mainToShow != ''){
		objToReturn['mainToShow'] = mainToShow;
	}
	if (otherResidues != ''){
		objToReturn['otherResidues'] = otherResidues;
	}

	return ({'mainToShow': mainToShow, 'otherResidues': otherResidues})
}

function cleanData_snap2_getAvgScore(desc, obj_featType){
	// console.log ('snap2 desc is ' + desc);
	desc = desc.replace(/^[^\;]+\;/, '');
	desc = desc.replace(/\;.*$/, '');

	let arr = desc.split(/\:/);

	let mainToShow = "Average score: " + arr[1];

	if (!obj_featType.hasOwnProperty('Mutational sensitivity')) {
		obj_featType['Mutational sensitivity'] = {};
	}

	if (! obj_featType['Mutational sensitivity'].hasOwnProperty('mainToShow')){
		obj_featType['Mutational sensitivity']['mainToShow'] = mainToShow;
	}
	else {
		obj_featType['Mutational sensitivity']['mainToShow'] =  obj_featType['Mutational sensitivity']['mainToShow'] + "<br>" + mainToShow;
	}

	// let obj_inFeatType = {mainToShow: "Average score: " + arr[1]};
	// return obj_inFeatType;
}


function cleanData_cath(desc){
	desc = desc.replace(/\<span[^\>]*\>/, '');
	desc = desc.replace(/\<i\>/, '');
	desc = desc.replace(/\<\/i\>/, '');
	desc = desc.replace(/\<\/span\>/, '');
	desc = desc.replace(/\$.*$/, '');

	let arr = desc.split(/\:\s/);
	arr[0] = arr[0].replace(/CATH/, '');

	let obj_featType = {};

	obj_featType[arr[0]] = {'mainToShow': arr[1]};
	// {mainToShow: arr_1[1], mainToHide: "Score: " + arr_1[0]};

	// console.log('cleaned cath desc is ' + desc + " arr[0]" + arr[0] + " arr[1]:" + arr[1]);
	return (obj_featType);
}

function cleanData_snap2_effects(desc, obj_featType, newRes){
	console.log("now the snap2 desc is " + desc);

	let arr = desc.split("\;");
	let mainToHide = '';
	let mainToShow = arr[0];
	let otherResidues = '';

	if (arr.length > 2){
		// individual residue values are present
		// Search for newResidue; // Data is in mainToHide, otherResidues;

		arr[2] = arr[2].replace(/^[^\:]+:/, '');
		let arr_1 = arr[2].split("\,");

		otherResidues = arr_1.length + "/20 residues add to change. " + 'Additional residues adding to mutational sensitivity ';

		let isNewResFound = false;

		let regex = new RegExp("^[\\s]*" + newRes);
		let foundIdx = -1;
		console.log("regex is " + regex);
		arr_1.forEach(function(item, i){
			if (item.match(regex)){
				console.log("found ! " + item);
				isNewResFound = true;
				mainToHide = "Score with which residue adds to change " + item;
				foundIdx = i;

			}
			else {
				otherResidues = otherResidues + " " + item;
			}
			// console.log(item + " " + newRes);
		});

		if (isNewResFound == false){
			// This residue does not add to change;
			mainToHide = "This residue does not add to mutational sensitivity.";
		}
	}
	else{
		// Place as is in the mainToHide section;
		mainToHide = arr[1];
	}



	if (!obj_featType.hasOwnProperty('Mutational sensitivity')) {
		obj_featType['Mutational sensitivity'] = {};
	}

	if (! obj_featType['Mutational sensitivity'].hasOwnProperty('mainToShow')){
		obj_featType['Mutational sensitivity']['mainToShow'] = mainToShow;
	}
	else {
		obj_featType['Mutational sensitivity']['mainToShow'] = mainToShow + "<br>" + obj_featType['Mutational sensitivity']['mainToShow'];
	}

	if (mainToHide != ''){
		obj_featType['Mutational sensitivity']['mainToHide'] = mainToHide;
	}

	if (otherResidues != ''){
		obj_featType['Mutational sensitivity']['otherResidues'] = otherResidues;
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
