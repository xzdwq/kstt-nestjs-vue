import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from 'vue-router'
import PageNotFound from '@/views/PageNotFound.vue'
import Register from '@/views/Register.vue'
import About from '@/views/About.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound
  },
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