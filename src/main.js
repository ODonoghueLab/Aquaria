import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
import VueMq from 'vue-mq'
import ToggleSwitch from 'vuejs-toggle-switch'
import Vuetify from 'vuetify'

// import styles (would be cleaner to do this through a top-level main.css)
import 'vue-material/dist/vue-material.min.css'
import 'jquery-ui-dist/jquery-ui.css'

// apply jquery plugins (these rely on global jquery)
// note that anything here ends up in the main bundle (will be loaded for every route)
import 'jquery-ui-dist/jquery-ui'
import 'jquery-expander'
import './legacy/javascripts/chardinjs.mod'

// load other globals (some may depend on jquery/plugins above)
import './legacy/javascripts/browser_check'

// Import all styles
require('../src/assets/css/layout.css')
require('../src/assets/css/normalize.css')
require('../src/assets/css/main.css')

Vue.use(ToggleSwitch)
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)
Vue.use(Vuetify)
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
