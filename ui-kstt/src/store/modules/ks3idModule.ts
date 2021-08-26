import axios from "axios";

export const ks3idModule = {
  namespaced: true,
  state: () => ({
    isLoading: false,
    KS3id: [],
    stageWorkflow: [],
    isLoadStageWorkflow: false,
    activeStageWorkflow: 0,
    currentStageInfo: {}
  }),
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    },
    getKS3id(state) {
      return state.KS3id
    },
    getStageWorkflow(state: any) {
      return state.stageWorkflow
    },
    getIsLoadStageWorkflow(state: any) {
      return state.isLoadStageWorkflow
    },
    getActiveStageWorkflow(state: any) {
      return state.activeStageWorkflow
    },
    getCurrentStageInfo(state) {
      return state.currentStageInfo
    }
  },
  mutations: {
    setIsLoading(state, loading) {
      state.isLoading = loading;
    },
    setKS3id(state, KS3id) {
      state.KS3id = KS3id;
    },
    setStageWorkflow(state, data) {
      state.stageWorkflow = data
    },
    setIsLoadStageWorkflow(state, isLoad) {
      state.isLoadStageWorkflow = isLoad
    },
    setActiveStageWorkflow(state, active) {
      state.activeStageWorkflow = active
    },
    setCurrentStageInfo(state, data) {
      state.currentStageInfo = data
    }
  },
  actions: {
    async fetchKS3id({ commit }, id) {
      try {
        commit('setKS3id', [])
        commit('setIsLoading', true)
        const data = await axios.get(`api/ks3id/${id}`)
        commit('setKS3id', data.data.data)
        commit('setStageWorkflow', data.data.data[0].workflow.stage)
        commit('setActiveStageWorkflow', data.data.data[0].workflow.current_stage)
        commit('setCurrentStageInfo', data.data.currentStage)
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