const locales = localStorage.getItem('locales') ? localStorage.getItem('locales') : 'ru';

export const localesSwitcherModule = {
  namespaced: true,
  state: () => ({
    locales: locales
  }),
  getters: {
    getLocales(state: any) {
      return state.locales
    }
  },
  mutations: {
    localesSwitch(state: any) {
      const newLocales = state.locales === 'ru' ? 'en' : 'ru'
      state.locales = newLocales;
      localStorage.setItem('locales', newLocales)
    }
  },
  actions: {
  },
  modules: {
  }
}