import axios from "axios";

export const workflowManagmentModule = {
  namespaced: true,
  state: () => ({
    isLoadStageWorkflow: false,
    stageWorkflow: [],
    ks3ByWfId: []
  }),
  getters: {
    getIsLoadStageWorkflow(state) {
      return state.isLoadStageWorkflow;
    },
    getStageWorkflow(state: any) {
      return state.stageWorkflow
    },
    getKs3ByWfId(state: any) {
      return state.ks3ByWfId;
    }
  },
  mutations: {
    setIsLoadStageWorkflow(state, loading) {
      state.isLoadStageWorkflow = loading;
    },
    setStageWorkflow(state, data) {
      state.stageWorkflow = data
    },
    setKs3ByWfId(state, ks3ByWfId) {
      state.ks3ByWfId = ks3ByWfId;
    }
  },
  actions: {
    async fetchStageWorkflow({ commit, getters }, params) {
      try {
        if(params.type == 'reload') commit('setStageWorkflow', [])
        if(getters.getStageWorkflow.length === 0) {
          commit('setIsLoadStageWorkflow', true)
          const data = await axios.get('api/ks3/stageworkflow', {
            params: {
              _workflow_id: params.workflow_id || ''
            }
          })
          commit('setStageWorkflow', data.data.data)
          commit('setKs3ByWfId', data.data.ks3 || [])
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