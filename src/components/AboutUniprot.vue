<template>
    <!-- <div class="panel" id="about" data-intro="UniProt summary of the specified protein's function." data-position="right">
    </div> -->
        <!-- <h3>About <span class="explanation"> Uniprot ID</span></h3> -->
        <div id="uniProtDesc"></div>
</template>

<script>
export default {
  name: 'AboutUniprot'
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
    padding: 0px 10px;
  }

</style>
