import Vue from 'vue'
import VueRouter from 'vue-router'
import Matrix from '../views/Matrix.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/SARS-CoV-2',
    name: 'Matrix',
    component: Matrix
  },
  {
    path: '/covid19',
    name: 'Matrix',
    component: Matrix
  },
  {
    path: '/:id(\\d+)',
    name: 'Matrix',
    component: Matrix
  },
  {
    path: '/:id?/:pdbid?/:chainid?',
    name: 'Wrapper',
    component: () => import(/* webpackChunkName: "wrapper" */ '../views/Wrapper.vue') // lazy load
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
