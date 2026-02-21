const userResponses = JSON.parse(localStorage.getItem('userResponses'));
const paragraphs = document.querySelectorAll('#summary ul li p');
const shareBtn = document.getElementById('share-btn');
const sideBtn = document.getElementById('side-btn');
const imageNames = [
    'astra', 'breach', 'brimstone', 'chamber', 'clove', 'cypher', 'deadlock', 'fade', 'gekko', 'harbor', 'iso', 'jett', 'kayo', 'killjoy', 'neon', 'omen', 'phoenix', 
    'raze', 'reyna', 'sage', 'skye', 'sova', 'tejo', 'veto', 'viper', 'vyse', 'waylay', 'yoru'
];

paragraphs.forEach((p, index) => {
    p.textContent = userResponses[index] || 'Skipped';
});

shareBtn.addEventListener('click', function() {
    const userResponses = JSON.parse(localStorage.getItem('userResponses'));
    const textToCopy = imageNames.map((agent, index) => 
        `${agent.charAt(0).toUpperCase() + agent.slice(1)} - ${userResponses[index] || 'Skipped'}`
    ).join('\n') + '\n\nPlay it yourself at: https://vctassociation.vercel.app/';
    navigator.clipboard.writeText(textToCopy)
      .then(() => {alert('Copied to clipboard!');})
      .catch(err => {console.error('Failed to copy:', err);});
});

sideBtn.addEventListener('click', function() {
    window.location.href = 'statistics.html';
    return;
});

console.log('shareBtn:', shareBtn);
console.log('userResponses:', userResponses);