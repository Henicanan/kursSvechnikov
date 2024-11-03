<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../store/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const inputLogin = ref<string>("");
const inputPassword = ref<string>("");
const errorLogin = ref<boolean>(false);

const signIn = async () => {
  try {
    const isAuthenticated = await userStore.handleSignInWithEmailAndPassword(
      inputLogin.value,
      inputPassword.value
    );
    if (isAuthenticated) {
      errorLogin.value = false;
      router.push({ path: "/admin-panel" });
    } else {
      errorLogin.value = true;
      console.log("Ошибка авторизации");
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div class="wrapper-card">
    <div class="card">
      <div class="title-card">
        <span class="title">Вход в аккаунт</span>
      </div>
      <div class="input-wrapper">
        <input
          class="input-login"
          placeholder="Введите логин"
          v-model="inputLogin"
        />
        <input
          class="input-password"
          placeholder="Введите пароль"
          v-model="inputPassword"
          type="password"
        />
        <span v-if="errorLogin" class="error-message"
          >Не верный логин или пароль</span
        >
        <button class="sigin-button" @click="signIn">Вход</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.card {
  border: 2px solid black;
  border-radius: 8px;
  padding: 20px;
  width: fit-content;
  height: fit-content;
  background-color: #fff;
}

.title-card {
  margin-left: 1.5rem;
  color: #1a3d7b;
}
.title {
  font-size: 25px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

.input-wrapper {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
}

.input-login {
  border-radius: 5px;
  height: 1.5rem;
  font-size: 20px;
  padding-left: 10px;
}

.input-password {
  margin-top: 1rem;
  border-radius: 5px;
  height: 1.5rem;
  font-size: 20px;
  padding-left: 10px;
}

.error-message {
  color: rgb(208, 36, 36);
  padding-top: 10px;
}

.sigin-button {
  margin-top: 20px;
  cursor: pointer;
  font-size: 20px;
  border-radius: 6px;
  background-color: #1a3d7b;
  color: white;
  border: 1px solid black;
  border-radius: 4px;
}

.sigin-button:hover {
  color: #999;
  border: 2px solid black;
}

.recover-password-title {
  margin-top: 10px;
  cursor: pointer;
}
</style>
