<template>
  <div class="homepage">
    <div class="top-content">
      <div id="logo">
        Event Planner
      </div>
      <div class="button">
        <router-link
          tag="div"
          :to="{ name: 'createEvent' }"
        >
          STWÓRZ PRZYJĘCIE
        </router-link>
      </div>
    </div>
    <div class="about_site">
      <p>Chcesz zorganizować przyjęcie, ale nie wiesz od czego zacząć?</p>
      <h2>
        Nasz serwis Ci w tym pomoże! Tutaj znajdziesz wszystkie elementy potrzebne do organizacji imprezy.
        Dzięki naszym modułom bez trudu będziesz mógł sporządzić listę gości, kontrolować rzeczy do zrobienia, czy chociażby rozplanować budżet wydarzenia.
        Ponadto dostępne są również szablony zadań, które pozwalają osobie bez doświadczenia zorganizować doskonałą imprezę czy wesele.
        Jednak to nie wszystko! Pomocnych modułów jest jeszcze więcej.
      </h2>
      <p>Więcej o modułach</p>
      <div class="modules">
        <div
          v-for="mod in modules"
          :key="mod.id"
          class="module_about"
        >
          <p>{{ mod.name }}</p>
          <img
            :src="mod.imageUrl"
            :alt="mod.name"
          >
          <span>
            {{ mod.description }}
          </span>
        </div>
      </div>
      <div class="button">
        <router-link
          tag="div"
          :to="{ name: 'createEvent' }"
        >
          STWÓRZ PRZYJĘCIE
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'Homepage',
  data () {
    return {
      modules: []
    }
  },
  async mounted () {
    const modules = await api.listModules()
    this.modules = modules.data
  }
}
</script>

<style lang="scss">
.homepage {
  text-align: center;

  #logo {
    padding: 10px 0;
    box-shadow: 3px 3px 30px 5px #0006;
    font-size: 64px;
    margin-bottom: 35px;
    margin-top: 12.39%;
    color: var(--color-logo);
    background: #0006;
    text-shadow: 2px 2px 1px #000;

    @media (max-width: 640px) {
      font-size: 43px;
    }

    @media (max-width: 420px) {
      font-size: 33px;
    }
  }

  .top-content {
    background-image: url('/static/party_img1.jpg');
    opacity: 0.8;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: auto;
    display: flex;
    flex-direction: column;
    height: 77vw;
    min-height: 280px;
    max-height: 77vh;
  }

  .about_site {
    margin: 30px auto;
    margin-top: -15px;
    padding: 20px 0;
    width: 80%;
    background-color: var(--secondary-bg-color);
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(25, 25, 25, 0.2);

    p {
      margin: 0;
      padding: 20px 30px 15px 30px;
      font-size: 28px;

      @media (max-width: 420px) {
        font-size: 18px;
      }
    }

    h2 {
      margin: 0 auto;
      padding-bottom: 15px;
      width: 85%;
      color: var(--color-homepage-grey);
      text-align: center;

      @media (max-width: 420px) {
        font-size: 12px;
      }
    }
  }

  .modules {
    width: 80%;
    font-size: 18px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 20px 20px 20px;

    .module_about {
      margin: 10px;
      width: 320px;

      @media (max-width: 2109px) {
        width: 250px;
      }

      @media (max-width: 1688px) {
        width: 350px;
      }

      img {
        width: 100%;
      }

      p {
        padding: 0;
        margin: 0;
        font-size: 24px;
      }

      span {
        text-justify: auto;
        color: var(--color-homepage-grey);
      }
    }
  }

  .button {
    margin: 15px auto;
    box-shadow: 0 0 30px 5px #0004;
    padding: 10px;
    background-color: black;
    border-radius: 4px;
    color: white;
    width: 250px;
    font-size: 18px;

    &:hover {
      cursor: pointer;
    }

    @media (max-width: 420px) {
      width: 150px;
      font-size: 12px;
    }
  }
}
</style>
