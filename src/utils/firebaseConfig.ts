// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-FpRnJQtlglJ-64cWJ1AMTKn_mF6VKPU",
  authDomain: "oiaio-fb5dc.firebaseapp.com",
  projectId: "oiaio-fb5dc",
  storageBucket: "oiaio-fb5dc.firebasestorage.app",
  messagingSenderId: "288303760139",
  appId: "1:288303760139:web:3ced9944ceff44c6e4980e",
  measurementId: "G-KX7NVH9T4K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
