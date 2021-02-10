<template>
<div id="wrapper">
  <!-- <div>{{data}}</div> -->
    <Content/>
    <Footer />
    <BadBrowser />
  </div>
</template>

<script>
// most legacy code bundling is triggered from here (expects global jolecule)
import '../legacy/aquaria'
import Content from '../components/Content'
import Footer from '../components/Footer'
import BadBrowser from '../components/BadBrowser'

export default {
  name: 'Wrapper',
  components: {
    Content,
    BadBrowser,
    Footer
  },
  // beforeMount () {
  //   const Script1 = document.createElement('script')
  //   Script1.setAttribute('src', '/javascripts/jquery-1.9.1.min.js')
  //   document.body.appendChild(Script1)

  //   const Script2 = document.createElement('script')
  //   Script2.setAttribute('src', '/javascripts/chardinjs.mod.js')
  //   document.body.appendChild(Script2)
  // },
  // created () {
  //   var libs = [
  //     '/javascripts/jquery-ui.1.10.3.js',
  //     '/javascripts/jquery.expander.min.js',
  //     '/javascripts/browser_check.js'
  //   ]

  //   var injectLibFromStack = function () {
  //     if (libs.length > 0) {
  //       // grab the next item on the stack
  //       var nextLib = libs.shift()
  //       var headTag = document.getElementsByTagName('head')[0]

  //       // create a script tag with this library
  //       var scriptTag = document.createElement('script')
  //       scriptTag.src = nextLib

  //       // when successful, inject the next script
  //       scriptTag.onload = function (e) {
  //         console.log('---> loaded: ' + e.target.src)
  //         injectLibFromStack()
  //       }

  //       // append the script tag to the <head></head>
  //       headTag.appendChild(scriptTag)
  //       console.log('injecting: ' + nextLib)
  //     }
  //   }

  //   // start script injection
  //   injectLibFromStack()
  // },
  mounted () {
    window.scrollBy(0, 100)
    window.addEventListener('resize', function () {
      window.scrollBy(0, 100)
    })
    if (document.querySelector('#header')) {
      document.querySelector('#header').remove()
    }
    setTimeout(function () {
      if (document.querySelector('.matrixLoading')) {
        document.querySelector('.matrixLoading').style.visibility = 'hidden'
        document.querySelector('.matrixLoading').style.display = 'none'
      }
    }, 1500)
  }
}
</script>

<style>
  /* @import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css"; */

#wrapper{
  font: 12px/18px "Lucida Sans", "Lucida Grande", "Lucida Sans Unicode", Verdana, sans-serif;
  overflow: hidden;
  height: 100vh;

}

a, p#psyns a, p#osyns a, .simulatelink {
    color: #08C;
    text-decoration: none;
}

/* span>a{
  color: rgb(104, 199, 247);
  text-decoration: none;
} */

span.content p, p.expandable, p.hidden {
    color: #5d5d5d;
}

span.content p:last-child {
    margin-bottom: 0.75em;
}

.panel h3, #gallery h3, .balloon h3, #about_overlay h3, #help_overlay h3 {
    background-color: #999;
    border-radius: 10px;
    color: white;
    font-size: 100%;
    font-weight: normal;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    /* padding: 2px 3px 2px 10px; */
    margin: 0px;
    padding: 7px 10px 4px 29px;
}

div.panel {
    background: #CCC;
    border: 1px solid rgba(153, 153, 153, 0);
    border-radius: 12px;
}

.ui-widget-content {
    background: #BBDDEE;
    z-index: 222;
    width: 100vh;
}

.ui-widget {
    font-family: inherit;
    font-size: 103%;
}
.ui-widget-content, .ui-widget-header {
    border: 0 none;
    color: inherit;
    font-weight: normal;
}

.ui-autocomplete li {
    margin: 0px;
    padding: 2px 5px;
    cursor: default;
    display: block;
    font: menu;
    font-size: 12px;
    line-height: 16px;
    overflow: hidden;
}

</style>
