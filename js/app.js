let sites = JSON.parse(localStorage.getItem('sitepulse_sites')) || [];

function saveSites() {
    localStorage.setItem('sitepulse_sites', JSON.stringify(sites));
}

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
        
        if (wasOnline) {
            sendNotification(site);
        }
    }
    saveSites();
    sortSites();
    renderSites();
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
    renderSites();
    checkSite(sites[sites.length - 1]);
}

function renderSites() {
    const container = document.getElementById('sitesContainer');
    container.innerHTML = '';

    sites.forEach((site, index) => {
        const isUp = site.status === 'up';
        const card = document.createElement('div');
        card.className = `bg-gray-900 rounded-3xl p-8 card border ${isUp ? 'border-emerald-500/30' : 'border-red-500/30'}`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-6">
                <div class="flex-1 min-w-0">
                    <h3 class="text-xl font-semibold break-all">${site.url}</h3>
                    <p class="text-sm text-gray-400 mt-1">
                        ${site.lastCheck ? new Date(site.lastCheck).toLocaleString('pt-BR') : 'Nunca verificado'}
                    </p>
                </div>
                <span class="px-4 py-2 rounded-full text-sm font-medium ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}">
                    ${isUp ? '✅ Online' : '❌ Offline'}
                </span>
            </div>
            
            <div class="flex items-center gap-8 mb-6">
                <div>
                    <p class="text-4xl font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}">
                        ${site.responseTime || '?'} <span class="text-base font-normal">ms</span>
                    </p>
                    <p class="text-xs text-gray-400">Tempo de Resposta</p>
                </div>
            </div>
            
            <div class="h-48">
                <canvas id="chart-${index}"></canvas>
            </div>
            
            <div class="flex gap-3 mt-6">
                <button onclick="checkSite(sites[${index}])" 
                        class="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-2xl transition">
                    Verificar Agora
                </button>
                <button onclick="removeSite(${index})" 
                        class="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 rounded-2xl transition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(card);
        
        setTimeout(() => {
            if (site.history && site.history.length > 0) {
                const chart = createChart(`chart-${index}`, 'Resposta (ms)', isUp ? '#10b981' : '#ef4444');
                chart.data.labels = site.history.map((_, i) => `#${i+1}`);
                chart.data.datasets[0].data = site.history.map(h => h.responseTime);
                chart.update();
            }
        }, 200);
    });
}

function removeSite(index) {
    if (confirm("Remover este site?")) {
        sites.splice(index, 1);
        saveSites();
        renderSites();
    }
}

function exportData() {
    const dataStr = JSON.stringify(sites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `sitepulse_backup_${new Date().toISOString().slice(0,10)}.json`);
    link.click();
}

// ==================== NOVAS FUNCIONALIDADES ====================

function reloadAll() {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Atualizar Tudo'));
    if (btn) {
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Atualizando...`;
        btn.disabled = true;
    }

    let completed = 0;
    sites.forEach(site => {
        checkSite(site).then(() => {
            completed++;
            if (completed === sites.length && btn) {
                btn.innerHTML = `<i class="fas fa-sync-alt"></i> Atualizar Tudo`;
                btn.disabled = false;
            }
        });
    });
}

function clearAllHistory() {
    if (confirm("Limpar histórico de todos os sites?")) {
        sites.forEach(site => site.history = []);
        saveSites();
        renderSites();
        alert("Histórico limpo com sucesso!");
    }
}

function sendNotification(site) {
    if (Notification.permission === "granted") {
        new Notification("⚠️ SitePulse - Site Offline", {
            body: `${site.url} está fora do ar!`,
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827342.png"
        });
    }
}

async function requestNotificationPermission() {
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('light-mode');
    const isLight = document.documentElement.classList.contains('light-mode');
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.classList.toggle('fa-moon', !isLight);
        icon.classList.toggle('fa-sun', isLight);
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function sortSites() {
    sites.sort((a, b) => {
        if (a.status === 'up' && b.status !== 'up') return -1;
        if (a.status !== 'up' && b.status === 'up') return 1;
        return 0;
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderSites();
    sortSites();
    
    // Carregar tema
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light-mode');
        const icon = document.getElementById('themeIcon');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Permissão de notificação
    requestNotificationPermission();
    
    // Atualização automática
    setInterval(() => {
        sites.forEach(site => checkSite(site));
    }, 15000);
});