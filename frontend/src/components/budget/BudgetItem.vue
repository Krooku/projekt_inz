<template>
  <li
    class="responsive__ul--li"
    :class="priority"
  >
    <div class="budget-item">
      <div class="budget-item__name">
        {{ item.name }}
      </div>
      <div class="budget-item__price">
        {{ item.price }} PLN
      </div>
      <div class="todo-controls">
        <div
          v-if="item.bought"
          class="todo-controls--icon far fa-arrow-alt-circle-left"
          @click="changeStatus(item._id, { bought: !item.bought })"
        />
        <div
          class="todo-controls--icon far fa-edit"
          title="Edytuj"
          @click="editItem(item._id, item)"
        />
        <div
          class="todo-controls--icon far fa-trash-alt"
          @click="deleteItem(item)"
        />
        <div
          v-if="item.bought === false"
          class="todo-controls--icon far fa-arrow-alt-circle-right"
          @click="changeStatus(item._id, { bought: !item.bought })"
        />
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    item: {
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
    priority () {
      if (this.item.bought) {
        return ('priority--2')
      }
      return ('priority--0')
    }
  },
  methods: {
    editItem (itemId, data) {
      this.$emit('prepareEdit', itemId, data)
    },
    changeStatus (itemId, data) {
      this.$emit('changeStatus', itemId, data)
    },
    deleteItem (data) {
      this.$emit('showDeleteModal', data)
    }
  }
}
</script>
