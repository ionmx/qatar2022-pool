import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, getRedirectResult, User as FirebaseUser } from "firebase/auth";

const config = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL:       process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:     process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(config);
export const db = getDatabase(app);
export const auth = getAuth();
export type { FirebaseUser };

getRedirectResult(auth)
    .then((result) => {
      if (auth.currentUser) {
        console.log('Logged');
      } else {
        console.log('Not logged');
      }
      
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      console.log(`AUTH ERROR: email = ${email}, code =  ${errorCode}, message = ${errorMessage}`);
    });