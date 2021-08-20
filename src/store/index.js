import Vue from "vue";
import Vuex from "vuex";
import user from "./user";
import permission from "./permission";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navigationDrawer: null
  },
  mutations: {
    REVERSE_DRAWER(state) {
      state.navigationDrawer = !state.navigationDrawer;
    }
  },
  actions: {},
  modules: { user, permission }
});
