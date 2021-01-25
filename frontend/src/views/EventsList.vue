<template>
  <div class="grid-container">
    <div class="logo">
      <div>
        <p v-if="!mobile">
          Event Planner
        </p>
        <p class="web_name">
          Twoje wydarzenia
        </p>
        <router-link
          v-if="mobile"
          class="btn_create"
          tag="button"
          :to="{ name: 'createEvent' }"
        >
          Stwórz wydarzenie
        </router-link>
      </div>
    </div>
    <div
      v-if="!tablet"
      class="title"
    >
      <p v-if="events.length > 0">
        Kliknij w wydarzenie, aby zobaczyć jego zawartość
      </p>
      <p v-else-if="events.length === 0">
        Możesz stworzyć więcej wydarzeń
      </p>
    </div>
    <div
      class="events"
    >
      <router-link
        v-if="!mobile"
        tag="div"
        :to="{ name: 'createEvent' }"
      >
        <div
          class="create_event"
        >
          Stwórz wydarzenie
        </div>
      </router-link>
      <events-item
        v-for="event of events"
        :key="event._id"
        :data="event"
        :last-visited-id="last_visitedId"
        :mobile="mobile"
        :tablet="tablet"
        @removeEvent="removeEvent"
        @updateEvent="updateEvent"
      />
    </div>
    <div
      v-if="!tablet"
      class="last_visited_text"
    >
      <img src="@/assets/curved_arrow.svg">
      <p v-if="last_event !== null">
        Ostatnio odwiedzony
      </p>
      <p v-else>
        Stwórz wydarzenie
      </p>
    </div>
    <div
      v-if="!tablet"
      class="last_visited_event"
    >
      <events-item
        v-if="last_event !== null"
        :data="last_event"
        :last-visited-id="last_visitedId"
        :mobile="mobile"
        :tablet="tablet"
        @removeEvent="removeEvent"
        @updateEvent="updateEvent"
      />
      <router-link
        v-else
        class="create_event"
        tag="div"
        :to="{ name: 'createEvent' }"
      >
        Stwórz wydarzenie
      </router-link>
    </div>
  </div>
</template>

<script>
import api from '../api'
import EventsItem from '../components/events/EventsItem'

export default {
  components: {
    EventsItem
  },
  data () {
    return {
      mobile: false,
      tablet: false,
      last_visitedId: '',
      last_event: null,
      events: [],
      windowWidth: 0,
      lveIndex: -1
    }
  },
  async beforeRouteEnter (to, from, next) {
    const response = await api.listEvents()
    next(vm => {
      vm.events = response.data
      if (vm.events.length === 0) {
        localStorage.setItem(localStorage.getItem('current_username') + 'last_visited_event', ''); vm.last_visitedId = ''; vm.last_event = null
      } else {
        vm.last_visitedId = localStorage.getItem(localStorage.getItem('current_username') + 'last_visited_event')
        if (vm.last_visitedId === null || vm.last_visitedId === '') { vm.last_visitedId = vm.events[0]._id; localStorage.setItem(localStorage.getItem('current_username') + 'last_visited_event', vm.last_visitedId) } // gdyby ktos zalogowal z innego urzadrzenia
        const index = vm.events.findIndex(event => event._id === vm.last_visitedId)
        vm.lveIndex = index
        if (index === -1) {
          vm.last_event = vm.events[0]// vm.events.shift()
          localStorage.setItem(localStorage.getItem('current_username') + 'last_visited_event', vm.last_event._id)
        } else {
          vm.last_event = vm.events[index]
          if (vm.events.length > 1) {
            // const event = vm.events[index]
            // vm.events[index] = vm.events[0]
            // vm.events[0] = event
          }

          // vm.events.splice(index, 1)
        }
      }
      const mq = window.matchMedia('(max-width: 1147px)')
      if (mq.matches) {
        const lveIndex = vm.events.findIndex(event => event._id === vm.last_visitedId)
        vm.lveIndex = lveIndex
        if (lveIndex === -1 && vm.last_event !== null) {
          // vm.events.unshift(vm.last_event)
          vm.events.shift()
          vm.last_event = null
        } else {
          if (vm.events.length > 1) {
            const event = vm.events[lveIndex]
            vm.events[lveIndex] = vm.events[0]
            vm.events[0] = event
          }
        }
      }
    })
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowWidth)
      this.getWindowWidth()
    })
  },
  methods: {
    removeEvent (eventId) {
      if (this.events.length === 0) {
        localStorage.setItem(localStorage.getItem('current_username') + 'last_visited_event', ''); this.last_visitedId = ''; this.last_event = null
        this.events.shift()
      } else {
        if (eventId === this.last_visitedId) {
          if (this.events.length > 1) {
            // this.events.shift()
            const mq = window.matchMedia('(max-width: 1147px)')
            if (mq.matches) {
              this.events.shift()
            } else {
              this.events.splice(this.lveIndex, 1)
            }
            this.last_event = this.events[0]
            this.last_visitedId = this.last_event._id
            localStorage.setItem(localStorage.getItem('current_username') + 'last_visited_event', this.last_visitedId)
            this.lveIndex = 0
          } else {
            this.last_event = null
            this.last_visitedId = ''
            localStorage.setItem(localStorage.getItem('current_username') + 'last_visited_event', '')
            this.events.shift()
            this.lveIndex = -1
          }
        } else {
          const index = this.events.findIndex(event => event._id === eventId)
          this.events.splice(index, 1)
        }
        const mq = window.matchMedia('(max-width: 1147px)')
        if (mq.matches) {
          if (this.last_event !== null) {
            this.last_event = null
          }
        }
      }
    },

    updateEvent (eventId, name) {
      if (eventId === this.last_visitedId && this.last_event !== null) {
        this.last_event.name = name
      } else {
        const index = this.events.findIndex(event => event._id === eventId)
        this.events[index].name = name
      }
    },
    getWindowWidth (event) {
      this.windowWidth = document.documentElement.clientWidth
      const mq = window.matchMedia('(max-width: 1147px)')
      if (mq.matches) {
        if (this.last_event !== null) {
          const lveIndex = this.events.findIndex(event => event._id === this.last_visitedId)
          // this.lveIndex = lveIndex
          if (this.events.length > 1) {
            const event = this.events[lveIndex]
            this.events[lveIndex] = this.events[0]
            this.events[0] = event
          }
          // this.events.unshift(this.last_event);
          this.last_event = null
        }
        this.mobile = false
        this.tablet = true
      } else {
        if (this.last_event === null && this.events.length > 0) {
          this.last_event = this.events[0]
          const event = this.events[this.lveIndex]
          this.events[this.lveIndex] = this.events[0]
          this.events[0] = event
        }
        this.tablet = false
      }
      const mq3 = window.matchMedia('(max-width: 763px)')
      if (mq3.matches) {
        this.mobile = true
      } else {
        this.mobile = false
      }
    }
  }
}
</script>

