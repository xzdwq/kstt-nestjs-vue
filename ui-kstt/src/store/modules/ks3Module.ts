import axios from "axios";

export const ks3Module = {
  namespaced: true,
  state: () => ({
    ks3: [],
    ks3Total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    isLoading: false,
  }),
  getters: {
    getKS3(state: any) {
      return state.ks3
    },
    getKS3Total(state: any) {
      return state.ks3Total
    }
  },
  mutations: {
    setKS3(state, data) {
      state.ks3 = data
    },
    setKS3Total(state, total) {
      state.ks3Total = total
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
  },
  actions: {
    async fetchKS3({ state, commit}) {
      try {
        commit('setIsLoading', true);
        const data = await axios.get('api/ks3')
        commit('setKS3', data.data.data)
        commit('setKS3Total', data.data.total)
      } catch(e) { console.log(e) }
      finally { commit('setIsLoading', false); }
    }
  }
}