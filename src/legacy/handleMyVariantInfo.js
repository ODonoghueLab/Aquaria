

module.exports = function (geneInfoObj, getJsonFromUrl, validateAgainstSchema, primary_accession, featureCallback){

	console.log("in this cool function");
	console.log(geneInfoObj);

	let genename = '';
	let featuresObj = {};

	let features_snpeff = [];
	let features_cosmic = [];
	let fs_cosmic_byTissue = {};

	let fsName_cosmic = "All variants";

	// Step 1: get the gene name;
	if (geneInfoObj.hasOwnProperty("data") && geneInfoObj.data.hasOwnProperty('hits') && geneInfoObj.data.hits.length > 0 && geneInfoObj.data.hits[0].hasOwnProperty('symbol')){
		genename = geneInfoObj.data.hits[0].symbol;
		getFromLocation(url_myVariantInfo(genename, 1000, 0))
		.then(function(response){
			return new Promise(function(resolve, reject){
				let promises_ = [];
				if (response.hasOwnProperty('data') && response.data.hasOwnProperty('total')){
					console.log("The total myVariant.info is " + response.data.total);
					let total = parseInt(response.data.total);
					let callsToMake = Math.ceil(total/1000) - 1;
					console.log("Total calls to make to myVariant.info is " + callsToMake);


					for (let i =0; i< callsToMake; i++){
						let from = 1000 * (i + 1);
						promises_.push(getFromLocation(url_myVariantInfo(genename, 1000, from)));
						console.log("Now calling position " + from);

						if (i == (callsToMake -1)){
							resolve({response: response, promises_: promises_});
							console.log("over here! .... . .. . .. blahblah");
						}
					}

				}
				else{
					resolve({response: response, promises_: promises_});
				}

			});
		})
		.then(function(data){
			return new Promise(function(resolve, reject){
				let respData = data.response;
				let promises_ = data.promises_;

				handlePromiseData(respData, featuresObj, fsName_cosmic, fs_cosmic_byTissue, features_snpeff, features_cosmic)
				.then(function(){
					console.log("over here - job biden");
					resolve(data.promises_);
				});

			});
		})
		.then(function(promises_){
			return new Promise(function(resolve, reject){
				Promise.all(promises_).then(function(theData){
				// 	return new Promise(function(resolve, reject){
						let promises_processing = [];
						theData.forEach(function(item, i){
							console.log("A data point is ");
							console.log(item);
							promises_processing.push(handlePromiseData(item, featuresObj, fsName_cosmic, fs_cosmic_byTissue, features_snpeff, features_cosmic));
						});

						Promise.all(promises_processing).then(function(){

							// if (item_i == (respData.data.hits.length - 1)){

								/*
								console.log("Features object is ");
								console.log(featuresObj);
								resolve();*/
							// }
							resolve();
						});
				//	});
				});

				if (promises_.length == 0){
					resolve();
				}
			});
		})
		.then(function(){
			featuresObj[fsName_cosmic] = {};
			featuresObj[fsName_cosmic]['Color'] = '#FF0000';
			featuresObj[fsName_cosmic]['Features'] = features_cosmic;

			console.log(fs_cosmic_byTissue);
			for (let key in fs_cosmic_byTissue){
				let key_fs = key;
				featuresObj[key_fs] = {};
				featuresObj[key_fs]['Color'] = '#FF0000';
				featuresObj[key_fs]['Features'] = fs_cosmic_byTissue[key];

			}
			console.log("In the last bit here!");
			validateAgainstSchema(featuresObj, primary_accession, featureCallback, 'myVariant.info');
		});
		console.log('genename is ' + genename);
	}
	else{
		validateAgainstSchema(featuresObj, primary_accession, featureCallback, 'myVariant.info');
	}



}
////////////////// Handling the different featureSet types



function handlePromiseData(respData, featuresObj, fsName_cosmic, fs_cosmic_byTissue, features_snpeff, features_cosmic){
	return new Promise(function (resolve, reject){
		if (respData.hasOwnProperty('data') && respData.data.hasOwnProperty('hits') && respData.data.hits.length > 0){
			respData.data.hits.forEach(function(item, item_i){

				if (item.hasOwnProperty('snpeff') && item.snpeff.hasOwnProperty('ann') && item.snpeff.ann.length > 0){
					let snpPos = handle_snpeff(item.snpeff.ann, features_snpeff);
					if (snpPos > -1 && item.hasOwnProperty('cosmic')){
						handle_cosmic(item.cosmic, features_cosmic, snpPos, fs_cosmic_byTissue);
					}
				}

				if (item_i == (respData.data.hits.length - 1)){
					resolve();
				}
			});
		}
		else{
			resolve();
		}
	});
}


function handle_snpeff(snpeffAnn, featureSet){
	// console.log(snpeffAnn);
	let snpPos = -1;
	if (snpeffAnn[0].hasOwnProperty('protein') && snpeffAnn[0].protein.hasOwnProperty('position')){
		snpPos = parseInt(snpeffAnn[0].protein.position);
	}

	return snpPos;
}


function handle_cosmic(cosmic, featureSet, snpPos, featSets_cosmic_byTissue){
	// console.log("Snp pos is " + snpPos); // {'Name': , 'Residue(s)': , 'Description': };
	let name = ''; let description = '';
	let byT_fs_name = ''; let byT_desc = '';
	if (cosmic.hasOwnProperty('mut_nt')){
		name = cosmic.mut_nt;
	}
	if (cosmic.hasOwnProperty('mut_freq')){
		description = "Mutation frequency: " + cosmic.mut_freq;
		byT_desc = description;

	}
	if (cosmic.hasOwnProperty('tumor_site')){
		description = description + '<br> Tumor site: ' + cosmic.tumor_site;
		byT_fs_name = cosmic.tumor_site;
	}

	if (name != ''){
		featureSet.push({Name: name, Residue: snpPos, Description: description});

		if (byT_fs_name != ''){
			addToFs(cosmic.tumor_site, featSets_cosmic_byTissue, byT_desc, snpPos, name);
		}
	}
}


function addToFs(fsName, fs, desc, snpPos, featureName){
	if (!fs.hasOwnProperty(fsName)){
		fs[fsName] = [];
	}

	fs[fsName].push({Name: featureName, Residue: snpPos, Description: desc})
}

////////////////// Getting data from myVariant.info


function url_myVariantInfo(genename, size, from){
	return ('https://myvariant.info/v1/query?q=' + genename + "&size=" + size +"&from=" + from);
}


var axios = require('axios')
function getFromLocation(url){
	return new Promise(function(resolve, reject){

		console.log("The myvariant.info url is " + url);
		let featuresFromExtServer = {};

		axios({
			method: 'get',
			url: url,
		})
		.then(function (response) {
			// handle success
			// console.log("Success");
			// console.log(response.data);
			featuresFromExtServer['status'] = "success";
			featuresFromExtServer['data'] = response.data;
			resolve(featuresFromExtServer)
		})
		.catch(function (error) {
			// handle error
			console.log("Error");
			console.log(error);

			featuresFromExtServer['status'] = "error";
			resolve(featuresFromExtServer)
		});
	})
}
