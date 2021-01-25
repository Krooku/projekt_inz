<template>
  <div>
    <app-header @dblclick.native="$store.commit('changeTheme')" />
    <transition
      name="fade-in"
      mode="out-in"
    >
      <router-view class="content-view" />
    </transition>
    <vue-progress-bar />
    <AppFooter />
  </div>
</template>

<script>
import './styles/main.scss'

import AppHeader from './components/header/AppHeader'
import AppFooter from './components/footer/AppFooter'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
    }
  },
  computed: {
    userLoaded () { return this.$store.getters.userLoaded },
    loggedIn () { return this.$store.getters.loggedIn },
    username () { return this.loggedIn && this.$store.getters.username },
    darkTheme () { return this.$store.getters.darkTheme }
  },
  watch: {
    darkTheme () {
      this.setTheme()
    }
  },
  created () {
    this.setTheme()
  },
  methods: {
    setTheme () {
      document.documentElement.setAttribute('theme', this.darkTheme ? 'dark' : '')
    }
  }
}
</script>

<style lang="scss">
.logo {
  line-height: 60px;
  display: inline-flex;
  font-weight: bold;
  font-size: 18px;
  color: var(--secondary-text-color);
  text-transform: uppercase;
  padding: 0 10px;

  img {
    object-fit: contain;
  }
}

.show-xs {
  display: none;
}

@media (max-width: 540px) {
  .hidden-xs {
    display: none !important;
  }

  .show-xs {
    display: flex;
  }
}
</style>
