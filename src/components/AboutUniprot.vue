<template>
    <div class="panel" id="about" data-intro="UniProt summary of the specified protein's function." data-position="right">
        <h3>About <span class="explanation"> Uniprot ID</span></h3>
        <div id="uniProtDesc"></div>
      </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'AboutUniprot',
  created () {
    var pdbid = '2xwc'
    $('#description h3 span.explanation').html("<a href='http://www.rcsb.org/pdb/explore.do?structureId=" + pdbid + "' title='Go to PDB'>PDB " + pdbid + '</a>')
  }
}
</script>

<style scoped>
  div.panel{
    width: 240px;
  }
  .panel h3{
  background-color: #999;
  border-radius: 10px;
  color: white;
  font-size: 100%;
  font-weight: normal;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 2px 3px 2px 10px;
  margin: 0px;
  }

  div#uniProtDesc {
  height: 300px;
  overflow: hidden;
  }
</style>
