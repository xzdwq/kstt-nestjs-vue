import axios from "axios";

export const workflowDefaultManagmentModule = {
  namespaced: true,
  state: () => ({
    isLoadWorkflowDefault: false,
    workflowDefault: { data: [] }, // делаем еще одну вложенность для свободной сортировки
    allGroupInWorkflow: [],
    allUsersInWorkflow: []
  }),
  getters: {
    getIsLoadWorkflowDefault: (state) => state.isLoadWorkflowDefault,
    getWorkflowDefault: (state) => state.workflowDefault,
    getAllGroupInWorkflow: (state) => state.allGroupInWorkflow,
    getAllUsersInWorkflow: (state) => state.allUsersInWorkflow
  },
  mutations: {
    setIsLoadWorkflowDefault: (state, load) => state.isLoadWorkflowDefault = load,
    setWorkflowDefault: (state, data) => state.workflowDefault.data = data,
    setAllGroupInWorkflow: (state, data) => state.allGroupInWorkflow = data,
    setAllUsersInWorkflow: (state, data) => state.allUsersInWorkflow = data
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
    }
  }
}