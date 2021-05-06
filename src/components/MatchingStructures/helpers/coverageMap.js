import d3 from 'd3'
export function RenderMap (cluster, rank) {
  this.width = document.getElementById('structure-viewer').offsetWidth //* 0.996 // - window.AQUARIA.margin.right - window.AQUARIA.margin.left
  this.height = 40 - window.AQUARIA.margin.top - window.AQUARIA.margin.bottom + 35 // height
  var seqLength = window.AQUARIA.showMatchingStructures.sequence.length
  this.xScale = d3.scale.linear().domain([1, seqLength]).range([0, this.width + 1]) // .range([1, width]);
  // this.onTextClick = onTextClick
  this.clustSize = 0
  this.rank = rank
  this.cluster = cluster
  var element = '#selectedCluster'
  var container = this.drawClusterContainer(cluster, rank, element)
  if (typeof container !== 'undefined') {
    this.drawCluster(cluster, rank)
  }
}
export function updateCluster (clusterToUpdate) {
  var that = this
  this.cluster = clusterToUpdate
  this.clustSize = clusterToUpdate.cluster_size
  var id = this.cluster.pdb_id.toLowerCase() + '_' + this.rank
  if (typeof this.nusvg !== 'undefined') {
    this.nusvg.select('g#structure_' + id + ' text')
      .text(function () {
        return that.clustSize
      })
  }
}
export function drawClusterContainer (cluster, s, element) {
  // scale start and end coordinates
  // //var repeat_domain = data.Repeat_domains[0];
  var _this = this
  if (cluster.secondary_structure.length === 0 || cluster.secondary_structure[0].length === 0) {
    console.log('ClusterRenderer.drawClusterContainer error: cannot draw cluster as it has no secondary structure: ', cluster)
    return
  }
  var seqLength = window.AQUARIA.showMatchingStructures.sequence.length
  // var myScale = d3.scale.linear().domain([1, seqLength]).range([1, document.getElementById('structure-viewer').offsetWidth / 1.2 - window.AQUARIA.margin.right - window.AQUARIA.margin.left - 5])
  var structStart = cluster.secondary_structure[0][0].start
  var structEnd = cluster.secondary_structure[0][cluster.secondary_structure[0].length - 1].end + 1
  window.AQUARIA.coverageMapsrw = (_this.xScale(structEnd - structStart))/(structEnd - structStart)
  var id = cluster.pdb_id.toLowerCase() + '_' + s
  this.clustSize = cluster.cluster_size
  var outerdiv = d3.select(element).append('div').attr('id', 'out_' + id)
    .attr('class', 'coverage_map_container')
  // draw outline of the whole chain
  this.nusvg = outerdiv.append('div').attr('id', 'c_' + id)
    .attr('class', 'coveragemap').append('svg')
    .attr('width', this.width)
    .attr('height', this.height + 30)
    .attr('viewBox', '0 0 ' + (this.width + 4) + ' ' + (this.height + 30))
    .attr('preserveAspectRatio', 'none')
  // add center line
  this.nusvg.append('rect')
    .attr('width', this.width)
    .attr('height', 1)
    .attr('transform', 'translate(0,53)')
    .attr('class', 'insertion')
  this.nusvg.append('g')
    .attr('id', 'structure_' + id)
    .attr('transform', 'translate(' + _this.xScale(structStart) + ',40)')
  // .append('rect') // background shape for cluster size label
  // .attr('transform', 'translate(' + (structEnd - structStart - 5) + ',5)')
  // .attr('class', 'handle').attr('width', 32 + pad).attr('height', 16).attr(
  //   'rx', 6)
  this.nusvg.select('g#structure_' + id).append('g').attr('class', 'cluster').attr('height', 26)
  this.nusvg.select('g#structure_' + id + ' g.cluster').append('rect').attr('class',
    'cluster').attr('width', _this.xScale(structEnd - structStart)).attr('height', 26)
    .attr('rx', 6)
  // this.nusvg.select('g#structure_' + id).append('text') // label for cluster size
  //   .attr('text-anchor', 'end').attr('fill', 'white').attr('x',
  //     (structEnd - structStart + 24 + pad)).attr('y', 13).attr('dx', -3) // padding-right
  //   .attr('dy', '.35em') // vertical-align: middle)
  return outerdiv
}
export function drawCluster (cluster, rank) {
  var that = this
  cluster.secondary_structure[0].forEach(function (d, index) {
    // convert strings to numbers
    d.start = +d.start
    d.end = +d.end // console.log(d.type +" "+index+", from "+d.start+" to
    // "+d.end);
    // draw the secondary structure, etc.
    that.drawResidues(cluster, rank, d)
  })
  this.setConservation(cluster)
}
export function drawResidues (cluster, rank, el) {
  var _this = this
  var seqLength = window.AQUARIA.showMatchingStructures.sequence.length
  var myScale = d3.scale.linear().domain([1, seqLength]).range([1, document.getElementById('structure-viewer').offsetWidth / 1.2 - window.AQUARIA.margin.right - window.AQUARIA.margin.left - 5])
  var offset = cluster.secondary_structure[0][0].start
  var thickness = 0
  for (var n = el.start; n <= el.end; n++) {
    var conservation = cluster.conservationArray[0][n]
    if (n !== el.end && conservation === cluster.conservationArray[0][n + 1]) {
      thickness++
      continue
    }
    // console.log("Thickness is " + thickness)
    var translateVal = n - offset - thickness
    var rect_id = 'g#structure_' + cluster.pdb_id.toLowerCase() + '_' + rank + ' g.cluster';
    var g_id = 'r_' + rank + '_' + n
    var rect = this.nusvg.select(rect_id)
      .append('g')
      .attr('class', 'residue ' + el.type)
      .attr('id', g_id)
      .attr('transform', 'translate(' + translateVal * AQUARIA.coverageMapsrw + ',8)')
      .append('rect')
      .attr('class', conservation)
      .attr('width', window.AQUARIA.coverageMapsrw * (thickness + 1))
      .attr('height', 10)
      // var rect = this.nusvg.select(
      //   'g#structure_' + cluster.pdb_id.toLowerCase() + '_' + rank + ' g.cluster').append('g').attr('class', 'residue ' + el.type)
      //   .attr('id', 'r_' + rank + '_' + n).attr('transform',
      //     'translate(' + this.xScale(n - offset - thickness) + ',8)')
      //   .append('rect').attr('class', conservation).attr('width',
      //     this.xScale(thickness + 1)).attr('height', 10)
      // if (data.conservationArray[n] === 'conserved') {
      // rect.attr("class", "conserved");
      // }
      if (el.type === 'SHEET') {
        rect.attr('height', 14).attr('transform', 'translate(0,-2)')
        if (n === el.end) {
          rect.attr('width', AQUARIA.coverageMapsrw * thickness)
          //      }
          this.nusvg.select('g.residue#r_' + rank + '_' + n).append('svg:polygon')
            .attr('class', conservation).attr('transform',
              'translate(' + AQUARIA.coverageMapsrw * thickness + ',0)').attr(
              'points', AQUARIA.coverageMapsrw+ ',0 0,-6 0,16 ' + AQUARIA.coverageMapsrw + ',10')
          // this.nusvg.select("g.residue#r_"+rank+"_"+n+" rect").remove();
        } else {
          // console.log(' not at the end:' + n);
        }
      }
      if (el.type === 'HELIX') {
        this.nusvg.select('g.residue#r_' + rank + '_' + n + ' rect')
          .attr('height', 16).attr('class', conservation).attr('transform',
            'translate(0,-3)')
      }
      thickness = 0
  }
  /*
  // for each residue, draw one rectangle with a unique position id, so we can
  // assign a class/status later
  var offset = cluster.secondary_structure[0][0].start
  var thickness = 0
  console.log("Element start and end " + cluster.pdb_id + " " + el.start + " " + el.end)
  console.log(cluster)
  console.log(el)
  for (var n = el.start; n <= el.end; n++) {
    var conservation = cluster.conservationArray[0][n]
    if (n !== el.end && conservation === cluster.conservationArray[0][n + 1]) {
      thickness++
      continue
    }
    // console.log("Thickness is " + thickness)
    var rect = this.nusvg.select(
      'g#structure_' + cluster.pdb_id.toLowerCase() + '_' + rank + ' g.cluster').append('g').attr('class', 'residue ' + el.type)
      .attr('id', 'r_' + rank + '_' + n).attr('transform',
        'translate(' + (n - offset - thickness) * window.AQUARIA.srw + ',8)')
      .append('rect').attr('class', conservation).attr('width',
        window.AQUARIA.srw * (thickness + 1)).attr('height', 10)
    // if (data.conservationArray[n] === 'conserved') {
    // rect.attr("class", "conserved");
    // }
    if (el.type === 'SHEET') {
      rect.attr('height', 14).attr('transform', 'translate(0,-2)')
      if (n === el.end) {
        rect.attr('width', window.AQUARIA.srw * (thickness))
        //      }
        this.nusvg.select('g.residue#r_' + rank + '_' + n).append('svg:polygon')
          .attr('class', conservation).attr('transform',
            'translate(' + (window.AQUARIA.srw * thickness) + ',0)').attr(
            'points', window.AQUARIA.srw + ',0 0,-6 0,16 ' + window.AQUARIA.srw + ',10')
        // this.nusvg.select("g.residue#r_"+rank+"_"+n+" rect").remove();
      } else {
        // console.log(' not at the end:' + n);
      }
    }
    if (el.type === 'HELIX') {
      this.nusvg.select('g.residue#r_' + rank + '_' + n + ' rect')
        .attr('height', 16).attr('class', conservation).attr('transform',
          'translate(0,-3)')
    }
    thickness = 0
  }
  */
}
export function setConservation (data) { // console.log("setting conservation
  var insertions = []
  for (var i = 0; i < data.seq_end.length - 1; i++) {
    var gap = []
    gap[0] = data.seq_end[i] + 1
    gap[1] = data.seq_start[i + 1] - 1
    insertions.push(gap) // console.log("insertion: " + gap.toString());
  }
}
