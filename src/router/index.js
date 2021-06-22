import Vue from 'vue'
import VueRouter from 'vue-router'
import Matrix from '../views/Matrix.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/covid19',
    name: 'Matrix',
    component: Matrix
  },
  {
    path: '/SARS-CoV-2',
    alias: '/covid19',
    component: Matrix
  },
  {
    path: '/:id(\\d+)',
    alias: '/covid19',
    component: Matrix
  },
  {
    path: '/coverage/:organism?',
    name: 'Coverage',
    component: () => import(/* webpackChunkName: "wrapper" */ '../views/Coverage.vue') // lazy load
  },
  {
    path: '/:id?/:pdbid?/:chainid?/:chain?',
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
