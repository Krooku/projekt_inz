<template>
  <section class="row events">
    <div class="events__list">
      <events-item
        v-for="event of events"
        :key="event._id"
        :data="event"
        @removeEvent="removeEvent"
        @updateEvent="updateEvent"
      />
    </div>
  </section>
</template>

<script>
import EventsItem from './EventsItem'

export default {
  components: {
    EventsItem
  },
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  methods: {
    removeEvent (eventId) {
      const index = this.events.findIndex(event => event._id === eventId)
      this.events.splice(index, 1)
    },

    updateEvent (eventId, name) {
      const index = this.events.findIndex(event => event._id === eventId)
      this.events[index].name = name
    }
  }
}
</script>
