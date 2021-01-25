<template>
  <div>
    <module-header
      :event-id="eventId"
      :module-name="moduleName"
    />
    <div class="content">
      <div class="content__box">
        Ten moduł nie jest jeszcze dostępny.
      </div>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '../components/modules/ModuleHeader'

export default {
  components: {
    ModuleHeader
  },
  data () {
    return {
      moduleName: 'Wkrótce gotowy',
      functions: [
        {}
      ],
      eventId: this.$route.params.eventId
    }
  }
}

</script>
