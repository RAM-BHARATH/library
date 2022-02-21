// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyAZf9K0FCdsOWgGejzEn_0d263g9S-rDj0",
  authDomain: "library-4b1a5.firebaseapp.com",
  projectId: "library-4b1a5",
  storageBucket: "library-4b1a5.appspot.com",
  messagingSenderId: "561810273344",
  appId: "1:561810273344:web:e5227badde99c611855ba5"
};

// Initialize Firebase
const app = initializeApp(config);
export const db = getFirestore(app);

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}

