import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/main-page",
    },
    {
      path: "/main-page",
      name: "main-page",
      component: () => import("../pages/main-page.vue"),
    },
    {
      path: "/test",
      name: "test",
      component: () => import("../pages/test-page.vue"),
    },
    {
      path: "/auth-admin",
      name: "auth-admin",
      component: () => import("../pages/auth-page.vue"),
    },
    {
      path: "/admin-panel",
      name: "admin-panel",
      component: () => import("../pages/admin-page.vue"),
    },
  ],
});
