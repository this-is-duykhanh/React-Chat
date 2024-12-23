import firebase from 'firebase/compat/app';

import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import 'firebase/compat/storage';



const firebaseConfig = {
    apiKey: 'your_api_key',
    authDomain: 'your_auth_domain',
    projectId: 'your_project_id',
    storageBucket: 'your_storage_bucket',
    messagingSenderId: "your_messaging_sender_id",
    appId: "your_app_id",
    measurementId: "your_measurement_id"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics()

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();




export { db, auth, storage };
export default firebase;
