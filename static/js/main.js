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
