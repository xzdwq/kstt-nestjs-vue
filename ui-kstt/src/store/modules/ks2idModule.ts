import axios from "axios";

export const ks2idModule = {
  namespaced: true,
  state: () => ({
    ks2: [],
    ks2Total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
    isLoading: false,
    searchQuery: ''
  }),
  getters: {
    getKS2id(state) {
      return state.ks2
    },
    getKS2Total(state) {
      return state.ks2Total
    },
    getPage(state: any) {
      return state.page
    },
    getTotalPage(state: any) {
      return state.totalPages
    },
    getLimit(state: any) {
      return state.limit
    },
    getIsLoading(state: any) {
      return state.isLoading
    },
    isEmptySearchQuery(state: any) {
      return !!!state.searchQuery
    },
    getSearchQuery(state: any) {
      return state.searchQuery
    },
  },
  mutations: {
    setKS2(state, data) {
      state.ks2 = data
    },
    setKS2Total(state, total) {
      state.ks2Total = total
    },
    setPage(state, page) {
      state.page = page
    },
    setTotalPages(state, totalPages) {
      state.totalPages = totalPages
    },
    setLimit(state, limit) {
      state.limit = limit
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setSearchQuery(state, searchQuery) {
      state.searchQuery = searchQuery
    },
  },
  actions: {
    async fetchKS2({ state, commit }, query) {
      try {
        commit('setIsLoading', true);
        commit('setKS2', []);
      } catch(e) { console.log(e) }
      finally { setTimeout(() => { commit('setIsLoading', false); }, 500) }
    }
  }
}