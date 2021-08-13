import axios from "axios";

export const groupModule = {
  namespaced: true,
  state: () => ({
    isLoading: false,
    group: []
  }),
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    },
    getGroup(state) {
      return state.group
    },
  },
  mutations: {
    setIsLoading(state, loading) {
      state.isLoading = loading;
    },
    setGroup(state, data) {
      state.group = data;
    },
  },
  actions: {
    async fetchGroup({ commit }) {
      try {
        commit('setIsLoading', true)
        const data = await axios.get('api/group')
        commit('setGroup', data.data.data)
        return {
          success: true,
          data: data.data.data
        }
      } catch(e) {
        return {
          success: false,
          data: [],
          message: e.toString()
        }
      }
      finally {
        commit('setIsLoading', false)
      }
    },
    async correctStageGroup({ commit }, params) {
      const data = await axios.post('api/group', {
        params: {
          group: params.group,
          stage: params.stage
        }
      })
      console.log(data)
    }
  }
}