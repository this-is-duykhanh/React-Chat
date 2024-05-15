import firebase from 'firebase/compat/app';

import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import 'firebase/compat/storage';



var firebaseConfig = {
    apiKey: "AIzaSyDSVm7MZ6hMsBfpwUwEJyuvlToPokw7_FM",
    authDomain: "chat-app-64432.firebaseapp.com",
    projectId: "chat-app-64432",
    storageBucket: "chat-app-64432.appspot.com",
    messagingSenderId: "619076010167",
    appId: "1:619076010167:web:2b1406a0fa2ad39ddf8d32",
    measurementId: "G-QM7WR5WB92"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics()

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


if(window.location.hostname === 'localhost'){
    auth.useEmulator('http://127.0.0.1:9099');      
    db.useEmulator("127.0.0.1", 8080);
    storage.useEmulator("127.0.0.1", 9199);
}


export { db, auth, storage };
export default firebase;
