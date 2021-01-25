<template>
  <div>
    <router-link
      class="btn"
      tag="button"
      :to="{ name: 'party', params: {eventId: this.$route.params.eventId} }"
    >
      <i class="fas fa-arrow-left arrow" />
      Powrót
    </router-link>
    <button
      v-for="func in functions"
      :key="func.value"
      class="btn"
      tag="button"
      @click="func.function"
    >
      <i :class="func.class" /> {{ func.value }}
    </button>
    <div class="event_n">
      <h3>
        {{ eventName }}
      </h3>
    </div>
    <h1 class="module_n">
      {{ moduleName }}
    </h1>
  </div>
</template>

<script>
import api from '../../api'

export default {
  props: {
    eventId: {
      type: String,
      required: true
    },
    moduleName: {
      type: String,
      required: true
    },
    functions: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      eventName: ''
    }
  },
  async mounted () {
    const response = await api.getEvent(this.eventId)

    if (response.status === 200) {
      this.eventName = response.data.name
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  padding: 20px 20px 0;

  .event_n {
    padding: 6px 12px;
    width: auto;
    float: right;

    @media (max-width: 500px) {
      float: none;
      margin-top: 15px;
      text-align: center;
    }
  }

  .module_n {
    text-align: center;
    margin-top: 15px;
  }
}
</style>
