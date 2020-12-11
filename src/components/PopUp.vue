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
