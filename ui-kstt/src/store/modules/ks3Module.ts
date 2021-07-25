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
    needLoad: true,
    transitionType: 'fade',
    stageWorkflow: [],
    isLoadStageWorkflow: false
  }),
  getters: {
    getKS3(state: any) {
      return state.ks3
    },
    getKS3Total(state: any) {
      return state.ks3Total
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
    }
  },
  actions: {
    async fetchKS3({ commit }) {
      try {
        commit('setIsLoading', true);
        commit('setKS3', [])
        const data = await axios.get('api/ks3')
        commit('setKS3', data.data.data)
        commit('setKS3Total', data.data.total)
        commit('setNeedLoad', false)
      } catch(e) { console.log(e) }
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
        // dispatch('fetchKS3')
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
    },
    async fetchStageWorkflow({ commit, getters }) {
      try {
        if(getters.getStageWorkflow.length === 0) {
          commit('setIsLoadStageWorkflow', true)
          const data = await axios.get('api/ks3/stageworkflow')
          commit('setStageWorkflow', data.data.data)
        }
      }
      catch(e) {
        console.log(e)
      }
      finally {
        commit('setIsLoadStageWorkflow', false)
      }
    }
  }
}