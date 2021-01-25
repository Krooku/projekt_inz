<template>
  <div
    class="modules__item"
    @click="enableModule"
  >
    <div class="modules__thumbnail">
      <img :src="data.imageUrl">
      <div
        v-if="data.wip"
        class="modules__badge modules__badge--wip"
      >
        WIP
      </div>
    </div>
    <div class="modules__title">
      <h3>{{ data.name }}</h3>
      <span>{{ data.description }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    enableModule () {
      this.$emit('enableModule', this.data)
    }
  }
}
</script>
