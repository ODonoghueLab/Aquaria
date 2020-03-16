import Vue from 'vue'
import router from './router'
import store from './store'
import Wrapper from './views/Wrapper'
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import VueMq from 'vue-mq'
// import 'vue-material/dist/theme/default.css'

Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)
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
  render: h => h(Wrapper)
}).$mount('#wrapper')
