import Vue from 'vue'
import store from '../store'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from '../views/layout/Layout'

const _import = require('./_import')
Vue.use(Router)

export const constantRouterMap = [
  { path: '/', component: _import('account/Login'), hidden: true },
  {
    path: '/',
    component: Layout,
    name: '首页',
    noDropdown: true,
    children: [{ path: 'dashboard', component: _import('dashboard/Dashboard') }]
  }
] //路由白名单

export const asyncRouterMap = [
  {
    path: '/parent/setting',
    component: Layout,
    name: '系统管理',
    noDropdown: false,
    children: [
      { path: '/menus/index', component: _import('manage/Menus'), hidden: true },
      { path: '/permissions/index', component: _import('manage/Permissions'), hidden: true },
      { path: '/roles/index', component: _import('manage/Roles'), hidden: true },
      { path: '/users/index', component: _import('manage/Users'), hidden: true }
    ]
  }
]

const router = new Router({
  routes: constantRouterMap
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  const auth = store.state.account.auth;
  if (!auth.check()) {
    next({
      path: '/login',
      query: { redirect_url: to.fullPath }
    });
    return;
  }

  if (store.getters.menus === null) {
    store.dispatch('getMenus').then(() => {
      store.dispatch('generateRoutes').then(() => {
        router.addRoutes(store.getters.addRouters)
      });
      next();
    })
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;