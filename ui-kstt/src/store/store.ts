import { createStore } from 'vuex'
import { localesSwitcherModule } from "@/store/modules/localesSwitcher";
import { themeSwitcherModule } from "@/store/modules/themeSwitcher";
import { bellNotificationModule } from "@/store/modules/bellNotification";
import { cryptoConfigurationModule } from "@/store/modules/cryptoConfiguration"

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
    bellNotificationModule,
    cryptoConfigurationModule
  }
})
