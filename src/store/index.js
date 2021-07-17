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
    variantStructs: {},
    popupTitle: 'This is the initial title',
    popupText: 'This is the initial text',
    variantResidues: {},
    variant: -1
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
    },
    setPopupTitle (state, value) {
      state.popupTitle = value // 'This is the popup title'
    },
    setPopupText (state, value) {
      state.popupText = value // 'This is the popup title'
    },
    setVariantResidues (state, value) {
      state.variantResidues = value
    },
    setVariant (state, value) {
      state.variant = value
    }
  },
  getters: {
    getVariant: (state) => {
      return state.variant
    },
    getVariantStructs: function (state) {
      // if (Object.hasOwnProperty.call(state.variantStructs, getters.getVariant)) {
      // console.log('Is this true????')
      return state.variantStructs
    },
    getVariantResidues: function (state) {
      // if (Object.hasOwnProperty.call(state.variantStructs, getters.getVariant)) {
      // console.log('Is this true????')
      return state.variantResidues
    },
    getPopupTitle: (state) => {
      return state.popupTitle // 'This is the popup title'
    },
    getPopupText: (state) => {
      return state.popupText // 'This is the popup title'
    }
    /* getPdbCount: function (state, getters) {
      return function (aa) {
        // if (Object.prototype.hasOwnProperty.call())
        const resVarStruct = getters.getVariantStruct_resNum
        console.log('Res var struct is ')
        console.log(resVarStruct[aa])
        if (resVarStruct !== undefined && Object.prototype.hasOwnProperty.call(resVarStruct, aa) && Object.prototype.hasOwnProperty.call(resVarStruct[aa], 'pdbs')) {
          console.log('The aa struct count is ' + aa + resVarStruct[aa].pdbs.length)
          return resVarStruct[aa].pdbs.length
        } else {
          return 0
        }
      }
    } */
  },
  actions: {
  },
  modules: {
  }
})
