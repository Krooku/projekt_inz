<template>
  <div>
    <div class="responsive">
      <span class="subtitle">{{ data.name }}</span>
      <ul class="responsive__ul">
        <todo-item
          v-for="todo in data.todos"
          :key="todo.name"
          :todo="todo"
        />
      </ul>
    </div>
    <button
      class="btn"
      @click="importSchema(packageID)"
    >
      Importuj
    </button>
    <button
      class="btn"
      @click="$emit('close')"
    >
      Anuluj
    </button>
  </div>
</template>

<script>
import TodoItem from '../todo/TodoItem'

export default {
  components: {
    TodoItem
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    packageID () {
      return this.data._id
    }
  },
  methods: {
    importSchema (packageID) {
      var packages = []

      if (JSON.parse(localStorage.getItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID'))) {
        packages = JSON.parse(localStorage.getItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID'))
        if (packages.indexOf(packageID) === -1) {
          packages.push(packageID)
          localStorage.setItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID', JSON.stringify(packages))
        }
      } else {
        packages.push(packageID)
        localStorage.setItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID', JSON.stringify(packages))
      }
      this.$emit('importSchema', packageID)
    }
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  display: block;
  line-height: normal;
  color: var(--color-dark-red);
  text-align: center;
  font-size: 36px;
  margin-bottom: 0.6em;
}

.responsive {
  padding: 10px;
  float: left;
  width: 100%;
  margin-bottom: 20px;

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
}
</style>
