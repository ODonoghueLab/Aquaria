<template>
    <!-- Draggable DIV -->
    <div id="popup" v-observer:subtree.childList="handler" class='level3'>
    <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
    <!-- <div id="mydivheader">
    </div> -->
      <div id='vueBased' class='balloon'>
        <span class="x">&nbsp;</span>
        <p v-html="$store.state.popupTitle">  </p>
        <p v-html="$store.state.popupText">  </p>
        <div class='aaLightBg'>
          <div v-for='aaCode in oneAaCodes' v-bind:key='aaCode' :id="'divVarInfo_' + aaCode">
            {{ aaCode }}
            <p v-for='dataStr in $store.state.variantResidues[126][aaCode]' v-bind:key='dataStr' v-html="dataStr">
            </p>
            Structures with mutation: {{ getPdbCount(126, aaCode) }}
          </div>
          <hr class='anAaHr'>
          <div id='divPosInfo'>
            <b> Residue 126 </b>
            <p v-for='(arrObj, keyStr) in $store.state.variantResidues[126]["positionInfo"]' v-bind:key='keyStr'>
              <span v-html='keyStr'></span>:
              <span v-for='dataStr in arrObj' v-bind:key='dataStr' v-html='dataStr'>
              </span>
            </p>
            Strcutures with mutation: {{ getTotalPdbCount(126) }}
          </div>
        </div>
      </div>
        <p id='popuptext'>Pop-up text box component for features</p>
        <!-- <TreeView v-show="showTree" id='treeView' class='level5'/> -->
        <img v-bind:src="popupTail" id='popupTail' @click="showTreeView" v-bind:myprop='data.variantStructs'>
        <!-- Variant structures: {{ $store.state.variantStructs }} -->
        Popup title: {{ $store.state.popupTitle }}
    </div>
</template>

<script>
// import $ from 'jquery'
// import TreeView from '../MatchingStructures/TreeView'
import observer from 'vue-mutation-observer'
import ExpandableTextLine from 'vue-expandable-text-line'
import * as Panels from '../AquariaLayout/helpers/hidePanels'
// import store from '../../store/index'

