<script setup lang="ts">
import { onMounted, ref } from "vue";
import { questions } from "../constants/questions";
import { db } from "../modules/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const currentQuestions = ref(questions);
const userAnswers = ref(Array(currentQuestions.value.length).fill(null));
const result = ref<number | null>(null);
const userName = ref("");
const showAnswers = ref<boolean>(false);

const startTime = ref<Date | null>(null);
const endTime = ref<Date | null>(null);

const setResult = async (formattedTime: string) => {
  if (userName.value && result.value !== null) {
    try {
      await addDoc(collection(db, "testResults"), {
        userName: userName.value,
        score: result.value,
        totalQustions: questions.length,
        date: new Date().toISOString().slice(0, 19).replace("T", " "),
        totalPercent: ((result.value / questions.length) * 100).toFixed(2),
        formattedTime: formattedTime,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("ФИО или результат не сохранен");
  }
};

const submitTest = () => {
  endTime.value = new Date();
  const elapsedTimeMs =
    endTime.value.getTime() - (startTime.value?.getTime() || 0);

  const minutes = Math.floor(elapsedTimeMs / 60000);
  const seconds = Math.floor((elapsedTimeMs % 60000) / 1000);
  const formattedTime = `${minutes} мин ${seconds} сек`;

  const score = userAnswers.value.reduce((acc, answer, index) => {
    return answer !== null && answer === currentQuestions.value[index].correct
      ? acc + 1
      : acc;
  }, 0);
  result.value = score;
  showAnswers.value = true;
  console.log(result.value);
  setResult(formattedTime);
};

onMounted(() => {
  startTime.value = new Date();
});
</script>

<template>
  <div class="test-container">
    <h1>Тестировение по технике безопасности и охраны труда</h1>
    <input
      v-model="userName"
      placeholder="Введите ваше ФИО"
      class="input-username"
    />
    <form @submit.prevent="submitTest">
      <div
        v-for="(question, index) in currentQuestions"
        :key="index"
        class="question"
      >
        <h3>{{ index + 1 }}. {{ question.text }}</h3>
        <div
          v-for="(answer, answerIndex) in question.answers"
          :key="answerIndex"
        >
          <label>
            <input
              type="radio"
              :name="'question_' + index"
              :value="answerIndex"
              v-model="userAnswers[index]"
            />
            {{ answer }}
          </label>
        </div>
      </div>
      <button type="submit" class="submit-button" v-if="!result">
        Отправить
      </button>
      <button
        class="head-back-button"
        @click="$router.push({ path: '/main-page' })"
        v-else
      >
        Вернуться назад
      </button>
    </form>
    <div v-if="result !== null" class="result">
      <h2>Ваш результат: {{ result }} из {{ questions.length }}</h2>
      <button @click="showAnswers = !showAnswers" class="show-answers-button">
        {{ showAnswers ? "Скрыть ответы" : "Показать правильные ответы" }}
      </button>
    </div>
    <div v-if="showAnswers" class="answers-section">
      <div
        v-for="(question, index) in currentQuestions"
        :key="index"
        class="answer-review"
      >
        <h3>{{ index + 1 }}. {{ question.text }}</h3>
        <p>
          Ваш ответ:
          <span
            :class="{
              correct: userAnswers[index] === question.correct,
              incorrect: userAnswers[index] !== question.correct,
            }"
          >
            {{ question.answers[userAnswers[index]] || "Не отвечено" }}
          </span>
        </p>
        <p>
          Правильный ответ:
          <span class="correct-answer">
            {{ question.answers[question.correct] }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-container {
  padding: 2rem;
  background-color: #eae9e9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 3rem 3rem;
}

.input-username {
  width: 16.6rem;
  height: 1.8rem;
  padding-left: 10px;
  font-size: 20px;
  border: none;
  border-bottom: 2px solid black;
  background-color: #eae9e9;
}

.question {
  margin-bottom: 1.5rem;
}

.submit-button {
  padding: 0.5rem 1rem;
  background-color: #1a3d7b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.head-back-button {
  padding: 0.5rem 1rem;
  background-color: #1a3d7b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.result {
  margin-top: 1.5rem;
  font-weight: bold;
}

.show-answers-button {
  padding: 0.5rem 1rem;
  background-color: #1a3d7b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
