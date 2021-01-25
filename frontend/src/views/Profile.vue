<template>
  <div>
    <div class="container">
      <h1> Twój Profil </h1>
      <profile-row
        name="Nazwa użytkownika"
        :value="user.username"
      />
      <profile-row
        name="E-mail"
        :value="user.email"
      />
      <profile-row
        name="Hasło"
        value="Sugerujemy regularną zmianę hasła w celu ochrony konta przed nieautoryzowanym dostępem."
      />
      <profile-row
        name="Motyw"
        value="Zmień kolorystykę."
      />
    </div>
  </div>
</template>

<script>
import api from '../api'
import ProfileRow from '../components/profile/ProfileRow'

export default {
  components: {
    ProfileRow
  },
  data () {
    return {
      user: {
        username: '',
        email: ''
      }
    }
  },
  async beforeRouteEnter (to, from, next) {
    const user = await api.getUser()

    if (user.status !== 200) {
      return next({ name: 'homepage' })
    }

    next(vm => {
      Object.assign(vm.user, user.data)
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const user = await api.getUser()

    if (user.status !== 200) {
      return next({ name: 'homepage' })
    }

    Object.assign(this.user, user.data)
    next()
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5%;
  margin-bottom: 5%;

  @media (max-width: 605px) {
    width: 100%;
    margin-top: 25px;
    font-size: 14px;

    h1 {
      text-align: center;
    }
  }
}
</style>
