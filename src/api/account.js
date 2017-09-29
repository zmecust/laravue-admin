import Vue from 'vue';

export default {
  // 登录
  login(res) {
    var params;
    params = {
      'login': res.username,
      'password': res.password
    }
    return Vue.http.post('https://api.laravue.org/api/v1/user/login', params);
  },
  // 获取菜单
  get_menu() {
    return Vue.http.get('https://api.laravue.org/api/v1/admin/menu');
  }
}