import axios from "axios";

export const workflowDefaultManagmentModule = {
  namespaced: true,
  state: () => ({
    isLoadWorkflowDefault: false,
    workflowDefault: { data: [] }, // делаем еще одну вложенность для свободной сортировки
    allTypesInWorkflow: [],
    allGroupInWorkflow: [],
    allUsersInWorkflow: []
  }),
  getters: {
    getIsLoadWorkflowDefault: (state) => state.isLoadWorkflowDefault,
    getWorkflowDefault: (state) => state.workflowDefault,
    getAllGroupInWorkflow: (state) => state.allGroupInWorkflow,
    getAllUsersInWorkflow: (state) => state.allUsersInWorkflow,
    getAllTypesInWorkflow: (state) => state.allTypesInWorkflow
  },
  mutations: {
    setIsLoadWorkflowDefault: (state, load) => state.isLoadWorkflowDefault = load,
    setWorkflowDefault: (state, data) => state.workflowDefault.data = data,
    setAllGroupInWorkflow: (state, data) => state.allGroupInWorkflow = data,
    setAllUsersInWorkflow: (state, data) => state.allUsersInWorkflow = data,
    setAllTypesInWorkflow: (state, data) => state.allTypesInWorkflow = data
  },
  actions: {
    async fetchWorkflowDefault({ commit }) {
      try {
        commit('setWorkflowDefault', [])
        commit('setIsLoadWorkflowDefault', true)
        const data = await axios.get('api/defaultworkflow')
        commit('setWorkflowDefault', data.data.data)
        commit('setAllGroupInWorkflow', data.data.allGroupInWorkflow)
        commit('setAllUsersInWorkflow', data.data.allUsersInWorkflow)
        commit('setAllTypesInWorkflow', data.data.allTypesInWorkflow)
      }
      catch(e) {
        console.log(e)
      }
      finally {
        commit('setIsLoadWorkflowDefault', false)
      }
    },
    // Обновление сортировки
    async setDefaultSortWorkflowElement({ commit }, params) {
      const data = await axios.post('api/sortdefaultworkflowelement', {
        params: params
      })
    },
    // Добавление/удаление групп в стадии
    async defCorrectStageGroup({ commit }, params) {
      const data = await axios.post('api/defaultworkflow/stagegroup', {
        params: {
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
    // Обновление типа групп
    async defUpdateGroupType({ commit }, params) {
      try {
        const data = await axios.put('api/defaultworkflow/grouptype', {
          params: {
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