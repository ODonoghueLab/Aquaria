<template>
    <autocomplete
    id="protein_syn_input"
    :search="search"
    :get-result-value="getResultValue"
    @submit="handleSubmit"
    ref="autocomplete"
  ></autocomplete>
</template>
<script>
import axios from 'axios'
import * as textpanel from '../../legacy/textpanels'
import * as resizeApp from '../../legacy/resize_app'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

export default {
  name: 'SearchProtein',
  components: {
    Autocomplete
  },
  data () {
    return {
      callbackData: {
        names: [],
        ids: [],
        pdbIDs: []
      },
      cacheProteinSynonyms: {},
      term: null,
      proteinSynonymOrgId: null,
      pdbId: null,
      collectResponsevalues: null
    }
  },
  methods: {
    getResultValue (result) {
      return (result.value + ' (' + result.id + ')')
    },
    clear () {
      this.value = ''
      this.$refs.autocomplete.value = ''
    },
    handleSubmit (result) {
      var _this = this
      var AQUARIA = window.AQUARIA
      if (result.value &&
          result.value.indexOf('No structures for: ') !== 0) {
        var primaryAccession = result.id
        if (primaryAccession.indexOf('/') > -1) {
          var parts = primaryAccession.split('/')
          primaryAccession = parts[0]
          _this.pdbId = parts[1]
        }
        if (result.type === 'PDB') {
          console.log('AQUARIA.proteinAutocomplete.select pdb', result.value)
          AQUARIA.blankAll(true, 'Waiting for data...')
          //   var chain = null
          var url = `${window.BACKEND}/getAccessionForPDB/${result.value}`
          axios({
            method: 'get',
            url: url
          })
            .then(function (response) {
              const accessionObject = response.data
              AQUARIA.loadAccession([accessionObject.Accession], result.value, null, false, accessionObject.Accession)
            })
        } else if (result.id === AQUARIA.protein_primary_accession) {
          if (result.value === AQUARIA.preferred_protein_name) {
            AQUARIA.blankAll(false)
            // do nothing
          } else {
            console.log('AQUARIA.proteinAutocomplete.select same protein, different name', result.value)

            AQUARIA.preferred_protein_name = result.value
            url = `${window.BACKEND}/getProteinSynonyms/${AQUARIA.protein_primary_accession};`
            axios({
              method: 'get',
              url: url
            })
              .then(function (response) {
                textpanel.displayProtSynonyms(response.data)
              })
          }
        } else {
          document.querySelector('#protein_syn_input').placeholder = result.value
          document.querySelector('#protein_syn_input').value = ''
          AQUARIA.blankAll(true, 'Waiting for data...')
          AQUARIA.loadAccession([primaryAccession], _this.pdbId, null, false, result.value)
        }
      } else {
        event.preventDefault()
      }
    },
    search (input) {
      var AQUARIA = window.AQUARIA
      var _this = this
      _this.term = input
      _this.callbackData.LRU = _this.getLRU()
      return new Promise(resolve => {
        if (_this.term === '') {
          _this.collectResponse()
          if (_this.collectResponsevalues) {
            resolve(_this.collectResponsevalues)
          }
        } else {
          resizeApp.startLogoSpin()
          _this.proteinSynonymOrgId = _this.term + '%' + AQUARIA.Organism.ID
          if (_this.proteinSynonymOrgId in _this.cacheProteinSynonyms) {
            resolve(_this.cacheProteinSynonyms[_this.proteinSynonymOrgId])
            return
          };
          document.querySelector('.autocomplete-result-list').style.maxHeight = '390px'
          var url = `${window.BACKEND}/queryProtein/${_this.term}/${AQUARIA.Organism.ID}`
          axios({
            method: 'get',
            url: url
          })
            .then(function (response) {
              const data = response.data
              if (!isNaN(parseInt(_this.term.charAt(0)))) {
                _this.pdbCallback(data)
                if (_this.collectResponsevalues) {
                  resolve(_this.collectResponsevalues)
                }
              } else {
                if (data.length > 0) {
                  if (data[0].isID === 0) {
                    _this.nameCallback(data)
                    if (_this.collectResponsevalues) {
                      resolve(_this.collectResponsevalues)
                    }
                  } else {
                    _this.idCallback(data)
                  }
                } else {
                  if (data.isID === 0) {
                    _this.nameCallback(data)
                    if (_this.collectResponsevalues) {
                      resolve(_this.collectResponsevalues)
                    }
                  } else {
                    _this.idCallback(data)
                    if (_this.collectResponsevalues) {
                      resolve(_this.collectResponsevalues)
                    }
                  }
                }
              }
            })
        }
      })
    },
    getLRU: function () {
      return window.AQUARIA.proteinTopTen.getAll().map(function (item) {
        return {
          label: item.name,
          suffix: item.primary_accession + ', ' + item.pdb_id,
          value: item.name,
          type: 'LRU',
          category: 'Recent',
          id: item.primary_accession + '/' + item.pdb_id
        }
      })
    },
    collectResponse: function () {
      var _this = this
      var lruMatches = _this.callbackData.LRU
      if (lruMatches.length > 0 && _this.term && _this.term.length > 0) {
        lruMatches = lruMatches.filter(function (val) {
          return val.label.toLowerCase().startsWith(_this.term.toLowerCase())
        })
      }
      var showPopup = true
      var allValues = lruMatches.concat(_this.callbackData.names).concat(_this.callbackData.ids).concat(_this.callbackData.pdbIDs)
      if (allValues.length === 0) {
        if (_this.term && _this.term.length > 0) {
          allValues = [{
            label: 'No structures for: ' + _this.term,
            value: 0
          }]
        } else {
          showPopup = false
        }
      }
      _this.cacheProteinSynonyms[_this.proteinSynonymOrgId] = allValues
      if (showPopup) {
        _this.collectResponsevalues = allValues
      }
    },
    // Autocomplete for gene name
    nameCallback: function (nameData) {
      var labelValues
      var _this = this
      labelValues = nameData.map(function (item) {
        return {
          label: item.Synonym,
          suffix: null,
          value: item.Synonym,
          type: 'Synonym',
          category: 'Names',
          id: item.Primary_Accession,
          organism: item.Organism_ID
        }
      })
      labelValues.sort(function (a, b) {
        return a.label > b.label ? 1 : -1
      })
      labelValues.reduce(function (previous, current) {
        var a = previous
        var b = current
        if (a && a.value === b.value) {
          if (a.dup) {} else {
            a.suffix = a.id
            a.dup = true
          }
          if (b.dup) {

          } else {
            b.suffix = b.id
            b.dup = true
          }
        }
        return current
      }, null)
      _this.callbackData.names = labelValues
      _this.collectResponse()
      resizeApp.stopLogoSpin()
    },
    // Autocomplete for Primary Accession
    idCallback: function (idData) {
      var _this = this
      var labelValues
      labelValues = idData.map(function (item) {
        var suffix = item.Source_Field
        if (suffix === 'AC' || suffix === 'ID') {
          suffix = 'UniProt'
        }
        return {
          label: item.Synonym,
          suffix: suffix,
          value: item.Synonym,
          type: suffix,
          category: 'Identifiers',
          id: item.Primary_Accession
        }
      })
      labelValues.sort(function (a, b) {
        return a.label > b.label ? 1 : -1
      })
      _this.callbackData.ids = labelValues
      _this.collectResponse()
      resizeApp.stopLogoSpin()
    },
    // Autocomplete for PDB
    pdbCallback: function (pdbData) {
      var _this = this
      var labelValues
      labelValues = pdbData.map(function (item) {
        return {
          label: item.Synonym,
          suffix: 'PDB',
          type: 'PDB',
          value: item.Synonym,
          category: item.Category,
          id: item.Synonym
        }
      })
      _this.callbackData.pdbIDs = labelValues
      _this.collectResponse()
      resizeApp.stopLogoSpin()
    }
  }
}
</script>
