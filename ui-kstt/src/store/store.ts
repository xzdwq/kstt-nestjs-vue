import { createStore } from 'vuex'
import { localesSwitcherModule } from "@/store/modules/localesSwitcher";
import { themeSwitcherModule } from "@/store/modules/themeSwitcher";
import { bellNotificationModule } from "@/store/modules/bellNotification";
import { cryptoConfigurationModule } from "@/store/modules/cryptoConfiguration"
import { ks3Module } from "@/store/modules/ks3Module"

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
    cryptoConfigurationModule,
    ks3Module
  }
})
