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
        <h3>Edytuj jedzenie</h3>
        <form @submit.prevent="editFood">
          <textarea
            v-model="editedFood.dish"
            class="responsive__input"
            type="text"
            placeholder="Zaproponuj potrawę"
            rows="3"
            wrap="soft"
            maxlength="64"
            required
          />
          <button
            class="submit-btn"
          >
            Edytuj
          </button>
        </form>
      </basic-modal>
      <basic-modal
        v-if="editOwnerModal"
        @close="editOwnerModal = false"
      >
        <h3>Zaklep jedzenie</h3>
        <form @submit.prevent="editFood">
          <input
            v-model="editedFood.owner"
            class="responsive__input"
            type="text"
            placeholder="Kto przygotuje potrawę"
            rows="1"
            wrap="soft"
            maxlength="32"
            required
          >
          <button
            class="submit-btn"
          >
            Zaklep
          </button>
        </form>
      </basic-modal>
      <basic-modal
        v-if="deleteOwnerModal"
        @close="deleteOwnerModal = false"
      >
        <h3>Chcesz zrezygnować z przyrządzenia {{ editedFood.dish }}?</h3>
        <form @submit.prevent="deleteOwner">
          <button
            class="submit-btn"
          >
            Zrezygnuj
          </button>
        </form>
      </basic-modal>
      <basic-modal
        v-if="deleteModal"
        @close="deleteModal = false"
      >
        <form @submit.prevent="deleteFood">
          <h3>
            Usuń jedzenie
          </h3>
          <p>
            Czy chcesz usunąć {{ editedFood.dish }}?
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
      <span class="subtitle">Zaproponowane</span>
      <div>
        <form @submit.prevent="addFood">
          <div
            class="tooltip"
            data-tooltip="Dodane jedzenie pojawi się na dole listy"
          >
            <input
              v-model="newFoodDish"
              class="responsive__input"
              type="text"
              placeholder="Zaproponuj potrawę"
              maxlength="64"
            >
          </div>
        </form>
        <transition-group
          name="list"
          tag="ul"
          class="responsive__ul"
        >
          <li
            v-for="food in foodsNotOwned"
            :key="food._id"
            class="responsive__ul--li list-item"
          >
            <food-item
              :food="food"
              @edit="showEditModal"
              @editOwner="showEditOwnerModal"
              @delete="showDeleteModal"
            />
          </li>
        </transition-group>
      </div>
    </div>

    <div class="responsive">
      <span class="subtitle">Zaklepane</span>
      <transition-group
        name="list"
        tag="ul"
        class="responsive__ul"
      >
        <li
          v-for="food in foodsOwned"
          :key="food._id"
          class="responsive__ul--li list-item"
        >
          <food-item
            :food="food"
            @edit="showEditModal"
            @deleteOwner="showDeleteOwnerModal"
            @delete="showDeleteModal"
          />
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script>
import api from '../api'
import ModuleHeader from '../components/modules/ModuleHeader'
import BasicModal from '../components/ui/BasicModal'
import FoodItem from '../components/food/FoodItem'

export default {
  components: {
    ModuleHeader,
    BasicModal,
    FoodItem
  },
  data () {
    return {
      moduleName: 'Wspólne jedzenie',
      editedFood: {},
      deleteModal: false,
      editModal: false,
      editOwnerModal: false,
      deleteOwnerModal: false,
      newFoodDish: '',
      foods: [],
      eventId: this.$route.params.eventId,
      importModal: false
    }
  },
  async beforeRouteEnter (to, from, next) {
    const foods = await api.listFoodItems(to.params.eventId)

    if (foods.status !== 200) return next({ name: 'party', params: { eventId: to.params.eventId } })

    next(vm => {
      vm.foods = foods.data
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const foods = await api.listFoodItems(to.params.eventId)

    if (foods.status !== 200) return next({ name: 'party', params: { eventId: this.eventId } })

    this.foods = foods.data
    next()
  },
  computed: {
    foodsOwned: function () {
      return this.foods.filter(food => food.owner !== '')
    },
    foodsNotOwned: function () {
      return this.foods.filter(food => food.owner === '')
    }
  },
  methods: {
    async addFood () {
      const response = await api.addFoodItem(this.eventId, {
        dish: this.newFoodDish,
        owner: ''
      })

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      this.foods.push(response.data)
      this.newFoodDish = ''
    },
    async deleteFood () {
      const foodId = this.editedFood._id

      const response = await api.deleteFoodItem(this.eventId, foodId)

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      const index = this.foods.findIndex(food => food._id === foodId)
      this.foods.splice(index, 1)
      var body = document.body
      body.classList.remove('modal-open')
      this.deleteModal = false
    },
    async editFood () {
      const foodId = this.editedFood._id
      const dish = this.editedFood.dish
      const owner = this.editedFood.owner

      const response = await api.editFoodItem(this.eventId, foodId, { dish: dish, owner: owner })

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      const index = this.foods.findIndex(food => food._id === foodId)
      this.foods[index].dish = dish
      this.foods[index].owner = owner
      var body = document.body
      body.classList.remove('modal-open')
      this.editModal = false
      this.editOwnerModal = false
    },
    async deleteOwner () {
      const foodId = this.editedFood._id
      const dish = this.editedFood.dish
      const owner = ''

      const response = await api.editFoodItem(this.eventId, foodId, { dish: dish, owner: owner })

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      const index = this.foods.findIndex(food => food._id === foodId)
      this.foods[index].dish = dish
      this.foods[index].owner = owner
      var body = document.body
      body.classList.remove('modal-open')
      this.deleteOwnerModal = false
    },
    showEditModal (food) {
      this.editedFood = { ...food }
      this.editModal = true
    },
    showEditOwnerModal (food) {
      this.editedFood = { ...food }
      this.editOwnerModal = true
    },
    showDeleteOwnerModal (food) {
      this.editedFood = { ...food }
      this.deleteOwnerModal = true
    },
    showDeleteModal (food) {
      this.editedFood = { ...food }
      this.deleteModal = true
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
  padding: 10px;
  float: left;
  width: 50%;
  margin-bottom: 20px;

  @media only screen and (max-width: 1222px) {
    width: 100%;
  }

  &__ul {
    list-style-type: none;

    &--li {
      padding: 20px;
      font-size: 1.4em;
      background-color: var(--color-light-grey);
      border-left: 5px solid var(--color-dark);
      margin-bottom: 2px;
      color: black;
      border-radius: 15px;
      float: left;
      width: 100%;
    }
  }

  &__input {
    width: 100%;
    border: 0;
    padding: 20px;
    margin-bottom: 5px;
    font-size: 1.4em;
    background-color: var(--color-dark-grey);
    color: black;
    border-radius: 15px;
    border-left: 5px solid var(--color-dark);
  }
}

.tooltip {
  position: relative;

  &::after {
    content: attr(data-tooltip);
    font-size: 14px;
    text-align: center;
    position: absolute;
    background: var(--header-hover-bg-color);
    padding: 4px 12px;
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    display: table;
    opacity: 0;
    pointer-events: none;
    left: 50%;
    top: 5px;
    border-radius: 4px;
    transform: translate3d(-50%, 0%, 0);
    transition: all 0.3s ease;
    transition-delay: 0.5s;
    z-index: -1;
  }

  &:hover {
    &::after {
      opacity: 1;
      transform: translate3d(-50%, calc(-100% - 2px), 0);
    }
  }
}
</style>
