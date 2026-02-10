/**
 * Header e Navegação
 */

// Menu Fixo ao Scroll
function initFixedNav() {
    const fixedNav = document.querySelector('.fixed-nav');
    const header = document.querySelector('.header');
    if (!fixedNav || !header) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const headerHeight = header.offsetHeight;
                const scrollPosition = window.scrollY;
                
                if (scrollPosition > headerHeight) {
                    fixedNav.classList.add('visible');
                } else {
                    fixedNav.classList.remove('visible');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Animação do Header ao Scroll
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let ticking = false;
    const scrollThreshold = 200; // Ponto único de transição
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.scrollY;
                
                if (currentScroll > scrollThreshold) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Highlight do item de menu ativo
function initActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && (href === currentPage || href.includes(currentPage))) {
            item.classList.add('active');
        }
    });
}

// Menu Mobile Toggle (para futuras implementações)
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

// Fechar dropdown ao clicar fora
function initDropdownClose() {
    document.addEventListener('click', function(event) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                if (dropdownContent) {
                    dropdownContent.style.display = 'none';
                    setTimeout(() => {
                        dropdownContent.style.display = '';
                    }, 300);
                }
            }
        });
    });
}

// Inicializar todas as funções de navegação
function initNavigation() {
    initFixedNav();
    initHeaderScroll();
    initActiveMenuItem();
    initMobileMenu();
    initDropdownClose();
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initNavigation };
}
