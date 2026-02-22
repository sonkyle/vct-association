const sideBtn = document.getElementById('side-btn');

import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


const query = await getDocs(query(collection(db, "responses"), where("imageIndex", "==", "0")));
const agentSubmissions = query.docs.map(doc => ({ agent: doc.agent, answer: doc.answer, imageIndex : doc.imageIndex }))
console.log(agentSubmissions);

sideBtn.addEventListener('click', function() {
    window.location.href = 'summary.html';
    return;
});