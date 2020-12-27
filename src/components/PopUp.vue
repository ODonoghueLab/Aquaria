<template>
    <!-- Draggable DIV -->
    <div id="popup" v-observer:subtree.childList="handler">
    <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
    <!-- <div id="mydivheader">
    </div> -->
    <div id="divVariantInfo">Over here?</div>
    <expandable-text-line>This is some expandable text line mate blabh blahbl balbhal balbhalkao asldfjasoekne;qleisoel.</expandable-text-line>
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
      popupTail: require('../assets/img/popupTail.png'),
      expandTextLine: []
    }
  },
  directives: {
    observer
  },
  mounted () {
    this.dragElement(document.getElementById('popup'))
    // this.handler(document.getElementsByTagName('expandable-text-line'))
  },
  updated () {
    // this.dragElement(document.getElementById('popup'))
    // this.handler(document.getElementsByTagName('expandable-text-line'))
  },
  beforeDestry () {
    console.log('WHERN WHEN WHEN WHEN WHEN WHEN WHEN WHEN !!!!! ')
  },
  methods: {
    handler: function () {
      const ExpandableTextLineCtor = Vue.extend(ExpandableTextLine)

      const a = document.getElementById('popup')
      console.log('a is ' + a)
      const b = document.getElementsByTagName('toReplace')
      console.log('The number of nodes to remove are: ' + b.length)

      if (b.length > 0) {
        var componentinstance = new ExpandableTextLineCtor({ data: function () { return { p: 'LORD OF THE RINGS, THE FELLOWSHIP, gandalf the ring cannot stay here. I had a dream that perhaps they must decide how to end it. My people are leaving these shores.' } } })
        console.log(componentinstance)

        // console.log(document.getElementsByTagName('expandable-text-line'))
        componentinstance.$mount()
        componentinstance.$el.innerHTML = 'LORD OF THE RINGS, THE FELLOWSHIP, gandalf the ring cannot stay here. I had a dream that perhaps they must decide how to end it. My people are leaving these shores.'
        document.getElementById('laters').appendChild(componentinstance.$el)
        this.expandTextLine.push(componentinstance)
        // console.log(this.expandTextLine)
        // extendTextLine.append(componentinstance)
        // componentinstance.$mount('#popup') //  componentinstance.$mount('#elementidhere').$mount('#mount')
        // document.getElementById('app').appendChild(component.$el)
        // var $element = a.append('<expandable-text-line>LORD OF THE RINGS, THE FELLOWSHIP, gandalf the ring cannot stay here. I had a dream that perhaps they must decide how to end it. My people are leaving these shores.</expandable-text-line>')
        // this.$compile($element.get(0))
        // console.log($element)
      } /* else {
        for (let i = 0; i < this.expandTextLine.length; i++) {
          this.expandTextLine[i].$el.parentNode.removeChild(this.expandTextLine[i].$el)
          this.expandTextLine[i].$destroy()
        }
        this.expandTextLine = []
      } */
      for (var i = 0, len = b.length; i !== len; ++i) {
        b[0].parentNode.removeChild(b[0])
      }

      // const c = new ExpandableTextLine()
      /* for (let i = 0; i < b.length; i++) {
        const c = document.createElement('expandable-text-line')
        c.textContent = 'LORD OF THE RINGS, THE FELLOWSHIP, gandalf the ring cannot stay here. I had a dream that perhaps they must decide how to end it. My people are leaving these shores.'
        console.log(c)
        a.appendChild(c)
      }
      for (var i = 0, len = b.length; i !== len; ++i) {
        b[0].parentNode.removeChild(b[0])
      } */
    },
    appendPopup: function (text, position, width) {
      var s, tailLeft
      document.querySelector('#popuptext').innerHTML = text
      $('div#popup').fadeIn()
      var popheight = document.querySelector('div#popup').offsetHeight

      var bleft = parseInt(position.left + (width / 2) - 120)
      var btop = parseInt(position.top - popheight)

      // var tailLeft = parseInt(position.left + (width / 2))
      document.querySelector('#popupTail').style.marginLeft = '107px'
      // document.querySelector('#popupTail').style.top = btop + 'px'

      $('div#popup').css({
        left: bleft + 'px',
        top: btop + 'px',
        width: '400px'
      }).fadeIn(600)

      if (bleft < 0) {
        tailLeft = 107 + bleft + 3
        document.querySelector('#popupTail').style.marginLeft = tailLeft + 'px'
        document.querySelector('div#popup').style.left = '-5px'
      }
      if (bleft + document.querySelector('div#popup').offsetWidth + 10 > document.querySelector('#structureviewer').clientWidth) {
        document.querySelector('div#popup').style.left = (document.querySelector('#structureviewer').clientWidth + 11 - 400) + 'px'
        tailLeft = 107 + (400 - (document.querySelector('#structureviewer').clientWidth - bleft) - 11)
        document.querySelector('#popupTail').style.marginLeft = tailLeft + 'px'
      }

      // Click on X to close popup
      $('span.x').on('click', function () {
        $('div#popup').fadeOut()
      })

      $('div#popup').on('hover', function () {
        clearTimeout(s)
      }, function () {
        s = setTimeout(function () {
          $('div#popup').fadeOut()
        }, 500)
      })
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
    /* background-color: #f1f1f1; */
    text-align: left;
    max-width: 90%;
    /* background: url(../../public/images/popupTail.png) no-repeat  center  bottom; */
    }

    /* #mydivheader {
    padding: 10px;
    cursor: move;
    z-index: 10;
    background-color: #666666;
    color: #fff;
    } */
    #popuptext{
    /* padding: 0px 20px 20px 20px; */
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
