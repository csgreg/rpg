import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyDxei4a0pf9WMTCg-ohVFGrz-98OrS1f5I",
  authDomain: "rpggame-e41ae.firebaseapp.com",
  databaseURL:
    "https://rpggame-e41ae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rpggame-e41ae",
  storageBucket: "rpggame-e41ae.appspot.com",
  messagingSenderId: "952629620045",
  appId: "1:952629620045:web:e8c2adaae2d5fd09aa1b04",
  measurementId: "G-4LYTX60806",
});

export const auth = app.auth();
export default getFirestore();
