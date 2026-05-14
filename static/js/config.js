// Configuração global para API URL
(function() {
    if (typeof window === 'undefined') return;
    if (window.API_URL) return; // respeita override já definido

    try {
        const stored = localStorage.getItem('apiUrl');
        if (stored) {
            window.API_URL = stored;
            return;
        }
    } catch (e) {
        // localStorage pode falhar em alguns contextos
    }

    // fallback para origin + /api
    try {
        window.API_URL = `${window.location.origin}/api`;
    } catch (e) {
        window.API_URL = 'http://localhost:8000/api';
    }

    // utilitário para permitir override em runtime
    window.setApiUrl = function(url) {
        try { localStorage.setItem('apiUrl', url); } catch (e) {}
        window.API_URL = url;
    };
})();
