<template>
    <div class="panel">
        <a href="#" class="close" @click="closeTab"></a>
        <div id="featurelist"></div>
    </div>
</template>
<script>
import * as Panels from '../AquariaLayout/helpers/hidePanels'
export default {
  name: 'Features',
  methods: {
    closeTab: function () {
      // document.querySelector('div.tabs').style.bottom = '50px'
      Panels.hidePanels()
    }
  }
}
</script>

<style>
.complete{
  display:none;
}

.more{
  background:lightblue;
  color:navy;
  font-size:13px;
  padding:3px;
  cursor:pointer;
}

#featurelist{
  overflow:  scroll;
  margin-bottom:  -100px;
  width:  100vw;
  max-height: 80vh;
  background: var(--primary-tab);
}
#groupedFeatures{
  margin-left:  6px;
  }

div.featureHeader{
  display:  inline-flex;
  width:  100%;
  background:  rgb(204,  204,  204);
  padding-bottom:  6px;
  height:  fit-content;
  max-height:  30px;
}

div.featureHeader  p{
  cursor:  pointer;
}

.featureName{
  font-size:  calc(15px  +  0.2vw);
  padding-left:  8px;
  color:  #5a5959;
  margin:  9px;
}

div.featureHeader  .info{
  font-size:  calc(10px  +  0.2vw);
  padding:  0px  5px  8px  5px;
  color:  #5a5959;
  background-color:  white;
  border-radius:  12px;
  height:  15px;
  margin-top:  10px;
  position:  relative;
}

/*  Tooltip  text  */
span.tooltiptext  {
  visibility:  hidden;
  width:  fit-content;
  max-width:  38vw;
  min-width:  25vw;
  background-color:  #fff;
  color:  black;
  text-align:  left;
  padding:  5px  10px;
  border-radius:  6px;
  /*  Position  the  tooltip  text  -  see  examples  below!  */
  position:  fixed;
  z-index:  1;
  overflow-wrap:  break-word;
  margin-top:  -5px;
  left:  22vw;
}

/*  Show  the  tooltip  text  when  you  mouse  over  the  tooltip  container  */
/*  .info:hover  span.tooltiptext  {
  visibility:  visible;
  }  */

h3.infoHeader{
  background-color:  white;
  color:  black;
}

#remove{
  margin-left:  auto;
  margin-right:  4px;
  height:  19px;
  margin-right:  10px;
}

/*  #share{
  height:  19px;
  margin-right:  10px;
}  */

.featureButtons{
  margin-top:  10px;
  background:  #777777;
  color:  #e8e2e2;
  border-radius:  10px;
  padding-top:  0px;
  cursor:  pointer;
}

.featureButtons{
  visibility:  hidden;
}

div.featureTrack{
  display:  none;
  background:  none;
  height:  fit-content;
}

#classification  a{
  color:  #9a9999;
  font-size:  14px;
}

#classification{
  padding-top:  5px;
}

#classification:hover  >  a{
  color:  #08C;
  font-size:  14px;
}

.track  >  p{
  text-align:  left;
  margin-left:  10px;
}

div.balloon  {
  background:  #666;
  border-radius:  10px;
  color:  #CCC;
  padding:  8px;
}

div.balloon  p  {
  margin:  0  0  6px  0;
}

div.balloon  p  a  {
  color:  #6AF;
}

div.balloon  h3  {
  background-color:  #999;
  margin-bottom:  1em;
  }

div.balloon{
  overflow: scroll;
  max-height: 800px;
}

div.popup.top  div.balloon  {
  border-radius:  16px;
  box-shadow:  0px  2px  16px  #555;
  cursor:  -moz-grab;
  cursor:  -webkit-grab;
  cursor:  grab;
  padding-left:  14px;
}

div.popup.top  div.balloon:active  {
  cursor:  -moz-grabbing;
  cursor:  -webkit-grabbing;
  cursor:  grabbing;
}

.windows  div.popup.top  div.balloon  {
  border-radius:  0;
}

div.popup  {
  background:  url(../../../public/images/point.png)  no-repeat  center  bottom;
  display:  none;
  padding:  0  0  14px  0;
  position:  absolute;
  width:  320px;
  z-index:  999;
}

.highcharts-figure,  .highcharts-data-table  table  {
  min-width:  100px;
  max-width:  150px;
  margin:  1em  auto;
}

.highcharts-data-table  table  {
  font-family:  Verdana,  sans-serif;
  border-collapse:  collapse;
  border:  1px  solid  #EBEBEB;
  margin:  10px  auto;
  text-align:  center;
  width:  150px;
  max-width:  200px;
}

.highcharts-data-table  caption  {
  padding:  1em  0;
  font-size:  1.2em;
  color:  #555;
}

.highcharts-data-table  th  {
  font-weight:  600;
  padding:  0.5em;
}

.highcharts-data-table  td,  .highcharts-data-table  th,  .highcharts-data-table  caption  {
  padding:  0.5em;
}

.highcharts-data-table  thead  tr,  .highcharts-data-table  tr:nth-child(even)  {
  background:  #f8f8f8;
}

.highcharts-data-table  tr:hover  {
  background:  #f1f7ff;
}

.column  {
  float:  left;
  width:  25%;
  padding:  2px;
  display:  inline-block;
  /*  border:1px  solid  orange;  */
  width:  105px;
  height:  130px;
  font-size:11px;
}

/*  Clear  floats  after  image  containers  */
.row::after  {
  content:  "";
  clear:  both;
  display:  table;
}

.popupTitle  {
  font-weight:  bold;
}

.popupText  {
  padding-top:  5px;
}
</style>
