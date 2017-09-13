import Vue from 'vue';
import Vuex from 'vuex';
import account from './modules/account';
import app from './modules/app';
import getters from './getters';
import permission from './modules/permission';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    account,
    app,
    permission
  },
  getters
});

export default store