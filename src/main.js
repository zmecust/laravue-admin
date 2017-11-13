// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import hasPermission from './utils/has-permission'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.css'

Vue.use(ElementUI)
Vue.config.productionTip = false

// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  methods: {
    has(data) {
      let permissions = store.getters.button_permission;
      if (!permissions[data.permission]) {
        return false;
      }
      return true;
    }
  }
})

// 注册一个全局自定义指令 v-has, 判断按钮级权限, 如果没有权限则按钮禁用
Vue.directive('has', hasPermission)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
