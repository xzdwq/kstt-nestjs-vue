export const bellNotificationModule = {
  namespaced: true,
  state: () => ({
    notification: 3
  }),
  getters: {
    getNotification(state: any) {
      return state.notification
    }
  },
  mutations: {
    readNotification(state: any) {
      state.notification = 0;
    }
  }
}