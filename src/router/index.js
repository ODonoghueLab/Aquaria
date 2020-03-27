import Vue from 'vue'
import VueRouter from 'vue-router'
import Wrapper from '../views/Wrapper.vue'
import Matrix from '../views/Matrix.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/SARS-CoV-2',
    name: 'Matrix',
    component: Matrix
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/orgID/:id',
    name: 'Matrix',
    component: Matrix
  },
  {
    path: '/:id/:pdbid?/:chainid?',
    name: 'Wrapper',
    component: Wrapper
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
