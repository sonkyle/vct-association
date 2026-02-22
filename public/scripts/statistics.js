import { supabase } from "./supabase.js";
const sideBtn = document.getElementById('side-btn');

const { data } = await supabase.rpc('get_top5_by_agent');

if (!error) {
    for (let i = 0; i < 28; i++) {
        const agentRows = data.filter(row => row.image_index === i);
        const total = agentRows.reduce((sum, row) => sum + Number(row.count), 0);
        
        const result = agentRows
            .slice(0, 5)
            .map(row => ({
                value: row.answer,
                count: Number(row.count),
                percent: (Number(row.count) / total * 100).toFixed(1)
            }));

        const li = document.querySelectorAll('#agent-stats li')[i];
        const spans = li.querySelectorAll('.players span');
        spans.forEach((span, j) => {
            span.textContent = result[j] ? `${result[j].value} - ${result[j].count} (${result[j].percent}%)` : "N/A";
        });
    }
}

sideBtn.addEventListener('click', function() {
    window.location.href = 'summary.html';
    return;
});