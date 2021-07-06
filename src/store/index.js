import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: 'May, 2020',
    url: window.location.protocol + '//' + window.location.hostname,
    hash: '',
    alignment: '',
    Organism: '',
    OrgID: '',
    Gene: '',
    error: '',
    errorMsg: '',
    helpTitle: 'Aquaria Help',
    newUser: true,
    variantStructs: {}
  },
  mutations: {
    setvariantStructs (state, value) {
      state.variantStructs = value
    },
    setUserStatus (state, value) {
      state.newUser = value
    },
    setHelpTitle (state, value) {
      state.helpTitle = value
    },
    setErrorTitle (state, value) {
      state.error = value
    },
    setOrganism (state, value) {
      state.Organism = value
    },
    setOrgID (state, value) {
      state.OrgID = value
    },
    setGene (state, value) {
      state.Gene = value
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
