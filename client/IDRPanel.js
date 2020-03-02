//var idrViewer;
//var structure;

var idrViewer;
var structures = {};

var IDRPanel = function (attachToDiv, width, height) {
	this.attachToDiv = attachToDiv;
	this.initialised = false;
};

IDRPanel.prototype.display_cluster = function(cluster, width, height) {
	var that = this;
	if (!this.initialised) {
		var w = width > 0 ? width : 640;
		var h = height > 0 ? height: 480;

		idrViewer = pv.Viewer(attachToDiv, 
				{ quality : 'low', width: w, height : h,
			antialias : true, outline : false,
			slabMode : 'auto',
			near: 0.1,
			far: 10000,
			background: [0.8, 0.8, 0.8]
				});
		idrViewer.options('fog', false);
		this.initialised = true;
	}
	
	idrViewer.clear();
	structures = {};
	cluster.members.forEach(function(member) {
		$.ajax({ url : getPDBURL(member.pdb_id), success : function(data) {
			console.log("[IDRPanel]: loading " + member.pdb_id);
			structures[member.pdb_id] = io.pdb(data);

			//idrViewer.sline(member.pdb_id, structures[member.pdb_id],{ color : color.uniform('red'), showRelated : '1'});
			idrViewer.cartoon(member.pdb_id, structures[member.pdb_id], 
			{ color: that.colorBySSAndHomology(structures[member.pdb_id].conservations), strength: 1.0});
			idrViewer.autoZoom();
			//that.initialised = true;
		}});
	});

};

IDRPanel.prototype.load = function (attributes) {
	idrViewer = pv.Viewer($(this.attachToDiv)[0], 
			{ quality : 'high', width: attributes.width, height : attributes.height,
		antialias : true, outline : false,
		slabMode : 'fixed',
		near: 0.1,
		far: 10000,
		background: [0.8, 0.8, 0.8]
			});
	//var selector =  this.PVSelector(idrViewer);	
	idrViewer.options('fog', false);
	this.reload(attributes);
};

IDRPanel.prototype.reload =  function(attributes) {
	var that = this;
	idrViewer.resize(attributes.width, attributes.height);
	$.ajax({ url : attributes.url, success : function(data) {
		structure = io.pdb(data);
		idrViewer.clear();
		idrViewer.cartoon('structure.protein', 
				structure, 
				{ color: that.colorBySSAndHomology(attributes.conservations), strength: 1.0});
		//showRelated : '1', 
		idrViewer.autoZoom();
		this.blankApplet(false);
		that.initialised = true;
	}});
};

IDRPanel.prototype.blankApplet = function(isOn, message) {
//changeAppletSize();
if (isOn ) {
    var appletMessage = $('#waitingFrame').contents().find('#appletMessage');
    if (message) {
      appletMessage.text(message);
    }
    else {
      appletMessage.text("Please wait...");
    }
    if (!$('#waitingFrame').is(":visible")) {
      
      $('#waitingFrame').hide();
      $('#waitingFrame').fadeIn("fast");
    }
}
else {
  $('#waitingFrame').fadeOut("slow");
}
};


IDRPanel.prototype.mousePressed =  function(atom, e) {
	console.log('obj: ' + atom.residue().num() + ', e: ' + e);
};

var interpolateColour = function (base, other, amount) {
	var i;
	var ret = [];
	for (i = 0; i < base.length; i++) {
		ret[i] = base[i] * amount + other[i] * (1 - amount);
	}
	return ret;
}

var assignColour = function (out, index, colorArray) {
	out[index] = colorArray[0]; 
	out[index+1] = colorArray[1]; 
	out[index+2] = colorArray[2];
}


IDRPanel.prototype.colorBySSAndHomology = function(conservations) {
	var that = this;
	this.conservations = conservations;
	this.notConserved = [60/255, 60/255, 60/255];
	this.identicalColourMap = {
			'C': [99/255, 153/255, 65/255], //coil
			'H': [86/255, 138/255, 181/255],   	// helix 
			'E': [255/255, 201/255, 0/255]   	//sheet 
	};
	this.conservedColourMap = {};
	Object.keys(this.identicalColourMap).forEach (function (key) {
		that.conservedColourMap[key] = interpolateColour(that.identicalColourMap[key], that.notConserved, 0.55);
	});

	return new ColorOp(function(atom, out, index) {
		var residue = atom.residue();
		var colour = that.getColourForResidue(residue);
		assignColour(out, index, colour);
	}, null, null);
};

IDRPanel.prototype.getColourForResidue = function (residue) {
	var chain = residue.chain().name();
	var chainConservation = this.conservations[chain]; 

	var checkAgainst = this.identicalColourMap[residue.ss()];
	if (chainConservation && chainConservation.nonconserved.indexOf(residue.num()) > -1) {
		// non conserved residue
		checkAgainst = this.notConserved;
	}
	else if (chainConservation){
		var map = (chainConservation.conserved.indexOf(residue.num()) > -1) ? this.conservedColourMap : this.identicalColourMap;
		checkAgainst =  map[residue.ss()];
	}
	return checkAgainst;
};

IDRPanel.prototype.selectNew = function (oldResidue, newResidue) {
	var that = this;
	return new ColorOp(function(atom, out, index) {
		var residue = atom.residue();
		if (residue == oldResidue) {
			var colour = that.getColourForResidue(residue);
			assignColour(out, index, colour);
		}
		else if (residue == newResidue) {
			var colour = that.getColourForResidue(residue);
			assignColour(out, index, vec3.fromValues(1,1,1));
		}
	}, null, null);

}

IDRPanel.prototype.PVSelector = function (viewer) {
	var that = this;
	this.lastSelectedAtom = null;

	viewer._domElement.addEventListener("atompicked", function(e) {
		e.preventDefault();

		console.log(e.detail.atom.residue().num());
		var newAtom = e.detail.atom;
		var oldResidue  = null;
		if ( this.lastSelectedAtom != null) {
			oldResidue = this.lastSelectedAtom.residue();
		}
		if (newAtom != null) {
//			idrViewer.options('color', selectNew(oldResidue, newAtom.residue()));
			e.detail.geom.colorBy(that.selectNew(oldResidue, newAtom.residue()));
			selectionText(true, newAtom.residue().name() + ": " + newAtom.residue().num());
		}
		viewer.requestRedraw();
		this.lastSelectedAtom = newAtom;
	}, false);
};

IDRPanel.prototype.changeViewerSize = function(w, h) {

  $(this.attachToDiv).width(w);
  $(this.attachToDiv).height(h);
  pViewer.fitParent();
}


function getPDBURL(pdbID, biounit) {
	var url = "https://files.rcsb.org/download/" + pdbID + ".pdb";
	if (biounit > 0) {
//		url = "https://files.rcsb.org/download/" + pdbID + ".pdb" + biounit ;
	}
	return url;
}

IDRPanel.prototype.gestures = function () {
  var functions = ['triggerPan', 'triggerRotate', 'triggerZoom', 'point', 'reset', 'zoomToSelection', 'selectMouseCursor'];
  var ret = {};
  functions.forEach(function (funcName) {
    ret[funcName] = function () {
      var newArgs = [funcName];
      newArgs.push(Array.prototype.slice.call(arguments));
      if (funcName === 'triggerRotate') {
        console.log('about to call TODO for webgl: ' + newArgs);
      }
//      if (document.applets[0]) {
//        document.applets[0].molecularControlToolkit.apply(document.applets[0], newArgs);
//      }
    }
  })
  return ret;
}

module.exports = IDRPanel;
