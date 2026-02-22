import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const sideBtn = document.getElementById('side-btn');

for (let i = 0; i<28; i++){
    const getAgentQuery = await getDocs(query(collection(db, "responses"), where("imageIndex", "==", i)));
    const agentSubmissions = getAgentQuery.docs.map(doc => doc.data().answer);
    const result = top5(agentSubmissions, agentSubmissions.length);
    
    const li = document.querySelectorAll('#agent-stats li')[i];
    const spans = li.querySelectorAll('.players span');
    spans.forEach((span, j) => {
        span.textContent = result[j] ? `${result[j].value} - ${result[j].count} (${result[j].percent}%)` : "N/A";
    });
}

function top5(arr, length){
    const counts = {};
    for (const item of arr) {
        counts[item] = (counts[item] || 0) + 1;
    }
    const top5 = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => ({ value: entry[0], count: entry[1], percent: (entry[1] / length * 100).toFixed(1) }))
    return top5;
}

sideBtn.addEventListener('click', function() {
    window.location.href = 'summary.html';
    return;
});