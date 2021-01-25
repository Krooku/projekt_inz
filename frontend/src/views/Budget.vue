<template>
  <div class="budget">
    <div>
      <module-header
        :event-id="eventId"
        module-name="Budżet"
      />
    </div>
    <span class="subtitle">Łączny koszt: {{ budgetCost() }}</span>
    <div class="responsive">
      <span class="subtitle">Do zrealizowania: {{ budgetCost(false) }}</span>
      <form
        class="responsive__createtbudget todo responsive__createtodo tooltip"
        data-tooltip="Dodany przedmiot pojawi się na dole listy"
        @submit.prevent="addBudgetItem"
      >
        <input
          v-model="newBudgetItem.name"
          class="responsive__input"
          type="text"
          placeholder="Napisz co musisz kupić"
          maxlength="64"
          required
        >
        <input
          v-model="newBudgetItem.price"
          class="responsive__input"
          type="number"
          min="0"
          placeholder="Napisz ile to kosztuje"
          max="999999"
          required
          @input="maxLengthCheck(newBudgetItem.price, false)"
        >
        <button
          type="submit"
          class="responsive__btn"
        >
          Dodaj przedmiot
        </button>
      </form>
      <transition-group
        name="list"
        tag="ul"
        class="responsive__ul"
      >
        <budget-item
          v-for="item in items.filter(item => item.bought === false)"
          :key="item._id"
          :item="item"
          class="list-item"
          @prepareEdit="prepareEdit"
          @changeStatus="changeStatus"
          @showDeleteModal="showDeleteModal"
        />
      </transition-group>
    </div>
    <div class="responsive">
      <span class="subtitle">Zrealizowane: {{ budgetCost(true) }}</span>
      <transition-group
        name="list"
        tag="ul"
        class="responsive__ul"
      >
        <budget-item
          v-for="item in items.filter(item => item.bought === true)"
          :key="item._id"
          :item="item"
          class="list-item"
          @prepareEdit="prepareEdit"
          @changeStatus="changeStatus"
          @showDeleteModal="showDeleteModal"
        />
      </transition-group>
    </div>
    <transition name="fade-in">
      <basic-modal
        v-if="editModal"
        @close="editModal = false"
      >
        <h3>Edytuj przedmiot</h3>
        <form @submit.prevent="editBudgetItem">
          <textarea
            v-model="budgetItem.name"
            class="responsive__input"
            type="text"
            placeholder="Napisz co kupiłeś/zamierzasz kupić"
            rows="3"
            maxlength="64"
            wrap="soft"
            required
          />
          <input
            v-model="budgetItem.price"
            class="responsive__input"
            type="number"
            min="0"
            max="999999"
            placeholder="Wprowadź cenę przedmiotu"
            required
            @input="maxLengthCheck(budgetItem.price, true)"
          >
          <button
            class="submit-btn"
          >
            Aktualizuj
          </button>
        </form>
      </basic-modal>
    </transition>
    <transition name="fade-in">
      <basic-modal
        v-if="deleteModal"
        @close="deleteModal = false"
      >
        <form @submit.prevent="deleteBudgetItem">
          <h3>
            Usuń przedmiot
          </h3>
          <p>
            Czy chcesz usunąć przedmiot {{ budgetItem.name }}?
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
import ModuleHeader from '../components/modules/ModuleHeader'
import BudgetItem from '../components/budget/BudgetItem'
import BasicModal from '../components/ui/BasicModal'

export default {
  components: {
    ModuleHeader,
    BudgetItem,
    BasicModal
  },
  data () {
    return {
      eventId: this.$route.params.eventId,
      items: [],
      showAdd: false,
      deleteModal: false,
      editModal: false,
      newBudgetItem: {},
      budgetItem: {},
      budgetItemId: '',
      budgetItemCost: 0
    }
  },
  async beforeRouteEnter (to, from, next) {
    const items = await api.listBudgetItems(to.params.eventId)

    if (items.status !== 200) return next({ name: 'party', params: { eventId: to.params.eventId } })

    next(vm => {
      vm.items = items.data
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const items = await api.listBudgetItems(to.params.eventId)

    if (items.status !== 200) return next({ name: 'party', params: { eventId: this.eventId } })

    this.items = items.data
    next()
  },
  methods: {
    async addBudgetItem () {
      const response = await api.addBudgetItem(this.eventId, this.newBudgetItem)

      if (response.status === 200) {
        this.items.push(response.data)
        this.showAdd = false
        this.newBudgetItem = {}
      }
    },
    prepareEdit (itemId, editedBudgetItem) {
      this.budgetItemId = itemId
      this.budgetItem = { ...editedBudgetItem }
      this.editModal = true
    },
    changeStatus (itemId, editedBudgetItem) {
      this.budgetItemId = itemId
      this.budgetItem = editedBudgetItem
      this.editBudgetItem()
    },
    async editBudgetItem () {
      const response = await api.editBudgetItem(this.eventId, this.budgetItemId, this.budgetItem)
      if (response.status === 200) {
        const index = this.items.findIndex(i => i._id === this.budgetItemId)
        this.items[index] = Object.assign(this.items[index], response.data)
        var body = document.body
        body.classList.remove('modal-open')
        this.editModal = false
      }
      this.budgetItem = {}
    },
    showDeleteModal (item) {
      this.budgetItem = { ...item }
      this.deleteModal = true
    },
    async deleteBudgetItem () {
      const itemId = this.budgetItem._id
      const response = await api.deleteBudgetItem(this.eventId, itemId)

      if (response.status === 200) {
        const index = this.items.findIndex(i => i._id === itemId)
        this.items.splice(index, 1)
        var body = document.body
        body.classList.remove('modal-open')
        this.deleteModal = false
      }
      this.budgetItem = {}
    },
    budgetCost (status) {
      let cost = 0
      let tab = []
      switch (status) {
        case true:
          tab = this.items.filter(item => item.bought === true)
          for (let i = 0; i < tab.length; i++) {
            cost += tab[i].price
          }
          return cost + ' PLN'
        case false:
          tab = this.items.filter(item => item.bought === false)
          for (let i = 0; i < tab.length; i++) {
            cost += tab[i].price
          }
          return cost + ' PLN'
        default:
          for (let i = 0; i < this.items.length; i++) {
            cost += this.items[i].price
          }
          return cost + ' PLN'
      }
    },
    maxLengthCheck (object, edit) {
      var maxLength = 6
      if (object.length > maxLength && edit === false) {
        object = object.slice(0, maxLength)
        this.newBudgetItem.price = object
      }
      if (object.length > maxLength && edit === true) {
        object = object.slice(0, maxLength)
        this.budgetItem.price = object
      }
    }
  }
}
</script>

<style lang="scss">
.budget {
  &__item {
    display: flex;

    .item {
      &__name {
        flex: 1 1 60%;
        padding: 1rem;
        border: 1px solid;
      }

      &__status {
        flex: 1 1 20%;
        padding: 1rem;
        border: 1px solid;
        border-left: none;
      }

      &__price {
        flex: 1 1 20%;
        padding: 1rem;
        border: 1px solid;
        border-left: none;
      }

      &__options {
        flex: 1;
        padding: 1rem;
        border: 1px solid;
        border-left: none;
      }
    }

    &:nth-child(n+2) {
      .item {
        &__name,
        &__status,
        &__price {
          border-top: none;
        }
      }
    }

    &:last-child {
      margin-bottom: 1rem;
    }
  }
}
</style>
