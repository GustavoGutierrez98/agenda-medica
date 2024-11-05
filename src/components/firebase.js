// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importa Firestore

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-5OW8N7uGKI_C0cHgnzM_JZqZiC6tnlM",
  authDomain: "milog-94449.firebaseapp.com",
  projectId: "milog-94449",
  storageBucket: "milog-94449.firebasestorage.app",
  messagingSenderId: "23625631868",
  appId: "1:23625631868:web:029fafe2b2a1032790a1f9",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore y exporta la instancia
const db = getFirestore(app);

export { db };
