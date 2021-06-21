<template>
  <div id="structure-viewer">
    <span id="threeDSpan"></span>
    <Loader/>
  </div>
</template>

<script>
import Loader from '../AquariaLayout/Loader'
export default {
  name: 'StructureViewer',
  components: {
    Loader
  },
  mounted () {
    function checkPhone () {
      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ]

      if (navigator.platform) {
        while (iDevices.length) {
          if (navigator.platform === iDevices.pop() || (screen.width >= 300 && screen.width <= 600)) { return true }
        }
      } else {
        return false
      }
    }
    var isPhone = checkPhone()
    if (isPhone) {
      const baseWindowHeight = Math.max(window.innerHeight)
      const documentBody = document.body
      document.addEventListener('scroll', function (e) {
        var newWindowHeight = Math.max(window.innerHeight)
        if (newWindowHeight - 50 > baseWindowHeight) {
          if (!documentBody.classList.contains('ios-toolbar')) {
            documentBody.classList.add('ios-toolbar')
          }
        } else {
          if (documentBody.classList.contains('ios-toolbar')) {
            documentBody.classList.remove('ios-toolbar')
          }
        }
      })
      // if ((window.outerHeight - window.innerHeight) >= 80) {
      //   $('#structure-viewer').css({
      //     height: '88vh'
      //   })
      //   window.scrollTo(0, 0)
      // } else {
      //   $('#structure-viewer').css({
      //     height: '103vh'
      //   })
      //   window.scrollTo(0, 0)
      // }
      // window.addEventListener('resize', function () {
      //   if ((window.outerHeight - window.innerHeight) >= 80) {
      //     $('#structure-viewer').css({
      //       height: '88vh'
      //     })
      //     window.scrollTo(0, 0)
      //   } else {
      //     $('#structure-viewer').css({
      //       height: '103vh'
      //     })
      //     window.scrollTo(0, 0)
      //   }
      // })
    }
  }
}
</script>

<style>
.aquariaWarning {
    position: absolute;
    top: 50px;
    left: 30%;
    background: #FAC88C;
    border: 15px solid transparent;
    border-image: url('../../assets/images/border-1.png') 15 15 round;
    margin: 12px auto;
    width: 40%;
    padding: 20px 20px 14px 20px;
    text-align: left;
    box-shadow: 6px 6px 15px #669;
    z-index: 999;
}

#selectionText {
    overflow: hidden;
    position: absolute;
    z-index: 95;
    pointer-events: none;
    display: none;
    padding: 0px;
    margin: 0px;
    width: 200px;
    height: 100px;
}

#waitingFrame {
    overflow: hidden;
    width: 100vw;
    top: 0px;
    left: 0px;
    height: 100vh;
    position: fixed;
    z-index: 6;
    pointer-events: none;
    display: none;
}

#threeDSpan, #threeDSpan-inner-jolecule-soup-display {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: absolute;
    z-index: 0;
    top: 0%;
}

.jolecule-embed-toolbar, .jolecule-embed-toolbar a {
    color: #777;
    text-decoration: none;
}
.jolecule-embed-toolbar {
    padding: 5px 5px 2px 5px;
    vertical-align: middle;
    background-color: #CCC;
    color: #666;
    /* font-family: helvetica; */
    font-size: 12px;
    /* letter-spacing: 0.05em; */
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    top: 6rem;
}
.jolecule-embed-footer {
  position: absolute;
  bottom: 0%;
  width: 100%;
}
.jolecule-embed-body {
    font-size: 12px;
    /* font-family: helvetica;
    letter-spacing: 0.05em; */
    line-height: 1.2em;
    color: #666;
}

.jolecule-overlay-text {
    z-index: 5001;
    padding: 10px;
    opacity: 0.7;
    text-align: left;
    letter-spacing: 0.1em;
    line-height: 1.5em;
    /* font-family: Helvetica, Arial, sans-serif; */
    font-size: 12px;
    border: 1px solid #888;
    background-color: rgba(200, 200, 200, 0);
    color: #333;
}
.ios-toolbar .tabs {
        transform: translateY(-25px);
      }
</style>
