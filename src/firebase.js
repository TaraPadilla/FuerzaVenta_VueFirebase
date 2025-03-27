import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCmmzDba28548DkZbVlkTvyQa1BNfPXBBs",
  authDomain: "fir-fuerza-venta.firebaseapp.com",
  projectId: "fir-fuerza-venta",
  storageBucket: "fir-fuerza-venta.firebasestorage.app",
  messagingSenderId: "945503813109",
  appId: "1:945503813109:web:ee266d53fcbbd65c69b4bc",
  measurementId: "G-7X9Y36QQWW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export { auth };

