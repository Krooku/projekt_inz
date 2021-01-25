<template>
  <section class="row events packages">
    <div class="events__list">
      <module-packages-item
        v-for="modulePackage of modulePackages"
        :key="modulePackage._id"
        :data="modulePackage"
        @choosePackage="choosePackage"
      />
    </div>
  </section>
</template>

<script>
import ModulePackagesItem from './ModulePackagesItem'

export default {
  components: {
    ModulePackagesItem
  },
  props: {
    modulePackages: {
      type: Array,
      required: true
    }
  },
  methods: {
    choosePackage ({ packageID, packageName }) {
      this.$emit('choosePackage', { packageID, packageName })
    }
  }
}
</script>
