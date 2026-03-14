import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";

export const schoolSignIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const schoolSignOut = () => signOut(auth);

export const onAuthChanged = (callback) =>
  onAuthStateChanged(auth, callback);