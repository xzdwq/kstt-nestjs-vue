import axios from "axios";

export const workflowManagmentModule = {
  namespaced: true,
  state: () => ({
    isLoadStageWorkflow: false,
    stageWorkflow: [],
    ks3ByWfId: [],
    allTypesInWorkflow: [],
    allGroupsInWorkflowStage: [],
    allUsersInWorkflowStage: []
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
    },
    getAllUsersInWorkflowStage(state) {
      return state.allUsersInWorkflowStage;
    },
    getAllGroupsInWorkflowStage(state) {
      return state.allGroupsInWorkflowStage;
    },
    getAllTypesInWorkflow: (state) => state.allTypesInWorkflow
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
    },
    setAllUsersInWorkflowStage(state, allUsersInWorkflowStage) {
      state.allUsersInWorkflowStage = allUsersInWorkflowStage;
    },
    setAllGroupsInWorkflowStage(state, groups) {
      state.allGroupsInWorkflowStage = groups;
    },
    setAllTypesInWorkflow: (state, type) => state.allTypesInWorkflow = type
  },
  actions: {
    async fetchStageWorkflow({ commit, getters }, params) {
      try {
        /*if(params.type == 'reload')*/ commit('setStageWorkflow', [])
        //if(getters.getStageWorkflow.length === 0) {
          commit('setIsLoadStageWorkflow', true)
          const data = await axios.get('api/ks3/stageworkflow', {
            params: {
              _workflow_id: params.workflow_id || ''
            }
          })
          commit('setStageWorkflow', data.data.data)
          commit('setKs3ByWfId', data.data.ks3 || [])
          commit('setAllTypesInWorkflow', data.data.allTypesInWorkflow)
          commit('setAllGroupsInWorkflowStage', data.data.allGroupsInWorkflowStage || [])
          commit('setAllUsersInWorkflowStage', data.data.allUsersInWorkflowStage || [])
        //}
      }
      catch(e) {
        console.log(e)
      }
      finally {
        commit('setIsLoadStageWorkflow', false)
      }
    },
    async setSortWorkflowElement({ commit }, params) {
      await axios.post('api/ks3/sortworkflowelement', {
        params: params
      })
    },
    // Добавление/удаление групп в стадии
    async correctStageGroup({ commit }, params) {
      const data = await axios.post('api/workflow/stagegroup', {
        params: {
          workflow_id: params.workflow_id,
          group: params.group,
          stage_id: params.stage_id,
          type_id: params.type_id
        }
      })
      .then((data) => {
        return {
          success: true,
          data: data.data.data
        }
      })
      .catch((e) => {
        return {
          success: false,
          data: [],
          message: e.toString()
        }
      })
      return data
    },
    // Обноаление типа
    async updateType({ commit }, params) {
      try {
        const data = await axios.put('api/workflow/type', {
          params: {
            workflow_id: params.workflow_id,
            stage_id: params.stage_id,
            type_id: params.type_id,
            subtype_id: params.subtype_id,
            cascade: params.cascade
          }
        })
        return {
          success: true,
          data: data.data.data
        }
      }
      catch(e) {
        return {
          success: false,
          data: [],
          message: e.toString(),
        }
      }
    }
  }
}