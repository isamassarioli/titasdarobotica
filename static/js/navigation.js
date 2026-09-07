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

// Menu Mobile Toggle
// O botão hambúrguer é injetado por JS para manter um único ponto de manutenção,
// já que o header/rodapé são replicados em todas as páginas.
function buildToggleButton(controlsId) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-toggle';
    btn.setAttribute('aria-label', 'Abrir menu de navegação');
    btn.setAttribute('aria-expanded', 'false');
    if (controlsId) btn.setAttribute('aria-controls', controlsId);
    btn.innerHTML = '<span class="menu-toggle-bar"></span>' +
                    '<span class="menu-toggle-bar"></span>' +
                    '<span class="menu-toggle-bar"></span>';
    return btn;
}

function wireMenu(container, menu, idSuffix) {
    if (!container || !menu || container.querySelector('.menu-toggle')) return;

    if (!menu.id) menu.id = 'nav-menu-' + idSuffix;
    const toggle = buildToggleButton(menu.id);
    container.appendChild(toggle);

    const closeMenu = () => {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu de navegação');
    };

    const openMenu = () => {
        menu.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Fechar menu de navegação');
    };

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Fecha ao clicar em um link do menu
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fecha ao clicar fora ou pressionar Esc
    document.addEventListener('click', function (e) {
        if (menu.classList.contains('is-open') &&
            !menu.contains(e.target) && !toggle.contains(e.target)) {
            closeMenu();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    // Garante estado limpo ao voltar para desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) closeMenu();
    });
}

function initMobileMenu() {
    wireMenu(document.querySelector('.header .header-content'),
             document.querySelector('.header .nav-menu'), 'header');
    wireMenu(document.querySelector('.fixed-nav .fixed-nav-content'),
             document.querySelector('.fixed-nav .fixed-nav-menu'), 'fixed');
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
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initNavigation };
}
