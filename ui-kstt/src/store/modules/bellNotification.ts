import axios from "axios";

export const bellNotificationModule = {
  namespaced: true,
  state: () => ({
    notificationCount: 0,
    notification: [],
    page: 1,
    limit: 10,
    totalPages: 0,
    isLoading: false,
    readNewNotification: 0,
    idReadNotification: [],
    totalNotification: 0
  }),
  getters: {
    getCountNotifications(state: any) {
      return state.notificationCount
    },
    getTotalNotifications(state: any) {
      return state.totalNotification
    },
    getNotifications(state: any) {
      return state.notification
    },
    getPage(state: any) {
      return state.page
    },
    getTotalPage(state: any) {
      return state.totalPages
    },
    getReadNewNotification(state: any) {
      return state.readNewNotification
    },
    getIdReadNotification(state: any) {
      return state.idReadNotification
    }
  },
  mutations: {
    setNotificationCount(state, count) {
      state.notificationCount = count;
    },
    setTotalNotifications(state, count) {
      state.totalNotification = count
    },
    setNotifications(state, notification) {
      state.notification = notification
    },
    setPage(state, page) {
      state.page = page
    },
    setTotalPages(state, totalPages) {
      state.totalPages = totalPages
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setReadNewNotification(state, count) {
      state.readNewNotification += count
    },
    setIdReadNotification(state, id) {
      state.idReadNotification.push(id)
    },
    mutationReadNotification(state, id) {
      const findById = state.notification.find(item => item.id === id)
      findById.status = findById.status === 1 ? 0 : 1
    },
    sortNotification(state) {
      state.notification.sort((a, b) => a.status - b.status);
    }
  },
  actions: {
    async fetchNotifications({ state, commit }) {
      try {
        commit('setPage', 1)
        commit('setTotalPages', 0)
        commit('setIsLoading', true);
        const data = await axios.get(`api/notification/${state.user_id || 1}`, {
          params: {
            _page: state.page,
            _limit: state.limit
          }
        });
        commit('setNotificationCount', data.data.totalNotRead)
        commit('setTotalPages', Math.ceil(data.data.total / state.limit))
        commit('setNotifications', data.data.data)
        commit('setTotalNotifications', data.data.total)
      }
      catch(e) { console.log(e) }
      finally { commit('setIsLoading', false); }
    },
    async fetchMoreNotification({ state, commit }) {
      try {
        commit('setIsLoading', true);
        commit('setPage', state.page + 1)
        const data = await axios.get(`api/notification/${state.user_id || 1}`, {
          params: {
            _page: state.page,
            _limit: state.limit
          }
        });
        commit('setTotalPages', Math.ceil(data.data.total / state.limit))
        commit('setNotifications', [...state.notification, ...data.data.data]);
      }
      catch(e) { console.log(e) }
      finally { commit('setIsLoading', false); }
    },
    async fetchReadNotifications({ state, commit, getters }, params) {
      const newStatus = params.status === 1 ? 0 : 1
      await axios.post(`api/notification/${state.user_id || 1}`, {
        params: {
          notification_id: params.id,
          status: newStatus
        }
      });
      const currentStatus = params.status === 1 ? 1 : -1
      commit('setNotificationCount', getters.getCountNotifications + currentStatus)
      commit('mutationReadNotification', params.id)
      commit('sortNotification')
    }
  }
}