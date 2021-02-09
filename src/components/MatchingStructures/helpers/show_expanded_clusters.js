/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable camelcase */
/// /// Expanding clusters /////////////

var position; var container_position; var left_edge
var limit = 10
var radius = 16
var $ = require('jquery')
var memberIndexCounter = 0
var d3 = require('d3')
var resize_app = require('../../AquariaLayout/helpers/resize_app')
var axios = require('axios')

module.exports.expand_cluster = function expand_cluster (d, cluster, sequence) {
  console.log('show_expanded_cluster.expand_cluster')
  // dim background

  // hide applet temporarily for Windows
  // if(browser.indexOf("Windows") != -1) { $("#threeD").css("visibility", "hidden"); }

  var cluster_nbr = parseInt(d.attr('id').substr(15))
  // console.log("expanding cluster "+ cluster_nbr);
  var pdbid = d.attr('id').substr(10, 4)

  // get click position
  position = $('g#structure_' + pdbid + '_' + cluster_nbr + ' rect.handle').offset()
  container_position = $('div#c_' + pdbid + '_' + cluster_nbr).offset()
  // console.log("position(left,top): "+parseInt(position.left)+","+parseInt(position.top)+"; container_position(left,top): "+parseInt(container_position.left)+","+parseInt(container_position.top));

  left_edge = parseInt(position.left - container_position.left)

  // create svg and show spinner where click happened

  var spinner = d3.select('div#c_' + pdbid + '_' + cluster_nbr).append('div')
    .attr('id', 'wait4tree')
    .append('svg')
    .attr('width', 60)
    .attr('height', 60)
    .attr('viewBox', '0 0 60 60')
    .attr('preserveAspectRatio', 'none')
    .append('g')
    .attr('id', 'treespinner')
    .attr('transform', 'translate(' + (2 + radius) + ',' + (2 + radius) + ')')
  spinner.append('circle')
    .attr('r', radius)
    .style('stroke', '#666')
    .style('fill', '#666')

  $('div#c_' + pdbid + '_' + cluster_nbr + ' div#wait4tree')
    .css('top', '0px')
    .css('left', left_edge + 'px')

  spinner.append('clipPath')
    .attr('id', 'spinClip')
    .append('circle')
    .attr('r', (radius - 1))
    .attr('clip-rule', 'evenodd')

  spinner.append('image')
    .attr('width', 2 * (radius - 2) + 'px')
    .attr('height', 2 * (radius - 2) + 'px')
    .attr('x', -(radius - 2))
    .attr('y', -(radius - 2))
    .attr('clip-path', 'spinClip')
    .attr('xlink:href', '/images/tree-loader.gif')

  // append <div>
  d3.select('div#c_' + pdbid + '_' + cluster_nbr).append('div').attr('class', 'expansion')
  d3.select('div#c_' + pdbid + '_' + cluster_nbr).append('div').attr('class', 'dimmer2')

  if (cluster._children) { // console.log(matching_structures.clusters[cluster_nbr]._children.length +" hidden c.");
    positionTreeDiv(cluster, cluster_nbr, pdbid)
  } else { // console.log('getting new Children');
    cluster._originalChildren = null
    var secondaryClustersCallback = function (newChildren) {
      if (cluster._originalChildren === null) {
        // first time
	        cluster._originalChildren = newChildren
	        cluster._children = cluster._originalChildren
	        positionTreeDiv(cluster, cluster_nbr, pdbid)
			  } else {
			    // DON"T use concat as that will create a new array
			    newChildren.forEach(function (newChild) {
			      cluster._originalChildren.push(newChild)
			    })
			    adjustHeight(cluster, cluster_nbr, pdbid)
			  }
    }
    //			var secondaryClustersCallbackProgress = function (val) {
    //				//console.log("The % complete = " + (val * 100));
    //			};
    console.log('show_expanded_cluster.expand_cluster remote fetch secondary clusters', cluster.members, sequence.primary_accession, cluster_nbr)

			  var url = `${window.BACKEND}/get_secondary_clusters/`
			  url = url + sequence.primary_accession + '/' + pdbid + '/' + AQUARIA.currentChain + '/' + cluster_nbr

			  axios({
      method: 'get',
      url: url
			  })
      .then(function (response) {
				  const newData = response.data
				  secondaryClustersCallback(newData)
			  //   })
      })
    // AQUARIA.remote.get_secondary_clusters(cluster.members, sequence.primary_accession, cluster_nbr, secondaryClustersCallback);
  }
}

