<template>
  <div class="profile-row">
    <h2 class="top">
      {{ name }}
      <span
        v-if="!showUpdate && !(name === 'Motyw')"
        @click="showUpdate = true"
      >
        <i class="fas fa-pencil-alt" />Aktualizuj
      </span>
      <span
        v-else-if="name === 'Motyw'"
        @click="$store.dispatch('changeTheme')"
      >
        <i class="fas fa-pencil-alt" />Zmień motyw
      </span>
    </h2>
    <div
      v-if="!showUpdate"
      class="bottom"
    >
      <div class="line">
        <div class="left">
          {{ name }}
        </div>
        <div
          class="value"
        >
          {{ value }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="bottom"
    >
      <div
        v-if="name === 'Hasło'"
        class="line_update"
      >
        <div
          class="left"
        >
          Obecne hasło
        </div>
        <input
          v-if="name === 'Hasło'"
          v-model="password"
          type="password"
          placeholder="Wprowadź obecne hasło"
        >
      </div>
      <div
        v-if="name==='Hasło'"
        class="line_update"
      >
        <div
          class="left"
        >
          Nowe hasło
        </div>
        <input
          v-model="newPassword"
          type="password"
          placeholder="Wprowadź nowe hasło"
        >
      </div>
      <div
        v-if="name === 'Hasło'"
        class="line_update"
      >
        <div
          class="left"
        >
          Potwierdź hasło
        </div>
        <input
          v-model="repeatPassword"
          type="password"
          placeholder="Potwierdź hasło"
        >
      </div>
      <div
        v-if="name === 'E-mail'"
        class="line_update"
      >
        <div
          class="left"
        >
          Nowy e-mail
        </div>
        <input
          v-model="newEmail"
          placeholder="Wprowadź nowy E-mail"
        >
      </div>
      <div
        v-if="name === 'E-mail'"
        class="line_update"
      >
        <div
          class="left"
        >
          Podaj hasło
        </div>
        <input
          v-model="password"
          type="password"
          placeholder="Podaj obecne hasło"
        >
      </div>
      <div
        v-if="name === 'Nazwa użytkownika'"
        class="line_update"
      >
        <div
          class="left"
        >
          Nowa nazwa użytkownika
        </div>
        <input
          v-model="newUsername"
          placeholder="Wprowadź nową nazwę użytkownika"
        >
      </div>
      <p v-if="error !== null">
        {{ error }}
      </p>
      <div class="btn_line">
        <div class="left" />
        <button
          class="btn"
          @click="updateUser()"
        >
          Zapisz
        </button>
        <button
          class="btn"
          @click="showUpdate = false"
        >
          Anuluj
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api'
// import { updateEmail, updatePassword } from '../../../../backend/src/routes/users'

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showUpdate: false,
      newUsername: null,
      newEmail: null,
      password: null,
      newPassword: null,
      repeatPassword: null,
      error: null
    }
  },
  methods: {
    async updateUsername () {
      const response = await api.updateUsername({ username: this.newUsername })
      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      this.value = this.newUsername
      this.newUsername = null
      this.error = null
      this.showUpdate = false
    },
    async updateEmail () {
      const response = await api.updateEmail({ password: this.password, email: this.newEmail })
      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      this.value = 'Postępuj zgodnie ze wskazówkami przesłanymi na e-mail ' + this.newEmail + '.'
      this.password = null
      this.newEmail = null
      this.error = null
      this.showUpdate = false
    },
    async updatePassword () {
      if (this.newPassword !== null && this.repeatPassword !== null) {
        if (this.newPassword !== this.repeatPassword) {
          return (this.error = 'Źle powtórzone hasło!')
        }
      }

      const response = await api.updatePassword({ currentPassword: this.password, password: this.newPassword })
      if (response.status !== 200) {
        return (this.error = response.data.message)
      }
      this.password = null
      this.newPassword = null
      this.repeatPassword = null
      this.error = null
      this.showUpdate = false
    },
    updateUser () {
      switch (this.name) {
        case 'Hasło':
          this.updatePassword()
          break
        case 'Nazwa użytkownika':
          this.updateUsername()
          break
        case 'E-mail':
          this.updateEmail()
          break
      }
    }
  }
}
</script>

<style lang="scss">
  .profile-row {
    padding: 0;
    margin-top: 25px;

    @media (max-width: 630px) {
      font-size: 12px;
    }

    p {
      text-align: center;
      color: red;
      margin-top: 10px;
      width: 100%;
    }

    .top {
      background-color: var(--profile-top-color);
      padding: 10px 25px;
      color: var(--profile-top-text);

      span {
        float: right;

        &:hover {
          cursor: pointer;
          color: var(--profile-text-hover);
          transition: all 0.8s ease;
        }

        i {
          margin-right: 7px;
        }
      }
    }

    .bottom {
      display: flex;
      background-color: var(--profile-bot-color);
      padding: 20px 25px;
      flex-direction: column;
      padding-bottom: 30px;

      @media (max-width: 453px) {
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
      }

      .line {
        display: flex;

        @media (max-width: 453px) {
          width: 100%;
        }

        .left {
          padding: 2px;
          color: var(--homepage-text-color);
          width: 200px;
          margin-top: 10px;

          @media (max-width: 630px) {
            width: 150px;
          }

          @media (max-width: 453px) {
            width: 100%;
          }
        }

        .value {
          padding: 2px;
          display: block;
          width: calc(100% - 250px);
          margin-top: 10px;

          @media (max-width: 453px) {
            width: 100%;
          }
        }
      }

      .btn_line {
        display: flex;

        @media (max-width: 453px) {
          margin-left: 10px;
        }

        .left {
          padding: 2px;
          color: var(--text-color-gray);
          width: 200px;
          margin-top: 10px;

          @media (max-width: 630px) {
            width: 150px;
          }

          @media (max-width: 453px) {
            display: none;
          }
        }

        .btn {
          background-color: var(--profile-top-color);
          border: none;
        }

        button {
          padding: 10px 0;
          margin-top: 10px;
          width: 100px;
          margin-right: 15px;
        }

        margin-bottom: 10px;
      }

      .line_update {
        display: flex;

        @media (max-width: 453px) {
          //flex-direction: column;
          width: 100%;
          // text-align: center;
          align-items: center;
        }

        .left {
          padding: 2px;
          color: var(--homepage-text-color);
          width: 200px;
          margin-top: 10px;

          @media (max-width: 630px) {
            width: 150px;
          }

          @media (max-width: 453px) {
            width: 100%;
          }
        }

        input {
          width: 250px;
          font-size: 14px;
          padding: 2px;
          margin-top: 10px;

          @media (max-width: 630px) {
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
