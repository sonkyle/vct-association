import { supabase } from "./supabase.js";
const sideBtn = document.getElementById('side-btn');

const { data, error } = await supabase
    .from('responses')
    .select('image_index, answer');

if (!error) {
    for (let i = 0; i < 28; i++) {
        const agentAnswers = data
            .filter(row => row.image_index === i)
            .map(row => row.answer);

        const result = top5(agentAnswers, agentAnswers.length);

        const li = document.querySelectorAll('#agent-stats li')[i];
        const spans = li.querySelectorAll('.players span');
        spans.forEach((span, j) => {
            span.textContent = result[j] ? `${result[j].value} - ${result[j].count} (${result[j].percent}%)` : "N/A";
        });
    }
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