<template>
    <!-- Draggable DIV -->
    <div id="popup" v-observer:subtree.childList="handler">
    <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
    <!-- <div id="mydivheader">
    </div> -->
    <!-- expandable-text-line use-click>This is some expandable text line mate blabh blahbl balbhal balbhalkao asldfjasoekne;qleisoel.</expandable-text-line -->
    <p id='popuptext' width="400px">Pop-up text box component for features</p>
    <img v-bind:src="popupTail" id='popupTail'>
    </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import $ from 'jquery'
import observer from 'vue-mutation-observer'
import ExpandableTextLine from 'vue-expandable-text-line'
import Vue from 'vue'

export default {
  name: 'PopUp',
  components: {
    ExpandableTextLine
  },
  data () {
    return {
      popupTail: require('../../assets/img/popupTail.png'),
      expandTextLine: []
    }
  },
  directives: {
    observer
  },
  mounted () {
    this.dragElement(document.getElementById('popup'))
  },
  methods: {
    handler: function () {
      const ExpandableTextLineCtor = Vue.extend(ExpandableTextLine)

      const b = document.getElementsByTagName('toReplace_varInfo')
      console.log('The number of nodes to remove are: ' + b.length)

      if (b.length > 0) {
        var varInfoDiv = document.getElementById('divVI_varInfo')
        for (let j = 0; j < b.length; j++) {
          const componentinstance = new ExpandableTextLineCtor({ data: function () { return { p: b[j].innerHTML } }, propsData: { useClick: true } })
          // console.log(componentinstance)

          componentinstance.$mount()
          componentinstance.$el.innerHTML = b[j].innerHTML
          varInfoDiv.appendChild(componentinstance.$el)
          this.expandTextLine.push(componentinstance)
        }
        document.getElementById('balloon').appendChild(document.getElementById('divVI_varInfo'))
      }
      for (let i = 0, len = b.length; i !== len; ++i) {
        b[0].parentNode.removeChild(b[0])
      }

      // const a2 = document.getElementById('divVI_otherResInfo')
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
        document.getElementById('balloon').appendChild(document.getElementById('divVI_posInfo'))
      }
      for (let i = 0, len = b2.length; i !== len; ++i) {
        b2[0].parentNode.removeChild(b2[0])
      }

      const b3 = document.getElementsByTagName('toReplace_otherResInfo')
      if (b3.length > 0) {
        var otherResInfo = document.getElementById('divVI_otherResInfo')
        for (let j = 0; j < b3.length; j++) {
          const componentinstance = new ExpandableTextLineCtor({ data: function () { return { p: b3[j].innerHTML } }, propsData: { useClick: true } })
          // console.log(componentinstance)

          // console.log('Nice day: ' + b3[j].innerHTML)
          componentinstance.$mount()
          componentinstance.$el.innerHTML = b3[j].innerHTML
          otherResInfo.appendChild(componentinstance.$el)
          this.expandTextLine.push(componentinstance)
        }
        document.getElementById('balloon').appendChild(document.getElementById('divVI_otherResInfo'))
      }
      for (let i = 0, len = b3.length; i !== len; ++i) {
        b3[0].parentNode.removeChild(b3[0])
      }
    },
    dragElement: function (elmnt) {
      var pos1 = 0; var pos2 = 0; var pos3 = 0; var pos4 = 0
      if (document.getElementById(elmnt.id + 'header')) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown
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
    z-index: 9;
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
