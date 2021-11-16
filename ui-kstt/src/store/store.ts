import { createStore } from 'vuex'
import { authModule } from '@/store/modules/authModule'
import { localesSwitcherModule } from "@/store/modules/localesSwitcher";
import { themeSwitcherModule } from "@/store/modules/themeSwitcher";
import { bellNotificationModule } from "@/store/modules/bellNotification";
import { cryptoConfigurationModule } from "@/store/modules/cryptoConfiguration"
import { ks3Module } from "@/store/modules/ks3Module"
import { ks3idModule } from "@/store/modules/ks3idModule"
import { ks2idModule } from "@/store/modules/ks2idModule"
import { groupModule } from "@/store/modules/groupModule"
import { workflowManagmentModule } from "@/store/modules/workflowManagmentModule"
import { workflowDefaultManagmentModule } from "@/store/modules/workflowDefaultManagmentModule"
import { expandStageInKS3IdModule } from "@/store/modules/expandStageInKS3Id"
import { tabModule } from '@/store/modules/tabModule'
import { countTitleModule } from '@/store/modules/countTitleModule'

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
    authModule,
    localesSwitcherModule,
    themeSwitcherModule,
    bellNotificationModule,
    cryptoConfigurationModule,
    ks3Module,
    ks3idModule,
    ks2idModule,
    groupModule,
    workflowManagmentModule,
    workflowDefaultManagmentModule,
    expandStageInKS3IdModule,
    tabModule,
    countTitleModule
  }
})
