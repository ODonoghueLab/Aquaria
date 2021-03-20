<template>
    <!-- Draggable DIV -->
    <div id="popup" v-observer:subtree.childList="handler">
    <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
    <!-- <div id="mydivheader">
    </div> -->
    <p id='popuptext'>Pop-up text box component for features</p>
    <img v-bind:src="popupTail" id='popupTail'>
    </div>
</template>

<script>
// import $ from 'jquery'
import observer from 'vue-mutation-observer'
import ExpandableTextLine from 'vue-expandable-text-line'
import Vue from 'vue'

export default {
  name: 'PopUp',
  data () {
    return {
      popupTail: require('../../assets/img//popupTail.png'),
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
              a = a.replace(/[a-zA-Z]+\)/, oneAaCodes[k] + ')')
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
              document.getElementById('btnVI_' + clickedAa).style.display = 'none'
            }
          } else {
            if (document.getElementById('btnVI_' + oneAaCodes[i])) {
              document.getElementById('btnVI_' + oneAaCodes[i]).style.display = 'inline'
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
        // document.getElementById('span_missenseHeading').innerHTML = a
      }
    },
    // appendPopup: function (text, position, width) {
    //   var s, tailLeft
    //   document.querySelector('#popuptext').innerHTML = text
    //   $('div#popup').fadeIn()
    //   var popheight = document.querySelector('div#popup').offsetHeight

    //   var bleft = parseInt(position.left + (width / 2) - 120)
    //   var btop = parseInt(position.top - popheight)

    //   // var tailLeft = parseInt(position.left + (width / 2))
    //   document.querySelector('#popupTail').style.marginLeft = '107px'
    //   // document.querySelector('#popupTail').style.top = btop + 'px'

    //   $('div#popup').css({
    //     left: bleft + 'px',
    //     top: btop + 'px',
    //     width: '400px'
    //   }).fadeIn(600)

    //   if (bleft < 0) {
    //     tailLeft = 107 + bleft + 3
    //     document.querySelector('#popupTail').style.marginLeft = tailLeft + 'px'
    //     document.querySelector('div#popup').style.left = '-5px'
    //   }
    //   if (bleft + document.querySelector('div#popup').offsetWidth + 10 > document.querySelector('#structure-viewer').clientWidth) {
    //     document.querySelector('div#popup').style.left = (document.querySelector('#structure-viewer').clientWidth + 11 - 400) + 'px'
    //     tailLeft = 107 + (400 - (document.querySelector('#structure-viewer').clientWidth - bleft) - 11)
    //     document.querySelector('#popupTail').style.marginLeft = tailLeft + 'px'
    //   }

    //   // Click on X to close popup
    //   $('span.x').on('click', function () {
    //     $('div#popup').fadeOut()
    //   })

    //   $('div#popup').on('hover', function () {
    //     clearTimeout(s)
    //   }, function () {
    //     s = setTimeout(function () {
    //       $('div#popup').fadeOut()
    //     }, 500)
    //   })
    // },
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

<style>
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
  /* Add this via class to link.
  a:link {
    color: #d5d4d5;
    text-decoration: underline;
  }
  */
  .theCursor{
    cursor: context-menu;
  }

</style>
