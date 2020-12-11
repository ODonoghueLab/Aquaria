var ClusterRenderer = require('./clusterRenderer');
var CoverageMapRenderer = require('../utils/coverageMap')
var d3 = require('d3');

// Render 2D structures in SVG.
//
// Authors: Christian Stolte, Vivian Ho, Kenny Sabir
// Utilises new format (see matching_structures_multipleuniprotinput.js)
// as opposed to matching_structures_singleuniprotinput.js
// new tree drawing routine

var that = null;
var ShowMatchingStructures = function(onTextClick) {
	this.onTextClick = onTextClick;
	that = this;
	this.clusters = [];
	this.clusterRenderers = [];
};

ShowMatchingStructures.prototype.removeAll = function() {
	// clear previous contents
	$("#vis.content div, #featurelist div").remove();

};

ShowMatchingStructures.prototype.selectCluster = function(cluster, clusterNumber) {
	this.selectedCluster = cluster || this.selectedCluster;
	if (typeof this.selectedCluster === 'undefined') {
	  console.log('ShowMatchingStructures.selectCluster error: cannot select null cluster for number: ' + clusterNumber);
	}
	else {
	  	this.bestClusterNumber = (typeof clusterNumber === 'undefined') ? this.bestClusterNumber : clusterNumber;
		var loadPDBStructure = this.selectedCluster.pdb_id;
	  	this.mark_loaded_structure(loadPDBStructure, this.bestClusterNumber);
	  	// update title bar for 3D structure view
	  	var identity_score = this.selectedCluster.members[0].alignment_identity_score;
	}
};


ShowMatchingStructures.prototype.initialise = function(sequence) {
	this.sequence = sequence || this.sequence; 
	// counter for clusters
	this.rank = 0;

	var seqLength = 0;
//	var clusters = matching_structures.clusters;
//	var Selected_PDB = matching_structures.Selected_PDB;

	// main function begins
		seqLength = this.sequence.length;
//		AQUARIA.structures2match = matching_structures;

		// this.width = document.getElementById("structureviewer").offsetWidth
		this.width = document.getElementById("structureviewer").offsetWidth/1.2 - AQUARIA.margin.right - AQUARIA.margin.left;
		this.height = 40 - AQUARIA.margin.top - AQUARIA.margin.bottom + 35; // height
		this.xScale = d3.scale.linear().domain([ 1, seqLength ]).range([ 1, this.width ]); // .range([1, width]);

		// set single residue width
		AQUARIA.srw = this.xScale(100) / 100;
		// console.log("srw: "+srw);

		this.removeAll();

		if(document.querySelector('#vis > .ruler')){
			document.querySelector('#vis > .ruler').remove()
		}
		// draw axis ruler
		this.drawAxisRuler("vis");
		
		// append div for clusters
		// $("#vis").append("<div id='allclusters' data-intro='Visual summary of all structures in PDB matching the specified protein, grouped by region of match.' data-position='left'></div>");

};

ShowMatchingStructures.prototype.updateSizes = function(newClusters) {
	var i;
	if (newClusters.length != this.clusterRenderers.length) {
		console.log("ShowMatchingStructures.updateSizes error, clusters don't exist for size update" + newClusters.length + " , " + this.clusterRenderers.length )
	}
	else {
	  this.clusters = newClusters;
		for (i = 0; i < newClusters.length; i++) {
			this.clusterRenderers[i].updateCluster(newClusters[i]);
		}
	}
	this.finishedLoading();
}

ShowMatchingStructures.prototype.refresh = function() {
	this.initialise();
	var existingClusters = this.clusters;
	this.clusters = [];
	this.clusterRenderers = [];
	existingClusters.forEach(function (cluster) {
		that.addCluster(cluster);
	});
	this.updateSizes(existingClusters);
	this.selectCluster();
};

ShowMatchingStructures.prototype.showMap = function(cluster) {
	CoverageMapRenderer.RenderMap(cluster, this.rank);
	AQUARIA.showMatchingStructures.cluster = cluster;
};

ShowMatchingStructures.prototype.addCluster = function(cluster) {
	this.clusters.push(cluster);
	var clusterRenderer = new ClusterRenderer(cluster, this.rank, this.xScale, this.width,
			this.height, function (d, clusterSelected) {
				console.log('ShowMatchingStructures.addCluster.onclick', clusterSelected)
				var cluster_nbr = that.getClusterId(d);
				that.onTextClick(d, clusterSelected);
			}, this.clusterItemClick, "#allclusters");
	this.clusterRenderers.push(clusterRenderer);
	this.rank++;
};



ShowMatchingStructures.prototype.finishedLoading = function() {
	var structureCount = totalStructures(this.clusters);
	console.log('ShowMatchingStructures.finishedLoading', structureCount + " structures total!");
	$("#structureexplanation").html("<span class='counter'>" + structureCount + "</span>");
	$("#structurematches h3 span.counter, div.container svg g.expandable text").digits();
	
};

var totalStructures = function(clusters) {
	var total = 0;
	clusters.forEach(function(cluster) {
		total += parseInt(cluster.cluster_size);
	});
	return total;
}

ShowMatchingStructures.prototype.getClusterId = function (d) {
	return parseInt(d.attr("id").substr(15));
};

function waitForElement(){
	AQUARIA.addedFeature = true;
	if(document.getElementById("waitingFrame").style.display != 'none'){
		setTimeout(waitForElement, 5);
	}
	else{
		AQUARIA.passFeature(AQUARIA.customfeatureSet, AQUARIA.customfeatureSetioid)
		d3.selectAll("svg.loaded rect.feature").attr("fill", "#a4abdf");
		d3.select("svg.loaded").classed("loaded", false);
	}
}

