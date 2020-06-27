import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBbC6PLIYq_BNuIpF7KKwT6Up6PYuOXlJw",
    authDomain: "reventscourse.firebaseapp.com",
    databaseURL: "https://reventscourse.firebaseio.com",
    projectId: "reventscourse",
    storageBucket: "reventscourse.appspot.com",
    messagingSenderId: "990229111437",
    appId: "1:990229111437:web:cb40dfdf45505da5b7f8c4"
}

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;