import Vue from 'vue'
import router from './router'
import store from './store'
import Wrapper from './views/Wrapper'
// import socketio from 'socket.io-client'
// import VueSocketIO from 'vue-socket.io'

// export const SocketInstance = socketio('http://localhost:8009')
// Vue.use(VueSocketIO, SocketInstance)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(Wrapper)
}).$mount('#wrapper')
