import Vue from 'vue';
import VueResource from 'vue-resource';
import store from '../store';
import account from './account';
import manage from './manage';
import article from './article';

Vue.use(VueResource); //引入vue-resource

Vue.http.options.root = process.env.API_URL; // 配置 api 根地址
Vue.http.headers.common.Accept = `application/json`; // 设置请求头

Vue.http.interceptors.push((request, next) => {
  const auth = store.state.account.auth;
  if (auth.check()) {
    const accessToken = auth.access_token;
    Vue.http.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete Vue.http.headers.common.Authorization;
  }
  next();
}); // 请求过滤

export default {
  account,
  manage,
  article
}