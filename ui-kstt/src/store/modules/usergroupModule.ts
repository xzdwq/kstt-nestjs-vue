import axios from "axios";

export const usergroupModule = {
  namespaced: true,
  state: () => ({
    isLoadStageWorkflow: false,
    stageWorkflow: []
  }),
  getters: {
    getIsLoadStageWorkflow(state) {
      return state.isLoadStageWorkflow;
    },
    getStageWorkflow(state: any) {
      return state.stageWorkflow
    },
  },
  mutations: {
    setIsLoadStageWorkflow(state, loading) {
      state.isLoadStageWorkflow = loading;
    },
    setStageWorkflow(state, data) {
      state.stageWorkflow = data
    },
  },
  actions: {
    async fetchStageWorkflow({ commit, getters }, type) {
      try {
        if(type == 'reload') commit('setStageWorkflow', [])
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