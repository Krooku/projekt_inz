<template>
  <div
    class="modules__item"
    style="cursor: default;"
  >
    <router-link :to="moduleLink">
      <div class="modules__thumbnail">
        <img :src="data.imageUrl">
        <div
          v-if="data.wip"
          class="modules__badge modules__badge--wip"
        >
          WIP
        </div>
      </div>
      <div class="modules__name">
        <h3>{{ data.name }}</h3>
      </div>
    </router-link>
    <div
      class="modules__remove"
      @click="showDeleteModal = true"
    >
      <i class="far fa-trash-alt btn_hover" />
    </div>
    <transition name="fade-in">
      <basic-modal
        v-if="showDeleteModal"
        @close="showDeleteModal = false"
      >
        <div style="max-width: 700px;">
          <h3>
            Czy na pewno chcesz kontynuować?
          </h3>
          <p>
            Usunięcie spowoduje nieodwracalną utratę wszelkich danych zawartych w tym module.
          </p>
          <button
            class="submit-btn"
            @click="disableModule(moduleID)"
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
    }
  },
  data () {
    return {
      showDeleteModal: false
    }
  },
  computed: {
    moduleLink () {
      return {
        name: this.data.wip ? 'moduleWip' : this.data.id,
        params: {
          eventId: this.$route.params.eventId
        }
      }
    },
    moduleID () {
      return this.data.id
    }
  },
  methods: {
    async disableModule (moduleID) {
      const response = await api.disableModule(this.$route.params.eventId, { module: moduleID })
      if (response.status === 200) {
        localStorage.removeItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID')
        this.$emit('removeModule', this.data.id)
        var body = document.body
        body.classList.remove('modal-open')
        this.showDeleteModal = false
      }
    }
  }
}
</script>
