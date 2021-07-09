import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from 'vue-router'
import Index from '@/views/Index.vue'
import About from '@/views/About.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/about',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL+'#'),
  routes
})

export default router