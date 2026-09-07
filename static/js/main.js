/**
 * Titãs da Robótica - Script Principal
 * Inicializa todos os módulos e funcionalidades
 */

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 Titãs da Robótica - Site inicializado');
    
    // Inicializar navegação
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    
    // Inicializar carrossel
    if (typeof initCarousel === 'function') {
        initCarousel();
    }
    
    // Inicializar formulários
    if (typeof initForms === 'function') {
        initForms();
    }
    
    // Inicializar animações
    if (typeof initAnimations === 'function') {
        initAnimations();
    }

});

// Vercel Web Analytics (site estático): injeta o script oficial só em produção
(function () {
    var host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '') return;
    var s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);
})();

// Prevenir comportamento padrão de arrastar imagens
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Log de erros
window.addEventListener('error', function(e) {
    console.error('Erro detectado:', e.message);
});

// Performance monitoring (opcional)
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Página carregada em ${pageLoadTime}ms`);
    });
}
