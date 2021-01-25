<template>
  <div class="events__item">
    <router-link :to="eventLink" />
    <h3
      v-if="(mobile || tablet) && (lastVisitedId === data._id)"
      style="padding: 2px; padding-bottom: 8px; text-align: center;"
    >
      Ostatnio odwiedzony
    </h3>
    <div class="events__thumbnail">
      <img :src="imageUrl">
    </div>

    <div class="events__title">
      <h3>{{ data.name }}</h3>

      <div class="events__remove">
        <div
          class="far fa-edit btn_hover"
          @click="editName"
        />
        <div
          class="far fa-trash-alt btn_hover"
          @click="showDeleteModal = true"
        />
      </div>
    </div>
    <transition name="fade-in">
      <basic-modal
        v-if="showUpdateModal"
        @close="showUpdateModal = false"
      >
        <div style="max-width: 700px;">
          <h3>
            Zmień nazwę wydarzenia:
          </h3>
          <input
            v-model="updatedEvent.name"
            class="responsive__input"
            type="text"
            placeholder="Nowa nazwa wydarzenia"
            maxlength="31"
            required
          >
          <button
            class="submit-btn"
            @click="updateEvent(eventID)"
          >
            Edytuj
          </button>
        </div>
      </basic-modal>
      <basic-modal
        v-if="showDeleteModal"
        @close="showDeleteModal = false"
      >
        <div style="max-width: 700px;">
          <h3>
            Czy na pewno chcesz kontynuować?
          </h3>
          <p>
            Usunięcie spowoduje nieodwracalną utratę wszelkich danych zawartych w tym wydarzeniu.
          </p>
          <button
            class="submit-btn"
            @click="deleteEvent(eventID)"
          >
            Usuń
          </button>
        </div>
      </basic-modal>
    </transition>
  </div>
</template>

<script>
import BasicModal from '../ui/BasicModal'
import api from '../../api'

export default {
  components: {
    BasicModal
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    lastVisitedId: {
      type: String,
      required: true
    },
    mobile: {
      type: Boolean,
      required: true
    },
    tablet: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      updatedEvent: { name },
      showDeleteModal: false,
      showUpdateModal: false
    }
  },
  computed: {
    eventLink () {
      return {
        name: 'party',
        params: {
          eventId: this.data._id
        }
      }
    },
    eventID () {
      return this.data._id
    },
    imageUrl () {
      return this.data.customCover ? this.data.customCover.imageUrl : this.data.cover && this.data.cover.imageUrl
    }
  },
  methods: {
    async deleteEvent (eventID) {
      const response = await api.deleteEvent(eventID)
      if (response.status === 200) {
        this.$emit('removeEvent', this.data._id)
        var body = document.body
        body.classList.remove('modal-open')
        this.showDeleteModal = false
      }
    },
    async updateEvent (eventId) {
      const name = this.updatedEvent.name

      const response = await api.updateEvent(eventId, { name })
      if (response.status === 200) {
        this.$emit('updateEvent', this.data._id, name)
        var body = document.body
        body.classList.remove('modal-open')
        this.showUpdateModal = false
      }
    },
    editName () {
      this.updatedEvent.name = ''
      this.updatedEvent.name = this.data.name
      this.showUpdateModal = true
    }
  }
}
</script>
