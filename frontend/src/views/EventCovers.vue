<template>
  <div>
    <div class="row top-bar">
      <router-link
        class="btn"
        tag="button"
        :to="{ name: 'party', params: {eventId: this.$route.params.eventId} }"
      >
        <i class="fas fa-arrow-left arrow" />
        Powrót
      </router-link>
      <label
        for="customcoverinput"
        class="btn"
        tag="button"
        @click="customCoverModal=true"
      >
        Dodaj okładkę
      </label>
      <input
        id="customcoverinput"
        ref="customcoverinputfile"
        type="file"
        accept=".jpg,.jpeg,.png"
        required
        hidden
        @change="addCustomCover"
      >
    </div>
    <div class="event_name">
      <h2>
        Wybierz okładkę wydarzenia
      </h2>
    </div>
    <section class="row events">
      <p class="message message--error">
        {{ error }}
      </p>
      <div class="events__list">
        <event-custom-covers-item
          v-for="customCoverItem of customCovers"
          :key="customCoverItem._id"
          :data="customCoverItem"
          @setEventCustomCover="setEventCustomCover"
          @showDeleteModal="showDeleteModal"
        />
        <event-covers-item
          v-for="cover of covers"
          :key="cover._id"
          :data="cover"
          @setEventCover="setEventCover"
        />
      </div>
    </section>
    <transition name="fade-in">
      <basic-modal
        v-if="deleteModal"
        @close="deleteModal = false"
      >
        <form @submit.prevent="removeCustomCover">
          <h3>
            Usuń okładkę
          </h3>
          <p>
            Czy chcesz usunąć okładkę?
          </p>
          <button
            class="submit-btn"
          >
            Usuń
          </button>
        </form>
      </basic-modal>
    </transition>
  </div>
</template>

<script>
import api from '../api'
import EventCoversItem from '../components/eventCovers/EventCoversItem'
import EventCustomCoversItem from '../components/eventCovers/EventCustomCoversItem'
import BasicModal from '../components/ui/BasicModal'

export default {
  components: {
    EventCoversItem,
    EventCustomCoversItem,
    BasicModal
  },
  data () {
    return {
      eventID: this.$route.params.eventId,
      covers: [],
      customCovers: [],
      error: '',
      deleteModal: false,
      customCoverItemID: ''
    }
  },
  async beforeRouteEnter (to, from, next) {
    const [response, responseCustom] = await Promise.all([
      api.listCovers(to.params.eventId),
      api.listCustomCovers(to.params.eventId)
    ])

    if (response.status !== 200 && responseCustom !== 200) next({ name: 'party', params: { eventId: this.$route.params.eventId } })

    next(vm => {
      vm.covers = response.data
      vm.customCovers = responseCustom.data
    })
  },
  methods: {
    async addCustomCover () {
      const file = this.$refs.customcoverinputfile.files
      const formData = new FormData()
      formData.append('cover', file[0])
      const response = await api.addCustomCover(formData)
      if (response.status === 200) {
        this.customCovers.push(response.data)
      } else alert('Coś poszło nie tak! Spróbuj ponownie później.')
    },
    async setEventCustomCover (customCoverID) {
      const response = await api.setEventCustomCover(this.eventID, { id: customCoverID })

      if (Math.floor((response.status / 100) % 10) === 2) {
        this.$router.push({ name: 'party', params: { eventId: this.eventID } })
      } else this.error = 'Coś poszło nie tak, spróbuj ponownie'
    },
    showDeleteModal (customCoverID) {
      this.customCoverItemID = customCoverID
      this.deleteModal = true
    },
    async removeCustomCover () {
      const response = await api.removeCustomCover(this.customCoverItemID)

      if (Math.floor((response.status / 100) % 10) === 2) {
        const index = this.customCovers.findIndex(i => i._id === this.customCoverItemID)
        this.customCovers.splice(index, 1)
      }
      var body = document.body
      body.classList.remove('modal-open')
      this.deleteModal = false
      this.customCoverItemID = ''
    },
    async setEventCover (coverID) {
      const response = await api.SetEventCover(this.eventID, { id: coverID })

      if (Math.floor((response.status / 100) % 10) === 2) {
        this.$router.push({ name: 'party', params: { eventId: this.eventID } })
      } else this.error = 'Coś poszło nie tak, spróbuj ponownie'
    }
  }
}
</script>
