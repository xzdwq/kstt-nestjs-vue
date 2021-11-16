export const authModule = {
  namespaced: true,
  state: () => ({
    auth: false,
    user: {},
    // Управление ролями
    roleManagment: ['admin'],
    // Настройка маршрута согласования по умолчанию
    workflowManagment: ['admin', 'manager'],
    // Редактирование метаданных КС-3
    metadataKs3: ['admin', 'manager', 'editor'],
    // Маршрут согласования для конкретной КС-3 / КС-2
    workflowManagmentKS3: ['admin', 'manager', 'editor'],
    // Удаление КС-2
    KS2Delete: ['admin', 'manager'],
    // Загрузка файлов КС-2 Excel, КС-6а
    KS2FileExcelKS6a: ['admin', 'manager', 'editor'],
    // Загрузка/удаление прочих файлов к КС-2
    KS2OtherFile: ['admin', 'manager', 'editor', 'negotiator_ks2'],
    // Действия с реестром актов КС-2
    KS2RegisterActions: ['admin', 'manager', 'editor', 'negotiator_ks2'],
    // Действия для участника согласования КС-2
    negotiatorKS2: ['negotiator_ks2'],
  }),
  getters: {
    getAuth: (state) => state.auth,
    getUser: (state: any) => state.user,
  },
  mutations: {
    setAuth: (state, auth) => state.auth = auth,
    setUser: (state, user) => state.user = user
  },
  actions: {
    matchRole({ commit, state }, stateType) {
      const roles = state[stateType]
      let check
      for(let accessRole of roles) {
        let matchRole = state.user.DB.user_role.find(dbRole => dbRole.role.code === accessRole)
        if(matchRole) {
          check = matchRole.role
          break
        }
      }
      if(check) {
        return true
      }
      return false
    }
  }
}