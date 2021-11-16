import axios from "axios";

export const ks2idModule = {
  namespaced: true,
  state: () => ({
    // Список КС-2 привязанных к КС-3 id
    ks2: [],
    ks2Total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    isLoading: false,
    searchQuery: '',
    // Конкретный КС-2
    ks2byid: [],
    ks2TotalSum: [],
    ks2TotalSumIncl: [],
    // Список статусов КС-2
    ks2StatusList: []
  }),
  getters: {
    // Список КС-2 привязанных к КС-3 id
    getKS2id(state) {
      return state.ks2
    },
    getKs2TotalSum(state) {
      return state.ks2TotalSum
    },
    getKs2TotalSumIncl: (state) => state.ks2TotalSumIncl,
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
    // Конкретный КС-2
    getKS2byid: (state) => state.ks2byid,
    // Список статусов КС-2
    getKs2StatusList: (state) => state.ks2StatusList,
  },
  mutations: {
    // Список КС-2 привязанных к КС-3 id
    setKS2(state, data) {
      state.ks2 = data
    },
    setKs2TotalSum: (state, data) => state.ks2TotalSum = data,
    setKs2TotalSumIncl: (state, data) => state.ks2TotalSumIncl = data,
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
    // Конкретный КС-2
    ks2byid: (state, ks2) => state.ks2byid = ks2,
    // Список статусов КС-2
    setKs2StatusList: (state, list) => state.ks2StatusList = list,
  },
  actions: {
    // Получить список привязанных КС-2 по КС-3 id
    async fetchKS2({ state, commit }, params) {
      const id = params.ks3_id
      const filter = params.filter.join(',')
      try {
        commit('setIsLoading', true);
        commit('setKS2', []);
        const data = await axios.get(`api/ks2/${id}`, {
          params: {
            _page: state.page,
            _limit: state.limit,
            _sortIndex: params.index,
            _sort: params.sort,
            _filter: filter,
            _searchIndex: params.searchIndex,
            _search: params.search
          }
        })
        commit('setKS2', data.data.data)
        commit('setKS2Total', data.data.total)
        commit('setTotalPages', Math.ceil(data.data.total / state.limit))
      } catch(e) { console.log(e) }
      finally { setTimeout(() => { commit('setIsLoading', false); }, 500) }
    },
    // Получить конкретный КС-2
    async fetchKS2byId({ commit }, params) {
      const id = params.ks2_id
      try {
        commit('setIsLoading', true);
        commit('ks2byid', []);
        commit('setKs2TotalSum', [])
        commit('setKs2TotalSumIncl', [])
        const data = await axios.get(`api/ks2id/${id}`)
        commit('ks2byid', data.data.data);
        commit('setKs2TotalSum', data.data.data.ks2_total_sum)
        commit('setKs2TotalSumIncl', data.data.data.ks2_total_sum_incl)
        return data.data
      } catch(e) { console.log(e) }
      finally { setTimeout(() => { commit('setIsLoading', false); }, 500) }
    },
    // Список статусов для КС-2
    async fetchKS2StatusList({ commit }) {
      commit('setKs2StatusList', []);
      await axios.get(`api/ks2/status`)
        .then(data => {
          commit('setKs2StatusList', data.data.data);
        })
    }
  }
}