import Vue from 'vue'
export default {
  name: 'PopUp',
  // components: {
  //   TreeView
  // },
  data () {
    return {
      popupTail: require('../../assets/img//popupTail.png'),
      expandTextLine: [],
      showTree: false,
      oneAaCodes: ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
    }
  },
  filters: {
    structCntAa (obj) {
      return 0
    }
  },
  computed: {
    data () {
      return {
        // variantStructs: store.state.variantStructs,
        popupTitle: this.$store.state.popupTitle
      }
    }
  },
  directives: {
    observer
  },
  mounted () {
    this.dragElement(document.getElementById('popup'))
  },
  methods: {
    getTotalPdbCount: function (resNum) {
      let totalNumStructs = 0
      for (let i = 0; i < this.oneAaCodes.length; i++) {
        console.log('Testing ' + this.oneAaCodes[i])
        if (Object.prototype.hasOwnProperty.call(this.$store.state.variantStructs[resNum], this.oneAaCodes[i]) && Object.prototype.hasOwnProperty.call(this.$store.state.variantStructs[resNum][this.oneAaCodes[i]], 'pdbs')) {
          console.log('Testing ')
          totalNumStructs = totalNumStructs + this.$store.state.variantStructs[resNum][this.oneAaCodes[i]].pdbs.length
        }
      }
      console.log(this.$store.state.variantStructs[resNum])
      return totalNumStructs
    },
    getPdbCount: function (resNum, aa) {
      console.log('Testing 1 2 3')
      // let count = 0
      if (Object.prototype.hasOwnProperty.call(this.$store.state.variantStructs[resNum], aa) && Object.prototype.hasOwnProperty.call(this.$store.state.variantStructs[resNum][aa], 'pdbs')) {
        return this.$store.state.variantStructs[resNum][aa].pdbs.length
      }
      return 0
    },
    showTreeView: function () {
      this.showTree = true
      Panels.overlay()
      document.querySelector('div.dimmer').className += ' level4'
      document.querySelector('div.dimmer').addEventListener('click', function () {
        Panels.RemoveOverlay()
      })
    },
    handler: function () {
      this.dragElement(document.getElementById('popup'))

      /*
      draggable="true" ondragstart=\"event.preventDefault();event.stopPropagation();\"
      */
      const ExpandableTextLineCtor = Vue.extend(ExpandableTextLine)
      const oneAaCodes = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']
      const b = document.getElementsByTagName('toReplace_varInfo')
      console.log('The number of nodes to remove are: ' + b.length)

      const b2 = document.getElementsByTagName('toReplace_posInfo')
      if (b2.length > 0) {
        var posInfoDiv = document.getElementById('divVI_posInfo')
        for (let j = 0; j < b2.length; j++) {
          const componentinstance = new ExpandableTextLineCtor({ data: function () { return { p: b2[j].innerHTML } }, propsData: { useClick: true } })
          // console.log(componentinstance)

          componentinstance.$mount()
          componentinstance.$el.innerHTML = b2[j].innerHTML
          posInfoDiv.appendChild(componentinstance.$el)
          this.expandTextLine.push(componentinstance)
        }
        document.getElementById('balloon').appendChild(document.getElementById('divVariantInfo'))
        // Add the chosen VarInfo div.
        document.getElementById('divVariantInfo').appendChild(document.getElementById('divVI_chosen'))
        // Add the posInfo div.
        document.getElementById('divVariantInfo').appendChild(document.getElementById('divVI_posInfo'))

        // Add btns.
        document.getElementById('balloon').appendChild(document.getElementById('buttons_eachAa'))
        // Attach events to btns.
        for (let k = 0; k < oneAaCodes.length; k++) {
          if (document.getElementById('btnVI_' + oneAaCodes[k])) {
            document.getElementById('btnVI_' + oneAaCodes[k]).addEventListener('click', function () {
              // Change heading amino acid.
              let a = document.getElementById('span_missenseHeading').innerHTML
              if (a.match(/[a-zA-Z\*\?]+\)/)) { // eslint-disable-line no-useless-escape
                a = a.replace(/[a-zA-Z\*\?]+\)/, oneAaCodes[k] + ')') // eslint-disable-line no-useless-escape
              } else {
                a = a.replace(/\)/, oneAaCodes[k] + ')')
              }

              document.getElementById('span_missenseHeading').innerHTML = a
              // Hide clicked button, and unhide any other button
              hideClickedUnhideOthrs(oneAaCodes[k])
              // document.getElementById('divVI_chosen').appendChild(document.getElementById('divVI_varInfo_' + oneAaCodes[k]))
              // Move clicked aa div to chosen, and move any other div already in chosen back down
              moveAndShowClickedDivAa(oneAaCodes[k])
            })
          }
        }
      }
      for (let i = 0, len = b2.length; i !== len; ++i) {
        b2[0].parentNode.removeChild(b2[0])
      }
      for (let i = 0; i < oneAaCodes.length; i++) {
        if (document.getElementsByTagName('toReplace_varInfo_' + oneAaCodes[i])) {
          const anAaToReplace = document.getElementsByTagName('toReplace_varInfo_' + oneAaCodes[i])
          if (anAaToReplace.length > 0) {
            if (document.getElementById('divVI_varInfo_' + oneAaCodes[i])) {
              var varInfoDivAnAa = document.getElementById('divVI_varInfo_' + oneAaCodes[i])
              // console.log('Popup vue anAaDiv ')
              // console.log(varInfoDivAnAa)
              for (let j = 0; j < anAaToReplace.length; j++) {
                const componentinstance = new ExpandableTextLineCtor({ data: function () { return { p: anAaToReplace[j].innerHTML } }, propsData: { useClick: true } })
                componentinstance.$mount()
                componentinstance.$el.innerHTML = anAaToReplace[j].innerHTML
                // console.log('anAaToReplace[j] ' + anAaToReplace[j].innerHTML)
                varInfoDivAnAa.appendChild(componentinstance.$el)
                this.expandTextLine.push(componentinstance)
              }
              document.getElementById('divVI_varInfo').appendChild(document.getElementById('divVI_varInfo_' + oneAaCodes[i]))

              for (let l = 0, len = anAaToReplace.length; l !== len; ++l) {
                anAaToReplace[0].parentNode.removeChild(anAaToReplace[0])
              }
              handleInitVar()
            }
          }
        }
      }

      function hideClickedUnhideOthrs (clickedAa) {
        for (let i = 0; i < oneAaCodes.length; i++) {
          if (clickedAa === oneAaCodes[i]) {
            if (document.getElementById('btnVI_' + clickedAa)) {
              // document.getElementById('btnVI_' + clickedAa).style.display = 'none'
              document.getElementById('btnVI_' + clickedAa).classList.add('selCol')
              // document.querySelector('.selCol').addEventListener('click', function () {
              //   console.log('this')
              //   _this.showTree = true
              // })
            }
          } else {
            if (document.getElementById('btnVI_' + oneAaCodes[i])) {
              // document.getElementById('btnVI_' + oneAaCodes[i]).style.display = 'inline'
              document.getElementById('btnVI_' + oneAaCodes[i]).classList.remove('selCol')
            }
          }
        }
      }

      function moveAndShowClickedDivAa (selAa) {
        for (let i = 0; i < oneAaCodes.length; i++) {
          if (selAa === oneAaCodes[i]) {
            // console.log('It comes down here!')
            if (document.getElementById('divVI_varInfo_' + selAa)) {
              document.getElementById('divVI_chosen').appendChild(document.getElementById('divVI_varInfo_' + selAa))
            }
          } else {
            if (document.getElementById('divVI_varInfo_' + oneAaCodes[i])) {
              document.getElementById('divVI_varInfo').appendChild(document.getElementById('divVI_varInfo_' + oneAaCodes[i]))
            }
          }
        }
      }

      function handleInitVar () {
        if (document.getElementById('span_missenseHeading')) {
          let a = document.getElementById('span_missenseHeading').innerHTML
          a = a.replace(/[()]+/g, '')
          const arr = a.split(' → ')

          if (arr.length > 1) {
            hideClickedUnhideOthrs(arr[1])
            moveAndShowClickedDivAa(arr[1])
          }
        }
      }
    },
    dragElement: function (elmnt) {
      var pos1 = 0; var pos2 = 0; var pos3 = 0; var pos4 = 0
      if (document.getElementById(elmnt.id + 'header')) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        // elmnt.onmousedown = dragMouseDown
      }

      function dragMouseDown (e) {
        e = e || window.event
        e.preventDefault()
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
      }

      function elementDrag (e) {
        e = e || window.event
        e.preventDefault()
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
        elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
      }

      function closeDragElement () {
        // stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
      }
    }
  }
}
</script>

