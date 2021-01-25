<template>
  <div>
    <div>
      <module-header
        :event-id="eventId"
        :module-name="moduleName"
        :functions="functions"
      />
    </div>
    <div class="grid_container">
      <div class="tables">
        <p
          v-if="tables.length === 0"
          class="center_text"
        >
          Nie ma żadnych stołów. <span @click="addTable()"> Dodaj </span> stół żeby rozpocząć rozsadzanie.
        </p>
        <p
          v-else
          class="center_text"
        >
          Liczba stołów {{ tables.length }}
        </p>
        <div
          v-for="(table, index) in tables"
          :key="table._id"
          class="table"
        >
          Stół {{ index + 1 }}, Krzesła w użyciu: {{ chairsNumber(table.guests) }} <span @click="showRemoveModal(table._id)"> Usuń </span>
          <div
            v-for="guest in table.guests"
            :key="guest._id"
            class="couple"
          >
            <p> {{ guest.firstname }} {{ guest.lastname }} <span @click="backGuest(index, guest._id)"> cofnij </span> </p>
            <p v-if="guest.plusOne">
              & {{ guest.plusOneFullName }}
            </p>
          </div>
        </div>
      </div>
      <div class="guests">
        <p
          v-if="guests.length === 0"
          class="center_text"
        >
          Rozmieściłeś wszystkich gości
        </p>
        <p
          v-else
          class="center_text"
        >
          Nierozmieszczeni goście: {{ guests.length }}
        </p>
        <div
          v-for="guest in guests"
          :key="guest._id"
          class="guest"
        >
          <span
            v-if="guest.plusOne"
            class="guest_text"
          >
            {{ guest.firstname }} {{ guest.lastname }} &amp; {{ guest.plusOneFullName }}
          </span>
          <span
            v-else
            class="guest_text"
          >
            {{ guest.firstname }} {{ guest.lastname }}
          </span>
          <select
            v-model="selectedTable"
            @change="addGuest(guest._id, selectedTable)"
          >
            <option
              :selected="selectedTable"
              disabled
              hidden
            >
              Wybierz stół
            </option>
            <option
              v-for="(table, index) in tables"
              :key="table._id"
            >
              Stolik {{ index + 1 }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <basic-modal
      v-if="deleteModal"
      @close="hideRemoveModal"
    >
      <form @submit.prevent="removeTable">
        <h3>
          Usuń stolik
        </h3>
        <p>
          Jesteś pewny?
        </p>
        <button
          class="submit-btn"
        >
          Usuń
        </button>
      </form>
    </basic-modal>
  </div>
</template>

<script>
import api from '../api'
import ModuleHeader from '../components/modules/ModuleHeader'
import BasicModal from '../components/ui/BasicModal'

export default {
  components: {
    ModuleHeader,
    BasicModal
  },
  data () {
    return {
      eventId: this.$route.params.eventId,
      moduleName: 'Rozmieszczenie gości',
      functions: [
        { function: this.addTable, value: 'Dodaj stolik' }
      ],
      tables: [],
      guests: [],
      selectedTable: 'Wybierz stół',
      removedTableId: '',
      deleteModal: false
    }
  },
  async beforeRouteEnter (to, from, next) {
    // przy pobraniu stołów usunąć z listy guests rozsadzonych gości
    const guests = await api.listGuestItems(to.params.eventId)
    const tables = await api.listTableItems(to.params.eventId)
    if (guests.status !== 200 || tables.status !== 200) {
      return next({ name: 'party', params: { eventId: to.params.eventId } })
    }
    next(vm => {
      vm.guests = guests.data.sort((a, b) => (a.lastname > b.lastname) ? 1 : (a.lastname === b.lastname) ? ((a.firstname > b.firstname) ? 1 : -1) : -1)
      vm.tables = tables.data
      vm.notplaced()
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const guests = await api.listGuestItems(to.params.eventId)
    const tables = await api.listTableItems(to.params.eventId)
    if (guests.status !== 200 || tables.status !== 200) {
      return next({ name: 'party', params: { eventId: this.eventId } })
    }
    this.guests = guests.data.sort((a, b) => (a.lastname > b.lastname) ? 1 : (a.lastname === b.lastname) ? ((a.firstname > b.firstname) ? 1 : -1) : -1)
    this.tables = tables.data
    this.notplaced()
    next()
  },
  computed: {
  },
  methods: {
    chairsNumber (guests) {
      var chairs = 0
      for (var i = 0; i < guests.length; i++) {
        if (guests[i].plusOne) {
          chairs += 2
        } else {
          chairs += 1
        }
      }
      return chairs
    },
    notplaced () {
      for (let i = 0; i < this.tables.length; i++) {
        if (this.tables[i].guests.length !== 0) {
          for (let j = 0; j < this.tables[i].guests.length; j++) {
            const index = this.guests.findIndex(g => this.tables[i].guests[j]._id === g._id)
            this.guests.splice(index, 1)
          }
        }
      }
    },
    async addTable () {
      const response = await api.addTableItem(this.eventId, { guests: [] })
      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      this.tables.push(response.data)
    },
    showRemoveModal (tableId) {
      this.removedTableId = tableId
      this.deleteModal = true
    },
    hideRemoveModal () {
      this.removedTableId = ''
      var body = document.body
      body.classList.remove('modal-open')
      this.deleteModal = false
    },
    async removeTable () {
      const response = await api.deleteTableItem(this.eventId, this.removedTableId)

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      const index = this.tables.findIndex(t => this.removedTableId === t._id)
      if (this.tables[index].guests.length !== 0) {
        for (let i = 0; i < this.tables[index].guests.length; i++) {
          this.guests.push(this.tables[index].guests[i])
        }
      }
      this.tables.splice(index, 1)
      var body = document.body
      body.classList.remove('modal-open')
      this.deleteModal = false
      this.removedTableId = ''
    },
    async addGuest (guestid, table) {
      const tableName = table.split(' ')
      const index = this.guests.findIndex(g => guestid === g._id)
      const guest = this.guests[index]
      this.guests.splice(index, 1)
      this.tables[parseInt(tableName[1]) - 1].guests.push(guest)
      this.selectedTable = 'Wybierz stół'

      const response = await api.editTableItem(this.eventId, this.tables[parseInt(tableName[1]) - 1]._id, { guests: this.tables[parseInt(tableName[1]) - 1].guests })
      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
    },
    async backGuest (index, guestId) {
      const indexGuest = this.tables[index].guests.findIndex(g => guestId === g._id)
      const guest = this.tables[index].guests[indexGuest]

      this.tables[index].guests.splice(indexGuest, 1)
      this.guests.push(guest)
      this.guests.sort((a, b) => (a.lastname > b.lastname) ? 1 : (a.lastname === b.lastname) ? ((a.firstname > b.firstname) ? 1 : -1) : -1)
      const response = await api.editTableItem(this.eventId, this.tables[index]._id, { guests: this.tables[index].guests })
      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.grid_container {
  width: 80%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: 60% 40%;

  @media (max-width: 1100px) {
    grid-template-columns: 100%;
  }

  @media (max-width: 700px) {
    width: 100%;
  }

  font-size: 24px;

  @media (max-width: 450px) {
    font-size: 18px;
  }
}

.center_text {
  text-align: center;
  font-size: 24px;
}

.tables {
  color: var(--homepage-text-color);
  padding: 10px;

  span {
    cursor: pointer;
    color: var(--profile-top-text);
  }

  span:hover {
    color: var(--profile-text-hover);
  }
}

.table {
  background-color: var(--profile-top-color);
  color: var(--homepage-text-color);
  padding: 10px;
  margin: 5px;
  border-radius: 3px;

  span {
    float: right;
    margin-right: 9px;
  }

  span:hover {
    color: var(--profile-text-hover);
  }

  p {
    word-wrap: break-word;
    padding: 5px;
    padding-left: 10px;
    background-color: var(--profile-bot-color);
  }

  .couple {
    margin-top: 5px;
    margin-left: 20px;
    overflow: hidden;
    border-radius: 3px;
  }
}

.guests {
  padding: 10px;

  .guest {
    background-color: var(--profile-bot-color);
    padding: 10px;
    margin: 2px;
    border-radius: 3px;
    display: grid;
    grid-template-columns: auto auto;

    .guest_text {
      margin-left: 3px;
      word-wrap: break-word;
    }

    select {
      justify-self: end;
      margin-right: 5px;
      background: transparent;
      color: inherit;
      font-family: inherit;
      border: 0;
      border-bottom: 2px solid var(--profile-top-color);
      font-weight: 700;

      option {
        background: var(--profile-top-color);
        font-size: 1rem;
      }
    }
  }
}

</style>
