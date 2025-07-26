import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_DX6klUwoZp6UF4wclU3VPjPQOALJnJg",
  authDomain: "printerest-clone-773aa.firebaseapp.com",
  projectId: "printerest-clone-773aa",
  storageBucket: "printerest-clone-773aa.appspot.com",
  messagingSenderId: "16581331396",
  appId: "1:16581331396:web:d44f9b1ecc47caca343c91",
  measurementId: "G-7DYF2BSN3C"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

