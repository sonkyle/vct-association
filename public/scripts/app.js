//todo list
//1. fix casing of usernames (nats --> nAts) 
import playerAliases from "./playerAliases.js";
import { supabase } from "./supabase.js";

let isSaving = false;
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

async function saveAnswers(sessionId, userResponses) {
    const rows = [];
    for (let i = 0; i < userResponses.length; i++) {
        if (userResponses[i]) {
            rows.push({
                session_id: sessionId,
                agent: imageNames[i],
                image_index: i,
                answer: userResponses[i]
            });
        }
    }
    const { error } = await supabase.from('responses').insert(rows);
    if (error) throw error;
}

async function getNextAgentImage() {
    agentIndex++;
    if (agentIndex > imageNames.length -1){
        if(isSaving) {
            return;
        }
        isSaving = true;
        try {
            await saveAnswers(getSessionId(), userResponses);
            localStorage.setItem('userResponses', JSON.stringify(userResponses));
            window.location.href = 'summary.html';
        } catch (err) {
            isSaving = false;
            console.error('Failed to save answers:', err);
        }
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
        input.value = userResponses[agentIndex];
    }
    if (img) {
        img.src = `img/splash/${imageNames[agentIndex]}.png`;
        img.alt = imageNames[agentIndex];
    }
}

function normalize(answer){
    let lower = answer.trim().toLowerCase();
    lower = lower.replace(/[^a-z0-9 _]/g, '');
    return playerAliases[lower] || lower;
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