<template>
  <div class="grid_container">
    <div class="container">
      <div id="homepage_top">
        <div
          v-if="!mobile"
          class="opacity"
        />
        <video
          v-if="!mobile"
          id="video"
          autoplay
          muted
          loop
        >
          <source
            src="@/assets/champagne.mp4"
            type="video/mp4"
          >
        </video>
        <img
          v-if="mobile"
          src="/static/party_img1.jpg"
        >
        <div id="content">
          <div class="textopacity">
            <h1> Event Planner </h1>
            <p> Zaplanuj swoje wydarzenie razem z nami </p>
          </div>
          <router-link
            tag="div"
            :to="{ name: 'createEvent' }"
          >
            <div class="homepage_btn">
              STWÓRZ PRZYJĘCIE
            </div>
          </router-link>
        </div>
      </div>
      <div class="middle">
        <h2 class="top_bot">
          Chcesz zorganizować przyjęcie, ale nie wiesz od czego zacząć?
        </h2>
        <p class="info">
          Nasz serwis Ci w tym pomoże! Tutaj znajdziesz wszystkie elementy potrzebne do organizacji imprezy.
          Dzięki naszym modułom bez trudu będziesz mógł sporządzić listę gości, kontrolować rzeczy do zrobienia, czy chociażby rozplanować budżet wydarzenia.
          Ponadto dostępne są również szablony zadań, które pozwalają osobie bez doświadczenia zorganizować doskonałą imprezę czy wesele.
          Jednak to nie wszystko! Pomocnych modułów jest jeszcze więcej.
        </p>
      </div>
      <transition name="fade-in">
        <basic-modal
          v-if="(previewModal && !mobile)"
          v-model="previewedMod"
          @close="previewModal = false"
        >
          <img
            v-if="getTheme() === '' && previewedMod.lightScreenUrl"
            class="preview"
            :src="previewedMod.lightScreenUrl"
          >
          <img
            v-else-if="getTheme() === 'dark' && previewedMod.darkScreenUrl"
            class="preview"
            :src="previewedMod.darkScreenUrl"
          >
          <p v-else>
            Ten moduł nie ma dostępnego podglądu
          </p>
        </basic-modal>
      </transition>
      <div
        class="tiles_flex"
      >
        <p class="top_bot">
          Lista modułów, z którymi organizacja Twojego wydarzenia stanie się o wiele prostsza
        </p>
        <div
          v-for="mod in modules"
          :key="mod.id"
          class="tile"
          @click="showPreviewModal(mod)"
        >
          <img
            :src="mod.imageUrl"
            :alt="mod.name"
          >
          <h2>{{ mod.name }}</h2>
          <p>
            {{ mod.description }}
          </p>
        </div>
      </div>
      <router-link
        tag="div"
        :to="{ name: 'createEvent' }"
      >
        <div class="btnh">
          STWÓRZ PRZYJĘCIE
        </div>
      </router-link>
    </div>
    <div
      v-if="cookie"
      class="cookie"
    >
      <h2> Ciasteczka </h2>
      <p> Korzystająć z aplikacji automatycznie zgadzasz się na używanie ciasteczek. </p>
      <a
        class="policy"
        href="../static/PolitykaPrywatnosci.pdf"
        target="_blank"
      > Dowiedz się więcej. </a>
      <a
        class="btnc"
        @click="setCookie()"
      > Rozumiem </a>
    </div>
  </div>
</template>

<script>
import api from '../api'
import BasicModal from '../components/ui/BasicModal'

export default {
  name: 'Homepage',
  components: {
    BasicModal
  },
  data () {
    return {
      modules: [],
      mobile: false,
      previewModal: false,
      previewedMod: {},
      cookie: false
    }
  },
  computed: {

  },
  async mounted () {
    const modules = await api.listModules()
    this.modules = modules.data
    localStorage.setItem('cookie', true)
    if (localStorage.getItem('cookie') !== null) {
      this.cookie = localStorage.getItem('cookie')
      if (this.cookie === 'false') {
        this.cookie = false
      }
    } else {
      this.cookie = true
    }
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowWidth)
      this.getWindowWidth()
    })
  },
  methods: {
    getWindowWidth (event) {
      this.windowWidth = document.documentElement.clientWidth
      const mq = window.matchMedia('(max-width: 927px)')
      if (mq.matches) {
        this.mobile = true
      } else {
        this.mobile = false
      }
    },
    showPreviewModal (mod) {
      this.previewedMod = { ...mod }
      this.previewModal = true
    },
    getTheme () {
      return document.documentElement.getAttribute('theme')
    },
    setCookie () {
      this.cookie = false
      localStorage.setItem('cookie', false)
    }
  }
}
</script>

