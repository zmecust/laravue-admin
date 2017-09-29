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
    path: '/dashboard',
    component: Layout,
    name: '首页',
    noDropdown: true,
    children: [{ path: 'dashboard', component: _import('dashboard/Dashboard'), name: '首页' }]
  }
] //路由白名单

export const asyncRouterMap = [
  {
    path: '/parent/setting',
    component: Layout,
    name: '系统管理',
    noDropdown: false,
    children: [
      { path: '/menus/index', component: _import('manage/Menus'), name: '菜单列表' },
      { path: '/permissions/index', component: _import('manage/Permissions'), name: '权限列表' },
      { path: '/roles/index', component: _import('manage/Roles'), name: '角色列表' },
      { path: '/users/index', component: _import('manage/Users'), name: '用户列表' }
    ]
  }
]

const router = new Router({
  routes: constantRouterMap
})


const whiteList = ['/'] // 不重定向白名单
let ifRouteFresh = true // 解决刷新重新加载路由
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (!store.state.account.auth.check()) { // 判断是否登录
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      // 否则全部重定向到登录页
      next({
        path: '/',
        query: { redirect_url: to.fullPath }
      });
    }
  } else {
    if (ifRouteFresh) {
      ifRouteFresh = false;
      store.dispatch('getMenus').then((res) => {
        let menus = res.data.data;
        store.dispatch('generateRoutes', { menus }).then(() => {
          router.addRoutes(store.getters.addRouters)
          next({ ...to });
        });
      })
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
