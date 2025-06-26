import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyoAtkQ0tdNer1uLUmalKcGoqL-lIce2Y",
  authDomain: "study-assistant-chatbot.firebaseapp.com",
  databaseURL: "https://study-assistant-chatbot-default-rtdb.firebaseio.com",
  projectId: "study-assistant-chatbot",
  storageBucket: "study-assistant-chatbot.firebasestorage.app",
  messagingSenderId: "750502158987",
  appId: "1:750502158987:web:cfd92532b8f30b6651aa8e",
  measurementId: "G-Q22PEX4L6J"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app); 
export { db, ref, push, onValue, auth }; 