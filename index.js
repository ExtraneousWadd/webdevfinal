/* === Imports === */
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {getFirestore, collection, addDoc,updateDoc,serverTimestamp, getDocs} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

/* === Firebase Setup === */
const firebaseConfig = {
    apiKey: "AIzaSyB9Y60AxvHBl05uBc1w6XmjE0gtY0lg4pc",
    authDomain: "webdevfinalproject-87774.firebaseapp.com",
    projectId: "webdevfinalproject-87774",
    storageBucket: "webdevfinalproject-87774.firebasestorage.app",
    messagingSenderId: "399317818062",
    appId: "1:399317818062:web:d2d867871cf39ca5374e9f"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log(auth);
const db = getFirestore(app);
console.log(db)


/* === UI === */

/* == UI - Elements == */
const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");
const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn");
const emailInputEl = document.getElementById("email-input");
const passwordInputEl = document.getElementById("password-input");
const signInButtonEl = document.getElementById("sign-in-btn");
const createAccountButtonEl = document.getElementById("create-account-btn");
const userProfilePictureEl = document.getElementById("user-profile-picture");
const userGreetingEl = document.getElementById("user-greeting");
const signOutButtonEl = document.getElementById("sign-out-btn");
const textareaEl = document.getElementById("post-input");
const postButtonEl = document.getElementById("post-btn");
const fetchButtonEl = document.getElementById("fetch-btn");


/* == UI - Event Listeners == */
signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle);
signInButtonEl.addEventListener("click", authSignInWithEmail);
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail);
signOutButtonEl.addEventListener("click", authSignOut);
postButtonEl.addEventListener("click", postButtonPressed);
fetchButtonEl.addEventListener("click", fetchPosts);

/* === Main Code === */
showLoggedOutView();

/* === Functions === */

/* = Functions - Firebase - Authentication = */
function authSignInWithGoogle() {
    console.log("Sign in with Google");
}

function authSignInWithEmail() {
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showLoggedInView();
        })
        .catch((error) => {
            console.error(error.message);
        });
}

function authSignOut() {
    signOut(auth)
        .then(() => {
            showLoggedOutView();
        })
        .catch((error) => {
            console.error(error.message);
        });
}

function authCreateAccountWithEmail() {
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showLoggedInView();
        })
        .catch((error) => {
            console.error(error.message);
        });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        showLoggedInView();
        showProfilePicture(userProfilePictureEl, user);
        showUserGreeting(userGreetingEl, user);
    } else {
        showLoggedOutView();
    }
});

/* == Functions - Profile and Greeting == */
function showProfilePicture(imgElement, user) {
    if (user && user.photoURL) {
        imgElement.src = user.photoURL;
    } else {
        imgElement.src = "assets/images/defaultPic.jpg";
    }
}

function showUserGreeting(element, user) {
    if (user && user.displayName) {
        const firstName = user.displayName.split(' ')[0];
        element.textContent = `Hi ${firstName}, how are you?`;
    } else {
        element.textContent = "Hey friend, how are you?";
    }
}

/* == Functions - UI Functions == */
function showLoggedOutView() {
    hideView(viewLoggedIn);
    showView(viewLoggedOut);
}

function showLoggedInView() {
    hideView(viewLoggedOut);
    showView(viewLoggedIn);
}

function showView(view) {
    view.style.display = "flex";
}

function hideView(view) {
    view.style.display = "none";
}

function postButtonPressed() {
    const postBody = textareaEl.value;
    const user = auth.currentUser;
   
    if (postBody) {
        clearInputField(textareaEl);
        addPostToDB(postBody, user);
    }
}


function clearInputField(field) {
    field.value = "";
}

async function fetchPosts() {
    const postsRef = collection(db, "posts");

    try {
        const postList = await getDocs(postsRef);
        const postsContainer = document.getElementById("posts-container");
        postsContainer.innerHTML = ""; 
        
        postList.forEach((doc) => {
            const post = doc.data();
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Function to create a post element
function createPostElement(post) {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    
    const postBody = document.createElement("p");
    postBody.textContent = post.body;
    
    const postTime = document.createElement("small");
    postTime.textContent = new Date(post.Time.seconds * 1000).toLocaleString();
    
    postElement.appendChild(postBody);
    postElement.appendChild(postTime);
    
    return postElement;
}

/* = Functions - Firebase - Cloud Firestore = */

async function addPostToDB(postBody, user) {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            body: postBody,
            userID: user.uid,
            Time: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}



 
 

 
