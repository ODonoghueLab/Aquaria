<template>
    <div id="featurelist"></div>
</template>

<script>
export default {
  name: 'FeatureList',
  methods: {}
}
</script>

<style>
#featurelist{
  overflow: scroll;
  margin-bottom: -10px;
  width: 100vw;
}
#groupedFeatures{
    margin-left: 6px;
  }

div.featureHeader{
  display: inline-flex;
  width: 100%;
  background: rgb(204, 204, 204);
  padding-bottom: 6px;
  height: fit-content;
  max-height: 30px;
}

div.featureHeader p{
  cursor: pointer;
}

.featureName{
  font-size: calc(15px + 0.2vw);
  padding-left: 8px;
  color: #5a5959;
  margin: 9px;
}

div.featureHeader .info{
  font-size: calc(10px + 0.2vw);
  padding: 0px 5px 8px 5px;
  color: #5a5959;
  background-color: white;
  border-radius: 12px;
  height: 15px;
  margin-top: 10px;
  position: relative;
}

/* Tooltip text */
span.tooltiptext {
  visibility: hidden;
  width: fit-content;
  max-width: 38vw;
  min-width: 25vw;
  background-color: #fff;
  color: black;
  text-align: left;
  padding: 5px 10px;
  border-radius: 6px;
  /* Position the tooltip text - see examples below! */
  position: fixed;
  z-index: 1;
  overflow-wrap: break-word;
  margin-top: -5px;
  left: 22vw;
}

/* Show the tooltip text when you mouse over the tooltip container */
/* .info:hover span.tooltiptext {
  visibility: visible;
  } */

h3.infoHeader{
  background-color: white;
  color: black;
}

#remove{
  margin-left: auto;
  margin-right: 4px;
  height: 19px;
  margin-right: 10px;
}

/* #share{
  height: 19px;
  margin-right: 10px;
} */

.featureButtons{
  margin-top: 10px;
  background: #777777;
  color: #e8e2e2;
  border-radius: 10px;
  padding-top: 0px;
  cursor: pointer;
}

.featureButtons{
  visibility: hidden;
}

  div.featureTrack{
  display: none;
  background: none;
  height: fit-content;
}

#classification a{
  color: #9a9999;
  font-size: 14px;
}

#classification{
  padding-top: 5px;
}

#classification:hover > a{
  color: #08C;
  font-size: 14px;
}

.track > p{
  text-align: left;
  margin-left: 10px;
}

</style>
