import { createApp } from "vue"
import mitt from 'mitt';
const emitter = mitt();
import App from "@/App.vue"
import router from "@/router/router"
import store from "@/store/store"
import components from "@/components/components"
import directives from '@/directives';

import VueClickAway from "vue3-click-away";
import dragged from 'vuedraggable'
import VueCollapsiblePanel from '@dafcoe/vue-collapsible-panel'
import Multiselect from '@vueform/multiselect'
import { DraggablePlugin, DraggableDirective } from '@braks/revue-draggable';

import i18n from '@/plugins/i18n'

import "@/css/main.css"
import '@dafcoe/vue-collapsible-panel/dist/vue-collapsible-panel.css'
import '@vueform/multiselect/themes/default.css'
import 'tippy.js/dist/tippy.css';


const app = createApp(App)

app.config.globalProperties.emitter = emitter

components.forEach(component => {
  app.component(component.name, component)
})

app.component('draggable', dragged)
app.component('multiselect', Multiselect)
// app.component('draggable', Draggable);

directives.forEach(directive => {
  app.directive(directive.name, directive)
})
app.directive('dragged', DraggableDirective)

app
  .use(store)
  .use(router)
  .use(i18n)
  .use(VueClickAway)
  .use(VueCollapsiblePanel)
  .use(DraggablePlugin)
  .mount('#app')