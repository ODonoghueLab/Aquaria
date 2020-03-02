<template>
    <div id="gallery">
      <div class="panel" id="description" data-intro="PDB summary for the shown structure." data-position="bottom">
        <h3>About <span class="explanation"> PDB</span></h3>
        <span class="content" id="aboutPDB">
            <span id="biounitDisplay"
                  style="display: none;"><span id="biounitLeft"
                                               style="display: inline-block;"
                                               title="Navigate to other assemblies">&lt;</span>&nbsp;<span id="biounitType" style="display: inline-block;">biounit</span>&nbsp;<span id="biounitCount" style="display: inline-block;">x/x</span>&nbsp;<span id="biounitRight"
                                                                                                                                                                                                                                                            style="display: inline-block;" title="Navigate to other assemblies">&gt;</span><a id="helpBiounit" href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/biological-assemblies#Anchor-BioUnit" target="_blank" title="Go to PDB to view explanation of assembly"><span class="help roundButton"> </span></a></span>
                    <span id="aboutPDBHider" style="display: none;" data-intro="PubMed Information about PDB structure" data-position="left">
              <h4 id="reference_title">Title unavailable</h4>
              <p id="reference_link"><a href="#">PubMed Link unavailable</a></p>
              <p class="reference_abstract">Abstract unavailable</p>
              <p id="method"><strong>Determined by: </strong><span class="text">unavailable</span></p> <p>
                              id="molecule"
                              title="View this structure in Aquaria"
                              data-intro="Information about currently focused PDB chain."
                              data-position="left"><strong>Molecule: </strong><span class="text">unavailable</span></p> <p>
                              id="organism"><strong>Organism: </strong><span class="text">unavailable</span></p> </span>
                    </span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Gallery'
}
</script>
