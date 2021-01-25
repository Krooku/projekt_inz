<template>
  <li
    class="responsive__ul--li"
    :class="priority"
  >
    <div>
      <span>
        {{ todo.name }}
      </span>
      <div
        v-if="todo.status"
        class="todo-controls"
      >
        <div
          v-if="actionLeft !== undefined"
          class="todo-controls--icon far fa-arrow-alt-circle-left"
          @click="setTodoStatus(todo, actionLeft)"
        />
        <div
          class="todo-controls--icon far fa-edit"
          title="Edytuj"
          @click="editTodo(todo)"
        />
        <div
          class="todo-controls--icon far fa-trash-alt"
          @click="deleteTodo(todo)"
        />
        <div
          v-if="actionRight !== undefined"
          class="todo-controls--icon far fa-arrow-alt-circle-right"
          @click="setTodoStatus(todo, actionRight)"
        />
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      statusList: ['todo', 'inprogress', 'done']
    }
  },
  computed: {
    actionLeft () {
      const index = this.statusList.findIndex(status => this.todo.status === status)
      return this.statusList[index - 1]
    },
    actionRight () {
      const index = this.statusList.findIndex(status => this.todo.status === status)
      return this.statusList[index + 1]
    },
    priority () {
      return ('priority--' + this.todo.priority)
    }
  },
  methods: {
    setTodoStatus (todo, status) {
      this.$emit('statusChange', todo, status)
    },
    editTodo (todo) {
      this.$emit('edit', todo)
    },
    deleteTodo (todo) {
      this.$emit('delete', todo)
    }
  }
}
</script>
