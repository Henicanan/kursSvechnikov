import { defineStore } from "pinia";
import { ref } from "vue";
import {
  auth,
  signOut,
  signInWithEmailAndPassword,
} from "../modules/firebase/firebase";
import type { User } from "firebase/auth";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };
  const clearUser = () => {
    user.value = null;
    localStorage.removeItem("userTokens");
  };

  const handleSignInWithEmailAndPassword = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      setUser(user);
      console.log("user:", user);
      const idTokenResult = await user.getIdTokenResult();
      console.log("idToken result:", idTokenResult);
      localStorage.setItem(
        "userTokens",
        JSON.stringify({
          accessToken: idTokenResult.token,
          refreshToken: (user as any).refreshToken,
          email: user.email,
          userId: user.uid,
        })
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const signOutAction = async () => {
    try {
      await signOut(auth);
      clearUser();
    } catch (err) {
      console.log(err);
    }
  };
  return {
    user,
    setUser,
    clearUser,
    handleSignInWithEmailAndPassword,
    signOutAction,
  };
});
