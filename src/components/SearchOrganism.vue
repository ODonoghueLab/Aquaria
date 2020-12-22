<template>
    <div>
        <!-- <p id="input2"><input class="search"
                                      type="text"
                                      id="organism_syn_input"
                                      name="organism_syn_input"
                                      placeholder="Specify an organism"
                                      autocomplete="on"
                                      data-intro="Enter an organism name (human is default)."
                                      data-position="right"
                                      size="12"
                                      />
                                      </p> -->
    <autocomplete
    id="organism_syn_input"
    :search="search"
    :get-result-value="getResultValue"
    @submit="handleSubmit"
    ref="autocomplete"
  ></autocomplete>
    </div>
</template>
<script>
import axios from 'axios'
import * as textpanel from '../legacy/textpanels'
import * as resizeApp from '../legacy/resize_app'
// import $ from 'jquery'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

export default {
  components: {
    Autocomplete
  },
  data () {
    return {
      OrganismSynonyms: {}
    }
  },
  name: 'SearchOrganism',
  methods: {
    getResultValue (result) {
      return result.value
    },
    handleSubmit (result) {
      var AQUARIA = window.AQUARIA
      if (result.value &&
          result.value.indexOf('No organisms for: ') !== 0) {
        if (result.id !== AQUARIA.Organism.ID) {
          const url = `${window.BACKEND}/getOrganismSynonyms`
          axios({
            method: 'get',
            url: url,
            params: {
              organism_id: result.id
            }
          })
            .then(function (response) {
              const orgNames = response.data
              AQUARIA.Organism.ID = result.id
              localStorage.preferred_organism_name = result.value
              textpanel.displayOrgSynonyms(orgNames)
              document.querySelector('#organism_syn_input').setAttribute('size', result.value.length)
            })
        }
      }
    },
    clear () {
      this.value = ''
      this.$refs.autocomplete.value = ''
    },
    search (input) {
      var OrganismSynonyms = this.OrganismSynonyms
      resizeApp.startLogoSpin()
      var labelValues
      var term = input
      this.value = input
      //   const url = `${wikiUrl}/w/api.php?${
      //     params
      //   }&srsearch=${encodeURI(input)}`

      return new Promise(resolve => {
        if (term in OrganismSynonyms) {
          resolve(OrganismSynonyms[term])
          return
        };
        if (term !== '') {
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
                labelValues = data.map(function (item) {
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
              document.querySelector('#autocomplete-result-list-1').style.zIndex = 99
              document.querySelector('.autocomplete-result-list').style.maxHeight = '390px'
              resolve(labelValues)
            })
        } else {
          labelValues = {
            label: window.AQUARIA.Organism.Name,
            value: window.AQUARIA.Organism.ID
          }
          resolve(labelValues)
        }
      })
    }
  },
  mounted () {
    // var AQUARIA = window.AQUARIA
    // // set up autocomplete for organism names
    // var OrganismSynonyms = {}
    // $('#organism_syn_input').autocomplete({
    //   source: function (request, response) {
    //     resizeApp.startLogoSpin()
    //     var labelValues
    //     var term = request.term
    //     if (term in OrganismSynonyms) {
    //       response(OrganismSynonyms[term])
    //       return
    //     };

    //     var url = `${window.BACKEND}/getQueryOrganism/${term}`
    //     axios({
    //       method: 'get',
    //       url: url
    //     })
    //       .then(function (res) {
    //         const data = res.data
    //         // AQUARIA.remote.queryOrganism(term,
    //         // resize_appstopLogoSpin();
    //         if (data.length > 0) {
    //           labelValues = $.map(data, function (item) {
    //             return {
    //               label: item.Synonym,
    //               value: item.Synonym,
    //               id: item.Organism_ID
    //             }
    //           })

    //           OrganismSynonyms[term] = labelValues
    //         } else {
    //           labelValues = {
    //             label: 'No organisms for: ' + term,
    //             value: 0
    //           }
    //         }
    //         response(labelValues)
    //       })
    //   },
    //   close: function (event, ui) {
    //     if (event.handleObj) {
    //       if (event.handleObj.type === 'menuselect') { // user selected an item
    //         // handled in select()
    //       } else if (event.handleObj.type === 'keydown' && event.keyCode === $.ui.keyCode.ESCAPE) { // user escaped
    //         $(this).val('')
    //         AQUARIA.blankAll(false)
    //       } else {
    //         AQUARIA.blankAll(false)
    //       }
    //     }
    //   },
    //   minLength: 1,
    //   delay: 100,
    //   mustMatch: true,
    //   autoFocus: true,
    //   select: function (event, ui) {
    //     if (ui.item.value &&
    //       ui.item.value.indexOf('No organisms for: ') !== 0) {
    //       if (ui.item.id !== AQUARIA.Organism.ID) {
    //         const url = `${window.BACKEND}/getOrganismSynonyms`
    //         axios({
    //           method: 'get',
    //           url: url,
    //           params: {
    //             organism_id: ui.item.id
    //           }
    //         })
    //           .then(function (response) {
    //             const orgNames = response.data
    //             AQUARIA.Organism.ID = ui.item.id
    //             localStorage.preferred_organism_name = ui.item.value
    //             textpanel.displayOrgSynonyms(orgNames)
    //             document.querySelector('#organism_syn_input').setAttribute('size', ui.item.value.length)
    //           })

    //         // AQUARIA.remote.getOrganismSynonyms([{
    //         //   "organism_id": ui.item.id
    //         // }],

    //         AQUARIA.loadAccession(null)
    //         $('#protein_syn_input').focus()
    //       }
    //     } else {
    //       event.preventDefault()
    //     }
    //   }
    // })
    // .on('focus', function() {
    //  $("#organism_syn_input").val(localStorage.preferred_organism_name);
    //  AQUARIA.blankAll(true, "Please specify an organism.");
    //  //$(this).autocomplete("search");
    //  $(this).select();
    // }).on('input', function() {
    //   AQUARIA.blankAll(true, "Please specify an organism.");
    // });

    // $('#organism_syn_input').autocomplete()
    // set up autocomplete for protein names
  }
}
</script>
