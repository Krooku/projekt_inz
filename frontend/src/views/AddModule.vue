<template>
  <div>
    <div class="row top-bar">
      <router-link
        class="btn"
        tag="button"
        :to="{ name: 'party', params: {eventId: this.$route.params.eventId} }"
      >
        <i class="fas fa-arrow-left arrow" />
        Powrót
      </router-link>
      <h2>Wybierz moduł</h2>
    </div>
    <div
      v-if="modules.length == 0"
      class="content"
    >
      <div class="content__box">
        Brak dostępnych modułów.
      </div>
    </div>
    <add-modules-list
      :modules="modules"
      :event-id="eventId"
    />
  </div>
</template>

<script>
import AddModulesList from '../components/addModules/AddModulesList'
import api from '../api'

export default {
  components: {
    AddModulesList
  },
  data () {
    return {
      eventId: this.$route.params.eventId,
      modules: []
    }
  },
  async beforeRouteEnter (to, from, next) {
    const [availableModules, enabledModules] = await Promise.all([
      api.listModules(),
      api.activeModules(to.params.eventId)
    ])

    if (availableModules.status !== 200 || enabledModules.status !== 200) next({ name: 'events' })

    const enabledIds = enabledModules.data.map(mod => mod.id)
    const remainingModules = availableModules.data.filter(mod => !enabledIds.includes(mod.id))

    next(vm => {
      vm.modules = remainingModules
    })
  }
}
</script>
