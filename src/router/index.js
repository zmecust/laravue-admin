import Vue from 'vue'
import store from '../store'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from '../views/layout/Layout'

const _import = require('./_import')
Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    component: _import('account/Login'),
    hidden: true
  },
]

export const asyncRouterMap = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      requireAuth: true
    },
    name: '首页',
    noDropdown: true,
    children: [{ path: 'dashboard', component: _import('dashboard/Dashboard') }]
  },
  {
    path: '/hotel',
    component: Layout,
    redirect: '/hotel/index',
    meta: {
      requireAuth: true
    },
    name: '酒店管理',
    noDropdown: true,
    children: [{ path: 'index', component: _import('hotel/index'), hidden: true }]
  }
]

const router = new Router({
  routes: constantRouterMap
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  // if (to.matched.some(record => record.meta.requireAuth)) {
  //   const auth = store.state.account.auth;
  //   // this route requires auth, check if logged in
  //   // if not, redirect to login page.
  //   if (!auth.check()) {
  //     next({
  //       path: '/login',
  //       query: { redirect_url: to.fullPath }
  //     });
  //     return;
  //   } else {
  //     store.dispatch('generateRoutes').then(() => {  //分发action,调用generateRoutes方法
  //       router.addRoutes(store.getters.addRouters)
  //       next();
  //     })
  //   }
  // }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;