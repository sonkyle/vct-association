import { supabase } from "./supabase.js";
const sideBtn = document.getElementById('side-btn');
const modal = document.getElementById('agent-modal');
const closeModal = document.getElementById('close-modal');
const modalAgentName = document.getElementById('modal-agent-name');
const modalTop10 = document.getElementById('modal-top10');
const searchInput = document.getElementById('modal-search-input');
const searchResult = document.getElementById('modal-search-result');

const imageNames = [
    'astra', 'breach', 'brimstone', 'chamber', 'clove', 'cypher', 'deadlock', 'fade', 'gekko', 'harbor', 'iso', 'jett', 'kayo', 'killjoy', 'neon', 'omen', 'phoenix',
    'raze', 'reyna', 'sage', 'skye', 'sova', 'tejo', 'veto', 'viper', 'vyse', 'waylay', 'yoru'
];

const { data, error } = await supabase.rpc('get_top5_by_agent');

if (!error) {
    for (let i = 0; i < 28; i++) {
        const agentRows = data.filter(row => row.image_index === i);
        const total = Number(agentRows[0]?.total) || 1;

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

const modalDataMap = {};
const { data: top10Data, error: top10Error } = await supabase.rpc('get_top10_by_agent');

if (!top10Error) {
    for (let i = 0; i < 28; i++) {
        const agentRows = top10Data.filter(row => row.image_index === i);
        const total = Number(agentRows[0]?.total) || 1;
        const counts = {};
        agentRows.forEach(row => { counts[row.answer] = Number(row.count); });
        modalDataMap[i] = { counts, total };
    }
}

let currentAgentData = null;
let currentAgentIndex = null;

function openModal(agentIndex) {
    const agentName = imageNames[agentIndex];
    modalAgentName.textContent = agentName.charAt(0).toUpperCase() + agentName.slice(1);
    searchInput.value = '';
    searchResult.textContent = '';
    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    currentAgentIndex = agentIndex;
    currentAgentData = modalDataMap[agentIndex] || null;
    if (currentAgentData) {
        const sorted = Object.entries(currentAgentData.counts).sort((a, b) => b[1] - a[1]);
        renderBars(sorted, currentAgentData.total);
    } else {
        modalTop10.innerHTML = '<p style="color: rgba(255,255,255,0.5);">No data yet.</p>';
    }
}

function closeModalFn() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    currentAgentData = null;
}

function renderBars(entries, total) {
    if (entries.length === 0) {
        modalTop10.innerHTML = '<p style="color: rgba(255,255,255,0.5);">No data yet.</p>';
        return;
    }

    const maxCount = entries[0][1];
    modalTop10.innerHTML = entries.map(([name, count]) => {
        const pct = (count / total * 100).toFixed(1);
        const barWidth = (count / maxCount * 100).toFixed(1);
        return `
            <div class="bar-row">
                <span class="bar-label" title="${name}">${name}</span>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${barWidth}%"></div>
                </div>
                <span class="bar-count">${count} (${pct}%)</span>
            </div>`;
    }).join('');
}

document.querySelectorAll('[id="see-more"]').forEach((span, i) => {
    span.addEventListener('click', () => openModal(i));
});

closeModal.addEventListener('click', closeModalFn);

document.addEventListener('click', (e) => {
    if (modal.style.display === 'block' && !modal.contains(e.target) && !e.target.closest('[id="see-more"]')) {
        closeModalFn();
    }
});

let searchTimeout = null;
searchInput.addEventListener('input', () => {
    if (currentAgentIndex === null) return;
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        searchResult.textContent = '';
        return;
    }
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        searchResult.textContent = 'Searching...';
        const { data: results, error: searchError } = await supabase.rpc('search_agent_answer', {
            agent_index: currentAgentIndex,
            search_term: query
        });
        if (searchError) {
            searchResult.textContent = 'Search failed.';
            return;
        }
        if (results.length > 0) {
            const { count, total } = results[0];
            const pct = (Number(count) / Number(total) * 100).toFixed(1);
            searchResult.textContent = `"${query}" — ${count} response${Number(count) !== 1 ? 's' : ''} (${pct}%)`;
        } else {
            searchResult.textContent = `"${query}" — no responses found`;
        }
    }, 300);
});

sideBtn.addEventListener('click', function() {
    window.location.href = 'summary.html';
    return;
});
