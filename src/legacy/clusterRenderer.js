var Cluster = require('./shared/cluster');
var d3 = require('d3');

var ClusterRenderer = function(cluster, rank, xScale, width, height, onTextClick, onClusterItemClick) {

	this.width = width;
	this.height = height;
	this.xScale = xScale;
	this.onTextClick = onTextClick;
	this.clustSize = 0;
	this.onClusterItemClick = onClusterItemClick;
	this.rank = rank;
	this.cluster = cluster;
	var container = this.drawClusterContainer(cluster, rank);
	if (typeof container !== 'undefined') {
		this.drawCluster(cluster, rank);
	}
//	return outerDiv;

};

ClusterRenderer.prototype.updateCluster = function (clusterToUpdate) {
	var that = this;
	this.cluster = clusterToUpdate;
	this.clustSize = clusterToUpdate.cluster_size;
	var id = this.cluster.pdb_id.toLowerCase() + "_" + this.rank;
	if (typeof this.nusvg !== 'undefined') {
		this.nusvg.select("g#structure_" + id + " text")
		.text(function() {
		return that.clustSize;
	});

	}

}

ClusterRenderer.prototype.drawClusterContainer = function(cluster, s) {
	// scale start and end coordinates
	var that = this;
	var member = cluster.members[0];
	var pdb_chain = cluster.pdb_chain[0];
	// //var repeat_domain = data.Repeat_domains[0];

	if (cluster.secondary_structure.length === 0 || cluster.secondary_structure[0].length === 0) {
		console.log('ClusterRenderer.drawClusterContainer error: cannot draw cluster as it has no secondary structure: ', cluster);
		return;
	}

	structStart = this.xScale(cluster.secondary_structure[0][0].start);
	structEnd = this.xScale(cluster.secondary_structure[0][cluster.secondary_structure[0].length - 1].end);
	// console.log ("structStart: " + structStart + ", structEnd: " +
	// structEnd);
	var id = cluster.pdb_id.toLowerCase() + "_" + s;
	this.clustSize = cluster.cluster_size;
	// ///var cluster_nbr = s;
	var identity_score = cluster.alignment_identity_score;
	// set padding for labels
	pad = 0;
	if (this.clustSize > 99) {
		pad = 8;
	}
	if (this.clustSize > 999) {
		pad = 18;
	}
	if (this.clustSize < 10) {
		pad = -6;
	}

	var outerdiv = d3.select("#allclusters").append("div").attr("id", "out_" + id).attr(
			"class", "outer_container");
	outerdiv.append("svg").attr("width", 40).attr("height", 40).attr("viewBox",
			"0 0 40 40").attr("preserveAspectRatio", "none")
	// add identity percentage
	.append("text").attr("text-anchor", "end").attr("class", "percentage").attr(
			"x", 28).attr("y", 26).text(identity_score + "%");

	// draw outline of the whole chain
	this.nusvg = outerdiv.append("div").attr("id", "c_" + id).attr("class",
			"container").append("svg").attr("width", this.width + 200).attr("height",
			this.height + 30)
			.attr("viewBox", "0 0 " + (this.width + 200) + " " + (this.height + 30)).attr(
					"preserveAspectRatio", "none");

	this.nusvg.append("g").attr("id", "structure_" + id).attr("transform",
			"translate(" + (AQUARIA.margin.left + structStart) + ",20)").on(
			"mouseover", function() {
				return d3.select(this).call(that.mouseover, that);
			}).on("mouseout", function() {
		return d3.select(this).call(that.mouseout, that);
	}).append("rect") // background shape for cluster size label
	.attr("transform", "translate(" + (structEnd - structStart - 5) + ",5)")
			.attr("class", "handle").attr("width", 32 + pad).attr("height", 16).attr(
					"rx", 6);

	this.nusvg.select("g#structure_" + id).append("g").attr("class", "cluster").attr(
			"title",
			"Click to load " + id.substr(0, 4) + ", chain " + pdb_chain
					+ " into structure view. Compared to the specified protein, this structure has "+identity_score+"% sequence identity. ").attr("width", structEnd - structStart + 2)
			.attr("height", 26).on("click", function() {
				return d3.select(this.parentNode).call(function (d) {
					console.log('ClusterRenderer.nusvg.select clicked! ' + d);
					that.onClusterItemClick(d);
				});
			});

	this.nusvg.select("g#structure_" + id + " g.cluster").append("rect").attr("class",
			"cluster").attr("width", structEnd - structStart + 3).attr("height", 26)
			.attr("rx", 6);

	// add center line
	this.nusvg.select("g#structure_" + id + " g.cluster").append("rect").attr("width",
			structEnd - structStart).attr("height", 1).attr("transform",
			"translate(0,13)").attr("class", "insertion");

	// add thumbnail images
	this.addThumbnails(id, structStart, structEnd, pad);


	this.nusvg.select("g#structure_" + id).append("text") // label for cluster size
	.attr("text-anchor", "end").attr("fill", "white").attr("x",
			(structEnd - structStart + 24 + pad)).attr("y", 13).attr("dx", -3) // padding-right
	.attr("dy", ".35em"); // vertical-align: middle)


	var clickTitle = "Click to see " + that.clustSize + " structures in this cluster";
	this.nusvg.select("g#structure_" + id + " text, g#structure_" + id).attr("class",
			"expandable").attr("title",
			clickTitle);

//	var clickClusterEvent = new CustomEvent(
//			"clusterExpanded",
//			{
//				detail: {
//					message: clickTitle,
//					time: new Date(),
//				},
//				bubbles: true,
//				cancelable: true
//			}
//		);

	this.nusvg.select("g#structure_" + id + " text").on(
			"click", function () {
				that.onTextClick(d3.select(this.parentNode), that.cluster);
			});

	return outerdiv;

};

