//todo list
//1. maybe make it so that instead of just raw resetting the input when you submit, you save it to some array, and then if the user clicks back, the input field
//   is populated with the answer they had previously put
//2. fix casing of usernames (nats --> nAts) 

let agentIndex = 0;
let userResponses = [];
const img = document.getElementById('agent-image');
const input = document.getElementById('input-field');
const submitBtn = document.getElementById('submit-btn');
const backBtn = document.getElementById('back-btn');
const skipBtn = document.getElementById('skip-btn');
const imageNames = [
    'astra', 'breach', 'brimstone', 'chamber', 'clove', 'cypher', 'deadlock', 'fade', 'gekko', 'harbor', 'iso', 'jett', 'kayo', 'killjoy', 'neon', 'omen', 'phoenix', 
    'raze', 'reyna', 'sage', 'skye', 'sova', 'tejo', 'veto', 'viper', 'vyse', 'waylay', 'yoru'
];

function normalize(answer){
    let lower = answer.trim().toLowerCase();
    lower = lower.replace(/[^a-z0-9 ]/g, '');
    return playerAliases[lower] || lower;
}

import playerAliases from "./playerAliases.js";
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

async function saveAnswers(sessionId, userResponses) {
    for(let i = 0; i< userResponses.length; i++){
        if(userResponses[i]){
            await addDoc(collection(db, "responses"), {
                sessionId,
                agent: imageNames[i],
                imageIndex : i,
                answer : userResponses[i],
                timestamp: new Date()
            });
        }
    }
}

async function getNextAgentImage() {
    agentIndex++;
    if (agentIndex > imageNames.length -1){
        await saveAnswers(getSessionId(), userResponses);
        localStorage.setItem('userResponses', JSON.stringify(userResponses));
        window.location.href = 'summary.html';
        return;
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
    if(userResponses[agentIndex]){
        input.textContent = userResponses[agentIndex];
    }
    if (img) {
        img.src = `img/splash/${imageNames[agentIndex]}.png`;
        img.alt = imageNames[agentIndex];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const answer = normalize(input.value);
            userResponses[agentIndex] = answer;
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
    if(input){
        input.addEventListener('input', function() {
            submitBtn.disabled = input.value.trim() === '';
        });

        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' && input.value !== '') {
            submitBtn.click();
            }
        });
    }
});

function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = Math.random().toString(36) + Date.now();
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}