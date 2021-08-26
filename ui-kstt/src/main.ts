import { createApp } from "vue"
import mitt from 'mitt';
const emitter = mitt();
import Popper from "vue3-popper";
import App from "@/App.vue"
import router from "@/router/router"
import store from "@/store/store"
import components from "@/components/components"
import directives from '@/directives';

import VueClickAway from "vue3-click-away";
import draggable from 'vuedraggable'
import VueCollapsiblePanel from '@dafcoe/vue-collapsible-panel'

import i18n from '@/plugins/i18n'

import "@/css/main.css"
import '@dafcoe/vue-collapsible-panel/dist/vue-collapsible-panel.css'


const app = createApp(App)

app.config.globalProperties.emitter = emitter

components.forEach(component => {
  app.component(component.name, component)
})

app.component('popper', Popper)
app.component('draggable', draggable)

directives.forEach(directive => {
  app.directive(directive.name, directive)
})

app
  .use(store)
  .use(router)
  .use(i18n)
  .use(VueClickAway)
  .use(VueCollapsiblePanel)
  .mount('#app')