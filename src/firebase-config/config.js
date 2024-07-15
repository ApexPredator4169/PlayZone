import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import { getDatabase } from "firebase/database";
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDID1FMqPLCmSwNJW7m-yaACsRzdVPmgs4",
  authDomain: "playzone-fbc38.firebaseapp.com",
  projectId: "playzone-fbc38",
  storageBucket: "playzone-fbc38.appspot.com",
  messagingSenderId: "926165236610",
  appId: "1:926165236610:web:8c78136152ddf6f12cad9b",
  measurementId: "G-X874VN87YN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(app);
export const db = getFirestore(app)
export const database = getDatabase(app);