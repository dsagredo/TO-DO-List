import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCcsiOxOrfqMHBeD9kVpZiBxUdpSkri2p8",
    authDomain: "todo-rt.firebaseapp.com",
    databaseURL: "https://todo-rt.firebaseio.com",
    projectId: "todo-rt",
    storageBucket: "todo-rt.appspot.com",
    messagingSenderId: "883652078830",
});

const db = firebaseApp.firestore();

export default db;