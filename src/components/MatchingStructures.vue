<template>
  <span class="content toggled" id="vis"></span>
</template>

<script>
export default {
  name: 'MatchingStructures'
}
</script>

<style scoped>
  span{
      width: 20vw;
  }
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
</style>
