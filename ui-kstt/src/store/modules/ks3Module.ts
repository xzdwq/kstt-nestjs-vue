import axios from "axios";

export const ks3Module = {
  namespaced: true,
  state: () => ({
    ks3: [],
    searchQuery: '',
    ks3Total: 0,
    page: 1,
    limit: 8,
    totalPages: 0,
    isLoading: false,
    needLoad: true,
    transitionType: 'fade',
    stageWorkflow: [],
    isLoadStageWorkflow: false
  }),
  getters: {
    getKS3(state: any) {
      // return state.ks3.filter((item) => {
      //   return (
      //       item.document_number.toLowerCase().includes(state.searchQuery.toLowerCase())
      //     || item.certificate_number.includes(state.searchQuery)
      //     || item.user.full_name.toLowerCase().includes(state.searchQuery.toLowerCase())
      //   )
      // })
      return state.ks3
    },
    getKS3Total(state: any) {
      return state.ks3Total
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
    getNeedLoad(state: any) {
      return state.needLoad
    },
    getTransitionType(state: any) {
      return state.transitionType
    },
    getStageWorkflow(state: any) {
      return state.stageWorkflow
    },
    getIsLoadStageWorkflow(state: any) {
      return state.isLoadStageWorkflow
    },
    isEmptySearchQuery(state: any) {
      return !!!state.searchQuery
    },
    getSearchQuery(state: any) {
      return state.searchQuery
    },
    getPage(state: any) {
      return state.page
    }
  },
  mutations: {
    setKS3(state, data) {
      state.ks3 = data
    },
    setKS3Total(state, total) {
      state.ks3Total = total
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
    setNeedLoad(state, needLoad) {
      state.needLoad = needLoad
    },
    addNewKS3(state, data) {
      state.ks3.push(data)
    },
    setTransitionType(state, type) {
      state.transitionType = type
    },
    setStageWorkflow(state, data) {
      state.stageWorkflow = data
    },
    setIsLoadStageWorkflow(state, isLoad) {
      state.isLoadStageWorkflow = isLoad
    },
    setSearchQuery(state, searchQuery) {
      state.searchQuery = searchQuery
    },
    setPage(state, page) {
      state.page = page
    }
  },
  actions: {
    async fetchKS3({ state, commit }, query) {
      try {
        commit('setIsLoading', true);
        commit('setSearchQuery', query);
        if(query) commit('setPage', 1)
        // commit('setKS3', [])
        // commit('setTotalPages', 0)
        const data:any = await axios.get('api/ks3', {
          params: {
            _page: state.page,
            _limit: state.limit,
            _query: query
          }
        })
        commit('setKS3', data.data.data)
        commit('setKS3Total', data.data.total)
        commit('setTotalPages', Math.ceil(data.data.total / state.limit))
        commit('setNeedLoad', false)
      } catch(e) {}
      finally { setTimeout(() => { commit('setIsLoading', false); }, 500) }
    },
    async createKS3({ commit, dispatch }, data) {
      try {
        commit('setTransitionType', 'item-notification')
        commit('setIsLoading', true);
        const newKS3 = await axios.post('api/ks3', {
          data: data
        })
        commit('addNewKS3', newKS3.data.data[0])
        dispatch('fetchKS3')
        return {
          success: newKS3.data.success,
          data: newKS3
        }
      }
      catch(e) {
        return {
          success: e?.response?.data?.success,
          data: e?.response?.data || [],
          message: e?.response?.data?.message || e.toString()
        }
      }
      finally {
        setTimeout(() => {
          commit('setIsLoading', false);
          commit('setTransitionType', 'fade')
        }, 500)
      }
    },
    async certificateNumber() {
      try {
        let newCertificateNumber;
        const data = await axios.get('api/ks3/newcrtificatenumber')

        data.data.data.length === 0
          ? newCertificateNumber = 1
          : newCertificateNumber = +data.data.data
        return {
          success: data.data.success,
          data: newCertificateNumber
        }
      }
      catch(e) {
        return {
          success: e?.response?.data?.success,
          data: e?.response?.data || [],
          message: e?.response?.data?.message || e.toString()
        }
      }
    }
  }
}