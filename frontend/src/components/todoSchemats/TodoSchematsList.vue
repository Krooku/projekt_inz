<template>
  <section class="row events packages">
    <div class="events__list">
      <todo-schemats-item
        v-for="todoSchema of todoSchemats"
        :key="todoSchema._id"
        :data="todoSchema"
        :title="todoSchema.todos.map(t => t.name).join('\n')"
        @previewSchema="previewSchema"
      />
    </div>
    <basic-modal
      v-if="previewModal"
      @close="previewModal = false"
    >
      <todo-schemats-preview
        :data="todo"
        @importSchema="importSchema"
        @close="previewModal = false"
      />
    </basic-modal>
  </section>
</template>

<script>
import TodoSchematsItem from './TodoSchematsItem'
import BasicModal from '../ui/BasicModal'
import TodoSchematsPreview from './TodoSchematsPreview'

export default {
  components: {
    TodoSchematsItem,
    BasicModal,
    TodoSchematsPreview
  },
  props: {
    todoSchemats: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      todo: {},
      previewModal: false
    }
  },
  methods: {
    previewSchema (todo) {
      this.todo = todo
      this.previewModal = true
    },
    importSchema (packageID) {
      this.$emit('importTodos', packageID)
      var body = document.body
      body.classList.remove('modal-open')
      this.previewModal = false
    }
  }
}
</script>
