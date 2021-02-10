


//	matches.uniprot_primary_accession[i] = data[i].Primary_Accession;
//	matches.uniprot_sequence[i] = data[i].Sequence;
//	matches.uniprot_sequence_length[i] = data[i].Length;
//	matches.uniprot_sequence_features[i] = data[i].Features;
//	matches.uniprot_sequence_description[i] = data[i].Description;
//	matches.uniprot_sequence_MD5_Hash[i] = data[i].MD5_Hash;

var Sequence = function (sequenceData) {
	this.primary_accession = sequenceData.Primary_Accession;
	this.sequence = sequenceData.Sequence;
	this.length = sequenceData.Length;
//	this.features = sequenceData.Features;
	this.description = sequenceData.Description;
	this.uniprot_hash = sequenceData.uniprot_hash;
	this.matches = sequenceData.Matches;
};



module.exports = Sequence;