import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: 'May, 2020',
    url: window.location.protocol + '//' + window.location.hostname,
    hash: '',
    alignment: '',
    organism: '',
    error: '',
    errorMsg: ''
  },
  mutations: {
    setErrorTitle (state, value) {
      state.error = value
    },
    setErrorMsg (state, value) {
      state.errorMsg = value
    },
    setAlignment (state, value) {
      state.alignment = value
    },
    setHash (state, value) {
      state.hash = value
    }
  },
  actions: {
  },
  modules: {
  }
})
