<template>
  <div class="events__item">
    <a
      style="cursor: pointer;"
      @click="setEventCustomCover()"
    />
    <div class="events__thumbnail">
      <img :src="data.imageUrl">
    </div>
    <div class="events__remove">
      <div
        class="far fa-trash-alt btn_hover"
        @click="deleteCustomCover"
      />
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
    setEventCustomCover () {
      this.$emit('setEventCustomCover', this.data._id)
    },
    deleteCustomCover () {
      this.$emit('showDeleteModal', this.data._id)
    }
  }
}
</script>

<style lang="scss" scoped>
.events__remove {
  top: 214px;
  right: 10px;
  padding: 3px 6px 5px 6px;
  background: var(--import-color-opacity);
  border-radius: 8px;
}
</style>
