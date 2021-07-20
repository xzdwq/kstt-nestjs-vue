import axios from "axios";

export const cryptoConfigurationModule = {
  namespaced: true,
  state: () => ({
    tspService: "http://testca2012.cryptopro.ru/tsp/tsp.srf",
    certificates: [],
    signatureType: [],
    defaultSignatureType: 4
  }),
  getters: {
    getTspService(state: any) {
      return state.tspService
    },
    getSignatureType(state: any) {
      return state.signatureType
    },
    getDefaultSignatureType(state: any) {
      return state.defaultSignatureType
    }
  },
  mutations: {
    setSignatureType(state, data) {
      state.signatureType = data
    },
    setDefaultSignatureType(state, id) {
      state.defaultSignatureType = id
    },
    setTspService(state, value) {
      state.tspService = value
    }
  },
  actions: {
    async fetchSignatureType({ state, commit}) {
      try {
        const data = await axios.get('api/cryptoconfig/signaturestype');
        commit('setSignatureType', data.data.data)
      }
      catch(e) {
        console.log(e)
      }
    },
    saveCogForm({ commit }, dataForm) {
      commit('setDefaultSignatureType', +dataForm.typeSignature)
      commit('setTspService', dataForm.tspService)
    }
  }
}