ClusterRenderer.prototype.drawCluster = function(cluster, rank) {
	var that = this;
	cluster.secondary_structure[0].forEach(function(d, index) {
		// convert strings to numbers
		d.start = +d.start;
		d.end = +d.end; // console.log(d.type +" "+index+", from "+d.start+" to
		// "+d.end);

		// draw the secondary structure, etc.
		that.drawResidues(cluster, rank, d);
	});
	this.setConservation(rank, cluster);
};

ClusterRenderer.prototype.drawResidues = function(cluster, rank, el) {
	// for each residue, draw one rectangle with a unique position id, so we can
	// assign a class/status later
	var offset = cluster.secondary_structure[0][0].start;

	var thickness = 0;

	for ( var n = el.start; n <= el.end; n++) {
		var conservation = cluster.conservationArray[0][n];
		if (n != el.end && conservation === cluster.conservationArray[0][n + 1]) {
			thickness++;
			continue;
		}
		var rect = this.nusvg.select(
				"g#structure_" + cluster.pdb_id.toLowerCase() + "_" + rank
						+ " g.cluster").append("g").attr("class", "residue " + el.type)
				.attr("id", "r_" + rank + "_" + n).attr("transform",
						"translate(" + (n - offset - thickness) * AQUARIA.srw + ",8)")
				.append("rect").attr("class", conservation).attr("width",
						AQUARIA.srw * (thickness + 1)).attr("height", 10);

		// if (data.conservationArray[n] === 'conserved') {
		// rect.attr("class", "conserved");
		// }
		if (el.type == "SHEET") {
		  rect.attr("height", 14).attr("transform", "translate(0,-2)");
      if (n == el.end) {
        rect.attr("width", AQUARIA.srw * (thickness));
//      }
//			if (n == el.end) {
				this.nusvg.select("g.residue#r_" + rank + "_" + n).append("svg:polygon")
						.attr("class", conservation).attr("transform",
								"translate(" + (AQUARIA.srw * thickness) + ",0)").attr(
								"points", AQUARIA.srw + ",0 0,-6 0,16 " + AQUARIA.srw + ",10");
				// this.nusvg.select("g.residue#r_"+rank+"_"+n+" rect").remove();
			} else {
				// console.log(' not at the end:' + n);
			}
		}
		if (el.type == "HELIX") {
			this.nusvg.select("g.residue#r_" + rank + "_" + n + " rect")
					.attr("height", 16).attr("class", conservation).attr("transform",
							"translate(0,-3)");
		}
		thickness = 0;
	}

};
ClusterRenderer.prototype.setConservation = function(index, data) { // console.log("setting conservation
	// for cluster "+index);

	// TO DO: account for gaps=insertions ( .clusters[n].seq_end[m]+1 ,
	// .clusters[n].seq_start[m+1]-1 )
	// draw rect height=2
	var insertions = [];
	var that = this;
	for ( var i = 0; i < data.seq_end.length - 1; i++) {
		var gap = [];
		gap[0] = data.seq_end[i] + 1;
		gap[1] = data.seq_start[i + 1] - 1;
		insertions.push(gap); // console.log("insertion: " + gap.toString());
	}

	var subst3 = this.nusvg.selectAll("g.residue").data(insertions).each(
			function(d) { // console.log("d.length: "+d.length);
				for ( var k = d[0]; k <= d[1]; k++) { // console.log("insertion at: " +
					// k);
					that.nusvg.select("g.residue#r_" + index + "_" + k + " rect").attr(
							"height", 1).attr("transform", "translate(0,5)").attr("class",
							"insertion");
				}
			});

};
ClusterRenderer.prototype.addThumbnails = function(protein, offset, end, pad) {
	var imgName = protein.substring(0, 4).toUpperCase();

	d3.select("g#structure_" + protein + " g.cluster").append("line").attr("x1",
			(end - offset + 6 + pad)).attr("y1", 13)
			.attr("x2", (this.width - offset + 60)).attr("y2", 13).attr("class",
					"connector").attr("stroke-width", 1);

	d3.select("g#structure_" + protein).append("g").attr("class", "thumbnail")
			.attr("transform", "translate(" + (this.width - offset + 28) + ",-18)")
			.append("circle").attr("cx", 30).attr("cy", 30).attr("r", 16).attr(
					"fill", "#FFF").attr("stroke", "#797979").attr("stroke-width", 2);

	d3.select("g#structure_" + protein + " g.thumbnail").append("clipPath").attr(
			"id", "path_" + protein).append("circle").attr("cx", 30).attr("cy", 30)
			.attr("r", 15).attr("clip-rule", "evenodd");

	var thumb = d3.select("g#structure_" + protein + " g.thumbnail").append(
			"image").attr("width", "30px").attr("height", "30px").attr("x", 15).attr(
			"y", 15).attr("xlink:href",
			"https://www.rcsb.org/pdb/images/" + imgName + "_bio_r_65.jpg").attr(
			"clip-path", "url(#path_" + protein + ")");
};

