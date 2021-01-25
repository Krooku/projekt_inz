<template>
  <div>
    <div>
      <module-header
        :event-id="eventId"
        :module-name="moduleName"
      />
    </div>
    <div class="add_note">
      <form @submit.prevent="submitNote">
        <input
          v-model="newNote.name"
          class="add_note__input"
          type="text"
          maxlength="24"
          placeholder="Tytuł notatki"
          required
        >
        <textarea
          v-model="newNote.content"
          class="add_note__input"
          type="text"
          placeholder="Treść notatki"
          maxlength="1024"
          rows="4"
          wrap="soft"
          required
        />
        <button
          class="submit-btn"
        >
          Dodaj
        </button>
      </form>
    </div>
    <div class="container">
      <div
        class="notes"
      >
        <div
          v-for="note in notes"
          :key="note._id"
          class="note"
        >
          <p class="nazwa">
            {{ note.name }}
          </p>
          <hr>
          <p> {{ note.content }} </p>
          <p class="footer">
            {{ pickDate(note.updatedAt) }} <i
              class="icon far fa-trash-alt"
              @click="showDeleteModal(note)"
            /><i
              class="icon fas fa-edit"
              @click="showEditModal(note)"
            />
          </p>
        </div>
      </div>
      <p v-if="notes.length===0">
        Nie posiadasz żadnych notatek.
      </p>
      <transition name="fade-in">
        <basic-modal
          v-if="editModal"
          @close="editModal = false"
        >
          <h3>Edytuj notatkę</h3>
          <form @submit.prevent="editNote">
            <input
              v-model="editedNote.name"
              class="add_note__input"
              type="text"
              placeholder="Napisz nazwę"
              maxlength="24"
              required
            >
            <textarea
              v-model="editedNote.content"
              class="add_note__input"
              type="text"
              placeholder="Napisz notatkę"
              maxlength="1024"
              rows="10"
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
          <form @submit.prevent="deleteNoteItem">
            <h3>
              Usuń notatkę
            </h3>
            <p>
              Czy chcesz usunąć notatkę {{ editedNote.name }}?
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
      moduleName: 'Notatnik',
      functions: [
        {}
      ],
      newNote: {},
      editedNote: {},
      notes: [],
      editModal: false,
      deleteModal: false,
      eventId: this.$route.params.eventId,
      windowWidth: 0
    }
  },
  async beforeRouteEnter (to, from, next) {
    const notes = await api.listNoteItems(to.params.eventId)

    if (notes.status !== 200) {
      return next({ name: 'party', params: { eventId: to.params.eventId } })
    }

    next(vm => {
      vm.notes = notes.data
    })
  },
  async beforeRouteUpdate (to, from, next) {
    const notes = await api.listNoteItems(to.params.eventId)

    if (notes.status !== 200) {
      return next({ name: 'party', params: { eventId: this.eventId } })
    }

    this.notes = notes.data
    next()
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowWidth)
    })
  },
  methods: {
    async submitNote () {
      const response = await api.addNoteItem(this.eventId, this.newNote)
      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      this.notes.push(response.data)
      this.newNote = {}
      window.scrollTo(0, document.body.scrollHeight)
    },
    async deleteNoteItem () {
      const noteId = this.editedNote._id
      const response = await api.deleteNoteItem(this.eventId, noteId)

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }

      const index = this.notes.findIndex(note => note._id === noteId)
      this.notes.splice(index, 1)
      var body = document.body
      body.classList.remove('modal-open')
      this.deleteModal = false
    },
    async editNote () {
      const noteId = this.editedNote._id
      const name = this.editedNote.name
      const content = this.editedNote.content

      const response = await api.editNoteItem(this.eventId, noteId, { name, content })

      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      const index = this.notes.findIndex(note => note._id === noteId)
      this.notes[index].name = name
      this.notes[index].content = content
      var body = document.body
      body.classList.remove('modal-open')
      this.editModal = false
    },
    pickDate (date) {
      let noteDate = new Date(date).toLocaleString('en-US', { timeZone: 'Europe/Warsaw' })
      noteDate = new Date(noteDate)
      let day = noteDate.getDate()
      let month = noteDate.getMonth()
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      if (parseInt(month) + 1 < 10) {
        month = '0' + (parseInt(month) + 1).toString()
      }
      return day + '.' + month + '.' + noteDate.getFullYear() + ', ' + (noteDate.toTimeString()).slice(0, 8)
    },
    showEditModal (note) {
      this.editedNote = { ...note }
      this.editModal = true
    },
    showDeleteModal (note) {
      this.editedNote = { ...note }
      this.deleteModal = true
    }
  }
}
</script>

<style lang="scss" scoped>
.add_note {
  width: 50%;
  padding: 0 15px;
  margin-left: auto;
  margin-right: auto;

  @media only screen and (max-width: 822px) {
    width: 100%;
  }

  &__input {
    margin-top: 8px;
    width: 100%;
    padding: 5px;
    margin-bottom: 5px;
    resize: none;
    font-size: 1.4em;
    background-color: var(--color-dark-grey);
    color: black;
    border-radius: 2px;

    &:focus {
      background-color: var(--color-dark-grey-focus);
      box-shadow: 0 0 5px 2px var(--text-color-gray);
    }
  }

  button {
    display: block;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--color-dark-red);
    font-size: 18px;
    letter-spacing: 2px;
    color: #fff;
    margin-top: 0;
    margin-bottom: 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    outline: none;

    &:hover {
      background-color: var(--secondary-text-color);
    }
  }
}

.container {
  display: flex;
  width: auto;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 4em;

  p {
    margin-top: 20px;
    font-size: 18px;
  }

  .notes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .note {
    display: grid;
    grid-template-rows: 30px 2px auto 30px;
    grid-template-columns: 100%;
    width: 450px;
    margin-top: 6px;
    margin-left: 5px;
    margin-right: 5px;
    padding: 5px;
    background-color: var(--color-dark-grey);
    color: black;
    border-radius: 2px;
    white-space: pre-line;

    @media (max-width: 461px) {
      width: 360px;
    }

    @media (max-width: 361px) {
      width: 310px;
    }

    p,
    span {
      margin: 0;
      font-size: 18px;
      padding: 5px;
      word-wrap: break-word;

      .icon {
        padding: 0 3px;
        float: right;
        cursor: pointer;
      }
    }

    .nazwa {
      font-weight: 1000;
    }
  }
}
</style>
