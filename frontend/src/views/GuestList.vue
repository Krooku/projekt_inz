<template>
  <div>
    <module-header
      :event-id="eventId"
      :module-name="moduleName"
      :functions="functions"
    />
    <transition name="fade-in">
      <basic-modal
        v-if="editModal"
        @close="editModal = false"
      >
        <form
          style="max-width: 700px;"
          @submit.prevent="submitGuest"
        >
          <input
            v-model="editedGuest.firstname"
            class="responsive__input"
            type="text"
            placeholder="Imię*"
            maxlength="32"
            required
          >
          <input
            v-model="editedGuest.lastname"
            class="responsive__input"
            type="text"
            placeholder="Nazwisko*"
            maxlength="32"
            required
          >
          <input
            v-model="editedGuest.phoneNumber"
            class="responsive__input"
            type="text"
            placeholder="Numer telefonu"
            maxlength="16"
          >
          <input
            v-model="editedGuest.email"
            class="responsive__input"
            type="text"
            placeholder="Email"
            maxlength="32"
          >

          <div id="selector">
            <div class="responsive__checkbox">
              <input
                id="toggle"
                v-model="editedGuest.plusOne"
                type="checkbox"
              >
            </div>
            <label for="toggle">{{ togglePlusOneLabel }}</label>
            <div v-if="editedGuest.plusOne">
              <input
                v-model="editedGuest.plusOneFullName"
                class="responsive__input--full"
                type="text"
                placeholder="Imię i nazwisko osoby towarzyszącej"
                maxlength="65"
                required
              >
            </div>
          </div>

          <button
            class="submit-btn"
            type="submit"
          >
            {{ submitGuestLabel }}
          </button>
        </form>
      </basic-modal>
      <basic-modal
        v-if="deleteModal"
        @close="deleteModal = false"
      >
        <form @submit.prevent="removeGuest">
          <h3>
            Usuń gościa
          </h3>
          <p>
            Czy chcesz usunąć gościa {{ editedGuest.firstname }} {{ editedGuest.lastname }}?
          </p>
          <button
            class="submit-btn"
          >
            Usuń
          </button>
        </form>
      </basic-modal>
    </transition>
    <div class="responsive">
      <span class="subtitle">Zaprosić: {{ guestsCount('invite') }}</span>
      <div>
        <transition-group
          name="list"
          tag="ul"
          class="responsive__ul"
        >
          <contact-list-info
            v-for="guest in guestsStatusInvite"
            :key="guest._id"
            :guest="guest"
            class="list-item"
            @statusChange="setGuestStatus"
            @guestEditRequested="showEditModal"
            @delete="showDeleteModal"
          />
        </transition-group>
      </div>
    </div>

    <div class="responsive">
      <span class="subtitle">Zaproszeni: {{ guestsCount('invited') }}</span>
      <transition-group
        name="list"
        tag="ul"
        class="responsive__ul"
      >
        <contact-list-info
          v-for="guest in guestsStatusInvited"
          :key="guest._id"
          :guest="guest"
          class="list-item"
          @statusChange="setGuestStatus"
          @guestEditRequested="showEditModal"
          @delete="showDeleteModal"
        />
      </transition-group>
    </div>

    <div class="responsive">
      <span class="subtitle">Potwierdzeni: {{ guestsCount('confirmed') }}</span>
      <transition-group
        name="list"
        tag="ul"
        class="responsive__ul"
      >
        <contact-list-info
          v-for="guest in guestsStatusConfirmed"
          :key="guest._id"
          :guest="guest"
          class="list-item"
          @statusChange="setGuestStatus"
          @guestEditRequested="showEditModal"
          @delete="showDeleteModal"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import api from '../api'
import ModuleHeader from '../components/modules/ModuleHeader'
import ContactListInfo from '../components/guestList/GuestContactItem'
import BasicModal from '../components/ui/BasicModal'

