import Firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "shopper-e6a03.firebaseapp.com",
  projectId: "shopper-e6a03",
  storageBucket: "shopper-e6a03.appspot.com",
  messagingSenderId: "159590555012",
  appId: "1:159590555012:web:445483a24b67fa8ff711d1",
};

const firebase = Firebase.initializeApp(firebaseConfig);

export { firebase };
