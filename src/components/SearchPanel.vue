<template>
    <div id="searchByName">
            <h3>Specify a Protein</h3>
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
                                     <p>&nbsp;</p>
                <p id="input2"><input class="search"
                                      type="text"
                                      id="organism_syn_input"
                                      name="organism_syn_input"
                                      placeholder="Organism"
                                      autocomplete="on"
                                      data-intro="Enter an organism name (human is default)."
                                      data-position="right" /></p>
                <!--<input type="hidden" id="organismid" name="organismid" value="9606"/>-->
              </form>
      <!-- </span> -->
      </div>

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
#myform{
  display: inline-flex;
}

#input1, #input2{
  padding: 4px;
}

input[type=search].ui-autocomplete-loading {
    background: white url('../../public/images/ui-anim_basic_16x16.gif') right center no-repeat;
  }

  div.auto_complete {
    width: 350px;
    background: #fff;
  }

  div.auto_complete ul {
    border: 1px solid #888;
    margin: 0;
    padding: 0;
    width: 100%;
    list-style-type: none;
  }

  div.auto_complete ul li {
    margin: 0;
    padding: 3px;
  }

  div.auto_complete ul li.selected {
    background-color: #ffb;

  }

  div.auto_complete ul strong.highlight {
    color: #800;
    margin: 0;
    padding: 0;
  }

  .auto_complete_identifier {
    color: #79a;
  }

  input {
    z-index: 9;
  }

  .ui-autocomplete ul {
    width: 100%;
    list-style-position: outside;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ui-autocomplete li {
    margin: 0px;
    padding: 2px 5px;
    cursor: default;
    display: block;
    font: menu;
    font-size: 12px;
    line-height: 16px;
    overflow: hidden;
  }

  .ui-autocomplete li.ui-autocomplete-category {
    background: none repeat scroll 0 0 transparent;
    border-top: 2px dotted #fafcff;
    color: #fff;
    float: right;
    font-weight: bold;
    letter-spacing: 0.1em;
    margin-bottom: -20px;
    text-align: right;
    text-transform: uppercase;
    width: 97%;
  }

  .ui-autocomplete li.ui-autocomplete-category:first-child {
    border-top: 0px none;
  }

  .ac_odd {
    background-color: #eee;
  }

  .ac_over {
    background-color: #0A246A;
    color: white;
  }

  .ui-widget-content,
  .ui-widget-header {
    border: 0 none;
    color: inherit;
    font-weight: normal;
  }

  span#tabs.aquaria .ui-widget-content,
  .ui-widget-header {
    background: none;
  }

  .ui-widget {
    font-family: inherit;
    font-size: 103%;
  }

  .ui-state-default a,
  .ui-state-default a:link,
  .ui-state-default a:visited {
    color: #666;
  }

  .ui-state-active,
  .ui-widget-content .ui-state-active,
  .ui-widget-header .ui-state-active,
  .ui-state-default,
  .ui-widget-content .ui-state-default,
  .ui-widget-header .ui-state-default {
    font-weight: normal;
    border: 0px none;
    color: #FFF;

  }

  .ui-state-active a,
  .ui-state-active a:link,
  .ui-state-active a:visited {
    color: #FFF;
  }

  .ui-state-active a:hover {
    color: orange;
  }

  li.ui-menu-item.ui-state-focus {
    background: transparent url(../../public/images/white50.png);
    border-color: #bcd;
    letter-spacing: -0.035em;
  }

  .safari li.ui-menu-item.ui-state-focus {
    font-weight: normal;
    letter-spacing: normal;
  }

  .ui-widget-content {
    background: #BBDDEE none;
  }

  .ui-tabs .ui-tabs-nav li a {
    padding: 0.1em;
    border-left: 1px solid #888;
  }

  .ui-tabs .ui-tabs-nav li.ui-tabs-active {
    margin-bottom: 0;
    padding: 0;
  }

  .ui-corner-all,
  .ui-corner-top,
  .ui-corner-left,
  .ui-corner-tl {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  .ui-tabs .ui-tabs-panel {
    padding: 0;
  }

  .ui-tabs .ui-tabs-nav {
    margin: 0;
    padding: 0;
  }
</style>
