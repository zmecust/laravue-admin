import Vue from 'vue';
import api from '../../api';
import * as types from '../mutation-types';

const AUTH_ACCESS_TOKEN = 'auth.access_token';
const AUTH_USER = 'auth.user';
const AUTH_USER_ID = 'auth.id';

const localStorage = global.localStorage;
const sessionStorage = global.sessionStorage;
const JSON = global.JSON;

export default {
  state: {
    auth: {
      check() {
        return this.id !== null && this.id !== 0;
      },
      access_token: JSON.parse(localStorage.getItem(AUTH_ACCESS_TOKEN)),
      id: parseInt(localStorage.getItem(AUTH_USER_ID), 10) || 0,
      user: JSON.parse(localStorage.getItem(AUTH_USER)),
    },
    login: {
      success: false,
      failure: null,
    },
    register: {
      success: false,
      failure: null,
    },
    button_permission: '',
  },
  mutations: {
    ACCOUNT_AUTH_STATUS_CHANGED: (state, data) => {
      if (!data.status) {
        Vue.set(state.auth, 'access_token', null);
        Vue.set(state.auth, 'id', 0);
        Vue.set(state.auth, 'user', null);
        localStorage.removeItem(AUTH_ACCESS_TOKEN);
        localStorage.removeItem(AUTH_USER_ID);
        localStorage.removeItem(AUTH_USER);
        return;
      }
      Vue.set(state.auth, 'access_token', data.data.jwt_token.access_token);
      Vue.set(state.auth, 'id', data.data.id);
      Vue.set(state.auth, 'user', data.data);
      localStorage.setItem(AUTH_ACCESS_TOKEN, JSON.stringify(data.data.jwt_token.access_token));
      localStorage.setItem(AUTH_USER_ID, data.data.id);
      localStorage.setItem(AUTH_USER, JSON.stringify(data.data));
    },
    ACCOUNT_LOGIN_SUCCESS: state => {
      Vue.set(state.login, 'success', true);
    },
    ACCOUNT_LOGIN_FAILURE: (state, data) => {
      Vue.set(state.login, 'success', false);
      Vue.set(state.login, 'failure', data);
    },
    ACCOUNT_REGISTER_SUCCESS: state => {
      Vue.set(state.register, 'success', true);
    },
    ACCOUNT_REGISTER_FAILURE: (state, data) => {
      Vue.set(state.register, 'success', false);
      Vue.set(state.register, 'failure', data);
    },
    BUTTON_PERMISSION: (state, data) => {
      Vue.set(state, 'button_permission', data);
    },
  },
  actions: {
    accountLoginSubmit({ commit }, params) {
      api.account.login(params).then(response => {
        if (response.data.status) {
          commit(types.ACCOUNT_AUTH_STATUS_CHANGED, response.data);
          commit(types.ACCOUNT_LOGIN_SUCCESS);
        } else {
          commit(types.ACCOUNT_LOGIN_FAILURE, response.data);
        }
      });
    },
    accountLogoutSubmit({ commit }) {
      api.account.logout().then(response => {
        commit(types.ACCOUNT_AUTH_STATUS_CHANGED, { status: 0 });
      });
    },
    accountRegisterSubmit({ commit }, params) {
      api.account.register(params).then(response => {
        if (response.data.status) {
          //commit(types.ACCOUNT_AUTH_STATUS_CHANGED, response.data);
          commit(types.ACCOUNT_REGISTER_SUCCESS);
        } else {
          commit(types.ACCOUNT_REGISTER_FAILURE, response.data);
        }
      });
    },
    button_permission({ commit }) {
      api.manage.button_permission.request().then(response => {
        commit(types.BUTTON_PERMISSION, response.data.data);
      });
    },
  },
};
