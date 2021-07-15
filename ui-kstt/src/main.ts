import { createApp } from "vue"
import App from "@/App.vue"
import router from "@/router/router"
import store from "@/store/store"
import components from "@/components/components"

import i18n from '@/plugins/i18n'

import "@/css/main.css"


const app = createApp(App)

components.forEach(component => {
  app.component(component.name, component)
})

app
  .use(store)
  .use(router)
  .use(i18n)
  .mount('#app')