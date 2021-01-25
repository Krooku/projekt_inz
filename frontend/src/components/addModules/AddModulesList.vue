<template>
  <section class="row events">
    <div class="modules__list">
      <add-modules-item
        v-for="module of modules"
        :key="module._id"
        :data="module"
        @enableModule="enableModule"
      />
    </div>
  </section>
</template>

<script>
import AddModulesItem from './AddModulesItem'
import api from '../../api'

export default {
  components: {
    AddModulesItem
  },
  props: {
    modules: {
      type: Array,
      required: true
    },
    eventId: {
      type: String,
      required: true
    }
  },
  methods: {
    async enableModule (mod) {
      const response = await api.enableModule(this.eventId, {
        module: mod.id
      })

      if (response.status !== 200) {
        return alert(response.data.message)
      }

      this.$router.replace({
        name: mod.wip ? 'moduleWip' : mod.id,
        params: { eventId: this.eventId }
      })
    }
  }
}
</script>