function positionTreeDiv (selectedCluster, cluster_nbr, pdbid) {
  // compute limit based on window height
  var h_w = $(window).height()
  var h_d = $(document).height()
  var h_s = $(document).scrollTop()
  // console.log("h_w: "+h_w+", h_d: "+h_d+", h_s: "+h_s+", top: "+position.top);
  var wlimit = Math.floor((h_w + h_s - position.top) / (2 * radius + 2))
  // uncomment next line to override limit
  if (wlimit > limit) { limit = wlimit }

  adjustHeight(selectedCluster, cluster_nbr, pdbid)

  // draw tree
  show_expanded_cluster(selectedCluster, pdbid, cluster_nbr)
}

function adjustHeight (selectedCluster, cluster_nbr, pdbid) {
  var max_height = get_max(selectedCluster)
  var treeheight = max_height * 2.5 * radius + AQUARIA.margin.top + AQUARIA.margin.bottom // console.log("tree height: "+treeheight);

  // adjust position

  $('div#c_' + pdbid + '_' + cluster_nbr + ' div.expansion')
    .css('left', left_edge + 'px')
    .css('top', parseInt(-(treeheight * 0.5) + 20) + 'px') // .css("top", parseInt(position.top - (treeheight/2) + 8) +"px");
}

/// ///// TREE //////////
var setId, rooted, max
var twidth = 800
var theight

var i = 0
var duration = 550
var root
var svg
var tree, nodes
var diagonal = d3.svg.diagonal()
  .projection(function (d) { return [d.y, d.x] })

function get_max (cluster, cmax) {
  if (cmax) { // we're in the second level of the tree structure
    //	console.log("cmax: "+cmax);//console.log(cluster);
    if (cluster._children && cluster._children.length > cmax) { // console.log("2nd level cluster has "+cluster._children.length+" _children");
      max = cluster._children.length
    }
    if (cluster.children && cluster.children.length > cmax) { // console.log("2nd level cluster has "+cluster.children.length+" children");
      max = cluster.children.length
    }
    // console.log("2nd level cluster has "+max+" children");
  } else { // first level of tree
    max = 0

    if (cluster._children) { // console.log("1st level cluster has "+cluster._children.length+" _children");
      max = cluster._children.length

      for (var i in cluster._children) {
        var newMax = get_max(cluster._children[i], max)
        if (newMax > max) {
          max = newMax
        }
      }
    }
  }

  if (max > limit) { // console.log("max > limit: " +max);
    max = limit
  }
  return max
	  }

