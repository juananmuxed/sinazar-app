import firebase from 'firebase'
import 'firebase/database'

// Edit your FIREBASE api configuration and rename this file deleting '_changedata'

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
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