
var Cluster = function (psshEntry) {
	this.members = null;
	this.seq_start = psshEntry.seq_start;
	this.seq_end = psshEntry.seq_end;
	this.psshEntry = psshEntry;
	this.alignment_identity_score = [ psshEntry.alignment_identity_score ];
	this.memberMap = {};
};


Cluster.prototype.addMember = function(member) {
  var ret = false;
  if (this.isUnique(member)) {
    this.members.push(member);
    this.memberMap[member.pdb_id + member.pdb_chain] = [member];
    ret = true;
  }
  return ret;
};

Cluster.prototype.clean = function() {
  this.memberMap = null;
  this.psshEntry = null;
  delete this.memberMap;
  delete this.psshEntry;
};


//Cluster.prototype.sort = function() {
// 
//  this.members.sort(function (a, b) {
//    var diff = b.alignment_identity_score - a.alignment_identity_score;
//    if (diff === 0) {
//      diff = b.match_length - a.match_length;
//    }
////    if (diff === 0) {
////      
////      // identical residues
////    }
//    if (diff === 0) {
//      diff = a.
//      // resolution
//    }
//    if (diff === 0) {
////      NMR, cyro last
//    }
//    if (diff === 0) {
////      by date
//    }
//
//  });
//}

function arraysIdentical(a, b) {
  var i = a.length;
  if (i != b.length) return false;
  while (i--) {
      if (a[i] !== b[i]) return false;
  }
  return true;
};

Cluster.prototype.isUnique = function(entry) {
  var key = entry.pdb_id + entry.pdb_chain;
  children = this.memberMap[key];
//  if (key === '4h34A') {
//    console.log(' key :' + key + ', children : ' + JSON.stringify(children));
//  }
  if (children) {
    return !children.some(function (child) {
      var ret =  arraysIdentical(child.viewer_format, entry.viewer_format);
      if (ret ){
//        console.log('found sameo:');
        
      }
      //  PTPN11
      if (key === '4h34A') {
//        console.log(' key :' + key + ', children : ' + JSON.stringify(children) + " ret: " + ret + ", child.viewer_format, entry.viewer_format: " + [child.viewer_format, entry.viewer_format].join('***'));
      }
      return ret;
    });
  }
  else {
    return true;
  }
}



Cluster.prototype.initialise = function(member) {
	this.members = [member];
	this.cluster_size = this.members.length;
	this.pdb_id = this.members[0].pdb_id;
	this.pdb_chain = this.members[0].pdb_chain
			.slice(0);
  this.model = this.members[0].model;
//  console.log('member for cluster is: ' + JSON.stringify(member));
	this.Repeat_domains = this.members[0].Repeat_domains
			.slice(0);
//	this.biounits = this.members[0].biounits;

};

Cluster.prototype.update = function() {
	this.cluster_size = this.members.length;
};

Cluster.prototype.getPSSHID = function () {
	return  [this.pdb_id , '-', this.pdb_chain[0] , '-', this.Repeat_domains[0]].join('');
};



module.exports = Cluster;




