<template>
  <div
    class="events__item package__item"
    @click="choosePackage(packageID, packageName)"
  >
    <div class="events__thumbnail">
      <img :src="data.imageUrl">
    </div>
    <div class="events__title">
      <h3>{{ packageName }}</h3>
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
  computed: {
    packageID () {
      return this.data._id
    },
    packageName () {
      return this.data.name
    }
  },
  methods: {
    choosePackage (packageID, packageName) {
      this.$emit('choosePackage', { packageID, packageName })
    }
  }
}
</script>
