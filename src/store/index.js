import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: 'Oct, 2020',
    url: window.location.protocol + '//' + window.location.hostname
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
