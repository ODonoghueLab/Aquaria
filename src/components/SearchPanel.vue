<template>
    <div class="panel" id="searchByName">
        <h3>Specify a Protein</h3>
        <span class="content">
              <form id="myform"
                    name="myform"
                    ACTION="#"
                    method="post">
                <p id="input1"><input class="search"
                                      type="text"
                                      id="protein_syn_input"
                                      name="protein_syn_input"
                                      placeholder="Protein name/ID"
                                      autocomplete="on"
                                      data-intro="START HERE - specify a protein name (or UniProt identifier, or PDB ID), then press 'Enter'."
                                      data-position="right" /></p>
                <div id='psyns'>
                  <p>(example: <a href="#" v-on:click="fillin('p53')">p53</a> or <a href="#" v-on:click="fillin('P04637');">P04637</a>)</p>
                </div>
                <div style="display:none;"
                     id='gsyns'>
                  <p>&nbsp;</p>
                </div>
                <p id="input2"><input class="search"
                                      type="text"
                                      id="organism_syn_input"
                                      name="organism_syn_input"
                                      placeholder="Organism"
                                      autocomplete="on"
                                      data-intro="Enter an organism name (human is default)."
                                      data-position="right" /></p>
                <div id='osyns'>
                  <p>&nbsp;</p>
                </div>
                <!--<input type="hidden" id="organismid" name="organismid" value="9606"/>-->
              </form>
      </span></div>

</template>

<script>

export default {
  name: 'SearchPanel',
  methods: {
    fillin: function (term) {
      document.getElementById('protein_syn_input').value = term
      setTimeout(function () {
        window.location.href = '/P04637'
      }, 300)
    }
  }
}
</script>

<style>
    /* #searchByName{
        background: aliceblue;
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

    span.content{
        padding: 0 6px;
    }

    #myform{
        visibility: visible;
        position: relative;
    } */
</style>
