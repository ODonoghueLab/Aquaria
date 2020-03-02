<template>
  <div id="home">
    <Wrapper/>
  </div>
</template>

<script>
import Wrapper from '@/components/Wrapper'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Wrapper
  },
  data () {
    return {
      data: null
    }
  },
  beforeMount () {
    const url = 'http://localhost:8009' + window.location.pathname
    axios({
      method: 'get',
      url: url
    })
      .then(response => (this.data = response.data))

    if (typeof initialParams !== 'undefined') {
      window.initialParams = JSON.parse(window.initialParams)
    }
  },
  mounted () {
    function getUrlParameter (sParam) {
      if (window.location.search.length > 0) {
        var sPageURL = window.location.search.substring(1) // no .toLowerCase() here (this affects the value!)
        var sURLVariables = sPageURL.split('&')
        sParam = sParam.toLowerCase()
        for (var i = 0; i < sURLVariables.length; i++) {
          var sParameterName = sURLVariables[i].split('=')
          if (sParameterName[0].toLowerCase() === sParam) {
            return decodeURIComponent(sParameterName[1]) // the value might have been encoded
          }
        }
      }
      return null
    }
    var persist = getUrlParameter('persist')
    var viewer = getUrlParameter('viewer')
    if (viewer && persist) {
      localStorage.setItem('3DViewer', viewer)
    }
    window.threedViewer = (viewer || localStorage.getItem('3DViewer') || 'Jolecule')
    window.threedViewer = window.threedViewer.toLowerCase()

    const url = 'http://localhost:8009'

    axios({
      method: 'get',
      url: url + '/javascripts/d3.v2.min.js'
    })

    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/browser_check.js'
    // })

    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/jquery-ui.min.js'
    // })

    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/jquery.expander.min.js'
    // })
    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/show_expanded_clusters.js'
    // })
    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/textpanels.js'
    // })
    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/pv.js'
    // })
    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/jolecule.js'
    // })
    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/aquaria.js'
    // })
    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/resize_app.js'
    // })
    // axios({
    //   method: 'get',
    //   url: url + '/javascripts/jsdas.0.1.6.min.js'
    // })

    // const script4 = document.createElement('script')
    // script4.setAttribute('src', '/javascripts/d3.v2.min.js')
    // document.head.appendChild(script4)

    const script3 = document.createElement('script')
    script3.setAttribute('src', 'https://www.java.com/js/deployJava.js')
    document.head.appendChild(script3)

    // const script5 = document.createElement('script')
    // script5.setAttribute('src', '/javascripts/browser_check.js')
    // document.head.appendChild(script5)

    // const script6 = document.createElement('script')
    // script6.setAttribute('src', '/javascripts/jquery-ui.min.js')
    // document.head.appendChild(script6)

    // const script7 = document.createElement('script')
    // script7.setAttribute('src', '/javascripts/jquery.expander.min.js')
    // document.head.appendChild(script7)

    // const script8 = document.createElement('script')
    // script8.setAttribute('src', '/javascripts/show_expanded_clusters.js')
    // document.head.appendChild(script8)

    // const script9 = document.createElement('script')
    // script9.setAttribute('src', '/javascripts/textpanels.js')
    // document.head.appendChild(script9)

    // const script10 = document.createElement('script')
    // script10.setAttribute('src', '/javascripts/pv.js')
    // document.head.appendChild(script10)

    // const script12 = document.createElement('script')
    // script12.setAttribute('src', '/javascripts/jolecule.js')
    // document.head.appendChild(script12)

    // const script11 = document.createElement('script')
    // script11.setAttribute('src', '/javascripts/aquaria.js')
    // document.head.appendChild(script11)

    // const script13 = document.createElement('script')
    // script13.setAttribute('src', '/javascripts/resize_app.js')
    // document.head.appendChild(script13)

    // const script14 = document.createElement('script')
    // script14.setAttribute('src', '/javascripts/jsdas.0.1.6.min.js')
    // document.head.appendChild(script14)

    const script15 = document.createElement('script')
    script15.setAttribute('src', 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js')
    document.head.appendChild(script15)
  }
}
</script>
