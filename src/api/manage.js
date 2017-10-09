import Vue from 'vue';

export default {
  get_sidebar_tree() {
    return Vue.http.get('admin/menu');
  },
  get_users(params) {
    return Vue.http.get('admin/users', params);
  },
  get_user(id) {
    return Vue.http.get('admin/users/' + id);
  },
  edit_user(id, params) {
    return Vue.http.patch('admin/users/' + id, params);
  },
  delete_user(id) {
    return Vue.http.delete('admin/users/' + id);
  },
  get_all_menus() {
    return Vue.http.get('admin/menus');
  },
  get_menu(id) {
    return Vue.http.get('admin/menus/' + id);
  },
  create_menu(params) {
    return Vue.http.post('admin/menus', params);
  },
  edit_menu(id, params) {
    return Vue.http.patch('admin/menus/' + id, params);
  },
  delete_menu(id) {
    return Vue.http.delete('admin/menus/' + id);
  },
  get_permissions(params) {
    return Vue.http.get('admin/permissions', params);
  },
  get_permission(id) {
    return Vue.http.get('admin/permissions/' + id);
  },
  group_permissions() {
    return Vue.http.get('admin/group_permissions');
  },
  create_permission(params) {
    return Vue.http.post('admin/permissions', params);
  },
  edit_permission(id, params) {
    return Vue.http.patch('admin/permissions/' + id, params);
  },
  delete_permission(id) {
    return Vue.http.delete('admin/permissions/' + id);
  },
  get_roles(params) {
    return Vue.http.get('admin/roles', params);
  },
  get_role(id) {
    return Vue.http.get('admin/roles/' + id);
  },
  create_role(params) {
    return Vue.http.post('admin/roles', params);
  },
  edit_role(id, params) {
    return Vue.http.patch('admin/roles/' + id, params);
  },
  delete_role(id) {
    return Vue.http.delete('admin/roles/' + id);
  },
}