/**
 * Blog Loader - carrega posts publicados do Supabase.
 * Mantem localStorage como fallback para edicao local/offline.
 */

const SUPABASE_URL = 'https://mbpwppopfqensjeksxoy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icHdwcG9wZnFlbnNqZWtzeG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3OTI3MTEsImV4cCI6MjA5NDM2ODcxMX0.xkXGSgSlq1Vavtf5gULVD6h7M60C3h3SP3GLNLvT2nM';
const POSTS_KEY = 'titas_posts';
const CATEGORY_LABELS = {
    todas: '',
    competicoes: 'competicoes',
    workshops: 'workshops',
    projetos: 'projetos',
    eventos: 'eventos',
    novidades: 'novidades'
};

let allBlogPosts = [];
let activeCategory = '';

function supabaseHeaders(token = SUPABASE_ANON_KEY) {
    return {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };
}

function readLocalPosts() {
    try {
        const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
        return Array.isArray(posts) ? posts : [];
    } catch (e) {
        console.warn('Posts locais invalidos:', e);
        return [];
    }
}

function normalizePost(post) {
    return {
        ...post,
        published_at: post.published_at || post.updated_at || post.created_at || new Date().toISOString(),
        summary: post.summary || '',
        cover_image: post.cover_image || post.image || null
    };
}

async function fetchSupabasePosts() {
    const params = new URLSearchParams({
        select: '*',
        status: 'eq.published',
        order: 'published_at.desc.nullslast,created_at.desc'
    });

    const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?${params}`, {
        headers: supabaseHeaders()
    });

    if (!response.ok) {
        throw new Error(`Supabase posts: ${response.status}`);
    }

    return response.json();
}

async function loadBlogPosts() {
    try {
        console.log('Carregando posts do Supabase...');
        const posts = (await fetchSupabasePosts()).map(normalizePost);

        if (posts.length === 0) {
            showEmptyState();
            return;
        }

        allBlogPosts = posts;
        setupCategoryFilters();
        renderFilteredBlogPosts();
    } catch (error) {
        console.error('Erro ao carregar posts do Supabase:', error);

        const localPosts = readLocalPosts()
            .filter(post => post.status === 'published')
            .map(normalizePost)
            .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        if (localPosts.length > 0) {
            allBlogPosts = localPosts;
            setupCategoryFilters();
            renderFilteredBlogPosts();
            return;
        }

        showErrorState('Nenhum post publicado ainda.');
    }
}

function renderFilteredBlogPosts() {
    const filteredPosts = activeCategory
        ? allBlogPosts.filter(post => post.category === activeCategory)
        : allBlogPosts;

    if (filteredPosts.length === 0) {
        showEmptyState('Nenhum post encontrado nesta categoria.');
        return;
    }

    renderBlogPosts(filteredPosts);
}

function normalizeCategoryLabel(label) {
    return (label || '')
        .toString()
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ç/g, 'c');
}

function setupCategoryFilters() {
    const badges = Array.from(document.querySelectorAll('.badge'));
    const categoryBadges = badges.filter(badge => {
        const key = normalizeCategoryLabel(badge.textContent);
        return Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, key);
    });

    categoryBadges.forEach(badge => {
        if (badge.dataset.blogFilterReady === 'true') return;

        badge.dataset.blogFilterReady = 'true';
        badge.addEventListener('click', () => {
            const key = normalizeCategoryLabel(badge.textContent);
            activeCategory = CATEGORY_LABELS[key] || '';
            updateCategoryFilterState(categoryBadges);
            renderFilteredBlogPosts();
        });
    });

    updateCategoryFilterState(categoryBadges);
}

function updateCategoryFilterState(categoryBadges) {
    categoryBadges.forEach(badge => {
        const key = normalizeCategoryLabel(badge.textContent);
        const category = CATEGORY_LABELS[key] || '';
        const isActive = category === activeCategory;
        badge.classList.toggle('active', isActive);
        badge.style.background = isActive ? '#FFA500' : '#333';
        badge.style.color = isActive ? '#0D0D0D' : '#FFA500';
    });
}

function renderBlogPosts(posts) {
    const blogsContainer = document.querySelector('.blog-carousel');

    if (!blogsContainer) {
        console.warn('Container .blog-carousel nao encontrado');
        return;
    }

    blogsContainer.innerHTML = '';

    const postsPerSlide = 3;
    const slides = [];

    for (let i = 0; i < posts.length; i += postsPerSlide) {
        slides.push(posts.slice(i, i + postsPerSlide));
    }

    slides.forEach((slideContent, slideIndex) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'hero-slide';
        slideDiv.style.display = slideIndex === 0 ? 'block' : 'none';
        slideDiv.innerHTML = createSlideHtml(slideContent);
        blogsContainer.appendChild(slideDiv);
    });

    createCarouselControls(blogsContainer, slides.length);
    initializeCarousel();
}

function createSlideHtml(slideContent) {
    const cardsHtml = slideContent.map(post => `
        <div class="blog-card">
            <img src="${post.cover_image || '/static/images/image.png'}" alt="${post.title}" class="blog-image">
            <div class="blog-content">
                <p class="blog-date">${formatDate(post.published_at)}</p>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.summary}</p>
                <a href="blog-post.html?slug=${encodeURIComponent(post.slug || post.id)}" class="blog-read-more">Leia mais &rarr;</a>
            </div>
        </div>
    `).join('');

    return `
        <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
            ${cardsHtml}
        </div>
    `;
}

function createCarouselControls(container, slideCount) {
    if (slideCount <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-prev';
    prevBtn.setAttribute('aria-label', 'Anterior');
    prevBtn.style.cssText = 'position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:36px;background:transparent;border:none;color:rgba(255,255,255,0.9);cursor:pointer;z-index:10;';
    prevBtn.innerHTML = '&lsaquo;';
    prevBtn.onclick = () => {
        previousSlide();
        restartBlogCarouselAutoplay();
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-next';
    nextBtn.setAttribute('aria-label', 'Proximo');
    nextBtn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:36px;background:transparent;border:none;color:rgba(255,255,255,0.9);cursor:pointer;z-index:10;';
    nextBtn.innerHTML = '&rsaquo;';
    nextBtn.onclick = () => {
        nextSlide();
        restartBlogCarouselAutoplay();
    };

    container.appendChild(prevBtn);
    container.appendChild(nextBtn);

    const indicatorsDiv = document.createElement('div');
    indicatorsDiv.className = 'hero-indicators';
    indicatorsDiv.style.cssText = 'position: absolute; left: 50%; transform: translateX(-50%); bottom: 8px; display: flex; gap: 12px;';

    for (let i = 0; i < slideCount; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        indicator.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'};
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        indicator.onclick = () => goToSlide(i);
        indicatorsDiv.appendChild(indicator);
    }

    container.appendChild(indicatorsDiv);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = date.toLocaleDateString('pt-BR', options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function showEmptyState(message = 'Nenhum post publicado ainda') {
    const blogsContainer = document.querySelector('.blog-carousel');
    if (blogsContainer) {
        blogsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.7);">
                <p style="font-size: 18px;">${message}</p>
                <p style="font-size: 14px; margin-top: 10px;">Fique atento para as proximas novidades!</p>
            </div>
        `;
    }
}

