<template>
<div id="wrapper">
    <Content/>
  </div>
</template>

<script>
// most legacy code bundling is triggered from here (expects global jolecule)
import '../legacy/aquaria'
import Content from '../components/AquariaLayout/Content'

export default {
  name: 'Wrapper',
  components: {
    Content
  },
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
#wrapper{
  font: 12px/18px "Lucida Sans", "Lucida Grande", "Lucida Sans Unicode", Verdana, sans-serif;
  overflow: hidden;
  height: 100vh;

}

a, p#psyns a, p#osyns a, .simulatelink {
    color: #08C;
    text-decoration: none;
}

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
