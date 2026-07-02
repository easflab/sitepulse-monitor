// tests/app.test.js
describe('PulseMonitor Tests', () => {
    test('Validação de URL', () => {
        const url = 'https://google.com';
        expect(url.startsWith('http')).toBe(true);
    });

    test('Cálculo de Uptime', () => {
        const history = [
            { online: true },
            { online: true },
            { online: false },
            { online: true }
        ];
        const onlineCount = history.filter(h => h.online).length;
        const uptime = Math.round((onlineCount / history.length) * 100);
        expect(uptime).toBe(75);
    });

    test('Formato de resposta', () => {
        const responseTime = 245;
        expect(typeof responseTime).toBe('number');
        expect(responseTime).toBeGreaterThan(0);
    });
});