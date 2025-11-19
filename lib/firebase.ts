// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqXoXlVEcZ_zyQQp4mn9l7qFgepOCyK7k",
  authDomain: "flume-30abd.firebaseapp.com",
  projectId: "flume-30abd",
  storageBucket: "flume-30abd.firebasestorage.app",
  messagingSenderId: "1049234977262",
  appId: "1:1049234977262:web:42ddaa202c18c05e3fdeff",
  measurementId: "G-MJWFP8ETML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app); // Initialize analytics
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };