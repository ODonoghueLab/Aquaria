<template>
    <div class="panel">
        <a v-bind:href="data.hash" class="close intab" @click="closeTab"></a>
        <div id="vis">
          <div id='allclusters' data-intro='Visual summary of all structures in PDB matching the specified protein, grouped by region of match.' data-position='left'></div>
        </div>
    </div>
</template>

<script>
import * as Panels from '../AquariaLayout/helpers/hidePanels'
import store from '../../store/index'
export default {
  name: 'MatchingStructures',
  data () {
    return {
      clusters: window.AQUARIA.structures2match.clusters
    }
  },
  computed: {
    data () {
      return {
        hash: store.state.hash
      }
    }
  },
  methods: {
    closeTab: function () {
      window.scrollBy(0, 100)
      Panels.hidePanels()
    }
  }
}
</script>

<style>

  #vis {
    max-height: 40vh;
    overflow: scroll;
    /* margin-bottom: -54px; */
    margin-bottom: -55px;
    width: 100vw;
    background: var(--primary-tab);
  }
  div.ruler {
    margin-left: 40px;
  }
  .outer_container{
    display: inline-flex;
  }

  .outer_container svg{
    margin-left: 4px;
  }

  div[data-id="structurematches"].chardinjs-helper-layer.chardinjs-top {
    border-top: 0 none;
  }

  div[data-id="structurematches"] .chardinjs-tooltip.chardinjs-top:after {
    height: 0;
    width: 0;
    display: none;
  }
  #allclusters {
    background-color: var(--background);
    overflow: hidden;
  }
  .panel .close.intab::after { top: -0.1em; }

  /**** SVG styles ****/
  svg {
    font-weight: 400;
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
    fill: #777777;
    stroke: #777777;
    stroke-width: 0.25px;
    opacity: 0.1;
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
.coverage_map_container {
  position: absolute;
  bottom: 0px;
  opacity: 1;
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

  div.panel#structure-viewer.fullscreen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  #threeD.threedcontent.fullscreen {
    height: 100%;
  }

  div.container {
    height: 40px;
    margin-left: -4px;
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

  div.panel span.help {
    display: inline-block;
    width: 17px;
    height: 17px;
    background: url('../../assets/images/UI-help.png') no-repeat 0px 0px;
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
    background: url('../../assets/images/point.png') no-repeat center bottom;
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
    background: url('../../assets/images/UI-close.png') no-repeat;
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
