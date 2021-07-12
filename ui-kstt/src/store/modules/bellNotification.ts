import axios from "axios";

export const bellNotificationModule = {
  namespaced: true,
  state: () => ({
    notificationCount: 0,
    notification: [],
    page: 1,
    limit: 10,
    totalPages: 0,
    isLoading: false
  }),
  getters: {
    getCountNotifications(state: any) {
      return state.notificationCount
    },
    getNotifications(state: any) {
      return state.notification
    },
    getPage(state: any) {
      return state.page
    },
    getTotalPage(state: any) {
      return state.totalPages
    }
  },
  mutations: {
    readNotification(state: any) {
      state.notificationCount = 0
    },
    setNotificationCount(state, count) {
      state.notificationCount = count
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
    }
  },
  actions: {
    async fetchNotifications({ state, commit }) {
      try {
        commit('setIsLoading', true);
        const data = await axios.get(`api/notification/${state.user_id || 1}`, {
          params: {
            _page: state.page,
            _limit: state.limit
          }
        });
        commit('setNotificationCount', data.data.total)
        commit('setTotalPages', Math.ceil(data.data.total / state.limit))
        commit('setNotifications', data.data.data)
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
    }
  }
}