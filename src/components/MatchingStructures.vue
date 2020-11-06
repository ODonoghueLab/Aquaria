<template>
  <!-- <span class="content toggled" id="vis"> -->
  <span id="vis">
    <div id='allclusters' data-intro='Visual summary of all structures in PDB matching the specified protein, grouped by region of match.' data-position='left'></div>
  </span>
</template>

<script>
// import d3 from 'd3'
export default {
  name: 'MatchingStructures',
  data () {
    return {
      clusters: window.AQUARIA.structures2match.clusters
    }
  }
  // mounted () {
  //   // scale start and end coordinates
  //   var that = window.AQUARIA.showMatchingStructures
  //   var cluster = this.clusters
  //   var s = that.rank
  //   // var member = cluster.members[0]
  //   var pdbChain = cluster.pdb_chain[0]
  //   // //var repeat_domain = data.Repeat_domains[0];

  //   if (cluster.secondary_structure.length === 0 || cluster.secondary_structure[0].length === 0) {
  //     console.log('ClusterRenderer.drawClusterContainer error: cannot draw cluster as it has no secondary structure: ', cluster)
  //     return
  //   }

  //   var structStart = this.xScale(cluster.secondary_structure[0][0].start)
  //   var structEnd = this.xScale(cluster.secondary_structure[0][cluster.secondary_structure[0].length - 1].end)
  //   // console.log ("structStart: " + structStart + ", structEnd: " +
  //   // structEnd);
  //   var id = cluster.pdb_id.toLowerCase() + '_' + s
  //   this.clustSize = cluster.cluster_size
  //   // ///var cluster_nbr = s;
  //   var identityScore = cluster.alignment_identity_score
  //   // set padding for labels
  //   var pad = 0
  //   if (this.clustSize > 99) {
  //     pad = 8
  //   }
  //   if (this.clustSize > 999) {
  //     pad = 18
  //   }
  //   if (this.clustSize < 10) {
  //     pad = -6
  //   }

  //   var outerdiv = d3.select('#allclusters').append('div').attr('id', 'out_' + id).attr(
  //     'class', 'outer_container')
  //   outerdiv.append('svg').attr('width', 40).attr('height', 40).attr('viewBox',
  //     '0 0 40 40').attr('preserveAspectRatio', 'none')
  //   // add identity percentage
  //     .append('text').attr('text-anchor', 'end').attr('class', 'percentage').attr(
  //       'x', 28).attr('y', 26).text(identityScore + '%')

  //   // draw outline of the whole chain
  //   this.nusvg = outerdiv.append('div').attr('id', 'c_' + id).attr('class',
  //     'container').append('svg').attr('width', this.width + 200).attr('height',
  //     this.height + 30)
  //     .attr('viewBox', '0 0 ' + (this.width + 200) + ' ' + (this.height + 30)).attr(
  //       'preserveAspectRatio', 'none')

  //   this.nusvg.append('g').attr('id', 'structure_' + id).attr('transform',
  //     'translate(' + (window.AQUARIA.margin.left + structStart) + ',20)').on(
  //     'mouseover', function () {
  //       return d3.select(this).call(that.mouseover, that)
  //     }).on('mouseout', function () {
  //     return d3.select(this).call(that.mouseout, that)
  //   }).append('rect') // background shape for cluster size label
  //     .attr('transform', 'translate(' + (structEnd - structStart - 5) + ',5)')
  //     .attr('class', 'handle').attr('width', 32 + pad).attr('height', 16).attr(
  //       'rx', 6)

  //   this.nusvg.select('g#structure_' + id).append('g').attr('class', 'cluster').attr(
  //     'title',
  //     'Click to load ' + id.substr(0, 4) + ', chain ' + pdbChain + ' into structure view. Compared to the specified protein, this structure has ' + identityScore + '% sequence identity. ').attr('width', structEnd - structStart + 2)
  //     .attr('height', 26).on('click', function () {
  //       return d3.select(this.parentNode).call(function (d) {
  //         console.log('ClusterRenderer.nusvg.select clicked! ' + d)
  //         that.onClusterItemClick(d)
  //       })
  //     })

  //   this.nusvg.select('g#structure_' + id + ' g.cluster').append('rect').attr('class',
  //     'cluster').attr('width', structEnd - structStart + 3).attr('height', 26)
  //     .attr('rx', 6)

  //   // add center line
  //   this.nusvg.select('g#structure_' + id + ' g.cluster').append('rect').attr('width',
  //     structEnd - structStart).attr('height', 1).attr('transform',
  //     'translate(0,13)').attr('class', 'insertion')

  //   // add thumbnail images
  //   this.addThumbnails(id, structStart, structEnd, pad)

  //   this.nusvg.select('g#structure_' + id).append('text') // label for cluster size
  //     .attr('text-anchor', 'end').attr('fill', 'white').attr('x',
  //       (structEnd - structStart + 24 + pad)).attr('y', 13).attr('dx', -3) // padding-right
  //     .attr('dy', '.35em') // vertical-align: middle)

  //   var clickTitle = 'Click to see ' + that.clustSize + ' structures in this cluster'
  //   this.nusvg.select('g#structure_' + id + ' text, g#structure_' + id).attr('class',
  //     'expandable').attr('title',
  //     clickTitle)

  //   this.nusvg.select('g#structure_' + id + ' text').on(
  //     'click', function () {
  //       that.onTextClick(d3.select(this.parentNode), that.cluster)
  //     })

  //   outerdiv()
  // }
}
</script>

