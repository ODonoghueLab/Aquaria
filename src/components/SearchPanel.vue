<template>
    <div id="searchByName">
      <v-app>
    <v-card>
      <v-card-text>
        Search Proteins
      </v-card-text>
      <v-card-text>
        <v-autocomplete
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search2"
          color="white"
          hide-no-data
          hide-selected
          item-text="Description"
          item-value="API"
          placeholder="Specify an organism"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!model"
          color="grey darken-3"
          @click="model = null"
        >
          Clear
          <v-icon right>
            mdi-close-circle
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
            <p>Search proteins</p>
              <form id="myform"
                    name="myform"
                    ACTION="#"
                    method="post">
                <img v-bind:src="search"/>
                <p id="input2"><input class="search"
                                      type="text"
                                      id="organism_syn_input"
                                      name="organism_syn_input"
                                      placeholder="Specify an organism"
                                      autocomplete="on"
                                      data-intro="Enter an organism name (human is default)."
                                      data-position="right"
                                      size="12"
                                      />
                                      </p>
                <p id="input1"><input class="search"
                                      type="text"
                                      id="protein_syn_input"
                                      name="protein_syn_input"
                                      placeholder="Protein name/ID"
                                      autocomplete="on"
                                      data-intro="START HERE - specify a protein name (or UniProt identifier, or PDB ID), then press 'Enter'."
                                      data-position="right"
                                      size="12" /></p>
                                     <p>&nbsp;</p>
                <!--<input type="hidden" id="organismid" name="organismid" value="9606"/>-->
              </form>
      <!-- </span> -->
      </div>

</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import * as textpanel from '../legacy/textpanels'
import * as resizeApp from '../legacy/resize_app'
export default {
  name: 'SearchPanel',
  data () {
    return {
      search: require('../assets/img/search_dark.png'),
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search2: null,
      items: ['Florida', 'Georgia', 'Nebraska', 'California', 'New York']
    }
  },
  mounted () {
    var AQUARIA = window.AQUARIA
    // set up autocomplete for organism names
    var OrganismSynonyms = {}
    $('#organism_syn_input').autocomplete({
      source: function (request, response) {
        resizeApp.startLogoSpin()
        var labelValues
        var term = request.term
        if (term in OrganismSynonyms) {
          response(OrganismSynonyms[term])
          return
        };

        var url = `${window.BACKEND}/getQueryOrganism/${term}`
        axios({
          method: 'get',
          url: url
        })
          .then(function (res) {
            const data = res.data
            // AQUARIA.remote.queryOrganism(term,
            // resize_appstopLogoSpin();
            if (data.length > 0) {
              labelValues = $.map(data, function (item) {
                return {
                  label: item.Synonym,
                  value: item.Synonym,
                  id: item.Organism_ID
                }
              })

              OrganismSynonyms[term] = labelValues
            } else {
              labelValues = {
                label: 'No organisms for: ' + term,
                value: 0
              }
            }
            response(labelValues)
          })
      },
      // focus : function() {
      // AQUARIA.blankAll(true);
      // },
      close: function (event, ui) {
        if (event.handleObj.type === 'menuselect') { // user selected an item
          // handled in select()
        } else if (event.handleObj.type === 'keydown' && event.keyCode === $.ui.keyCode.ESCAPE) { // user escaped
          $(this).val('')
          AQUARIA.blankAll(false)
        }
      },
      minLength: 1,
      delay: 100,
      mustMatch: true,
      autoFocus: true,
      select: function (event, ui) {
        if (ui.item.value &&
          ui.item.value.indexOf('No organisms for: ') !== 0) {
          if (ui.item.id !== AQUARIA.Organism.ID) {
            const url = `${window.BACKEND}/getOrganismSynonyms`
            axios({
              method: 'get',
              url: url,
              params: {
                organism_id: AQUARIA.Organism.ID
              }
            })
              .then(function (response) {
                const orgNames = response.data
                AQUARIA.Organism.ID = ui.item.id
                localStorage.preferred_organism_name = ui.item.value
                textpanel.displayOrgSynonyms(orgNames)
              })

            // AQUARIA.remote.getOrganismSynonyms([{
            //   "organism_id": ui.item.id
            // }],

            AQUARIA.loadAccession(null)
            $('#protein_syn_input').focus()
          }
        } else {
          event.preventDefault()
        }
      }
    })
    // .on('focus', function() {
    //  $("#organism_syn_input").val(localStorage.preferred_organism_name);
    //  AQUARIA.blankAll(true, "Please specify an organism.");
    //  //$(this).autocomplete("search");
    //  $(this).select();
    // }).on('input', function() {
    //   AQUARIA.blankAll(true, "Please specify an organism.");
    // });

    // $("#organism_syn_input").autocomplete();
    // set up autocomplete for protein names
  },
  methods: {
    fillin: function (term) {
      document.getElementById('protein_syn_input').value = term
      setTimeout(function () {
        window.location.href = '/P04637'
      }, 300)
    },
    selectOrganism: function (event) {

    },
    placeholderText: function (organism, protein) {
      var orgInput = document.querySelector('#organism_syn_input')
      var protInput = document.querySelector('#protein_syn_input')
      orgInput.placeholder = organism
      orgInput.setAttribute('size', orgInput.getAttribute('placeholder').length)
      protInput.placeholder = protein
      protInput.setAttribute('size', protInput.getAttribute('placeholder').length)

      $('#organism_syn_input').focus(function () {
        $(this).attr('placeholder', 'Specify an organism')
        orgInput.setAttribute('size', orgInput.getAttribute('placeholder').length)
      }).blur(function () {
        $(this).attr('placeholder', organism)
        orgInput.setAttribute('size', orgInput.getAttribute('placeholder').length)
      })

      $('#protein_syn_input').focus(function () {
        $(this).attr('placeholder', 'Specify a protein')
        protInput.setAttribute('size', protInput.getAttribute('placeholder').length)
      }).blur(function () {
        $(this).attr('placeholder', protein)
        protInput.setAttribute('size', protInput.getAttribute('placeholder').length)
      })
    }
  }
}
</script>

<style>
#searchByName {
  width: 100%;
}
#searchByName img{
    height: calc(0.25rem + 2vh);
    margin: 8px 0 0 2px;
    padding-left: 4px;
}
#myform{
  display: flex;
  background: white;
  border: 1px solid var(--background);
  padding: 2px 0;
  width: 100%;
  justify-content: flex-start;
}

#input1, #input2{
  display: inline;
  padding: 4px;
  margin: 0;
}

input[type=search].ui-autocomplete-loading {
    background: white url('../../public/images/ui-anim_basic_16x16.gif') right center no-repeat;
  }
.contents p {
  margin: 0.5em 0;
}
  div.auto_complete {
    width: 150px;
    background: #fff;
  }

  div.auto_complete ul {
    border: 1px solid #888;
    margin: 0;
    padding: 0;
    /* width: 100%; */
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
    z-index: 40;
    border: none;
    color: #333333;
    padding: 0.2rem 0.5rem;
    font-size: 0.9rem;
  }
  #input2 input {
    border-radius: 1rem;
    background: var(--background);
  }
  .ui-autocomplete ul {
    max-width: 30rem;
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
    width: 30em;
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
    background: #BBDDEE;
    max-width: 15rem;
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
