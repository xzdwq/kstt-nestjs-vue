import axios from "axios";

export const workflowDefaultManagmentModule = {
  namespaced: true,
  state: () => ({
    isLoadWorkflowDefault: false,
    workflowDefault: { data: [] } // делаем еще одну вложенность для свободной сортировки
  }),
  getters: {
    getIsLoadWorkflowDefault: (state) => state.isLoadWorkflowDefault,
    getWorkflowDefault: (state) => state.workflowDefault
  },
  mutations: {
    setIsLoadWorkflowDefault: (state, load) => state.isLoadWorkflowDefault = load,
    setWorkflowDefault: (state, data) => state.workflowDefault.data = data
  },
  actions: {
    async fetchWorkflowDefault({ commit }) {
      try {
        commit('setWorkflowDefault', [])
        commit('setIsLoadWorkflowDefault', true)
        const data = await axios.get('api/defaultworkflow')
        commit('setWorkflowDefault', data.data.data)
      }
      catch(e) {
        console.log(e)
      }
      finally {
        commit('setIsLoadWorkflowDefault', false)
      }
    }
  }
}