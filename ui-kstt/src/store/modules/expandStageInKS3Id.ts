export const expandStageInKS3IdModule = {
  namespaced: true,
  state: () => ({
    expandHeightClass: 'h-[calc(100vh-415px)] duration-100',
    noExpandHeightClass: 'h-[calc(100vh-295px)] duration-500',
  }),
  getters: {
    getExpandHeightClass: (state) => state.expandHeightClass,
    getNoExpandHeightClass: (state) => state.noExpandHeightClass
  }
}