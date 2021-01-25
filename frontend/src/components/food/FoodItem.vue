<template>
  <div>
    <span>
      <span
        v-if="food.owner !==''"
      >
        <b>{{
          food.owner
        }}
        </b>
        przygotuje

      </span>
      {{ food.dish }}
    </span>
    <div class="todo-controls">
      <div
        v-if="food.owner !== ''"
        class="todo-controls--icon far fa-arrow-alt-circle-left"
        title="Odklep"
        @click="deleteOwner(food)"
      />
      <div
        class="todo-controls--icon far fa-edit"
        title="Edytuj"
        @click="editFood(food)"
      />
      <div
        class="todo-controls--icon far fa-trash-alt"
        title="Usuń"
        @click="deleteFood(food)"
      />
      <div
        v-if="food.owner === ''"
        class="todo-controls--icon far fa-arrow-alt-circle-right"
        title="Zaklep"
        @click="editFoodOwner(food)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object,
      required: true
    }
  },
  methods: {
    editFood (food) {
      this.$emit('edit', food)
    },
    editFoodOwner (food) {
      this.$emit('editOwner', food)
    },
    deleteOwner (food) {
      this.$emit('deleteOwner', food)
    },
    deleteFood (food) {
      this.$emit('delete', food)
    }
  }
}

</script>

<style lang="scss">
.todo-controls {
  float: right;

  &--icon {
    cursor: pointer;
    padding: 10px 3px 0 3px;
    transition: all 0.2s ease;

    &:hover {
      color: var(--accent-color);
    }
  }
}

.priority {
  color: transparent;
  width: 50px;
  border-bottom: 5px solid transparent;
  margin-left: auto;
  margin-bottom: 5px;

  &--0 {
    border-color: green;
  }

  &--1 {
    border-color: orange;
  }

  &--2 {
    border-color: red;
  }
}
</style>
