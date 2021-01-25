<template>
  <div>
    <header>
      <h2>
        Cieszymy się, że chcesz zorganizować z nami swoje przyjęcie
      </h2>
      <p>Aby rozpocząć, wypełnij poniższe pola</p>
    </header>
    <div id="login_site">
      <div class="login">
        <form
          @submit.prevent="createEvent"
        >
          <h1>Nowe wydarzenie</h1>
          <input
            id="eventName"
            v-model="eventName"
            type="text"
            placeholder="Nazwa Wydarzenia*"
            maxlength="31"
            required
          >
          <div class="login__event-type">
            <input
              id="eventType"
              v-model="eventType"
              type="text"
              placeholder="Rodzaj wydarzenia*"
              autocomplete="off"
              readonly
              @click="showChooseModal = true"
            >
          </div>
          <p class="message message--error">
            {{ error }}
          </p>
          <button
            type="submit"
            @click="validator($event)"
          >
            Dodaj Wydarzenie
          </button>
        </form>
      </div>
    </div>
    <transition name="fade-in">
      <basic-modal
        v-if="showChooseModal"
        :wide="true"
        @close="showChooseModal = false"
      >
        <div>
          <h3>
            Wybierz rodzaj organizowanego wydarzenia.
          </h3>
          <module-packages-list
            :module-packages="modulePackages"
            @choosePackage="choosePackage"
          />
        </div>
      </basic-modal>
    </transition>
  </div>
</template>

<script>
import api from '../api'
import BasicModal from '../components/ui/BasicModal'
import ModulePackagesList from '../components/modulePackages/ModulePackagesList'

export default {
  components: {
    BasicModal,
    ModulePackagesList
  },
  data () {
    return {
      error: null,
      eventName: '',
      packageName: '',
      packageID: null,
      modulePackages: [],
      showChooseModal: false,
      eventType: ''
    }
  },
  async mounted () {
    const response = await api.listModulePackages()

    if (response.status === 200) {
      this.modulePackages = response.data
    }
  },
  methods: {
    choosePackage ({ packageID, packageName }) {
      if (packageID) {
        this.packageName = packageName
        this.packageID = packageID
        document.getElementById('eventType').value = this.packageName
      }
      var body = document.body
      body.classList.remove('modal-open')
      this.eventType = packageName
      this.showChooseModal = false
    },
    async createEvent () {
      const response = await api.createEvent({
        name: this.eventName,
        packageId: this.packageID
      })

      if (response.status === 200) {
        this.$router.push({ name: 'setCover', params: { eventId: response.data._id } })
      } else this.error = 'Coś poszło nie tak, spróbuj ponownie'
    },
    validator (eventType) {
      if (!(this.eventType === 'Wesele' || this.eventType === 'Impreza w lokalu' || this.eventType === 'Domówka' || this.eventType === 'Inne')) {
        alert('Wybierz rodzaj wydarzenia')
        event.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  margin: 10px 15px 0 15px;
  text-align: center;

  h2 {
    font-size: 26px;

    span {
      color: var(--text-color-red);
    }
  }

  p {
    padding-top: 0;
    color: var(--color-homepage-grey);
    font-size: 20px;
  }
}
</style>