ClusterRenderer.prototype.mouseover = function(d, that) {
	that.origin = d3.select("#" + d.attr("id") + " g.thumbnail").attr("transform"); // //////console.log(origin);
	var over = parseFloat(that.origin.substring((that.origin.indexOf("(")) + 1, that.origin
			.indexOf(",")));// //////console.log("over:
	// "+over);
	var shortId = d.attr("id").substr(9); // //////console.log("shortId:
	// "+shortId);
	d3.select("#" + d.attr("id") + " g.cluster, #" + d.attr("id")).classed(
			"active", true);
	d3.select("#" + d.attr("id") + " g.thumbnail").attr("transform",
			"translate(" + (over + 32) + ", -18)");
	d3.select("#" + d.attr("id") + " g.thumbnail circle").attr("r", 30);
	d3.select("#" + d.attr("id") + " g.thumbnail #path" + shortId + " circle")
			.attr("r", 29);
	d3.select("#" + d.attr("id") + " g.thumbnail image").attr("width", "60px")
			.attr("height", "60px").attr("x", 0).attr("y", 0);
};
ClusterRenderer.prototype.mouseout = function(d, that) {
	var shortId = d.attr("id").substr(9); // //////console.log("shortId:
	// "+shortId);
	d3.select("#" + d.attr("id") + " g.cluster, #" + d.attr("id")).classed(
			"active", false);
	d3.select("#" + d.attr("id") + " g.thumbnail").attr("transform", that.origin);
	d3.select("#" + d.attr("id") + " g.thumbnail circle").attr("r", 16);
	d3.select("#" + d.attr("id") + " g.thumbnail #path" + shortId + " circle")
			.attr("r", 15);
	d3.select("#" + d.attr("id") + " g.thumbnail image").attr("width", "30px")
			.attr("height", "30px").attr("x", 15).attr("y", 15);
};

module.exports = ClusterRenderer;