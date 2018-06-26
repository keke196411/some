import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 存储状态值
  state: {
    appInfo: {}
  },
  mutations: {
    appDeleiver (state, Payload) {
      state.appInfo = Payload
    }
  },
  getters: {},
  actions: {}
})
