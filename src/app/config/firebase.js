import {initializeApp} from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "reventscourse.firebaseapp.com",
    databaseURL: "https://reventscourse.firebaseio.com",
    projectId: "reventscourse",
    storageBucket: "reventscourse.appspot.com",
    messagingSenderId: "990229111437",
    appId: "1:990229111437:web:cb40dfdf45505da5b7f8c4"
}

export const app = initializeApp(firebaseConfig);