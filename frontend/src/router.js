import Vue from 'vue'
import Router from 'vue-router'
import store from './store/'
import api from './api'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'homepage',
      meta: { loginNotRequired: true },
      component: () => import(/* webpackChunkName: "home" */ './views/Homepage.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { loginNotRequired: true, blockIfLoggedIn: true },
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/login/resetPassword',
      name: 'resetPasswordEmail',
      meta: { loginNotRequired: true, blockIfLoggedIn: true },
      component: () => import(/* webpackChunkName: "login" */ './views/ResetPasswordEmail.vue')
    },
    {
      path: '/login/resetPassword/:token',
      name: 'resetPassword',
      meta: { loginNotRequired: true, blockIfLoggedIn: true },
      component: () => import(/* webpackChunkName: "login" */ './views/ResetPassword.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: { loginNotRequired: true, blockIfLoggedIn: true },
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue')
    },
    {
      path: '/events',
      name: 'events',
      component: () => import(/* webpackChunkName: "events" */ './views/EventsList.vue')
    },
    {
      path: '/events/create',
      name: 'createEvent',
      component: () => import(/* webpackChunkName: "events" */ './views/CreateEvent.vue')
    },
    {
      path: '/events/:eventId',
      name: 'party',
      component: () => import(/* webpackChunkName: "party" */ './views/Event.vue')
    },
    {
      path: '/events/:eventId/covers',
      name: 'setCover',
      component: () => import(/* webpackChunkName: "party" */ './views/EventCovers.vue')
    },
    {
      path: '/events/:eventId/add',
      name: 'addModule',
      component: () => import(/* webpackChunkName: "party" */ './views/AddModule.vue')
    },
    {
      path: '/events/:eventId/wip',
      name: 'moduleWip',
      component: () => import(/* webpackChunkName: "moduleWip" */ './views/ModuleWip.vue')
    },
    {
      path: '/events/:eventId/todo',
      name: 'todo',
      component: () => import(/* webpackChunkName: "todo" */ './views/Todo.vue')
    },
    {
      path: '/events/:eventId/guestList',
      name: 'guestList',
      component: () => import(/* webpackChunkName: "guestList" */ './views/GuestList.vue')
    },
    {
      path: '/events/:eventId/notepad',
      name: 'notepad',
      component: () => import(/* webpackChunkName: "notepad" */ './views/Notepad.vue')
    },
    {
      path: '/events/:eventId/budget',
      name: 'budget',
      component: () => import(/* webpackChunkName: "notepad" */ './views/Budget.vue')
    },
    {
      path: '/events/:eventId/food',
      name: 'food',
      component: () => import(/* webpackChunkName: "food" */ './views/Food.vue')
    },
    {
      path: '/events/:eventId/guestPlacement',
      name: 'guestPlacement',
      component: () => import(/* webpackChunkName: "guestPlacement" */ './views/PlacementGuests.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import(/* webpackChunkName: "notepad" */ './views/Profile.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.userLoaded) {
    const response = await api.getUser()
    store.dispatch('login', response.data)
  }

  if (!store.getters.loggedIn) {
    if (to.matched.some(record => record.meta.loginNotRequired)) {
      return next()
    }

    return next('/login')
  } else if (to.matched.some(record => record.meta.blockIfLoggedIn)) {
    return next('/events')
  }

  next()
})

export default router
