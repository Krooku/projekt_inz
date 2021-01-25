import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appName: process.env.VUE_APP_NAME || 'Event Planner',
    user: null,
    userLoaded: false,
    darkTheme: localStorage.darkTheme === 'true' || !localStorage.darkTheme
  },
  mutations: {
    loginUser (state, user) {
      state.user = user
      state.userLoaded = true
    },
    logoutUser (state) {
      state.user = null
    },
    changeTheme (state) {
      localStorage.darkTheme = state.darkTheme = !state.darkTheme
    }
  },
  actions: {
    login ({ commit }, user) {
      commit('loginUser', user)
    },
    logout ({ commit }) {
      commit('logoutUser')
    },
    changeTheme ({ commit }) {
      commit('changeTheme')
    }
  },
  getters: {
    userLoaded: state => state.userLoaded,
    loggedIn: state => !!(state.user && state.user.id),
    username: state => state.user && state.user.username,
    darkTheme: state => state.darkTheme
  }
})
