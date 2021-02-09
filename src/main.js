import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
// import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
import VueMq from 'vue-mq'
import ToggleSwitch from 'vuejs-toggle-switch'

// import styles (would be cleaner to do this through a top-level main.css)
// import 'vue-material/dist/vue-material.min.css'
import 'jquery-ui-dist/jquery-ui.css'

// apply jquery plugins (these rely on global jquery)
// note that anything here ends up in the main bundle (will be loaded for every route)
import 'jquery-ui-dist/jquery-ui'
import 'jquery-expander'
import './components/AquariaLayout/helpers/chardinjs.mod'

// load other globals (some may depend on jquery/plugins above)
import './components/AquariaLayout/helpers/browser_check'
import './assets/js/plugins'
// import './assets/js/vendor/modernizr-3.11.2.min'

// Import all styles
require('../src/assets/css/layout.css')
require('../src/assets/css/normalize.css')
require('../src/assets/css/main.css')

Vue.use(ToggleSwitch)
// Vue.use(MdButton)
// Vue.use(MdContent)
// Vue.use(MdTabs)
Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    laptop: Infinity
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#wrapper')
