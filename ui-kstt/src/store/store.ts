import { createStore } from 'vuex'
import { localesSwitcherModule } from "@/store/modules/localesSwitcher";
import { themeSwitcherModule } from "@/store/modules/themeSwitcher";
import { bellNotificationModule } from "@/store/modules/bellNotification";
import { cryptoConfigurationModule } from "@/store/modules/cryptoConfiguration"
import { ks3Module } from "@/store/modules/ks3Module"
import { ks3idModule } from "@/store/modules/ks3idModule"
import { ks2idModule } from "@/store/modules/ks2idModule"
import { groupModule } from "@/store/modules/groupModule"
import { usergroupModule } from "@/store/modules/usergroupModule"

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
    ks3Module,
    ks3idModule,
    ks2idModule,
    groupModule,
    usergroupModule
  }
})
