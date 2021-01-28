exports.getGranthamIsCons = getGranthamIsCons;

function getGranthamIsCons(oldRes, newRes){
	let granthamVal = -1;

	if (rows.includes(oldRes) && cols.includes(newRes)){


		let idxOld = rows.indexOf(oldRes);
		let idxNew = cols.indexOf(newRes);

		granthamVal = Grantham[idxOld][idxNew];

		console.log("Get the two indexes, then get the Val :) " + oldRes + " " + newRes + " " + idxOld + " " + idxNew + " " + granthamVal);


	}

	if (granthamVal <= 0 && rows.includes(newRes) && cols.includes(oldRes)){
		let idxOld = rows.indexOf(newRes);
		let idxNew = cols.indexOf(oldRes);

		granthamVal = Grantham[idxOld][idxNew];



		console.log("Get the two indexes, then get the Val :) " + oldRes + " " + newRes + " " + idxOld + " " + idxNew + " " + granthamVal);
	}

	if (granthamVal >= 0 && granthamVal <= 100){
		return "Grantham score: " + granthamVal + " (conserved)";
	}
	else if (granthamVal > 100 ) {
		return "Grantham score: " + granthamVal + " (not conserved)";
	}
	else {
		return "";
	}

}



let cols = ['R', 'L', 'P', 'T', 'A', 'V', 'G', 'I', 'F', 'Y', 'C', 'H', 'Q', 'N', 'K', 'D', 'E', 'M', 'W'];
let rows = ['S', 'R', 'L', 'P', 'T', 'A', 'V', 'G', 'I', 'F', 'Y', 'C', 'H', 'Q', 'N', 'K', 'D', 'E', 'M'];

let Grantham = [
	[110,145,74,58,99,124,56,142,155,144,112,89,68,46,121,65,80,135,177],
	[0,102,103,71,112,96,125,97,97,77,180,29,43,86,26,96,54,91,101],
	[0,0,98,92,96,32,138,5,22,36,198,99,113,153,107,172,138,15,61],
	[0,0,0,38,27,68,42,95,114,110,169,77,76,91,103,108,93,87,147],
	[0,0,0,0,58,69,59,89,103,92,149,47,42,65,78,85,65,81,128],
	[0,0,0,0,0,64,60,94,113,112,195,86,91,111,106,126,107,84,148],
	[0,0,0,0,0,0,109,29,50,55,192,84,96,133,97,152,121,21,88],
	[0,0,0,0,0,0,0,135,153,147,159,98,87,80,127,94,98,127,184],
	[0,0,0,0,0,0,0,0,21,33,198,94,109,149,102,168,134,10,61],
	[0,0,0,0,0,0,0,0,0,22,205,100,116,158,102,177,140,28,40],
	[0,0,0,0,0,0,0,0,0,0,194,83,99,143,85,160,122,36,37],
	[0,0,0,0,0,0,0,0,0,0,0,174,154,139,202,154,170,196,215],
	[0,0,0,0,0,0,0,0,0,0,0,0,24,68,32,81,40,87,115],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,46,53,61,29,101,130],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,94,23,42,142,174],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,101,56,95,110],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,160,181],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,126,152],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,67],
];
