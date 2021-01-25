<template>
  <div id="login_site">
    <div id="logo">
      Event Planner
    </div>
    <div class="login">
      <form
        @submit.prevent="handleRegister"
      >
        <h1>REJESTRACJA</h1>
        <input
          v-model="user.username"
          type="text"
          placeholder="Nazwa użytkownika"
          pattern=".{4,20}"
          title="Nazwa powinna mieć od 4 do 20 znaków."
          required
        >
        <input
          v-model="user.email"
          type="email"
          placeholder="Email"
          required
        >
        <input
          v-model="user.password"
          type="password"
          placeholder="Hasło"
          pattern=".{8,127}"
          title="Hasło powinno mieć przynajmniej 8 znaków."
          required
        >
        <input
          v-model="user.repeat"
          type="password"
          placeholder="Powtórz hasło"
          required
        >
        <p
          v-if="message.text"
          :class="message.style"
        >
          {{ message.text }}
        </p>
        <button type="submit">
          Stwórz konto
        </button>
      </form>
      <div class="strike">
        <span>Posiadasz konto?</span>
      </div>
      <div class="register">
        <router-link to="/login">
          Zaloguj się
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data () {
    return {
      user: {},
      emptyUser: {
        username: '',
        email: '',
        password: '',
        repeat: ''
      },
      message: {
        style: null,
        text: null
      }
    }
  },
  created () {
    this.resetUser()
  },
  methods: {
    resetUser () {
      Object.assign(this.user, this.emptyUser)
    },
    displayMessage (type, message) {
      this.message.style = `message message--${type}`
      this.message.text = message
    },
    async handleRegister () {
      if (this.user.password !== this.user.repeat) {
        return this.displayMessage('error', 'Hasła muszą być identyczne')
      }

      const response = await api.register(this.user)

      if (response.status !== 200) {
        return this.displayMessage('error', response.data.message)
      }

      this.displayMessage(
        'success',
        `Rejestracja udana. Postępuj zgodnie ze wskazówkami przesłanymi na ${this.user.email}. Nie dostałeś maila? Sprawdź folder spam.`
      )

      this.resetUser()
    }
  }
}
</script>
