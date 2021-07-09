const theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'theme-light';

export const themeSwitcherModule = {
  namespaced: true,
  state: () => ({
    theme: theme
  }),
  getters: {
    getTheme(state: any) {
      return state.theme
    }
  },
  mutations: {
    themeSwitch(state: any) {
      const newTheme = state.theme === 'theme-light' ? 'theme-dark' : 'theme-light'
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme)
    }
  },
  actions: {
  },
  modules: {
  }
}