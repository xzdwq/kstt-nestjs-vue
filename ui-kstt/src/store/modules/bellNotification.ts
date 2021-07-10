export const bellNotification = {
  namespaced: true,
  state: () => ({
    notification: 3
  }),
  getters: {
    getNotification(state: any) {
      return state.notification
    }
  }
}