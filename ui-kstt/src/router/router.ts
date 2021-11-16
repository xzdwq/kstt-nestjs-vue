import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from 'vue-router'
import Login from '@/views/Login.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import Register from '@/views/Register.vue'
import About from '@/views/About.vue'
import KS3idPage from '@/views/KS3idPage.vue'
import WorkflowManagmentDefault from '@/views/WorkflowManagmentDefault.vue'
import WorkflowMangmentPage from '@/views/WorkflowMangmentPage.vue'
import KS2id from '@/views/KS2id.vue'
import KS2Workflow from '@/views/KS2Workflow.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound
  },
  {
    path: '/login',
    component: Login
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
    path: '/ks2/:id',
    component: KS2id
  },
  {
    path: '/ks2/:id/workflow',
    component: KS2Workflow
  },
  {
    path: '/workflowmanagment',
    component: WorkflowManagmentDefault
  },
  {
    path: '/workflowmanagment/:workflow_id',
    component: WorkflowMangmentPage
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