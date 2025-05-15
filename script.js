import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCxY-KJ8H1m-9DO2_fs5qLo9MEwb7PiHVY",
    authDomain: "book-me-a6d98.firebaseapp.com",
    projectId: "book-me-a6d98",
    storageBucket: "book-me-a6d98.appspot.com", 
    messagingSenderId: "162115788301",
    appId: "1:162115788301:web:fe46d6ed06f95fc2f87f44",
    measurementId: "G-DEXMQ2FKFM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);


export async function signUp(email, password, name) {
try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addDoc(collection(db, "users"), {
    uid: user.uid,   
    name: name,
    email: email
    });

    alert(`User signed up: ${user.email}`);
} catch (error) {
    alert("Sign up error: " + error.message);
}
}