<style lang="scss">
  .grid_container {
    display: grid;
    grid-template-columns: 100% auto;
    justify-content: center;

    .container {
      width: 100%;
      margin-top: 0;

      #homepage_top {
        background-color: white;
        position: relative;
        z-index: 1;
        overflow: hidden;
        object-fit: scale-down;

        @media (max-width: 927px) {
          background-color: black;
          text-align: center;
          clip-path: none;
        }

        video {
          @media (min-width: 1600px) {
            transform: rotateY(180deg) + rotate(30deg);
          }

          @media (max-width: 1600px) {
            transform: rotateY(180deg) + rotate(30deg) + translate(200px, -150px);
          }

          @media (max-width: 1470px) {
            transform: rotateY(180deg) + rotate(30deg) + translate(350px, -210px);
          }

          @media (max-width: 1250px) {
            transform: rotateY(180deg) + rotate(30deg) + translate(450px, -210px);
          }

          position: absolute;
          z-index: -2;
        }

        img {
          position: absolute;
          z-index: -2;
          opacity: 0.7;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
          overflow: auto;
          top: 0;
          left: 0;
        }

        #content {
          padding: 4em;

          @media (max-width: 927px) {
            padding: 4em 0;
          }

          h1 {
            margin: 0;
            margin-top: 0.45em;
            text-transform: uppercase;
            font-size: 5em;
            font-weight: 800;

            @media (max-width: 927px) {
              font-size: 3em;
              width: 100%;
              padding-top: 5px;
            }

            @media (max-width: 504px) {
              font-size: 2em;
            }

            @media (max-width: 377px) {
              font-size: 1.5em;
            }
          }

          p {
            font-size: 1.5em;

            @media (max-width: 927px) {
              padding-bottom: 5px;
              font-size: 1em;
            }

            @media (max-width: 504px) {
              font-size: 0.8em;
            }

            @media (max-width: 377px) {
              font-size: 0.6em;
            }

            margin-top: 0;
          }
        }
      }
    }
  }

  .homepage_btn {
    display: inline-block;
    background-color: #000;
    padding: 15px 90px 15px 30px;
    color: #fff;
    font-size: 1.5em;
    text-transform: uppercase;
    font-weight: bold;
    margin-top: 1.2em;
    margin-bottom: 5.5em;
    clip-path: polygon(0 0, 100% 0, 75% 100%, 0% 100%);
    cursor: pointer;

    @media (max-width: 927px) {
      font-size: 1em;
      margin-bottom: 3.5em;
      padding: 10px 20px;
      clip-path: none;
    }

    @media (max-width: 504px) {
      font-size: 1em;
      margin-bottom: 1.5em;
      padding: 10px 20px;
    }

    @media (max-width: 377px) {
      font-size: 0.8em;
    }
  }

  .homepage_btn:hover {
    color: var(--accent-color);
  }

  .middle {
    max-width: 1300px;
    margin: 0 auto;

    .info {
      text-align: center;
      margin-top: 1.5em;
      font-size: 1.5em;
      margin-left: auto;
      margin-right: auto;
      width: 80%;
      color: var(--homepage-text-color);

      @media (max-width: 927px) {
        font-size: 1em;
      }

      @media (max-width: 504px) {
        font-size: 0.8em;
      }
    }

    .top_bot {
      text-align: center;
      margin-top: 1.5em;
      font-size: 1.9em;
      margin-left: auto;
      margin-right: auto;
      width: 80%;

      @media (max-width: 927px) {
        font-size: 1em;
      }

      @media (max-width: 504px) {
        font-size: 0.8em;
      }
    }
  }

  .opacity {
    // background-color: var(--homepage-color-opacity);
    background-image: var(--homepage-color-opacity);
    opacity: 0.7;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
  }

  .textopacity {
    @media (max-width: 927px) {
      background: var(--homepage-logo-opacity);
    }
  }

  .btnh {
    width: 200px;
    text-align: center;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    margin-left: auto;
    margin-right: auto;
    background: transparent;
    border: 1px solid var(--accent-color);
    border-radius: 5px;
    cursor: pointer;
    color: var(--text-color);
    outline: 0;
    padding: 6px 12px;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
      color: #151c26;
      background-color: var(--accent-color);
    }
  }

  .preview {
    width: 100%;
  }

  .cookie {
    border-radius: 4px;
    position: fixed;
    background-color: #232323;
    width: 350px;
    padding: 30px;
    z-index: 50;
    bottom: 30px;
    right: 30px;
    color: #fff;

    .policy {
      margin-top: 4px;
      display: block;
      color: rgb(194, 184, 184);
    }

    .policy:hover {
      cursor: pointer;
      color: #3e9b67;
    }

    .btnc {
      display: inline-block;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      margin-top: 14px;
      background: #000;
      box-sizing: border-box;
      padding: 15px 24px;
      text-align: center;
      transition: background 0.3s;
    }

    .btnc:hover {
      cursor: pointer;
      background-color: #3e9b67;
    }
  }
</style>
