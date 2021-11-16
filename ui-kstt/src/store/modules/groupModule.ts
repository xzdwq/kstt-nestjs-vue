import axios from "axios";

export const groupModule = {
  namespaced: true,
  state: () => ({
    isLoading: false,
    group: [],
    isGroupTypeLoading: false,
    groupType: []
  }),
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    },
    getGroup(state) {
      return state.group
    },
    getIsGroupTypeLoading(state) {
      return state.isGroupTypeLoading;
    },
    getGroupType(state) {
      return state.groupType
    }
  },
  mutations: {
    setIsLoading(state, loading) {
      state.isLoading = loading;
    },
    setGroup(state, data) {
      state.group = data;
    },
    setGroupTypeLoading(state, loading) {
      state.isGroupTypeLoading = loading;
    },
    setGroupType(state, data) {
      state.groupType = data;
    },
  },
  actions: {
    async fetchGroup({ commit }) {
      try {
        commit('setIsLoading', true)
        commit('setGroup', [])
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
      const data = await axios.post('api/ks3/stagegroup', {
        params: {
          group: params.group,
          stage_id: params.stage_id,
          workflow_id: params.workflow_id
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
    // Загрузка типов групп
    async fetchGroupType({ commit }) {
      try {
        commit('setGroupTypeLoading', true)
        commit('setGroupType', [])
        const data = await axios.get('api/grouptype')
        commit('setGroupType', data.data.data)
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
        commit('setGroupTypeLoading', false)
      }
    },
    async updateGroupType({ commit }, params) {
      await axios.put('api/grouptype', {
        params: {
          group_id: params.group_id,
          group_type: params.group_type,
          stage_id: params.stage_id,
          workflow_id: params.workflow_id,
          cascade: params.cascade
        }
      })
    },
    // Создание новой группы
    async createNewGroup({}, params) {
      await axios.post('api/creategroup', {
        params
      })
    }
  }
}