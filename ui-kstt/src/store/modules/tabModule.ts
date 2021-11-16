export const tabModule = {
  namespaced: true,
  state: () => ({
    tab: {
      cog: [],
      ks2form: []
    }
  }),
  getters: {
    gettab_ks2form: (state) => state.tab.ks2form,
    gettab_cog: (state) => state.tab.cog
  },
  mutations: {
    settab_ks2form: (state, tab) => state.tab.ks2form = tab,
    settab_cog: (state, tab) => state.tab.cog = tab
  }
}