import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu5Qo2_nUDD8uhsDmRNVUxJqMBEvWlz4U",
  authDomain: "dota-2-ward-tracker.firebaseapp.com",
  projectId: "dota-2-ward-tracker",
  storageBucket: "dota-2-ward-tracker.firebasestorage.app",
  messagingSenderId: "195597625600",
  appId: "1:195597625600:web:2e099ff5b74bd8c45cebe5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)