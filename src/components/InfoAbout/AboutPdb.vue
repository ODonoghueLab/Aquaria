<template>
    <!-- About PDB -->
    <div id="Structure" class="panel overlay about level4">
        <div id="description" data-intro="PDB summary for the shown structure." data-position="bottom">
        <span class="content" id="description" data-intro="PDB summary for the shown structure." data-position="bottom">
            <span id="biounitDisplay" style="display: none;">
                <span id="biounitLeft" style="display: inline-block;" title="Navigate to other assemblies">&lt;</span>
                &nbsp;<span id="biounitType" style="display: inline-block;">biounit</span>
                &nbsp;<span id="biounitCount" style="display: inline-block;">x/x</span>
                &nbsp;
                <span id="biounitRight" style="display: inline-block;" title="Navigate to other assemblies">&gt;</span>
                <a id="helpBiounit" href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/biological-assemblies#Anchor-BioUnit" target="_blank" title="Go to PDB to view explanation of assembly">
                    <span class="help roundButton"> </span>
                </a>
            </span>
            <span id="aboutPDBHider" style="display: none;" data-intro="PubMed Information about PDB structure" data-position="left">
                <p id="classification">Classification unavailable</p>
                <h4 id="reference_title">Title unavailable</h4>
                <p id="reference_link"><a href="#">PubMed Link unavailable</a></p>
                <p id="molecule" title="View this structure in Aquaria" data-intro="Information about currently focused PDB chain." data-position="left">
                    <strong>Molecule: </strong>
                    <span class="text">unavailable</span>
                </p>
            </span>
            <p id="organism"><strong>Organism: </strong><span class="text">unavailable</span></p>
            <p id="small_molecules"><strong>Small molecules: </strong><span class="text">unavailable</span></p>
            <p id="method"><strong>Method: </strong><span class="text">unavailable</span></p>
            <p id="resolution"><strong>Resolution: </strong><span class="text">unavailable</span></p>
            <p id="pdb"><strong>Protein Data Bank: </strong><span class="text">unavailable</span></p>
        </span>
      </div>
    </div>
</template>
<script>
export default {
  name: 'AboutPdb'
}
</script>

<style scoped>
#aboutPDBHider{
    height: 350px;
    overflow: scroll;
}

#description span.content {
    height: fit-content;
    overflow: hidden;
    display: block;
}
div.panel span.content, div.panel p {
    padding: 0 6px;
}
div.panel span, span.section {
    display: inline;
}

span.explanation a {
    color: #6df;
    text-decoration: none;
}

div.panel span#biounitDisplay {
    color: #555;
    padding: 2px 0;
    /* background-image: -webkit-linear-gradient(top, #ccc, #aaa); */
}

#biounitLeft {
    background: transparent url('../../assets/images/ar-le.png') no-repeat center;
}
#biounitRight {
    background: transparent url('../../assets/images/ar-ri.png') no-repeat center;
}
#biounitLeft, #biounitRight {
    cursor: pointer;
    color: transparent;
    width: 16px;
    text-align: center;
}

div.panel span.help {
    display: inline-block;
    width: 17px;
    height: 17px;
    background: url('../../assets/images/UI-help.png') no-repeat 0px 0px;
    margin-left: 8px;
}

div.panel h4#reference_title {
    padding: 0 6px;
}
</style>
