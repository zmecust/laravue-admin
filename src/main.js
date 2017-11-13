// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.css'

Vue.use(ElementUI)
Vue.config.productionTip = false

// 注册一个全局自定义指令 v-has, 判断按钮级权限
Vue.directive('has', {
  inserted: function(el, binding) {
    console.log(el);
    el.disabled = "disabled: \"disabled\"";
  }
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
