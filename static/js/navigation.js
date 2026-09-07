/**
 * Header e Navegação
 */

/*
 * Chrome compartilhado (menu + rodapé)
 * -----------------------------------
 * O header e o footer são replicados em ~18 páginas estáticas e, com o tempo,
 * divergiram (itens de menu diferentes, labels distintas, links quebrados).
 * Para ter UMA fonte de verdade sem build, o markup canônico é definido aqui
 * e injetado em runtime. O HTML de cada página segue servindo de fallback
 * para buscadores e para navegação sem JavaScript.
 */

const NAV_LINKS = [
    { href: 'index.html', label: 'HOME' },
    {
        href: 'equipes.html', label: 'EQUIPES', dropdown: [
            { href: 'cospace.html', label: 'CoSpace' },
            { href: 'futebol-2d.html', label: 'Futebol 2D' },
            { href: 'humanoide.html', label: 'Humanóide' },
            { href: 'seguidor-de-linha.html', label: 'Seguidor de Linha' },
            { href: 'challenger.html', label: 'SEK / Challenger' },
            { href: 'obr-teorica.html', label: 'OBR Teórica' },
            { href: 'pesquisa.html', label: 'Pesquisa' },
            { href: 'pratica.html', label: 'Prática' },
            { href: 'osorin.html', label: 'OSORIN' },
            { href: 'equipes.html#coordenacao', label: 'Coordenação' }
        ]
    },
    { href: 'inscreva-se.html', label: 'INSCREVA-SE' },
    { href: 'blog.html', label: 'BLOG' },
    { href: 'apoio.html', label: 'APOIO' },
    { href: 'contato.html', label: 'CONTATO' }
];

const SOCIAL_LINKS = [
    { href: 'https://www.instagram.com/titasdarobotica', label: 'Instagram', icon: 'fa-instagram' },
    { href: 'https://www.facebook.com/titasdarobotica', label: 'Facebook', icon: 'fa-facebook' },
    { href: 'https://www.youtube.com/@titasdarobotica', label: 'YouTube', icon: 'fa-youtube' },
    { href: 'https://www.linkedin.com/company/tit%C3%A3s-da-rob%C3%B3tica/', label: 'LinkedIn', icon: 'fa-linkedin' }
];

function navMarkup(withDropdown) {
    return NAV_LINKS.map(item => {
        if (item.dropdown && withDropdown) {
            const sub = item.dropdown.map(d =>
                `<a href="${d.href}" class="dropdown-item">${d.label}</a>`).join('');
            return `<div class="dropdown">` +
                `<a href="${item.href}" class="nav-item">${item.label} ↓</a>` +
                `<div class="dropdown-content">${sub}</div></div>`;
        }
        return `<a href="${item.href}" class="nav-item">${item.label}</a>`;
    }).join('');
}

function socialMarkup(className) {
    return SOCIAL_LINKS.map(s =>
        `<a href="${s.href}" target="_blank" rel="noopener"${className ? ` class="${className}"` : ''}` +
        ` aria-label="${s.label}" title="${s.label}"><i class="fab ${s.icon}"></i></a>`).join('');
}

function footerMarkup() {
    const year = new Date().getFullYear();
    return `<div class="footer-content">
        <div class="footer-section">
            <h3>Redes Sociais</h3>
            <p>Siga-nos nas redes sociais e fique por dentro de todas as novidades!</p>
            <div class="social-links">${socialMarkup('social-link')}</div>
        </div>
        <div class="footer-section">
            <h3>Links Rápidos</h3>
            <a href="index.html">Home</a>
            <a href="equipes.html">Nossas Equipes</a>
            <a href="inscreva-se.html">Inscrições</a>
            <a href="blog.html">Blog</a>
            <a href="apoio.html">Apoio</a>
            <a href="contato.html">Contato</a>
        </div>
        <div class="footer-section">
            <h3>Contato</h3>
            <p><strong>E-mail:</strong><br>
            <a href="mailto:titasdarobotica@gmail.com">titasdarobotica@gmail.com</a></p>
            <p><strong>Telefone:</strong><br>
            <a href="tel:+5528999698766">55 28 99969-8766</a><br>
            <span style="color: #aaa; font-size: 12px;">Coordenador Júlio Vendramini</span></p>
            <p><strong>Localização:</strong><br>
            IFES Campus Colatina<br>
            Colatina - ES, Brasil</p>
        </div>
        <div class="footer-section">
            <h3>Sobre Titãs</h3>
            <p>Somos um projeto de extensão dedicado à educação em robótica, promovendo competências técnicas e inovação desde 2015.</p>
        </div>
    </div>
    <div class="footer-bottom">
        <div>
            <p><strong>Política de Privacidade</strong><br>
            Respeitamos sua privacidade e seus dados são protegidos. Consulte nossa
            <a href="politicas.html#privacidade">política de privacidade</a> completa.</p>
        </div>
        <div>
            <p><strong>Termos de Uso</strong><br>
            Ao usar este site, você concorda com nossos
            <a href="politicas.html#termos">termos de uso</a>.</p>
        </div>
        <div>
            <p><strong>Cookies</strong><br>
            Utilizamos cookies para melhorar sua experiência. Saiba mais na nossa
            <a href="politicas.html#cookies">política de cookies</a>.</p>
        </div>
        <div class="copyright">
            <p>&copy; ${year} Titãs da Robótica - IFES Colatina. Todos os direitos reservados.</p>
        </div>
    </div>`;
}

function normalizeChrome() {
    const navMenu = document.querySelector('.header .nav-menu');
    if (navMenu) navMenu.innerHTML = navMarkup(true);

    const fixedMenu = document.querySelector('.fixed-nav .fixed-nav-menu');
    if (fixedMenu) fixedMenu.innerHTML = navMarkup(true);

    const footer = document.querySelector('footer');
    if (footer) footer.innerHTML = footerMarkup();

    // Rodapé de contato dedicado (página de contato)
    document.querySelectorAll('.contact-social-links').forEach(el => {
        el.innerHTML = socialMarkup('');
    });
}

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

// Atalho discreto para a equipe chegar ao painel (Ctrl+Shift+A).
// Não há botão visível: o acesso real é protegido pelo login em admin.html.
function initAdminShortcut() {
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            window.location.href = '/admin.html';
        }
    });
}

// Inicializar todas as funções de navegação
function initNavigation() {
    normalizeChrome();
    initFixedNav();
    initHeaderScroll();
    initActiveMenuItem();
    initMobileMenu();
    initAdminShortcut();
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initNavigation };
}
