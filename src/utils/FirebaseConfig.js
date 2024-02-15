import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAyE0IPmqUFWkeyiga4K9QpcGngzAfwow0",
    authDomain: "whatsapp-6d9f0.firebaseapp.com",
    projectId: "whatsapp-6d9f0",
    storageBucket: "whatsapp-6d9f0.appspot.com",
    messagingSenderId: "960797200662",
    appId: "1:960797200662:web:e2935bf9b5ef8d3dc9c037",
    measurementId: "G-J35K8EXHX1"
  };

  const app = initializeApp(firebaseConfig);
  export const firebaseAuth = getAuth(app)