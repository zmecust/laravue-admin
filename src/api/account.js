import Vue from 'vue';

export default {
  // 登录
  login(res) {
    var params;
    params = {
      'login': res.username,
      'password': res.password
    }
    return Vue.http.post('user/login', params);
  },
  // 登出
  logout() {
    return Vue.http.get('user/logout');
  },
  // 获取菜单
  get_menu() {
    return Vue.http.get('admin/menu');
  }
}