export default {
  components: {
    ModuleHeader,
    ContactListInfo,
    BasicModal
  },
  data () {
    return {
      moduleName: 'Lista gości',
      editedGuest: {},
      functions: [
        { function: this.showEditModal, value: 'Dodaj gościa', class: 'fas fa-plus' }
      ],
      emptyGuest: {
        firstname: '',
        lastname: '',
        phoneNumber: '',
        email: '',
        plusOne: false,
        plusOneFullName: ''
      },
      guests: [],
      editModal: false,
      deleteModal: false,
      eventId: this.$route.params.eventId
    }
  },
  async beforeRouteEnter (to, from, next) {
    const guests = await api.listGuestItems(to.params.eventId)

    if (guests.status !== 200) {
      return next({ name: 'party', params: { eventId: to.params.eventId } })
    }

    next(vm => {
      vm.guests = guests.data.sort((a, b) => (a.lastname > b.lastname) ? 1 : (a.lastname === b.lastname) ? ((a.firstname > b.firstname) ? 1 : -1) : -1)
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const guests = await api.listGuestItems(to.params.eventId)

    if (guests.status !== 200) {
      return next({ name: 'party', params: { eventId: this.eventId } })
    }

    this.guests = guests.data.sort((a, b) => (a.lastname > b.lastname) ? 1 : (a.lastname === b.lastname) ? ((a.firstname > b.firstname) ? 1 : -1) : -1)
    next()
  },
  computed: {
    guestIsEdited () {
      return !!this.editedGuest._id
    },
    submitGuestLabel () {
      return `${this.guestIsEdited ? 'Edytuj' : 'Dodaj'} gościa`
    },
    togglePlusOneLabel () {
      return `${
        this.editedGuest.plusOne ? 'Usuń' : 'Dodaj'
      } osobę towarzyszącą`
    },
    guestsStatusInvite () {
      return this.guests.filter(guest => guest.status === 'invite')
    },
    guestsStatusInvited () {
      return this.guests.filter(guest => guest.status === 'invited')
    },
    guestsStatusConfirmed () {
      return this.guests.filter(guest => guest.status === 'confirmed')
    }
  },
  created () {
    this.resetGuest()
    this.editedGuest = { ...this.emptyGuest }
  },
  methods: {
    resetGuest (guest = this.emptyGuest) {
      this.editedGuest = { ...guest }
    },
    showEditModal (guest) {
      this.resetGuest(guest)
      this.editModal = true
    },
    showDeleteModal (guest) {
      this.resetGuest(guest)
      this.deleteModal = true
    },
    async removeGuest () {
      const response = await api.deleteGuestItem(this.eventId, this.editedGuest._id)

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      const index = this.guests.findIndex(g => this.editedGuest._id === g._id)
      this.guests.splice(index, 1)

      var body = document.body
      body.classList.remove('modal-open')
      this.deleteModal = false
    },
    async setGuestStatus (guest, status) {
      const response = await api.editGuestStatus(this.eventId, guest._id, {
        status
      })

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      const index = this.guests.findIndex(g => g._id === guest._id)
      this.guests[index].status = status
    },
    async submitGuest () {
      let response
      if (!this.guestIsEdited) {
        response = await api.addGuestItem(this.eventId, this.editedGuest)
        this.resetGuest()
      } else {
        response = await api.editGuestItem(
          this.eventId,
          this.editedGuest._id,
          this.editedGuest
        )
      }

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      if (!this.guestIsEdited) {
        this.guests.push(response.data)
      } else {
        const index = this.guests.findIndex(g => g._id === this.editedGuest._id)
        Object.assign(this.guests[index], response.data)
      }

      this.guests.sort((a, b) => (a.lastname > b.lastname) ? 1 : (a.lastname === b.lastname) ? ((a.firstname > b.firstname) ? 1 : -1) : -1)
      var body = document.body
      body.classList.remove('modal-open')
      this.editModal = false
      this.resetGuest()
    },
    guestsCount (status) {
      switch (status) {
        case 'invite':
          return this.guestsStatusInvite.length + this.guestsStatusInvite.filter(guest => guest.plusOne === true).length
        case 'invited':
          return this.guestsStatusInvited.length + this.guestsStatusInvited.filter(guest => guest.plusOne === true).length
        case 'confirmed':
          return this.guestsStatusConfirmed.length + this.guestsStatusConfirmed.filter(guest => guest.plusOne === true).length
        default:
          return this.guests.length + this.guests.filter(guest => guest.plusOne === true).length
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  display: block;
  color: var(--color-dark-red);
  text-align: center;
  font-size: 36px;
  margin-bottom: 0.6em;
}

.responsive {
  padding: 1%;
  float: left;
  width: 33.33333%;

  @media only screen and (max-width: 1222px) {
    width: 100%;
  }

  &__ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  &__input {
    width: 50%;
    border: 0;
    padding: 20px;
    font-size: 1.4em;
    background-color: var(--color-dark-grey);
    color: black;
    border-radius: 15px;
    border-left: 5px solid var(--color-dark);

    @media only screen and (max-width: 800px) {
      width: 100%;
    }

    &--full {
      width: 100%;
      margin-top: 5px;
      border: 0;
      padding: 20px;
      font-size: 1.4em;
      background-color: var(--color-dark-grey);
      color: black;
      border-radius: 15px;
      border-left: 5px solid var(--color-dark);
    }
  }

  &__checkbox {
    position: absolute;
    left: -9999px;
  }

  button {
    width: 100%;
    background-color: var(--color-dark-red);
    font-size: 18px;
    letter-spacing: 2px;
    color: #fff;
    padding: 15px 10px;
    margin-top: 5px;
    margin-bottom: 10px;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    outline: none;
  }
}

label {
  float: left;
  margin-top: 5px;
  width: 100%;
  background-color: var(--color-dark-red);
  font-size: 16px;
  color: #fff;
  padding: 10px 10px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
}
</style>
