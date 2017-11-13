import Vue from 'vue';

export default {
  get_sidebar_tree: {
    permission: '',
    request: () => {
      return Vue.http.get('admin/menu');
    }
  },
  get_users: {
    permission: 'users.index',
    request: (params) => {
      return Vue.http.get('admin/users', params);
    }
  },
  get_user: {
    permission: 'users.show',
    request: (id) => {
      return Vue.http.get('admin/users/' + id);
    }
  },
  edit_user: {
    permission: 'users.update',
    request: (id, params) => {
      return Vue.http.patch('admin/users/' + id, params);
    }
  },
  delete_user: {
    permission: 'users.destroy',
    request: (id) => {
      return Vue.http.delete('admin/users/' + id);
    }
  },
  get_all_menus: {
    permission: 'menus.index',
    request: (id) => {
      return Vue.http.get('admin/menus');
    }
  },
  get_menu: {
    permission: 'menus.show',
    request: (id) => {
      return Vue.http.get('admin/menus/' + id);
    }
  },
  create_menu: {
    permission: 'menus.store',
    request: (params) => {
      return Vue.http.post('admin/menus', params);
    }
  },
  edit_menu: {
    permission: 'menus.update',
    request: (id, params) => {
      return Vue.http.patch('admin/menus/' + id, params);
    }
  },
  delete_menu: {
    permission: 'menus.destroy',
    request: (id) => {
      return Vue.http.delete('admin/menus/' + id);
    }
  },
  get_permissions: {
    permission: 'permissions.index',
    request: (params) => {
      return Vue.http.get('admin/permissions', params);
    }
  },
  get_permission: {
    permission: 'permissions.show',
    request: (id) => {
      return Vue.http.get('admin/permissions/' + id);
    }
  },
  group_permissions: {
    permission: '',
    request: () => {
      return Vue.http.get('admin/group_permissions');
    }
  },
  create_permission: {
    permission: 'permissions.store',
    request: (params) => {
      return Vue.http.post('admin/permissions', params);
    }
  },
  button_permission: {
    permission: '',
    request: (params) => {
      return Vue.http.get('admin/button_permissions');
    }
  },
  edit_permission: {
    permission: 'permissions.update',
    request: (id, params) => {
      return Vue.http.patch('admin/permissions/' + id, params);
    }
  },
  delete_permission: {
    permission: 'permissions.destroy',
    request: (id) => {
      return Vue.http.delete('admin/permissions/' + id);
    }
  },
  get_roles: {
    permission: 'roles.index',
    request: (params) => {
      return Vue.http.get('admin/roles', params);
    }
  },
  get_role: {
    permission: 'roles.show',
    request: (id) => {
      return Vue.http.get('admin/roles/' + id);
    }
  },
  create_role: {
    permission: 'roles.store',
    request: (params) => {
      return Vue.http.post('admin/roles', params);
    }
  },
  edit_role: {
    permission: 'roles.update',
    request: (id, params) => {
      return Vue.http.patch('admin/roles/' + id, params);
    }
  },
  delete_role: {
    permission: 'roles.destroy',
    request: (id) => {
      return Vue.http.delete('admin/roles/' + id);
    }
  }
}
