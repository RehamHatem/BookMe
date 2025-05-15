import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import { getFirestore, collection, addDoc ,setDoc, getDoc ,doc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { GoogleAuthProvider , signInWithPopup } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

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


// with email and password 
export async function signUp(email, password, name) {
try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addDoc(collection(db, "users"), {
    uid: user.uid,   
    name: name,
    email: email,
    createdAt: new Date()
    });
    alert(`User signed up: ${user.email}`);
    window.location.href = "index.html"; 
} catch (error) {
    alert("Sign up error: " + error.message);
}
}

export async function loginUser(email, password) {
try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert(" User logged in:"+ userCredential.user.email);
    window.location.href = "home.html"; 
} catch (error) {
    alert(" Login failed:"+ error.code+ error.message);
}
}
//=========================================================================================

//with google 
const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        createdAt: new Date()
      });
      alert(`Welcome new user: ${user.displayName}`);
      window.location.href = "index.html"; 
    } else {
      alert(`Welcome back: ${user.displayName}`);
      window.location.href = "home.html"; 
    }

  } catch (error) {
    alert("Google Sign-In error: " + error.message);
  }
}
