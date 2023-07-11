// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

import { initializeAuth, reactNativeLocalPersistence } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzU9tkSn8eggJwWY9eoGUEscBka6kFTbA",
  authDomain: "orbital-final-final.firebaseapp.com",
  projectId: "orbital-final-final",
  storageBucket: "orbital-final-final.appspot.com",
  messagingSenderId: "456824775210",
  appId: "1:456824775210:web:5af16587b90bb4f37c9953",
  measurementId: "G-677T0CZ3V1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)

initializeAuth(app,
    {
      persistence: reactNativeLocalPersistence
    }
  )