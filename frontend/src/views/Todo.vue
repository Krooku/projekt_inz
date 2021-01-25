<template>
  <div class="todo">
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
        <h3>Edytuj zadanie</h3>
        <form @submit.prevent="editTodo">
          <select
            id="priority-choose"
            v-model="editedTodo.priority"
            class="responsive__input"
            name="priority"
          >
            <option value="0">
              Priorytet: NISKI
            </option>
            <option value="1">
              Priorytet: ŚREDNI
            </option>
            <option value="2">
              Priorytet: WYSOKI
            </option>
          </select>
          <div
            for="priority-choose"
            class="priority-symbol"
          />
          <textarea
            v-model="editedTodo.name"
            class="responsive__input"
            type="text"
            placeholder="Napisz co musisz zrobić"
            rows="6"
            wrap="soft"
            maxlength="512"
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
        v-if="deleteModal"
        @close="deleteModal = false"
      >
        <form @submit.prevent="deleteTodo">
          <h3>
            Usuń zadanie
          </h3>
          <p>
            Czy chcesz usunąć zadanie {{ editedTodo.name }}?
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
      <span class="subtitle">Do wykonania</span>
      <div>
        <form
          class="responsive__createtodo tooltip"
          data-tooltip="Dodane zadanie pojawi się na dole listy"
          @submit.prevent="createTodo"
        >
          <input
            v-model="newTodo.name"
            class="responsive__input"
            type="text"
            placeholder="Napisz co musisz zrobić"
            maxlength="512"
          >
        </form>
        <transition-group
          name="list"
          tag="ul"
          class="responsive__ul"
        >
          <todo-item
            v-for="todo in todosStatusTodo"
            :key="todo._id"
            :todo="todo"
            class="list-item"
            @statusChange="setTodoStatus"
            @edit="showEditModal"
            @delete="showDeleteModal"
          />
        </transition-group>
      </div>
    </div>

    <div class="responsive">
      <span class="subtitle">W trakcie</span>
      <transition-group
        name="list"
        tag="ul"
        class="responsive__ul"
      >
        <todo-item
          v-for="todo in todosStatusInprogress"
          :key="todo._id"
          :todo="todo"
          class="list-item"
          @statusChange="setTodoStatus"
          @edit="showEditModal"
          @delete="showDeleteModal"
        />
      </transition-group>
    </div>

    <div class="responsive">
      <span class="subtitle">Wykonanane</span>
      <transition-group
        name="list"
        tag="ul"
        class="responsive__ul"
      >
        <todo-item
          v-for="todo in todosStatusDone"
          :key="todo._id"
          :todo="todo"
          class="list-item"
          @statusChange="setTodoStatus"
          @edit="showEditModal"
          @delete="showDeleteModal"
        />
      </transition-group>
    </div>
    <transition name="fade-in">
      <basic-modal
        v-if="importModal"
        :wide="true"
        @close="importModal = false"
      >
        <div>
          <h3>
            Wybierz schemat do zaimportowania
          </h3>
          <todo-schemats-list
            :todo-schemats="todoSchemats"
            @importTodos="importTodos"
          />
        </div>
      </basic-modal>
    </transition>
  </div>
</template>

<script>
import api from '../api'
import ModuleHeader from '../components/modules/ModuleHeader'
import BasicModal from '../components/ui/BasicModal'
import TodoItem from '../components/todo/TodoItem'
import TodoSchematsList from '../components/todoSchemats/TodoSchematsList'

export default {
  components: {
    ModuleHeader,
    BasicModal,
    TodoItem,
    TodoSchematsList
  },
  data () {
    return {
      moduleName: 'Lista zadań',
      functions: [
        { function: this.listTodoSchemats, value: 'Importuj szablon' }
      ],
      editedTodo: {},
      deleteModal: false,
      editModal: false,
      newTodo: {},
      todos: [],
      eventId: this.$route.params.eventId,
      importModal: false,
      todoSchemats: []
    }
  },
  async beforeRouteEnter (to, from, next) {
    const todos = await api.listTodoItems(to.params.eventId)

    if (todos.status !== 200) return next({ name: 'party', params: { eventId: to.params.eventId } })

    next(vm => {
      vm.todos = todos.data.sort((b, a) => a.priority - b.priority)
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const todos = await api.listTodoItems(to.params.eventId)

    if (todos.status !== 200) return next({ name: 'party', params: { eventId: this.eventId } })

    this.todos = todos.data.sort((b, a) => a.priority - b.priority)
    next()
  },
  computed: {
    todosStatusTodo: function () {
      return this.todos.filter(todo => todo.status === 'todo')
    },
    todosStatusInprogress: function () {
      return this.todos.filter(todo => todo.status === 'inprogress')
    },
    todosStatusDone: function () {
      return this.todos.filter(todo => todo.status === 'done')
    }
  },
  methods: {
    async createTodo () {
      const response = await api.createTodoItem(this.eventId, {
        name: this.newTodo.name,
        priority: this.newTodo.priority
      })

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      this.todos.push(response.data)
      this.newTodo = {}
      this.todos.sort((b, a) => a.priority - b.priority)
    },
    async setTodoStatus (todo, status) {
      const response = await api.editTodoItem(this.eventId, todo._id, { status })

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      const index = this.todos.findIndex(t => t._id === todo._id)
      this.todos[index].status = status
    },
    async deleteTodo () {
      const todoId = this.editedTodo._id

      const response = await api.deleteTodoItem(this.eventId, todoId)

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      const index = this.todos.findIndex(todo => todo._id === todoId)
      this.todos.splice(index, 1)
      var body = document.body
      body.classList.remove('modal-open')
      this.deleteModal = false
    },
    async editTodo () {
      const todoId = this.editedTodo._id
      const name = this.editedTodo.name
      const priority = this.editedTodo.priority

      const response = await api.editTodoItem(this.eventId, todoId, { name: name, priority: priority })

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      const index = this.todos.findIndex(todo => todo._id === todoId)
      this.todos[index].name = name
      this.todos[index].priority = priority
      this.todos.sort((b, a) => a.priority - b.priority)
      var body = document.body
      body.classList.remove('modal-open')
      this.editModal = false
    },
    showEditModal (todo) {
      this.editedTodo = { ...todo }
      this.editModal = true
    },
    showDeleteModal (todo) {
      this.editedTodo = { ...todo }
      this.deleteModal = true
    },
    async listTodoSchemats () {
      const response = await api.listTodoPackages(this.eventId)

      if (response.status === 200) {
        this.todoSchemats = response.data
        this.importModal = true
      }
    },
    async importTodos (packageID) {
      const response = await api.importTodos(this.eventId, { packageId: packageID })

      if (response.status === 200) {
        this.todos = this.todos.concat(response.data)
        this.importModal = false
      }
    }
  }
}
</script>
