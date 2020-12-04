

module.exports = function (geneInfoObj, getJsonFromUrl, validateAgainstSchema, primary_accession, featureCallback){

	console.log("in this cool function");
	console.log(geneInfoObj);

	let genename = '';
	let featuresObj = {};

	let features_snpeff = [];
	let features_cosmic = [];
	let fs_cosmic_byTissue = {};

	let fsName_cosmic = "COSMIC (all variants)";

	// Step 1: get the gene name;
	if (geneInfoObj.hasOwnProperty("data") && geneInfoObj.data.hasOwnProperty('hits') && geneInfoObj.data.hits.length > 0 && geneInfoObj.data.hits[0].hasOwnProperty('symbol')){
		genename = geneInfoObj.data.hits[0].symbol;
		getFromLocation(url_myVariantInfo(genename))
		.then(function(respData){
			return new Promise(function(resolve, reject){
				if (respData.hasOwnProperty('data') && respData.data.hasOwnProperty('hits') && respData.data.hits.length > 0){
					respData.data.hits.forEach(function(item, item_i){

						if (item.hasOwnProperty('snpeff') && item.snpeff.hasOwnProperty('ann') && item.snpeff.ann.length > 0){
							let snpPos = handle_snpeff(item.snpeff.ann, features_snpeff);
							if (snpPos > -1 && item.hasOwnProperty('cosmic')){
								handle_cosmic(item.cosmic, features_cosmic, snpPos, fs_cosmic_byTissue);
							}
						}



						if (item_i == (respData.data.hits.length - 1)){
							featuresObj[fsName_cosmic] = {};
							featuresObj[fsName_cosmic]['Color'] = '#FF0000';
							featuresObj[fsName_cosmic]['Features'] = features_cosmic;

							console.log(fs_cosmic_byTissue);
							for (let key in fs_cosmic_byTissue){
								let key_fs = 'COSMIC (' + key + ')'
								featuresObj[key_fs] = {};
								featuresObj[key_fs]['Color'] = '#FF0000';
								featuresObj[key_fs]['Features'] = fs_cosmic_byTissue[key];

							}


							console.log("Features object is ");
							console.log(featuresObj);
							resolve();
						}
					});


				}
				// resolve(respData);
			});
		})
		.then(function(){
			validateAgainstSchema(featuresObj, primary_accession, featureCallback, 'myVariant.info');
		});
		console.log('genename is ' + genename);
	}
	else{
		validateAgainstSchema(featuresObj, primary_accession, featureCallback, 'myVariant.info');
	}



}
////////////////// Handling the different featureSet types

function handle_snpeff(snpeffAnn, featureSet){
	// console.log(snpeffAnn);
	let snpPos = -1;
	if (snpeffAnn[0].hasOwnProperty('protein') && snpeffAnn[0].protein.hasOwnProperty('position')){
		snpPos = parseInt(snpeffAnn[0].protein.position);
	}

	return snpPos;
}


function handle_cosmic(cosmic, featureSet, snpPos, featSets_cosmic_byTissue){
	console.log("Snp pos is " + snpPos); // {'Name': , 'Residue(s)': , 'Description': };
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


function url_myVariantInfo(genename){
	return ('https://myvariant.info/v1/query?q=' + genename + "&fetch_all=TRUE");
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
