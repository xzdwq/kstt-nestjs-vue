export const countTitleModule = {
  namespaced: true,
  state: () => ({
    cntOtherFile: 0,
    cntHistory: 0,
    cntComments: 0
  }),
  getters: {
    getCntOtherFile: (state) => state.cntOtherFile,
    getCntHistory: (state) => state.cntHistory,
    getCntComments: (state) => state.cntComments,
  },
  mutations: {
    setCntOtherFile:(state, cnt) => state.cntOtherFile = cnt,
    setCntHistory:(state, cnt) => state.cntHistory = cnt,
    setCntComments:(state, cnt) => state.cntComments = cnt
  }
}