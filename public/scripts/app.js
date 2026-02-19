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
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const answer = input.value.trim();
            userResponses[agentIndex] = answer;
            fetch('/api/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: getSessionId(),
                    imageIndex: agentIndex,
                    answer: answer
                })
            }).catch(err => console.error('Failed to send answer:', err));
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