<style lang="scss">
.grid-container {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 25px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;

  @media (min-width: 1148px) {
    grid-template-columns: 0.1fr 2.5fr 1.4fr 0.7fr 1.2fr 0.1fr;
    grid-template-rows: 1fr auto auto;
  }

  .logo {
    grid-area: 1 / 1 / 2 / 2;
    font-size: 54px;
    padding: 40px;
    text-align: center;

    @media (min-width: 1148px) {
      grid-area: 1 / 1 / 2 / 3;
    }

    @media (max-width: 1371px) {
      font-size: 44px;
    }

    @media (max-width: 1147px) {
      font-size: 29px;
      padding: 10px;

      div {
        margin-left: auto;
        margin-right: auto;
      }
    }

    .btn_create {
      background: transparent;
      border: 1px solid var(--accent-color);
      border-radius: 5px;
      cursor: pointer;
      color: var(--text-color);
      outline: 0;
      padding: 6px 12px;
      font-weight: 600;
      transition: all 0.2s ease;
      font-size: 18px;

      &:hover {
        color: #151c26;
        background-color: var(--accent-color);
      }
    }

    .web_name {
      font-size: 22px;

      @media (max-width: 763px) {
        font-size: 29px;
      }
    }
  }

  .title {
    color: var(--homepage-text-color);
    grid-area: 2 / 2 / 3 / 4;
    justify-self: center;
    align-self: end;
  }

  .last_visited_text {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    grid-area: 1 / 3 / 2 / 4;

    p {
      color: var(--homepage-text-color);
      justify-self: end;
      align-self: start;
      margin-right: 25px;
      font-size: 24px;
    }

    img {
      width: 100px;
      height: 100px;
      justify-self: end;
      margin-bottom: -6px;
      align-self: end;
      transform: rotate(-55deg);
      -webkit-transform: rotate(-55deg);
      -moz-transform: rotate(-55deg);
      -ms-transform: rotate(-55deg);
    }
  }

  .last_visited_event {
    grid-area: 1 / 4 / 3 / 6;
    max-width: 400px;
    min-width: 300px;

    .flex {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
      border: dashed black 5px;
      border-radius: 5px;
    }
  }

  .events {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(300px, 1fr));
    grid-area: 2 / 1 / 3 / 2;
    grid-gap: 5px 5px;
    margin-top: 20px;

    @media (min-width: 1148px) {
      grid-area: 3 / 2 / 6 / 6;
    }

    @media (max-width: 380px) {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    .empty_event {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      min-height: 300px;
      border: dashed black 5px;
      border-radius: 5px;
      cursor: default;
    }
  }

  .create_event {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    min-height: 300px;
    border: dashed black 5px;
    border-radius: 5px;
    cursor: pointer;
  }

  .create_event:hover {
    border: dashed var(--color-dark-red) 5px;
    color: var(--color-dark-red);
  }
}
</style>
