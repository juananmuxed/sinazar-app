import firebase from 'firebase'
import 'firebase/database'

var firebaseConfig = {
    apiKey: "AIzaSyBIflLdSeOPSq6DC8aMwbdD9vsnsqfE7xc",
    authDomain: "sinazar-muxed.firebaseapp.com",
    databaseURL: "https://sinazar-muxed.firebaseio.com",
    projectId: "sinazar-muxed",
    storageBucket: "sinazar-muxed.appspot.com",
    messagingSenderId: "429926710725",
    appId: "1:429926710725:web:40116a18d35ec250"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser


export {
    db,
    auth,
    currentUser
}