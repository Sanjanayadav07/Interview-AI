
import { initializeApp } from "firebase/app";
import { progress } from "motion/react";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interview-ai-c8ebc.firebaseapp.com",
  projectId: "interview-ai-c8ebc",
  storageBucket: "interview-ai-c8ebc.firebasestorage.app",
  messagingSenderId: "394160402060",
  appId: "1:394160402060:web:fd2be3a2f53e6d90ea55a9"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth, provider}