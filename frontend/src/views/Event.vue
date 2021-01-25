<template>
  <div>
    <div class="row top-bar">
      <router-link
        class="btn"
        tag="button"
        to="/events"
      >
        <i class="fas fa-arrow-left" />
        Powrót
      </router-link>
      <router-link
        class="btn"
        tag="button"
        :to="{ name: 'addModule' }"
      >
        Dodaj moduł
      </router-link>
      <router-link
        class="btn"
        tag="button"
        :to="{ name: 'setCover' }"
      >
        Zmień okładkę
      </router-link>
    </div>
    <div class="event_name">
      <h1>
        {{ eventName }}
      </h1>
    </div>
    <div
      v-if="modules.length == 0"
      class="content"
    >
      <div class="content__box">
        Aktualnie nie korzystasz z żadnego modułu, dodaj moduł by rozpocząć.
      </div>
    </div>
    <modules-list
      :modules="modules"
    />
  </div>
</template>

<script>
import api from '../api'
import ModulesList from '../components/modules/ModulesList'

export default {
  components: {
    ModulesList
  },
  data () {
    return {
      eventId: this.$route.params.eventId,
      eventName: '',
      modules: []
    }
  },
  async beforeRouteEnter (to, from, next) {
    localStorage.setItem(localStorage.getItem('current_username') + 'last_visited_event', to.params.eventId)
    const [response, event] = await Promise.all([
      api.activeModules(to.params.eventId),
      api.getEvent(to.params.eventId)
    ])

    if (response.status !== 200 || event.status !== 200) next({ name: 'events' })

    next(vm => {
      vm.modules = response.data
      vm.eventName = event.data.name
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const [response, event] = await Promise.all([
      api.activeModules(to.params.eventId),
      api.getEvent(to.params.eventId)
    ])

    if (response.status !== 200 || event.status !== 200) next({ name: 'events' })

    this.modules = response.data
    this.eventName = event.data.name
    next()
  }
}
</script>
