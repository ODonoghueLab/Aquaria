import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: 'May, 2020',
    url: window.location.protocol + '//' + window.location.hostname,
    alignment: ''
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
