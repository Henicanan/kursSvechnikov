import { auth } from "../modules/firebase/firebase";
import { useUserStore } from "./auth";

export const setupAuthStateListener = () => {
  const userStore = useUserStore();

  auth.onAuthStateChanged((user) => {
    if (user) {
      userStore.setUser(user);
    } else {
      userStore.clearUser();
    }
  });
};
