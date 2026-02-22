import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZjKucr7Dy6549t3jDy7XgmrEpqw5A6Yo",
    authDomain: "vct-association.firebaseapp.com",
    projectId: "vct-association",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };