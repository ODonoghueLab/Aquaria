var counter_complete = 0;

module.exports = function (resStart_pp, resEnd_pp, variantResidues, featureType, description, serverName, variants_featTypesOfInt){

	// console.log("restart " + resStart_pp + " resEnd " + resEnd_pp + " featuretype " + featureType + " description " + description + " serverNameSet " + serverName);

	if (variants_featTypesOfInt.includes(featureType)){
		Object.keys(variantResidues).forEach(function(resSnp, i){
			console.log("The new residue is " + variantResidues[resSnp].newResidue);

			if (parseInt(resSnp) >= parseInt(resStart_pp) && parseInt(resSnp) <= parseInt(resEnd_pp)){

				if (!variantResidues[resSnp].hasOwnProperty(serverName)){


					variantResidues[resSnp][serverName] = [];


				}

				let obj_featType = {};
				if (serverName == 'PredictProtein' && featureType == 'Conservation'){
					let obj_inFeatType = cleanData_pp(description);
					obj_featType[featureType] = obj_inFeatType;
					console.log(' does come in here ... ');
					console.log(obj_inFeatType);
				}

				variantResidues[resSnp][serverName].push(obj_featType);


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


function cleanData_pp(desc){
	desc = desc.replace(/\s+/g, '');

	let arr = desc.split(/\:/);
	let arr_1 = arr[1].split(/\(/);
	arr_1[1] = arr_1[1].replace(/\)/, '');

	let obj_inFeatType = {mainToShow: arr_1[1], mainToHide: "Score: " + arr_1[0]};

	return obj_inFeatType;
}


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
