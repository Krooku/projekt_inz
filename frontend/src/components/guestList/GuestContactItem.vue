<template>
  <li class="guest-contact-info">
    <div>
      <div
        v-if="allowShowMore"
        class="controls-left"
      >
        <div
          class="icon far fas fa-angle-double-down"
          :class="{ 'icon far fas fa-angle-double-up': showMore }"
          title="Rozwiń"
          @click="showMore=!showMore"
        />
      </div>
      <div class="controls-right">
        <div
          v-if="guest.status !== 'invite'"
          class="icon far fa-arrow-alt-circle-left"
          title="Przenieś"
          @click="setGuestStatus(guest.status === 'confirmed' ? 'invited' : 'invite')"
        />
        <div
          class="icon fas fa-user-edit"
          title="Edytuj"
          @click="$emit('guestEditRequested', guest)"
        />
        <div
          class="icon far fa-trash-alt"
          title="Usuń"
          @click="deleteGuest(guest)"
        />
        <div
          v-if="guest.status !== 'confirmed'"
          class="icon far fa-arrow-alt-circle-right"
          title="Przenieś"
          @click="setGuestStatus(guest.status === 'invite' ? 'invited' : 'confirmed')"
        />
      </div>
      <span
        v-if="allowShowMore"
        class="show-more"
        @click="showMore = !showMore"
      >
        {{ guest.firstname }} {{ guest.lastname }}
      </span>
      <span v-else>
        {{ guest.firstname }} {{ guest.lastname }}
      </span>
      <div v-if="showMore">
        <div class="list">
          <div v-if="guest.phoneNumber">
            Telefon: {{ guest.phoneNumber }}
          </div>
          <div v-if="guest.email">
            Email: {{ guest.email }}
          </div>
          <div v-if="guest.plusOne">
            Towarzysz: {{ guest.plusOneFullName }}
          </div>
          <div v-if="!guest.phoneNumber && !guest.email && !guest.plusOne">
            Brak informacji
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    guest: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showMore: false,
      eventId: this.$route.params.eventId
    }
  },
  computed: {
    allowShowMore () {
      return this.guest.phoneNumber || this.guest.email || this.guest.plusOne
    }
  },
  methods: {
    async setGuestStatus (status) {
      this.$emit('statusChange', this.guest, status)
    },
    async deleteGuest () {
      this.$emit('delete', this.guest)
    }
  }
}
</script>

<style lang="scss">
.guest-contact-info {
  padding: 15px;
  font-size: 1.4em;
  background-color: var(--color-light-grey);
  border-left: 5px solid var(--color-dark);
  margin-bottom: 2px;
  color: black;
  border-radius: 15px;

  .list {
    margin-left: 1.18em;
  }

  .icon {
    cursor: pointer;
    padding-right: 4px;
  }

  .controls-right {
    float: right;
  }

  .controls-left {
    float: left;
    padding-right: 0.35em;
  }

  .show-more:hover {
    color: var(--color-dark-red);
    cursor: pointer;
  }
}
</style>
