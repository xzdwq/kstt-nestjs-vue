import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from 'vue-router'
import Register from '@/views/Register.vue'
import About from '@/views/About.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Register
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