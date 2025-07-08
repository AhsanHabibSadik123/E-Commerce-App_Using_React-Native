// This firebase.jsx file

// auth/firebase.jsx
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB9tRfJ4IBn2LZBONhZnQgCr5MRrteX_OM",
  authDomain: "ecommerce-app-c2d3f.firebaseapp.com",
  projectId: "ecommerce-app-c2d3f",
  storageBucket: "ecommerce-app-c2d3f.appspot.com",
  messagingSenderId: "963417571537",
  appId: "1:963417571537:web:8da4e7d595c6a0d72845f0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
