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
    localesSwitch(state, params) {
      let newLocales
      if(!params.forced && params.locale) {
        params.locale === 'ru' ? newLocales = 'ru' : newLocales = 'en'
      }
      if(params.forced) newLocales = state.locales === 'ru' ? 'en' : 'ru'
      state.locales = newLocales;
      localStorage.setItem('locales', newLocales)
    }
  },
  actions: {
  },
  modules: {
  }
}