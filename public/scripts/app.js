let agentIndex = 0;
let userResponses = [];
const img = document.getElementById('agent-image');
const input = document.getElementById('input-field');
const submitBtn = document.getElementById('submit-btn');
const backBtn = document.getElementById('back-btn');
const skipBtn = document.getElementById('skip-btn');
const paragraphs = document.querySelectorAll('#summary ul li p');
const imageNames = [
    'astra', 'breach', 'brimstone', 'chamber', 'clove', 'cypher', 'deadlock', 'fade', 'gekko', 'harbor', 'iso', 'jett', 'kayo', 'killjoy', 'neon', 'omen', 'phoenix', 
    'raze', 'reyna', 'sage', 'skye', 'sova', 'tejo', 'veto', 'viper', 'vyse', 'waylay', 'yoru'
];
const playerAliases = {
    'forsaken': 'f0rsaken',
    'davai': 'd4v41',
    'dav4i': 'd4v41',
    'd4vai': 'd4v41',
    'dava1': 'd4v41',
    'dav41': 'd4v41',
    'd4v4i': 'd4v41',
    'd4va1': 'd4v41',
    'som': 's0m',
    'finesse' : 'fns',
    'jing' : 'jinggg',
    'jingg' : 'jinggg',
    'jingggg' : 'jinggg',
    'narrate' : 'n4rrate',
    'finesse' : 'fns',
    'freeing' : 'free1ing',
    'com' : "c0m",
    'vookashu' : 'vo0kashu',
    'v0okashu' : 'vo0kashu',
    'v00kashu' : 'vo0kashu',
    'shrimp' : 'shr1mp',
    'larok' : 'lar0k',
    'fangeer' : 'f4ngeer',
    'vic' : 'v1c',
    'kira' : 'k1ra',
    'alorante' : 'al0rante',
    'sugarzero' : 'sugarz3ro',
    'texture' : 't3xture',
    'krystal' : 'kr1stal',
    'kristal' : 'kr1stal',
    'purpo' : 'purp0',
    'luoking' : 'luok1ng',
    'aui' : 'au1',
    'rose' : 'rosé',
    'flexin' : 'flex1n',
    'demur' : 'd3mur',
}

function normalize(answer){
    const lower = answer.trim().toLowerCase();
    return playerAliases[lower] || lower;
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZjKucr7Dy6549t3jDy7XgmrEpqw5A6Yo",
    authDomain: "vct-association.firebaseapp.com",
    projectId: "vct-association",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveAnswer(sessionId, imageIndex, answer) {
    await addDoc(collection(db, "responses"), {
        sessionId,
        agent: imageNames[imageIndex],
        imageIndex,
        answer,
        timestamp: new Date()
    });
}

function getNextAgentImage() {
    agentIndex++;
    if (agentIndex > imageNames.length -1){
        document.querySelector('#header h1').textContent = 'Summary of Answers';
        submitBtn.style.display = 'none';
        backBtn.style.display = 'none';
        skipBtn.style.display = 'none';
        document.getElementById('image-container').style.display = 'none';
        input.style.display = 'none';
        document.getElementById('image-input').style.display = 'none';
        document.getElementById('summary').style.display = 'block';
        document.getElementById('share-btn').disabled = false;
        document.getElementById('share-btn').style.display = 'block';
        paragraphs.forEach((p, index) => {
            p.textContent = userResponses[index] || 'Skipped';
        });
    }
    if (img) {
        img.src = `img/splash/${imageNames[agentIndex]}.png`;
        img.alt = imageNames[agentIndex];
    }
}

function getPreviousAgentImage() {
    agentIndex--;
    if (agentIndex < 0){
        agentIndex = 0;
    }
    if (img) {
        img.src = `img/splash/${imageNames[agentIndex]}.png`;
        img.alt = imageNames[agentIndex];
    }
}

input.addEventListener('input', function() {
    submitBtn.disabled = input.value.trim() === '';
});

input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && input.value !== '') {
      submitBtn.click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const answer = normalize(input.value);
            userResponses[agentIndex] = answer;
            await saveAnswer(getSessionId(), agentIndex, answer);
            getNextAgentImage();
            input.value = '';
            input.focus();
        });
    }
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            getPreviousAgentImage();
            input.value = '';
            input.focus();
        });
    }
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            getNextAgentImage();
            input.value = '';
            input.focus();
        }); 
    }
});

document.getElementById('share-btn').addEventListener('click', function() {
    const textToCopy = imageNames.map((agent, index) => 
        `${'Play it yourself at: https://sonkyle.github.io/vctassociation/\n' + agent.charAt(0).toUpperCase() + agent.slice(1)} - ${userResponses[index] || 'Skipped'}`
    ).join('\n');
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {alert('Copied to clipboard!');})
      .catch(err => {console.error('Failed to copy:', err);});
});

// Generate or retrieve a session ID for the user
function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}