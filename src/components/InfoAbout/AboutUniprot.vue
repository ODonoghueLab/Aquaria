<template>
    <!-- About Uniprot -->
    <div data-intro="UniProt summary of the specified protein's function." data-position="right" class="scrollable">
      <div style="display:none;"
            id='gsyns'>
        <p>Genes: &nbsp;</p>
      </div>
      <div id="uniProtDesc" v-if="uniprotDesc"></div>
        <div v-for="(description, i) in descriptions" :key="i" class='expandable'>
        <expandable-text-line>
          <p><strong>{{description[0]}}</strong> : {{description[1]}}</p>
        </expandable-text-line>
      </div>
    </div>
</template>

<script>
import ExpandableTextLine from 'vue-expandable-text-line'

export default {
  name: 'AboutUniprot',
  components: {
    ExpandableTextLine
  },
  data () {
    return {
      uniprotDesc: null,
      sections: [],
      descriptions: [],
      a: [1, 2, 3],
      tightSections: [],
      desc: null,
      list: []
    }
  },
  mounted () {
    var _this = this
    _this.waitForElement()
  },
  methods: {
    waitForElement: function () {
      var _this = this
      if (!window.AQUARIA.structures2match.sequences) {
        setTimeout(_this.waitForElement, 50)
      } else if (!window.AQUARIA.structures2match.sequences[0]) {
        setTimeout(_this.waitForElement, 50)
      } else {
        _this.uniprotDesc = window.AQUARIA.structures2match.sequences[0].description
        _this.updateUniprotInfo(_this.uniprotDesc)
      }
    },
    updateUniprotInfo: function (info) {
      var _this = this
      _this.list = []
      _this.tightSections = []
      var patt = /\n[A-Z ]+:.*?$/
      function extractLines () {
        if (info && info.length > 0) {
          var match = info.match(patt)
          if (match !== null) {
            _this.sections.unshift(match[0].split(': '))
            info = info.replace(match[0], '')
            extractLines()
          } else {
            _this.sections.unshift(info.split(': '))
          }
        }
      }

      extractLines()
      this.sections.forEach(function (k) {
        // format URLs
        if (k[1].indexOf('URL=') !== -1) { /// /console.log("URL found in section["+k+"]");
          var linkCode = ''; var lhref = ''; var lname = ''; var ltitle = ''
          var parts = k[1].split(';')
          parts.forEach(function (n) { // parts is max. 3 strings (Name, URL, Note)
            n = n.split('=') /// /console.log("parts["+n+"]: "+ parts[n].toString());
            if (n[0].indexOf('URL') !== -1) { lhref = n[1] }
            if (n[0].indexOf('Name') !== -1) { lname = n[1] }
            if (n[0].indexOf('Note') !== -1) { ltitle = n[1] }
          })
          linkCode = '<a href=' + lhref + ' title="' + ltitle + '" target="_blank">' + lname + '</a>' /// /console.log("linkCode: "+linkCode);
          k[1] = linkCode
        }
      })

      function makeLists (fromCollection) { // convert items with the same header to bullet lists:
        var list = null
        for (var n = 0; n < fromCollection.length; n++) {
          if (n < fromCollection.length - 2) {
            var head = fromCollection[n][0]
            var nextHead = fromCollection[(n + 1)][0]
            // if the next header matches the current header, start a bullet list
            if (nextHead === head) {
              if (list === null) { list = '<ul>' }
              list += '<li>' + fromCollection[n][1] + '</li>'
            } else {
              if (list === null) { // no open list
                // since the next header is different, add the current item to the new array
                _this.tightSections.push(fromCollection[n])
              } else { // make a list item, close the list, and add it to the new array
                list += '<li>' + fromCollection[n][1] + '</li></ul>'
                var newList = [head, list]
                _this.tightSections.push(newList)
                list = null
              }
            }
          } else { // n has reached the end of the sections array
            if (list === null) { // no open list
              _this.tightSections.push(fromCollection[n])
            } else {
              list += '<li>' + fromCollection[n][1] + '</li></ul>'
              newList = [head, list]
              _this.tightSections.push(newList)
              list = null
            }
          }
        } /// /console.log(tightSections.toString());
        return _this.tightSections
      }
      var finalList = makeLists(_this.sections)
      finalList.forEach(function (section) {
        var EachSec = ''
        if (section.length > 2) {
          for (var i = 1; i < section.length; i++) {
            EachSec = EachSec + ' ' + section[i]
          }
          section[1] = EachSec
        }
        _this.list.push(section)
      })
      _this.descriptions = _this.list
    }
  }
  // updated () {
  //   var _this = this
  //   // this.sections = window.AQUARIA.structures2match.sequences[0].description
  //   this.updateUniprotInfo(this.uniprotDesc)
  // }
}
</script>

<style scoped>
.expandable {
  margin: 8px 0px;
}
</style>
