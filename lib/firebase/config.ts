// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB89NPEqRJ6UrnRMJDNFh3Gm7lwJ0HGzrA",
  authDomain: "pragati-447318.firebaseapp.com",
  projectId: "pragati-447318",
  storageBucket: "pragati-447318.firebasestorage.app",
  messagingSenderId: "700720099561",
  appId: "1:700720099561:web:453e5609a800c6aff08078",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