function showErrorState(errorMsg) {
    const blogsContainer = document.querySelector('.blog-carousel');
    if (blogsContainer) {
        blogsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.7);">
                <p style="font-size: 16px;">${errorMsg}</p>
            </div>
        `;
    }
}

let currentSlide = 0;
let blogCarouselTimer = null;
const BLOG_CAROUSEL_INTERVAL = 5000;

function initializeCarousel() {
    const slides = document.querySelectorAll('.blog-carousel .hero-slide');
    currentSlide = 0;
    updateCarouselDisplay(slides);
    startBlogCarouselAutoplay();
    setupBlogCarouselPause();
}

function nextSlide() {
    const slides = document.querySelectorAll('.blog-carousel .hero-slide');
    if (!slides.length) return;
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarouselDisplay(slides);
}

function previousSlide() {
    const slides = document.querySelectorAll('.blog-carousel .hero-slide');
    if (!slides.length) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarouselDisplay(slides);
}

function goToSlide(index) {
    currentSlide = index;
    const slides = document.querySelectorAll('.blog-carousel .hero-slide');
    updateCarouselDisplay(slides);
    restartBlogCarouselAutoplay();
}

function updateCarouselDisplay(slides) {
    slides.forEach((slide, index) => {
        slide.style.display = index === currentSlide ? 'block' : 'none';
    });

    const indicators = document.querySelectorAll('.blog-carousel .hero-indicators .indicator');
    indicators.forEach((indicator, index) => {
        indicator.style.background = index === currentSlide
            ? 'rgba(255,255,255,0.9)'
            : 'rgba(255,255,255,0.5)';
    });
}

function startBlogCarouselAutoplay() {
    const slides = document.querySelectorAll('.blog-carousel .hero-slide');
    stopBlogCarouselAutoplay();

    if (slides.length <= 1) return;

    blogCarouselTimer = setInterval(() => {
        nextSlide();
    }, BLOG_CAROUSEL_INTERVAL);
}

function stopBlogCarouselAutoplay() {
    if (blogCarouselTimer) {
        clearInterval(blogCarouselTimer);
        blogCarouselTimer = null;
    }
}

function restartBlogCarouselAutoplay() {
    stopBlogCarouselAutoplay();
    startBlogCarouselAutoplay();
}

function setupBlogCarouselPause() {
    const container = document.querySelector('.blog-carousel');
    if (!container || container.dataset.carouselPauseReady === 'true') return;

    container.dataset.carouselPauseReady = 'true';
    container.addEventListener('mouseenter', stopBlogCarouselAutoplay);
    container.addEventListener('mouseleave', startBlogCarouselAutoplay);
    container.addEventListener('focusin', stopBlogCarouselAutoplay);
    container.addEventListener('focusout', startBlogCarouselAutoplay);
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);

