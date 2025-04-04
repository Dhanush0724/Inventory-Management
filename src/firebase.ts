import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCUXfxECq8A5isTT8MkNXl3kffC-kig_SM",
    authDomain: "inventory-management-d4846.firebaseapp.com",
    projectId: "inventory-management-d4846",
    storageBucket: "inventory-management-d4846.appspot.com",

    messagingSenderId: "225439683512",
    appId: "1:225439683512:web:b395a9ef529682b4eff54d",
    measurementId: "G-0TE3M1HGK8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db, doc, setDoc, getDoc };
