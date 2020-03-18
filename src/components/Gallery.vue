<template>
    <div id="gallery">
      <div class="panel" id="description" data-intro="PDB summary for the shown structure." data-position="bottom">
        <h3>About <span class="explanation"> PDB</span></h3>
        <span class="content" id="description" data-intro="PDB summary for the shown structure." data-position="bottom">
            <span id="biounitDisplay"
                  style="display: none;"><span id="biounitLeft"
                                               style="display: inline-block;"
                                               title="Navigate to other assemblies">&lt;</span>
                                               &nbsp;
                                               <span id="biounitType" style="display: inline-block;">biounit</span>
                                               &nbsp;<span id="biounitCount" style="display: inline-block;">x/x</span>
                                               &nbsp;
                                               <span id="biounitRight" style="display: inline-block;" title="Navigate to other assemblies">&gt;</span>
                                               <a id="helpBiounit" href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/biological-assemblies#Anchor-BioUnit" target="_blank" title="Go to PDB to view explanation of assembly">
                                                <span class="help roundButton"> </span>
                                              </a>
                                          </span>
                    <span id="aboutPDBHider" style="display: none;" data-intro="PubMed Information about PDB structure" data-position="left">
              <h4 id="reference_title">Title unavailable</h4>
              <p id="reference_link"><a href="#">PubMed Link unavailable</a></p>
              <p class="reference_abstract">Abstract unavailable</p>
              <p id="method"><strong>Determined by: </strong><span class="text">unavailable</span></p>
              <p id="molecule" title="View this structure in Aquaria" data-intro="Information about currently focused PDB chain." data-position="left"><strong>Molecule: </strong><span class="text">unavailable</span></p>
              <p id="organism"><strong>Organism: </strong><span class="text">unavailable</span></p> </span>
                    </span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Gallery'
}
</script>

<style scoped>
#gallery{
    width: 100%;
    min-height: 100px;
}
div.panel{
    border: 1px solid rgb(153, 153, 153);
    font-size: 89%;
    height: 35vh;
  }
#aboutPDBHider{
    height: 350px;
    overflow: scroll;
}
#gallery div {
    margin: 2px 0;
}

#description span.content {
    height: 32vh;
    overflow: hidden;
    display: block;
}
#aboutPDB {
    position: relative;
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
    background-image: -webkit-linear-gradient(top, #ccc, #aaa);
}

#biounitLeft {
    background: transparent url('/../public/javascripts/images/ar-le.png') no-repeat center;
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
    background: url(/../public/images/UI-help.png) no-repeat 0px 0px;
    margin-left: 8px;
}

div.panel h4#reference_title {
    padding: 0 6px;
}
</style>
