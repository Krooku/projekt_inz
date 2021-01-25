<template>
  <div
    v-if="!imported"
    class="events__item package__item"
    @click="previewSchema(data)"
  >
    <div class="events__title">
      <h3>{{ data.name }}</h3>
      <span>{{ data.description }}</span>
    </div>
  </div>
  <div
    v-else
    class="events__item package__imported"
  >
    <div class="events__title">
      <h3>{{ data.name }}</h3>
      <span>{{ data.description }}</span>
    </div>
    <p> Już zaimpotowany </p>
    <i
      class="icon fas fa-sync"
      @click="refreshImport(packageID)"
    />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      imported: false
    }
  },
  computed: {
    packageID () {
      return this.data._id
    }
  },
  mounted () {
    var packageID = this.data._id
    var packages = []
    if (JSON.parse(localStorage.getItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID'))) {
      packages = JSON.parse(localStorage.getItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID'))
      if (packages.indexOf(packageID) > -1) {
        this.imported = true
      }
    }
  },
  methods: {
    refreshImport (packageID) {
      var packages = []
      if (JSON.parse(localStorage.getItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID'))) {
        packages = JSON.parse(localStorage.getItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID'))
        for (var i = 0; i < packages.length; i++) {
          if (packages[i] === packageID) {
            packages.splice(i, 1)
            localStorage.setItem(localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event') + 'todo_packagesID', JSON.stringify(packages))
            this.imported = false
            break
          }
        }
      }
    },
    previewSchema (data) {
      this.$emit('previewSchema', data)
    }
  }
}
</script>
