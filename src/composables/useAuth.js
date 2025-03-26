// useAuth.js
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { ref } from 'vue';

export function useAuth() {
  const user = ref(null);
  const auth = getAuth();

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      user.value = firebaseUser;
    } else {
      user.value = null;
    }
  });

  const logout = () => {
    signOut(auth);
  };

  return { user, logout };
}