<style scoped>
    #popup {
    display: none;
    position: absolute;
    text-align: left;
    max-width: 90%;
    }

    #popuptext{
    background-color: #666666;
    color: white;
    margin-top: 0px;
    border-radius: 12px;
    margin-bottom: 0px;
    }
    #popupTail {
        margin-top: -6px;
    }
</style>

<style>

  .expandable {
    margin: 8px 0px;
    /* cursor: ns-resize; */
  }
  .expandable-text-line {
    cursor: s-resize !important;
  }
  .expandable-text-line.__extl-expanded{
    cursor: n-resize !important;
  }
  #popuptext a{
    color: var(--background);
  }
  .anAaHr {
    border-top: 0.5px solid #929192;
  }
  .btnAaBold {
    border: none;
    background-color: inherit;
    cursor: pointer;
    color: #929192 !important;
    padding-left: 3.5px;
    padding-right: 3.5px;
    display: inline;
  }
  .btnAaBold_b {
    border: none;
    background-color: inherit;
    cursor: pointer;
    color: #a6a5a6 !important;
    padding-left: 3.5px;
    padding-right: 3.5px;
    display: inline;
  }

  .selCol {
    color: var(--text) !important;
    background-color: var(--primary-highlight);
    border-radius: 25%;
  }

  /*
  .selCol:hover {
    background-color: var(--primary-link);
  }
  #title span a:active, #title span a.active {
    background-color: var(--primary-highlight);
  }
  */

  .pAaColor {
    display: inline;
    color: #929192 !important;
  }
  .aaLightBg {
    background-color: #7f7e7f;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .btnAaBold:hover {
    background-color: var(--primary-link);
  }

  .btnAaBold_b:hover {
    background-color: var(--primary-link);
  }

  /* Add this via class to link.
  a:link {
    color: #d5d4d5;
    text-decoration: underline;
  }
  */
  /*
  .theCursor{
    cursor: context-menu;
  }
*/
</style>
