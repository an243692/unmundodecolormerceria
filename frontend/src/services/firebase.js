import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCMw7wzlZnosYEh1qqas1wboAhpR1ELh_Q",
  authDomain: "un-mundo-de-color.firebaseapp.com",
  projectId: "un-mundo-de-color",
  storageBucket: "un-mundo-de-color.firebasestorage.app",
  messagingSenderId: "570098047760",
  appId: "1:570098047760:web:0093305899487bce90e395",
  measurementId: "G-8MQ9J9JRCB",
  databaseURL: "https://un-mundo-de-color-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export default app;

