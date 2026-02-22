import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const sideBtn = document.getElementById('side-btn');

const getAgentQuery = await getDocs(query(collection(db, "responses"), where("imageIndex", "==", 0)));
const agentSubmissions = getAgentQuery.docs.map(doc => ({ agent: doc.data().agent, answer: doc.data().answer, imageIndex : doc.data().imageIndex }))
console.log(agentSubmissions);

sideBtn.addEventListener('click', function() {
    window.location.href = 'summary.html';
    return;
});