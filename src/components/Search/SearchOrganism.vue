<template>
    <div>
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
import * as textpanel from '../../legacy/textpanels'
import * as resizeApp from '../../legacy/resize_app'
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
  }
}
</script>