function show_expanded_cluster (selectedCluster, id, number) {
  var i = 0
  var duration = 500
  var root = selectedCluster

  if (root._children) {
    root.children = root._children /// /console.log("hidden children");

	  function collapse (d) {
      if (d.children) {
        d._children = d.children
		  	d.children.forEach(collapse)
		  	d.children = null
      }
	 	 }

    var rmax = get_max(root)
    // console.log("rmax is "+rmax);
    theight = rmax * 2.5 * radius + AQUARIA.margin.top + AQUARIA.margin.bottom
    tree = d3.layout.tree()
      .size([theight, twidth]) // console.log("tree (h, w): "+theight+", " +twidth);

    var vis = d3.select('div#c_' + id + '_' + number + ' div.expansion').append('svg')
      .attr('width', twidth)
      .attr('height', theight + AQUARIA.margin.top + AQUARIA.margin.bottom)
      .attr('viewBox', '0 0 ' + (twidth) + ' ' + (theight + AQUARIA.margin.top + AQUARIA.margin.bottom))
      .attr('preserveAspectRatio', 'none')
      .append('g')
      .attr('transform', 'translate(' + (2 + radius) + ',0)')

    root.x0 = theight / 2
  	root.y0 = 6
    root.children.forEach(collapse)
    if (root.children.length > limit) {
	  root.allchildren = insert_buttons(root.children, root)
      root.children = root.allchildren.slice(0, limit + 1)
    }
    update(root)
  }
  // remove tree when background is clicked
  $('div.dimmer2').one('click', function () { // console.log("clicked background");
    nodeClick(root)
    //	  if (root.children && root.children[0]) {
    //	    if (root.children[0].children) {
    //        load_structure(AQUARIA.structures2match, root, false);
    //	      root.children[0]._children = root.children[0].children;
    //	      root.children[0].children = null;
    //        delete root.children[0]._siblings;
    //        delete root.children[0].focused;
    //	    }
    //	  }
    //    root.children = root._originalChildren;
    $('div.expansion, div.dimmer2, div#wait4tree').remove()
		 // un-hide applet
    $('#threeD').css('visibility', 'visible')
  })
  // hide and remove wait spinner
  	$('div#wait4tree').hide(500).remove()

  function update (source) {
	  // Compute the tree layout.
	   var nodes = tree.nodes(root)// .reverse();
	   // console.log(nodes);
    /* / Compute a new tree layout.
	  if (source.parent) {
		nodes = tree.nodes(source);
		}
		else {
		nodes = tree.nodes(root);
		}
  */

	  nodes.forEach(function (d, index) { // console.log(d);
	  		d.cluster = number // Register in which cluster the tree is
	  		d.member = index // Record member number
	  		d.y = d.depth * 80 // Normalize for fixed-depth.
	  		})

	  // Update the nodes
	  var node = vis.selectAll('g.node')
		  .data(nodes, function (d) {
		    if (typeof d.id === 'undefined') {
		      var tempId = ++memberIndexCounter
		      console.log("show_expanded_clusters.update: can't find ID for node : " + d + ', assigning: ' + tempId)
		      d.id = tempId
		    }

		    return d.id
      })

	  // Enter any new nodes at the parent's previous position.
	  var nodeEnter = node.enter().append('g')
		  .attr('class', 'node')
		  .attr('id', function (d) {
			  if (d.member == 0 && d.depth == 0) { d.id = 0 }
			  	return d.id
			  })
		  .attr('transform', function (d) { return 'translate(' + source.y0 + ',' + source.x0 + ')' })
		  .on('click', nodeClick)
		  .on('mouseenter', function (d) { if (!d.name && d.depth == 2) { return nodeOver(d, d3.event) } })
		  .on('mouseleave', nodeOut)
    // make a label for nodes with children
  	nodeEnter.append('rect')
  		.attr('transform', 'translate(6,-8)')
  		.attr('class', 'label')
      .attr('width', function (d) { return d._children ? (d._children.length > 9 ? 30 : 22) : 0 })
      .attr('height', function (d) { return d._children ? 16 : 0 })
      .attr('rx', 6)
      .attr('fill', '#a3a3a3')
      .attr('stroke', 'none')

	  nodeEnter.append('circle')
		  .attr('r', 1e-6)
		  .style('stroke', function (d) { return (typeof d.children === 'undefined') ? '#666' : '#CCC' })
		  .style('fill', function (d) { return d.pos ? 'steelblue' : '#fff' })
    // add structure images for leaf nodes
    nodeEnter.append('clipPath')
      .attr('id', function (d) { return (d.pdb_id && typeof d._children === 'undefined') ? 'clip_' + d.pdb_id : (d._children ? 'clip_' + d._children[0].pdb_id : ' ') })
      .append('circle')
      .attr('r', (radius - 1))
      .attr('clip-rule', 'evenodd')

    nodeEnter.append('image')
      .attr('width', 2 * (radius - 1) + 'px')
      .attr('height', 2 * (radius - 1) + 'px')
      .attr('x', -(radius - 1))
      .attr('y', -(radius - 1))
      .attr('clip-path', function (d) {
        var pathNm = ' '
        if (d.pdb_id) { pathNm = 'url(#clip_' + d.pdb_id + ')' }
        if (d._children && d._children[0].pdb_id) { pathNm = 'url(#clip_' + d._children[0].pdb_id + ')' }
        return pathNm
      })
      .attr('xlink:href', function (d) {
        var imgNm = ' '
        if (d.pdb_id && typeof d._children === 'undefined') { imgNm = d.pdb_id.toUpperCase() }
        if (d._children && d._children[0].pdb_id) { imgNm = d._children[0].pdb_id.toUpperCase() }
        return (imgNm === ' ') ? ' ' : 'https://www.ebi.ac.uk/pdbe/static/entry/' + imgNm.toLowerCase() + '_assembly_1_chain_front_image-200x200.png'
        // return (imgNm === " ") ? " " : "https://www.rcsb.org/pdb/images/"+imgNm+"_bio_r_65.jpg";
      })

	  nodeEnter.append('text')
		  .attr('x', 18)
		  .attr('y', function (d) { return d.children ? -24 : 0 })
		  .attr('dy', '.35em')
		  .attr('class', 'identifier')
		  .attr('text-anchor', function (d) { return d.children || d._children ? 'end' : 'start' })
		  .text(function (d) {
		  		if (d.pdb_id && d.pdb_id != 'undefined') { return d.pdb_id + '-' + d.pdb_chain[0] }
		  		if (d.name && d.name != 'undefined') { return d.name } else { return ' ' }
		  	})
		  .style('fill-opacity', 1e-6)

	 nodeEnter.append('text')
		  .attr('x', 18) // function(d) { return d.children || d._children ? -24 : 18; })
		  .attr('dy', '.35em')
		  .attr('class', 'nbr_label')
		  // .attr("text-anchor", function(d) { return d.children ? "end" : "start"})
		  .text(function (d) {
		    	if (d.label && d.label != 'undefined') {
		    		/// /console.log("labelling: "+d._children.length + '  '+d.label);
		    		var nodeLabel = d.label // shorten very long labels
		    		if (d.label.length > 60) { nodeLabel = d.label.substr(0, 60) + '...' }
		    		return d._children ? d._children.length + '  ' + nodeLabel : ' '
        } else {
		    		if (d.children && d.children !== 'undefined') {
		    			if (d.cluster_size) { return d.cluster_size } else {
              /// /console.log("text: "+d.children.length );
              return (d.children === null) ? ' ' : d.children.length
		    				}
		    			}
		    		}
		    	})
		  .attr('title', function (d) { return (d.label && d.label.length > 60) ? d.label : ' ' })
		  .attr('text-anchor', 'start')
	  	// .text(function(d) { return d._children ? d._children.length : " "; })
	  	.style('fill-opacity', 1e-6)

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
		  .duration(duration)
		  .attr('transform', function (d) { return 'translate(' + d.y + ',' + d.x + ')' })

	  nodeUpdate.select('circle')
		  .attr('r', function (d) { return d.pos ? 10 : radius })
		  .style('stroke', function (d) { return (typeof d._children === 'undefined') ? '#DDD' : '#999' })
		  .style('fill', function (d) { return d.pos ? 'lightsteelblue' : '#fff' })

	  nodeUpdate.select('text.identifier')
		  // .attr("x", function(d) { return d.focused ? 0 : 18})
		  // .attr("y", function(d) { return d.focused ? -18 : 0})
		  // .attr("text-anchor", function(d) { return d.focused ? "middle" : "start"})
      .text(function (d) {
		  		if (d.pdb_id && d.pdb_id != 'undefined') { return d.pdb_id + '-' + d.pdb_chain[0] } else {
		  			if (d.name && d.name != 'undefined') { return d.name } else { return ' ' }
        }
		  		})
		  	.style('fill-opacity', 1)

	  nodeUpdate.select('text.nbr_label')
	  	.style('fill-opacity', 1)
      .attr('y', function (d) { return d.focused ? 28 : 0 })
      .attr('text-anchor', function (d) { return d.focused ? 'middle' : 'start' })

	  // Transition exiting nodes to the parent's new position.
	  var nodeExit = node.exit().transition()
		  .duration(duration)
		  .attr('transform', function (d) { return 'translate(' + source.y + ',' + source.x + ')' })
		  .remove()

	  nodeExit.select('circle')
		  .attr('r', 1e-6)

	  nodeExit.selectAll('text')
		  .style('fill-opacity', 1e-6)

	  // Update the links
	  var link = vis.selectAll('path.link')
		  .data(tree.links(nodes), function (d) { return d.target.id })

	  // Enter any new links at the parent's previous position.
	  link.enter().insert('path', 'g')
		  .attr('class', 'link')
		  .attr('d', function (d) {
        var o = { x: source.x0, y: source.y0 }
        return diagonal({ source: o, target: o })
		  })

	  // Transition links to their new position.
	  link.transition()
		  .duration(duration)
		  .attr('d', diagonal)
		  .style('stroke', function (d) { // calculate color saturation from identity
		  	var identity = 0
		  	if (d.target._children && d.target._children[0].alignment_identity_score) {
		  		identity = d.target._children[0].alignment_identity_score / 100 // console.log("identity: "+identity);
		  	}
		  	if (d.target.alignment_identity_score) {
		  		identity = d.target.alignment_identity_score / 100 // console.log("identity: "+identity);
		  	}
		  	var red = Math.floor(40 + (identity * 20)) // max: 60
		  		var green = Math.floor(40 + (identity * 50)) // max:90
		  		var blue = 40
		  	return 'rgb(' + red + '%,' + green + '%,' + blue + '%)'
		  })

	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
		  .duration(duration)
		  .attr('d', function (d) {
        var o = { x: source.x, y: source.y }
        return diagonal({ source: o, target: o })
		  })
		  .remove()

	  // Stash the old positions for transition.
	  nodes.forEach(function (d) {
      d.x0 = d.x
      d.y0 = d.y
	  })
  }

  // Toggle children on click, collapse siblings, and page through large branches.
  function nodeClick (d) { // console.log(d);
	  if (d.children) { /// /console.log("collapsing "+d.children.length+" children of..."); //
      d._children = d.children
  		d.children = null
  		if (d.parent) { // console.log("has parent");
  			if (d._siblings) { /// /console.log(d._siblings.length + " siblings");////console.log(d);
  				d.parent.children = d._siblings
  				d._siblings = null
  				d.focused = false// console.log("focus off");
  			}
  		} else {
  		  load_structure(AQUARIA.structures2match, d, false)
  		}
	  } else { // no visible children
      if (d._children) { // expanding a node: add to children, up to limit
        if (d.allchildren) {} else {
          if (d._children.length > limit) { // insert buttons and save as allchildren
            d.allchildren = insert_buttons(d._children, d) // console.info("inserting buttons");//console.log(d.allchildren);
            d._children = d.allchildren.slice(0, limit + 1)
          }
        }
        d.children = d._children
        d._children = null
        if (d.parent) { // not the root, not a button, so collapse siblings
          d._siblings = d.parent.children /// /console.log(d._siblings);
          d.parent.children = [d] /// /console.log(d.parent.children);
          d.focused = true // console.log("focus on");
        }
      } else { // leaf node
        if (d.name) { // console.log ("a button at pos "+d.pos+" was clicked");
          var pos = d.pos
          var kidz = d.parent.allchildren
          if (d.name == 'Next') { // console.log("Button " + d.name);
            // kidz[pos].name = "Previous";
            d.name = 'Previous' /// /console.log("renamed " + d.name);
            if (kidz.length < limit + 2 + pos) { var end = kidz.length } else { var end = limit + 2 + pos }
            d.parent.children = kidz.slice(pos, end)// console.log("showing kids "+pos+" to "+end);
          } else {
            // kidz[pos].name ="Next";
            d.name = 'Next'
            if (pos - limit > 0) { var start = pos - limit - 1 } else { var start = 0 }
            d.parent.children = kidz.slice(start, pos + 1) // console.log("showing kids "+start+" to "+(pos+1));
          }
        } else {
          if (d._siblings) { // console.log("Leaf with " +d._siblings.length + " siblings");//console.log(d);
            d.parent.children = d._siblings
            d._siblings = null
            d.focused = false // console.log("focus off");
          } else { // console.log("hiding leaf siblings");
            d._siblings = d.parent.children /// /console.log(d._siblings);
            d.parent.children = [d] /// /console.log(d.parent.children);

            // selection made

            load_structure(AQUARIA.structures2match, d, true)// console.log("d says: cluster "+d.cluster+", member "+d.member);
          }
		  }
      }
	  } // console.log("about to go into update");
	  update(d)
  }

  // call this function when there are more children than the limit
  function insert_buttons (kids, parent) {
    var pos; var a; var nukids = []
    for (a = 0; (a + 1) * limit < kids.length; a++) {
      pos = a + limit * (a + 1)
      var button = { name: 'Next', id: 99999 + a + parent.id, pos: pos, parent: parent, children: null }
      if (pos - limit > 0) { var start = pos - limit - a } else { var start = 0 }
      var kids2add = kids.slice(start, pos - a)
      for (k in kids2add) { nukids.push(kids2add[k]) }
      nukids.push(button) // console.log("added button at "+pos+"; nukids for "+a+": "+nukids.length);
    }
    var lastkids = kids.slice(pos - a + 1, kids.length)	 // console.log(lastkids.length + " stragglers");
    for (f in lastkids) { nukids.push(lastkids[f]) } // console.log("final nukids: "+nukids.length+" + nukids is:")//;//console.log(nukids);
    return nukids
  }

  function waitForElement () {
    AQUARIA.addedFeature = true
    if (document.getElementById('waitingFrame').style.display != 'none') {
      setTimeout(waitForElement, 5)
    } else {
      AQUARIA.passFeature(AQUARIA.customfeatureSet, AQUARIA.customfeatureSetioid)
    }
  }

  function load_structure (matching_structures, d, really) {	// console.log(really + " load "+d.id+" MS.c: "+matching_structures.clusters.length);
    console.log('show_expanded_cluster.load_structure')
    var cluster_nr = d.cluster
    var count = countCluster(matching_structures.clusters[cluster_nr], d)
    var member_nr = count.member // console.log("count says: cluster "+cluster_nr+", member "+member_nr);
    var parent_cluster = matching_structures.clusters[cluster_nr]
    parent_cluster.children = null
    parent_cluster._children = null
    parent_cluster.allchildren = null
    matching_structures.clusters[matching_structures.Selected_PDB.cluster_number].children = null
    matching_structures.clusters[matching_structures.Selected_PDB.cluster_number]._children = null

    if (really == true) {
      console.log('about to load cluster ' + cluster_nr + ', ' + d.pdb_id + ', chain ' + d.pdb_chain[0] + ', repeats: ' + d.Repeat_domains[0])

      resize_app.startLogoSpin()
      AQUARIA.panel3d.blankApplet(true)
      AQUARIA.blankPanel('#aboutPDB', true)
      AQUARIA.display_member(matching_structures.clusters[cluster_nr].members[member_nr]); console.info(matching_structures.clusters[cluster_nr].members[member_nr])
      AQUARIA.showMatchingStructures.selectCluster(matching_structures.clusters[cluster_nr], cluster_nr)
      update(d)

			  // un-hide applet
      $('#threeD').css('visibility', 'visible')

      window.setTimeout(function () {
        $('div.expansion, div.dimmer2').remove()
			  }, 600)

      var featureRegex = new RegExp(/[A-Z a-z]+[0-9]+[A-za-z]+/)
      var searchParam = window.location.search.split('?')[1]
      // searchParam = window.location.search.split('=')[0]
      if (($(location).attr('href').includes('json') || featureRegex.test(searchParam))) {
        waitForElement()
      }
	  	} else {
	  update(d)

	  // un-hide applet
	  $('#threeD').css('visibility', 'visible')

	  // remove layers once a leaf node was clicked
	  window.setTimeout(function () {
        $('div.expansion, div.dimmer2').remove()
	 	 }, 600)
    }
  }

  function countCluster (cluster, el) { // console.log("countCluster: finding cluster of "+el.pdb_id+" in "+matching_structures.clusters.length+" clusters");
    var count = {}

    for (m in cluster.members) {
				 if (cluster.members[m].pdb_id == el.pdb_id) {
        // count.cluster = c;
        count.member = parseInt(m)
        return count
      }
    }
  }
  var timer

  function nodeOver (d, evt) {
    $('.longtitle').remove() // remove old instance from DOM
    var count = countCluster(AQUARIA.structures2match.clusters[d.cluster], d)
    var member_nr = count.member
    var myStruct = AQUARIA.structures2match.clusters[d.cluster].members[member_nr]
    var longtitle = null
    if (myStruct.pdb_title) {
      longtitle = '<strong>' + myStruct.pdb_id + '</strong>, chain ' + myStruct.pdb_chain[0] + ': ' + myStruct.pdb_title
      timer = window.setTimeout(showTitle, 600, longtitle, evt)
    } else {
      var url = `${window.BACKEND}/queryPDBTitle/${myStruct.pdb_id}/${myStruct.pdb_chain[0]}`
      axios({
        method: 'get',
        url: url
      })
        .then(function (response) {
		  experimentalMethod = '(' + response.data.Experimental_Method	+ ')'
		  myStruct.pdb_title = [response.data.chainTitle, response.data.pdbTitle, response.data.Experimental_Method].join('<BR>')
		  longtitle = '<strong>' + myStruct.pdb_id + '</strong>, chain ' + myStruct.pdb_chain[0] + ': ' + myStruct.pdb_title
		  timer = window.setTimeout(showTitle, 50, longtitle, evt)
        })

    //   AQUARIA.remote.queryPDBTitle(myStruct.pdb_id, myStruct.pdb_chain[0], function (chainTitle, pdbTitle, experimentalMethod) {
    // 	experimentalMethod = "("+  experimentalMethod + ")";
    //     myStruct.pdb_title = [chainTitle, pdbTitle, experimentalMethod].join('<BR>');
    //     longtitle = "<strong>"+myStruct.pdb_id+"</strong>, chain "+myStruct.pdb_chain[0]+": "+myStruct.pdb_title;
    //     timer = window.setTimeout( showTitle, 50, longtitle, evt);
    //   });
    }
    // alert(longtitle);
  }

  function nodeOut () { window.clearTimeout(timer); $('.longtitle').fadeOut() }

  function showTitle (strng, event) {
    var p = $('div.expansion').offset()
    var t = $(event.target).offset()
    var wx = parseInt(t.left - p.left)
    var wy = parseInt(t.top - p.top)

    $('div.expansion').append("<div class='longtitle' style='left:" + wx + 'px; top:' + (wy + 40) + "px;'>" + strng + '</div>')
    $('div.longtitle').fadeIn('slow')
  }
}

// remove tree and overlay when Escape key is pressed
$(document).keyup(function (e) {
  if (e.keyCode == 27) { // esc
	 // e.preventDefault();
	 // e.stopPropagation();
	 // if( e.isDefaultPrevented() ) { console.log("Esc pressed and default prevented: "+ e.isDefaultPrevented());}
	 // if( e.isPropagationStopped() ) { console.log("Esc pressed and bubbling up prevented: "+ e.isPropagationStopped());}
	  $('div.expansion, div.dimmer2, div#wait4tree').remove()
	  // un-hide applet
	  $('#threeD').css('visibility', 'visible')
  }
})
