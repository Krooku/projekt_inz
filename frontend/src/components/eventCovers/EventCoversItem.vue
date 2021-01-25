<template>
  <div class="events__item">
    <a
      style="cursor: pointer;"
      @click="setEventCover()"
    />
    <div class="events__thumbnail">
      <img :src="data.imageUrl">
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
    setEventCover () {
      this.$emit('setEventCover', this.data._id)
    }
  }
}
</script>