<style>
 /* #vis {
    min-height: 200px;
    padding: 2px;
    position: relative;
  } */
  #vis{
    max-height: 40vh;
    overflow: scroll;
    /* margin-bottom: -54px; */
    margin-bottom: -20px;
    width: 100vw;
  }
  .outer_container{
    display: inline-flex;
  }

  div[data-id="structurematches"].chardinjs-helper-layer.chardinjs-top {
    border-top: 0 none;
  }

  div[data-id="structurematches"] .chardinjs-tooltip.chardinjs-top:after {
    height: 0;
    width: 0;
    display: none;
  }

  /**** SVG styles ****/
  svg {
    font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
  }

  .container>svg {
    display: block;
    position: relative;
    top: -13px;
  }

  line,
  path {
    fill: none;
    /*stroke: #000;*/
  }

  line.connector {
    stroke: #808080;
  }

  .minor :not(.minor) {
    display: none;
  }

  .SHEET rect,
  .HELIX rect,
  .COIL rect,
  polygon {
    /*shape-rendering: geometric-precision;*/
    stroke-width: 0.6px;
  }

  .SHEET polygon,
  .SHEET rect {
    fill: #f6c719;
    stroke: #f6c719;
  }

  .SHEET polygon.conserved,
  .SHEET rect.conserved {
    fill: #998436;
    stroke: #998436;
  }

  .SHEET polygon.nonconserved,
  .SHEET rect.nonconserved {
    fill: #4d4d4d;
    stroke: #4d4d4d;
  }

  .HELIX rect {
    fill: #6491b6;
    stroke: #6491b6;
  }

  .HELIX rect.conserved {
    fill: #586c7c;
    stroke: #586c7c;
  }

  .HELIX rect.nonconserved {
    fill: #4d4d4d;
    stroke: #4d4d4d;
  }

  .COIL rect {
    fill: #6f9e52;
    stroke: #6f9e52;
  }

  .COIL rect.conserved {
    fill: #5d724f;
    stroke: #5d724f;
  }

  .COIL rect.nonconserved {
    fill: #4d4d4d;
    stroke: #4d4d4d;
  }

  .COIL rect.insertion,
  .HELIX rect.insertion,
  .SHEET rect.insertion,
  rect.insertion {
    fill: #ACACAC;
    stroke: #ACACAC;
    stroke-width: 0.25px;
  }

  rect.handle text {
    color: white;
  }

  rect.handle {
    fill: #888;
    stroke: none;
  }

  text.percentage {
    font-size: 11px;
    fill: #777;
  }

  /*div.outer_container:hover*/
  text.percentage:hover {
    fill: #333333;
  }

  text.expandable:hover,
  g.expandable.active text:hover {
    cursor: pointer;
  }

  g.active rect.cluster,
  g.active line,
  g.active g.thumbnail circle {
    stroke: orange;
  }

  g.expandable.active rect.handle {
    fill: orange;
  }

  .active rect:hover {
    cursor: pointer;
  }

  rect.cluster {
    fill: #CCC;
    stroke: #808080;
    stroke-width: 1px;
  }

  g.active rect.cluster {
    fill: #FFF;
  }

  g.loaded rect.cluster {
    fill: #FFF;
    stroke: #333;
  }

  g.x line.tick {
    stroke: #666;
  }

  g.x.minor line.tick {
    stroke: #AAA;
  }

  g.x text {
    font-size: 10px;
    fill: #999;
  }

  g.x path.domain {
    fill: none;
    stroke: black;
    opacity: 0.5;
  }

  .node circle {
    cursor: pointer;
    fill: #fff;
    stroke: steelblue;
    stroke-width: 1.5px;
  }

  path.link {
    fill: none;
    stroke: #888888;
    stroke-width: 1.5px;
  }

  .expansion text {
    fill: #fff;
  }

  /******** features *****/

  div.track:nth-child(even) {
    background: #D6D6D6;
  }

  div.track svg:hover {
    background: #E9E9E9;
    cursor: pointer;
  }

  div.panel span.source {
    display: inline-block;
    font-size: 80%;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #999;
    margin-left: 1em;
  }

  /********** PSSH VIEW ***********/

  div.panel#structureviewer.fullscreen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  span#threeD.threedcontent.fullscreen {
    height: 100%;
  }

  div.container {
    height: 40px;
  }

  div.container:hover {
    background: #D6D6D6;
  }

  svg rect.bg {
    fill: none;
  }

  /*div*/
  .loaded {
    background: #DEDEDE;
  }

  svg.loaded rect.bg {
    fill: #EEE;
    cursor: pointer;
  }

  /*div*/
  .loaded:hover {
    background: #EEE;
  }

  svg.loaded rect.bg:hover {
    fill: #FFF;
  }

  div#wait4tree {
    position: relative;
    z-index: 100;
  }

  div.expansion {
    position: absolute;
    width: 0px;
    z-index: 102;
  }

  div.expansion div.longtitle,
  div.longtitle {
    background: #555;
    border-radius: 8px;
    box-shadow: 3px 3px 6px #222;
    color: white;
    display: none;
    padding: 8px;
    position: absolute;
    width: 300px;
    z-index: 103;

  }

  .blank {
    background: black;
    height: 100%;
    position: absolute;
    top: 0;
    opacity: 0.68;
    -moz-opacity: 0.68;
    width: 100%;
    z-index: 90;
  }

  /* div.dimmer {
    background: #5E5E5E ;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    opacity: 0.77;
    -moz-opacity: 0.68;
    width: 100%;
    z-index: 3;
  } */

  div.panel span.help {
    display: inline-block;
    width: 17px;
    height: 17px;
    background: url(../../public/images/UI-help.png) no-repeat 0px 0px;
    margin-left: 8px;
  }

  .fakelink:hover,
  span.applauncher:hover,
  span#expander:hover span#threedSwitcher:hover {
    cursor: pointer;
    background-position: 0px -21px;
  }

  /*div.panel span.help:hover { background-position: 0px -16px; cursor: pointer; }*/

  div.balloon {
    background: #666;
    border-radius: 10px;
    color: #CCC;
    padding: 8px;
  }

  div.balloon p {
    margin: 0 0 6px 0;
  }

  div.balloon p a {
    color: #6AF;
  }

  /*
div.balloon p.quality { border-radius: 6px; padding:6px;}

div.balloon p.quality.twilight { background: #455; color: #CC3; }

div.balloon p.quality.high { background: #555; color: #DFF; }
*/
  div.balloon h3 {
    background-color: #999;
    margin-bottom: 1em;
  }

  div.popup.top div.balloon {
    border-radius: 16px;
    box-shadow: 0px 2px 16px #555;
    cursor: -moz-grab;
    cursor: -webkit-grab;
    cursor: grab;
    padding-left: 14px;
  }

  div.popup.top div.balloon:active {
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }

  .windows div.popup.top div.balloon {
    border-radius: 0;
  }

  div.popup {
    background: url(../../public/images/point.png) no-repeat center bottom;
    display: none;
    padding: 0 0 14px 0;
    position: absolute;
    width: 320px;
    z-index: 999;
  }

  div.popup.top {
    background: transparent none;
  }

  div.large-ppi-diagram {
    position: absolute;
    width: 400px;
    z-index: 100;
  }

  span.x {
    background: url(../../public/images/UI-close.png) no-repeat;
    display: block;
    float: right;
    height: 18px;
    width: 18px;
  }

  span.x:hover {
    background-position: 0 -21px;
    cursor: pointer;
  }

  /*new stuff from david*/

  path.arc {
    cursor: move;
    fill: #fff;
  }

  .proteinNode,
  .complexNode {
    font-size: 10px;
  }

  .proteinNode:hover,
  .complexNode:hover {
    fill: #1f77b4;
  }

  .ppiLink {
    fill: none;
    stroke: #1f77b4;
    stroke-opacity: .4;
    pointer-events: none;
  }

  .ppiLink.source,
  .ppiLink.target {
    stroke-opacity: 1;
    stroke-width: 2px;
  }

  .proteinNode.target,
  .complexNode.target {
    fill: #d62728 !important;
  }

  .ppiLink.source {
    stroke: #d62728;
  }

  .proteinNode.source,
  .complexNode.source {
    fill: #2ca02c;
  }

  .ppiLink.target {
    stroke: #2ca02c;
  }
</style>
