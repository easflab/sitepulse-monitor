let sites = JSON.parse(localStorage.getItem('sitepulse_sites')) || [];
let renderTimeout = null;
let chartInstances = {};

// ==================== PERFORMANCE HELPERS ====================
function debouncedRender() {
    if (renderTimeout) clearTimeout(renderTimeout);
    renderTimeout = setTimeout(() => {
        renderSites();
    }, 150);
}

function saveSites() {
    localStorage.setItem('sitepulse_sites', JSON.stringify(sites));
}

// ==================== CORE FUNCTIONS ====================
async function checkSite(site) {
    const start = Date.now();
    const wasOnline = site.status === 'up';
    
    try {
        await fetch(site.url, { mode: 'no-cors', cache: 'no-cache' });
        const time = Date.now() - start;
        
        site.status = 'up';
        site.responseTime = time;
        site.lastCheck = new Date().toISOString();
        site.history = site.history || [];
        site.history.push({ time: Date.now(), responseTime: time, online: true });
        
        if (site.history.length > 30) site.history.shift();
    } catch (e) {
        site.status = 'down';
        site.responseTime = Date.now() - start;
        site.lastCheck = new Date().toISOString();
        site.history = site.history || [];
        site.history.push({ time: Date.now(), responseTime: site.responseTime, online: false });
        
        if (wasOnline) sendNotification(site);
    }
    
    saveSites();
    sortSites();
    debouncedRender();
}

function addSite() {
    const urlInput = document.getElementById('urlInput');
    let url = urlInput.value.trim();
    
    if (!url) return alert("Digite uma URL válida!");
    if (!url.startsWith('http')) url = 'https://' + url;

    sites.push({
        url: url,
        status: 'unknown',
        responseTime: 0,
        lastCheck: null,
        history: []
    });

    urlInput.value = '';
    saveSites();
    sortSites();
    debouncedRender();
    checkSite(sites[sites.length - 1]);
}

function renderSites() {
    const container = document.getElementById('sitesContainer');
    container.innerHTML = '';

    sites.forEach((site, index) => {
        const isUp = site.status === 'up';
        const card = document.createElement('div');
        card.className = `bg-gray-900 rounded-3xl p-6 md:p-8 card border ${isUp ? 'border-emerald-500/30' : 'border-red-500/30'}`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-6">
                <div class="flex-1 min-w-0">
                    <h3 class="text-lg md:text-xl font-semibold break-all">${site.url}</h3>
                    <p class="text-xs md:text-sm text-gray-400 mt-1">
                        ${site.lastCheck ? new Date(site.lastCheck).toLocaleString('pt-BR') : 'Nunca verificado'}
                    </p>
                </div>
                <span class="px-4 py-2 rounded-full text-sm font-medium ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}">
                    ${isUp ? '✅ Online' : '❌ Offline'}
                </span>
            </div>
            
            <div class="mb-6">
                <p class="text-4xl font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}">
                    ${site.responseTime || '?'} <span class="text-base font-normal">ms</span>
                </p>
                <p class="text-xs text-gray-400">Tempo de Resposta</p>
            </div>
            
            <div class="h-44 md:h-48">
                <canvas id="chart-${index}"></canvas>
            </div>
            
            <div class="flex gap-3 mt-6">
                <button onclick="checkSite(sites[${index}])" 
                        class="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-2xl transition text-sm">
                    Verificar Agora
                </button>
                <button onclick="removeSite(${index})" 
                        class="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 rounded-2xl transition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(card);
        
        // Criar gráfico com delay para melhor performance
        setTimeout(() => {
            if (site.history && site.history.length > 0) {
                createChart(`chart-${index}`, 'Resposta (ms)', isUp ? '#10b981' : '#ef4444', site.history);
            }
        }, 100);
    });
}

function removeSite(index) {
    if (confirm("Remover este site?")) {
        sites.splice(index, 1);
        saveSites();
        debouncedRender();
    }
}

// ==================== CHARTS (Otimizado) ====================
function createChart(canvasId, label, color, history) {
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
    
    const ctx = document.getElementById(canvasId).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.map((_, i) => `#${i+1}`),
            datasets: [{
                label: label,
                data: history.map(h => h.responseTime),
                borderColor: color,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#374151' } },
                x: { grid: { color: '#374151' } }
            }
        }
    });
    
    chartInstances[canvasId] = chart;
    return chart;
}

// ==================== NOVAS FUNCIONALIDADES ====================
function reloadAll() { /* ... mesma função anterior ... */ }
function clearAllHistory() { /* ... */ }
function sendNotification(site) { /* ... */ }
async function requestNotificationPermission() { /* ... */ }
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    const isLight = html.classList.toggle('light-mode');

    if (icon) {
        icon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
    }

    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}
function sortSites() { /* ... */ }
function exportData() { /* ... */ }

// Inicialização Otimizada
document.addEventListener('DOMContentLoaded', () => {
    renderSites();
    sortSites();
    
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light-mode');
        const icon = document.getElementById('themeIcon');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }
    
    requestNotificationPermission();
    
    // Atualização automática mais eficiente
    setInterval(() => {
        sites.forEach(site => checkSite(site));
    }, 15000);
});