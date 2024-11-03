<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../modules/firebase/firebase";
import { useUserStore } from "../store/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();

const testResults = ref<
  Array<{
    userName: string;
    score: number;
    totalQustions: number;
    totalPercent: number;
    date: Date;
    formattedTime: number;
  }>
>([]);

const sortKey = ref<string | null>(null);
const sortOrder = ref<string | null>(null);
const searchQuery = ref<string>("");

const allResults = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "testResults"));
    testResults.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log(data);
      return {
        userName: data?.userName || null,
        date: data?.date || null,
        totalQustions: data?.totalQustions || null,
        totalPercent: data?.totalPercent || null,
        score: data?.score || null,
        formattedTime: data?.formattedTime || null,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const sortResult = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
  testResults.value.sort((a, b) => {
    const aValue = a[key as keyof typeof a];
    const bValue = b[key as keyof typeof b];

    if (aValue === null) return 1;
    if (bValue === null) return -1;

    if (sortOrder.value === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

const filtredResults = computed(() => {
  return testResults.value.filter((result) =>
    result.userName
      ?.toLocaleLowerCase()
      .includes(searchQuery.value.toLocaleLowerCase())
  );
});

const signOut = async () => {
  try {
    userStore.signOutAction();
    router.push({ path: "/auth-admin" });
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  allResults();
});
</script>

<template>
  <div class="header">
    <img class="admin-icon" src="../icon/profile.png" />
    <span class="username">Administration account</span>
    <span @click="signOut" class="signOut">Выйти</span>
  </div>
  <h2>Таблица учета результатов тестирования</h2>
  <div class="wrapper-input">
    <span class="input-title">Поиск сотрудников</span>
    <input class="input-search" v-model="searchQuery" />
  </div>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>ФИО</th>
          <th>Время</th>
          <th @click="sortResult('score')" style="cursor: pointer">
            Итого баллов
          </th>
          <th>Процент прохождения</th>
          <th>Время прохождения</th>
          <th>Всего вопросов</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in filtredResults" :key="index">
          <td>{{ result.userName }}</td>
          <td>{{ result.date }}</td>
          <td>{{ result.score }}</td>
          <td>{{ result.totalPercent }} %</td>
          <td>{{ result.formattedTime }}</td>
          <td>{{ result.totalQustions }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.header {
  margin-left: 2rem;
  display: flex;
  align-items: center;
}

.admin-icon {
  width: 3rem;
  height: 3rem;
}

.username {
  padding-left: 1rem;
  padding-top: 10px;
  font-size: 23px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

.signOut {
  color: rgb(214, 67, 67);
  text-decoration: underline;
  padding-left: 1rem;
  padding-top: 10px;
  cursor: pointer;
}

.wrapper-input {
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
}

.input-title {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  font-size: 18px;
}

.input-search {
  height: 1.4rem;
  width: 11rem;
  border: 1.5px solid black;
  border-radius: 6px;
  margin-top: 0.5rem;
  padding: 3px 10px;
}

h2 {
  margin-left: 2rem;
}

.table-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-left: 2rem;
  margin-right: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
