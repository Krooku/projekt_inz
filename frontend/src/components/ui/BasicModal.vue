<template>
  <div class="user-modal">
    <div
      class="modal-backdrop"
      @click="closeModal"
    />
    <div class="content">
      <div
        class="content__box"
        :class="{ wide }"
      >
        <div
          class="notification__close"
          @click="closeModal"
        >
          <i class="far fa-times-circle" />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    wide: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    var body = document.body
    body.classList.add('modal-open')
  },
  methods: {
    closeModal () {
      this.$emit('close')
      var body = document.body
      body.classList.remove('modal-open')
    }
  }
}
</script>