ShowMatchingStructures.prototype.clusterItemClick = function(d) {
	history.pushState("", document.title, window.location.pathname + window.location.search);

	var shortId = d.attr("id").substr(10, 4);
	var cluster_nbr = that.getClusterId(d);

	that.mark_loaded_structure(shortId, cluster_nbr);
	console.log(
		"ShowMatchingStructures.clusterItemClick",
		"shortId: " + shortId,
		"cluster-number: " + cluster_nbr,
		that.clusters[cluster_nbr]
	);

	if (window.threedViewer === 'IDR') {
		var threeDWidth = $("#threeD").width();
		var threeDHeight = threeDWidth;
		threeDHeight = $("#threeDSpan").innerHeight();
		if (threeDHeight < 570) {
			threeDHeight = 570;
		}
		AQUARIA.panel3d.display_cluster(that.clusters[cluster_nbr], threeDWidth, threeDHeight);
	} else {
		var member = that.clusters[cluster_nbr].members[0];
		AQUARIA.display_member(member);
	}
	var featureRegex = new RegExp(/[A-Z a-z]+[0-9]+[A-za-z]+/)
	var searchParam = window.location.search.split('?')[1]
	// searchParam = window.location.search.split('=')[0]
	if(($(location).attr('href').includes("json") || featureRegex.test(searchParam))){
		waitForElement()
	}
	document.querySelectorAll('.coverage_map_container').forEach(function(map){
		map.remove()
	})
	that.drawCoverageMap(that.clusters[cluster_nbr])
	//document.querySelector(".featureTrack svg.loaded") check if exists to keep the feature.
};

ShowMatchingStructures.prototype.drawCoverageMap = function (cluster) {
	AQUARIA.showMatchingStructures.clusters.forEach(function(c){
		AQUARIA.showMatchingStructures.showMap(c)
	})
	document.querySelectorAll("#selectedCluster [id*='c_'] rect").forEach(function (part) {
		part.style.fill = '#a5a5a5'
		part.style.stroke = '#a5a5a5'
		part.style.opacity = '0.2'
	})
	document.querySelectorAll("#selectedCluster [id*='c_'] polygon").forEach(function (part) {
		part.style.fill = '#a5a5a5'
		part.style.stroke = '#a5a5a5'
		part.style.opacity = '0.2'
	})
	that.showMap(cluster)
}

ShowMatchingStructures.prototype.drawAxisRuler = function(layerId) { // console.log("Ruler
																																// width:
//	d3.select("#" + layerId + "div.ruler").remove();																															// "+width+",

	var rsvg = d3.select("#" + layerId)
		.insert("div",":first-child")
			.attr("class", "ruler")
			.attr("data-intro","Graphical representation of the specified protein's sequence")
			.attr("data-position", "left")
		.append("svg").attr("width",
			parseInt(this.width + AQUARIA.margin.left)).attr("viewBox",
			"0 0 " + parseInt(this.width + AQUARIA.margin.left) + " 15").attr(
			"preserveAspectRatio", "none").attr("height", 15).append("g").attr(
			"transform", "translate(" + AQUARIA.margin.left + ",0)");

	rsvg.append("g").attr("class", "x axis").call(
			d3.svg.axis()
				.scale(this.xScale)
				.orient("bottom")
				.tickSize(4, 2, 6)
				.tickPadding(2)
			//	.tickValues([allTicks,this.sequence.length])
		);	
	
	var tickList = [];
	var allTicks = d3.selectAll("#vis div.ruler g.x text")[0];	
	
	for (var n=0; n < allTicks.length; n++) {
		tickList.push(+allTicks[n].textContent);		//console.log(n+":"+tickList);
	}
	
	function doesItFit(x) { 
		var rulerEnd = AQUARIA.showMatchingStructures.sequence.length;
		return  (x!== 1 && x!==rulerEnd && x*AQUARIA.srw < (rulerEnd*AQUARIA.srw-30) );
	
	}
	
	tickList = tickList.filter(doesItFit);   // console.log("filtered:"+tickList);
	tickList.push(AQUARIA.showMatchingStructures.sequence.length);
	tickList.unshift(1);
	// left
	//console.log(" = = = ticks: "+allTicks)	;																	// margin:
	//console.log(tickList);	
	
	d3.select("#" + layerId + " div.ruler g.x").call(
			d3.svg.axis()
			.scale(this.xScale)
			.orient("bottom")
			.tickSize(4, 2, 6)
			.tickPadding(2)
			.tickValues(tickList)
	);	
		
	d3.selectAll("g.x text").attr("text-anchor", "end");

};


ShowMatchingStructures.prototype.mark_loaded_structure = function(id, nbr) { // console.log("highlight
	// id:
	// "+id+",
	// cluster:
	// "+nbr);
	$("g.loaded").removeClass("loaded");
	d3.select("div.container.loaded").classed("loaded", false);
	d3.select("g#structure_" + id + "_" + nbr).classed("loaded", true);
	d3.select("div#c_" + id + "_" + nbr).classed("loaded", true);
	// AQUARIA.currentData.cluster_number = nbr;
}
// //// Expanding clusters: moved to show_expanded_clusters.js /////////////
module.exports = ShowMatchingStructures;
//module.exports.set = function(global) {
//	AQUARIA = global;
//};

// /////// sidebar information panels: moved to textpanels.js //
