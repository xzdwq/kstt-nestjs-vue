import { createStore } from 'vuex'
import { localesSwitcherModule } from "@/store/modules/localesSwitcher";
import { themeSwitcherModule } from "@/store/modules/themeSwitcher";
import { bellNotificationModule } from "@/store/modules/bellNotification";

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
    localesSwitcherModule,
    themeSwitcherModule,
    bellNotificationModule
  }
})
