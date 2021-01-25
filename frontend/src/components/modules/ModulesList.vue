<template>
  <section class="row events">
    <div class="modules__list">
      <modules-item
        v-for="module of modules"
        :key="module._id"
        :data="module"
        @removeModule="removeModule"
      />
    </div>
  </section>
</template>

<script>
import ModulesItem from './ModulesItem'

export default {
  components: {
    ModulesItem
  },
  props: {
    modules: {
      type: Array,
      required: true
    }
  },
  methods: {
    removeModule (moduleId) {
      const index = this.modules.findIndex(module => module.id === moduleId)
      this.modules.splice(index, 1)
    }
  }
}
</script>
