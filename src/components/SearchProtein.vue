<template>
        <p id="input1"><input class="search"
                                      type="text"
                                      id="protein_syn_input"
                                      name="protein_syn_input"
                                      placeholder="Protein name/ID"
                                      autocomplete="on"
                                      data-intro="START HERE - specify a protein name (or UniProt identifier, or PDB ID), then press 'Enter'."
                                      data-position="right"
                                      size="12" /></p>
</template>
<script>
import axios from 'axios'
import * as textpanel from '../legacy/textpanels'
import * as resizeApp from '../legacy/resize_app'
import $ from 'jquery'
export default {
  name: 'SearchProtein',
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
  mounted () {
    $.widget('custom.catcomplete', $.ui.autocomplete, {
      _create: function () {
        this._super()
        this.widget().menu('option', 'items', '> :not(.ui-autocomplete-category)')
      },
      _renderMenu: function (ul, items) {
        var that = this
        var currentCategory = ''
        $.each(items, function (index, item) {
          var li
          if (item.category && item.category !== currentCategory) {
            ul.append("<li class='ui-autocomplete-category'>" + item.category + '</li>')
            currentCategory = item.category
          }
          li = that._renderItemData(ul, item)
          if (item.category) {
            li.attr('aria-label', item.category + ' : ' + item.label)
          }
        })
      },
      _renderItem: function (ul, item) {
        var label = item.label
        if (item.suffix) {
          label += ' <span class="auto_complete_identifier">(' + item.suffix + ')</span>'
        }
        return $('<li>')
          .append('<a>' + label + '</a>')
          .appendTo(ul)
      }
    })
    //   },
    //   mounted () {
    var AQUARIA = window.AQUARIA
    var _this = this
    var proteinAutocomplete = $('#protein_syn_input')
    proteinAutocomplete.catcomplete({
      source: function (request, outerResponse) {
        _this.term = request.term
        _this.callbackData.LRU = _this.getLRU()
        if (_this.term === '') {
          _this.collectResponse()
          if (_this.collectResponsevalues) {
            outerResponse(_this.collectResponsevalues)
          }
        } else {
          resizeApp.startLogoSpin()
          _this.proteinSynonymOrgId = _this.term + '%' + AQUARIA.Organism.ID
          if (_this.proteinSynonymOrgId in _this.cacheProteinSynonyms) {
            outerResponse(_this.cacheProteinSynonyms[_this.proteinSynonymOrgId])
            return
          };

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
                  outerResponse(_this.collectResponsevalues)
                }
              } else {
                if (data.length > 0) {
                  if (data[0].isID === 0) {
                    _this.nameCallback(data)
                    if (_this.collectResponsevalues) {
                      outerResponse(_this.collectResponsevalues)
                    }
                  } else {
                    _this.idCallback(data)
                  }
                } else {
                  if (data.isID === 0) {
                    _this.nameCallback(data)
                    if (_this.collectResponsevalues) {
                      outerResponse(_this.collectResponsevalues)
                    }
                  } else {
                    _this.idCallback(data)
                    if (_this.collectResponsevalues) {
                      outerResponse(_this.collectResponsevalues)
                    }
                  }
                }
              }
            })
        }
      },

      close: function (event, ui) {
        if (event.handleObj) {
          if (event.handleObj.type === 'blur') { // user selected an item
            // handled in select()
          } else if (event.handleObj.type === 'keydown' && event.keyCode === $.ui.keyCode.ESCAPE) { // user escaped
            $('#organism_syn_input').val('')
            if (typeof AQUARIA.structures2match.Selected_PDB === 'undefined') { // no structure loaded yet, keep panels blanked
              AQUARIA.blankAll(true)
            } else {
              AQUARIA.blankAll(false)
            }
          }
        }
        $(this).val('')
      },
      minLength: 0,
      autoFocus: true,
      delay: 300,
      // user has selected an item from the autocomplete list
      select: function (event, ui) {
        if (ui.item.value &&
          ui.item.value.indexOf('No structures for: ') !== 0) {
          var primaryAccession = ui.item.id
          if (primaryAccession.indexOf('/') > -1) {
            var parts = primaryAccession.split('/')
            primaryAccession = parts[0]
            _this.pdbId = parts[1]
          }
          if (ui.item.type === 'PDB') {
            console.log('AQUARIA.proteinAutocomplete.select pdb', ui.item.value)
            AQUARIA.blankAll(true, 'Waiting for data...')
            var chain = null
            var url = `${window.BACKEND}/getAccessionForPDB/${ui.item.value}/${chain}`
            axios({
              method: 'get',
              url: url
            })
              .then(function (response) {
                const accessionObject = response.data
                AQUARIA.loadAccession([accessionObject.Accession], ui.item.value, null, false, accessionObject.Accession)
              })
            // AQUARIA.remote.getAccessionForPDB(ui.item.value, chain, function(accessionObject) {
            //   AQUARIA.loadAccession([accessionObject.Accession], ui.item.value, null, false, accessionObject.Accession);

            // })
          } else if (ui.item.id === AQUARIA.protein_primary_accession) {
            if (ui.item.value === AQUARIA.preferred_protein_name) {
              AQUARIA.blankAll(false)
              // do nothing
            } else {
              console.log('AQUARIA.proteinAutocomplete.select same protein, different name', ui.item.value)

              AQUARIA.preferred_protein_name = ui.item.value
              // AQUARIA.remote.getProteinSynonyms(AQUARIA.protein_primary_accession, //localStorage.organism_id, displayProtSynonyms, null);
              url = `${window.BACKEND}/getProteinSynonyms/${AQUARIA.protein_primary_accession};`
              axios({
                method: 'get',
                url: url
              })
                .then(function (response) {
                  textpanel.displayProtSynonyms(response.data)
                })
                // Figure out a way to bring currentData
            //   AQUARIA.update3DTitle(AQUARIA.structures2match.source_primary_accession,
            //     currentData.pdb_id, AQUARIA.currentChain, AQUARIA.molecule_name, AQUARIA.currentMember.alignment_identity_score)
            //   AQUARIA.updateDocumentTitle(AQUARIA.currentMember.alignment_identity_score, currentData.pdb_id, AQUARIA.currentChain)
            //   featurelist.updateFeatureTabTitle(AQUARIA.preferred_protein_name)
            }
          } else {
            /// console.log('AQUARIA.proteinAutocomplete.select new protein', ui.item.value);
            document.querySelector('#protein_syn_input').placeholder = ui.item.value
            AQUARIA.blankAll(true, 'Waiting for data...')
            AQUARIA.loadAccession([primaryAccession], _this.pdbId, null, false, ui.item.value)
          }
        } else {
          event.preventDefault()
        }
      }
    })
  },
  methods: {
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
      /// console.log('AQUARIA.proteinAutocomplete received', allValues)
      _this.cacheProteinSynonyms[_this.proteinSynonymOrgId] = allValues
      if (showPopup) {
        _this.collectResponsevalues = allValues
      }
    },
    // Autocomplete for gene name
    nameCallback: function (nameData) {
      var labelValues
      var _this = this
      labelValues = $.map(nameData,
        function (item) {
          return {
            label: item.Synonym,
            suffix: null,
            value: item.Synonym,
            type: 'Synonym',
            category: 'Names',
            id: item.Primary_Accession
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
      labelValues = $.map(idData,
        function (item) {
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
      labelValues = $.map(pdbData,
        function (item) {
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
