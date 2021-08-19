import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from 'vue-router'
import PageNotFound from '@/views/PageNotFound.vue'
import Register from '@/views/Register.vue'
import About from '@/views/About.vue'
import KS3idPage from '@/views/KS3idPage.vue'
import UserGroupPage from '@/views/UserGroupPage.vue'

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
    path: '/ks3/:id',
    component: KS3idPage
  },
  {
    path: '/usergroup',
    component: UserGroupPage
  },
  {
    path: '/usergroup/:workflow_id',
    component: UserGroupPage
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