import { createStore } from 'vuex'
import { themeSwitcherModule } from "@/store/modules/themeSwitcher";
import { bellNotification } from "@/store/modules/bellNotification";

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    themeSwitcherModule,
    bellNotification
  }
})
