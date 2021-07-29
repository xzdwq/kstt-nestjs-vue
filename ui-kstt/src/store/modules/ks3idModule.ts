import axios from "axios";

export const ks3idModule = {
  namespaced: true,
  state: () => ({
    isLoading: false,
    KS3id: [],
  }),
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    },
    getKS3id(state) {
      return state.KS3id
    }
  },
  mutations: {
    setIsLoading(state, loading) {
      state.isLoading = loading;
    },
    setKS3id(state, KS3id) {
      state.KS3id = KS3id;
    }
  },
  actions: {
    async fetchKS3id({ commit }, id) {
      try {
        commit('setKS3id', [])
        commit('setIsLoading', true)
        const data = await axios.get(`api/ks3id/${id}`)
        commit('setKS3id', data.data.data)
        return {
          success: true,
          data: data.data.data
        }
      }
      catch(e) {
        return {
          success: false,
          data: [],
          message: e.toString()
        }
      }
      finally {
        commit('setIsLoading', false)
      }
    }
  }
}