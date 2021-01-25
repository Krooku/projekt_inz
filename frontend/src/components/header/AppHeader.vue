<template>
  <div class="header row">
    <div
      class="show-xs header-hamburger"
      @click="mobileMenu = !mobileMenu"
    >
      <i class="fa fa-bars" />
    </div>
    <router-link
      to="/"
      class="logo"
    >
      <img src="@/assets/logo_mini_ico.png">
      {{ appName }}
    </router-link>
    <div
      v-if="userLoaded"
      class="header__items-container hidden-xs"
    >
      <template v-if="loggedIn">
        <router-link
          class="header__btn"
          to="/events"
        >
          Moje wydarzenia
        </router-link>
        <router-link
          class="header__btn"
          to="/profile"
        >
          Profil
        </router-link>
        <div
          class="header__btn"
          @click="logout"
        >
          Wyloguj się
        </div>
      </template>
      <template v-else>
        <router-link
          class="header__btn"
          to="/login"
        >
          Zaloguj się
        </router-link>
      </template>
    </div>
    <div
      :class="{ 'mobile-nav': true, 'open': mobileMenu }"
      @click="mobileMenu = false"
    >
      <template v-if="loggedIn">
        <router-link
          class="mobile-nav__btn"
          to="/events"
        >
          Moje wydarzenia
        </router-link>
        <router-link
          class="mobile-nav__btn"
          to="/profile"
        >
          Profil
        </router-link>
        <div
          class="mobile-nav__btn"
          @click="logout"
        >
          Wyloguj się
        </div>
      </template>
      <template v-else>
        <router-link
          class="mobile-nav__btn"
          to="/login"
        >
          Zaloguj się
        </router-link>
      </template>
    </div>
  </div>
</template>

<script>
import api from '../../api'
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      mobileMenu: false
    }
  },
  computed: {
    ...mapState([
      'appName',
      'userLoaded'
    ]),
    ...mapGetters([
      'loggedIn'
    ])
  },
  methods: {
    async logout () {
      const response = await api.logout()
      if (response.status === 200) {
        this.$store.dispatch('logout')
        this.$router.push({ name: 'homepage' })
      }
    }
  }
}
</script>

<style lang="scss">
.header {
  display: flex;
  position: relative;
  white-space: nowrap;

  &__items-container {
    display: flex;
    margin-left: auto;
  }

  &-hamburger {
    font-size: 32px;
    align-items: center;
    padding: 0 4px;
    margin-left: 6px;
  }

  &__btn {
    display: flex;
    font-size: 0.875rem;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    min-width: 50px;
    margin: 0 2px;
    color: var(--secondary-text-color);
    border-bottom: 3px solid transparent;
    box-sizing: border-box;
    white-space: nowrap;
    transition: all 0.2s ease;
    cursor: pointer;

    &.router-link-exact-active {
      border-bottom-color: #d24b5e;
    }
  }

  &__btn:hover {
    color: var(--accent-color);
    background-color: var(--header-hover-bg-color);
    border-bottom-color: #a64452;
  }
}

.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  box-shadow: 3px 0 6px 0 rgba(0, 0, 0, 0.2);
  background: var(--header-bg-color);
  padding: 8px 0;
  height: 100%;
  z-index: 101;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transform: translateX(-120%);
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);

  @media (max-width: 540px) {
    &.open {
      transform: none;
    }
  }

  &__btn {
    display: flex;
    font-size: 1rem;
    align-items: center;
    padding: 20px 15px;
    margin: 2px 0;
    color: var(--secondary-text-color);
    border-left: 4px solid transparent;
    box-sizing: border-box;
    white-space: nowrap;
    transition: all 0.1s ease;
    cursor: pointer;

    &.router-link-exact-active {
      border-left-color: #d24b5e;
      background-color: var(--header-hover-bg-color);
    }
  }

  &__btn:hover {
    color: var(--accent-color);
    border-left-color: #a64452;
  }

  &.open::after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 250px;
    width: 100vw;
    height: 100%;
  }
}
</style>
