<template>
<div id="wrapper">
    <!-- <div>{{data}}</div> -->
    <Content/>
    <Footer />
    <BadBrowser />
  </div>
</template>

<script>
import Content from '../components/Content'
import Footer from '../components/Footer'
import BadBrowser from '../components/BadBrowser'

export default {
  name: 'Wrapper',
  components: {
    Content,
    BadBrowser,
    Footer
  }
  // data () {
  //   return {
  //     primary_accession: null
  //   }
  // },
  // beforeMount () {
  //   axios({
  //     method: 'get',
  //     url: url
  //   })
  //     .then(function (response) {
  //       // if (response.data.initialParams) {
  //       //   window.location.pathname = JSON.parse(response.data.initialParams).primary_accession + '/' + JSON.parse(response.data.initialParams).pdb_id
  //       // }
  //       if (response.data.primary_accessions) {
  //         window.location.pathname = '/orgID/' + response.data.OrganismID
  //       }
  //     }
  //     )
  // }
  // mounted () {
  //

  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/d3.v2.min.js'
  //   })

  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/browser_check.js'
  //   }).then(response => (
  //     document.createElement('script').setAttribute('src', response.data))
  //   )

  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/jquery-ui.min.js'
  //   })

  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/jquery.expander.min.js'
  //   })
  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/show_expanded_clusters.js'
  //   })
  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/textpanels.js'
  //   })
  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/pv.js'
  //   })
  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/jolecule.js'
  //   })
  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/aquaria.js'
  //   })
  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/resize_app.js'
  //   })
  //   axios({
  //     method: 'get',
  //     url: url + '/javascripts/jsdas.0.1.6.min.js'
  //   })
  // }
}
</script>

<style>
#wrapper{
  font: 12px/18px "Lucida Sans", "Lucida Grande", "Lucida Sans Unicode", Verdana, sans-serif;
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
    color: #666;
}

span.content p:last-child {
    margin-bottom: 0.75em;
}
span.content p, p.expandable, p.hidden {
    color: #666;
}

.panel h3, #gallery h3, #controls h3, .balloon h3, #about_overlay h3, #help_overlay h3 {
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
