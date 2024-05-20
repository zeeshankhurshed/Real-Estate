// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-app-e7828.firebaseapp.com",
  projectId: "mern-app-e7828",
  storageBucket: "mern-app-e7828.appspot.com",
  messagingSenderId: "63925793261",
  appId: "1:63925793261:web:51de49ca3257413cc837e4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);