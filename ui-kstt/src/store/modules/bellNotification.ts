import axios from "axios";

export const bellNotificationModule = {
  namespaced: true,
  state: () => ({
    notificationCount: 0,
    notification: []
  }),
  getters: {
    getCountNotifications(state: any) {
      return state.notificationCount
    },
    getNotifications(state: any) {
      return state.notification
    }
  },
  mutations: {
    readNotification(state: any) {
      state.notificationCount = 0;
    },
    setNotificationCount(state, count) {
      state.notificationCount = count;
    },
    setNotifications(state, notification) {
      state.notification = notification;
    },
  },
  actions: {
    async fetchNotifications({ state, commit }) {
      try {
        const data = await axios.get(`api/notification/${state.user_id || 1}`);
        commit('setNotificationCount', data.data.length)
        commit('setNotifications', data.data)
      } catch(e) { console.log(e) }
    }
  }
}