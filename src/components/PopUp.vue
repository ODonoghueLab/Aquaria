<template>
    <!-- Draggable DIV -->
    <div id="popup">
    <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
    <!-- <div id="mydivheader">
    </div> -->
    <p id='popuptext'>Pop-up text box component for features</p>
    <img v-bind:src="popupTail" id='popupTail'>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'PopUp',
  data () {
    return {
      popupTail: require('../assets/img/popupTail.png')
    }
  },
  mounted () {
    this.dragElement(document.getElementById('popup'))
  },
  methods: {
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
