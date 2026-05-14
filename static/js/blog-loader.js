/**
 * Blog Loader - Carrega posts do admin local e usa API somente como fallback.
 */

const API_URL = (function() {
    if (typeof window !== 'undefined') {
        if (window.API_URL) return window.API_URL;
        try {
            const ls = localStorage.getItem('apiUrl');
            if (ls) return ls;
        } catch (e) {}
        return `${window.location.origin}/api`;
    }
    return 'http://localhost:8000/api';
})();

const POSTS_KEY = 'titas_posts';

function readLocalPosts() {
    try {
        const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
        return Array.isArray(posts) ? posts : [];
    } catch (e) {
        console.warn('Posts locais inválidos:', e);
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

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
        throw new Error(`Erro ao carregar posts: ${response.status}`);
    }

    if (!contentType.includes('application/json')) {
        throw new Error('A resposta da API não é JSON');
    }

    return response.json();
}

async function loadBlogPosts() {
    try {
        console.log('Carregando posts do blog...');

        const localPosts = readLocalPosts()
            .filter(post => post.status === 'published')
            .map(normalizePost)
            .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        if (localPosts.length > 0) {
            renderBlogPosts(localPosts);
            return;
        }

        const data = await fetchJson(`${API_URL}/posts/?status=published`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        });
        const posts = (Array.isArray(data) ? data : (data.results || [])).map(normalizePost);

        if (posts.length === 0) {
            showEmptyState();
            return;
        }

        renderBlogPosts(posts);
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        showErrorState('Nenhum post publicado ainda.');
    }
}

function renderBlogPosts(posts) {
    const blogsContainer = document.querySelector('.blog-carousel');

    if (!blogsContainer) {
        console.warn('Container .blog-carousel não encontrado');
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
                <a href="blog.html#${post.slug || post.id}" class="blog-read-more">Leia mais →</a>
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
    prevBtn.textContent = '‹';
    prevBtn.onclick = previousSlide;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-next';
    nextBtn.setAttribute('aria-label', 'Próximo');
    nextBtn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:36px;background:transparent;border:none;color:rgba(255,255,255,0.9);cursor:pointer;z-index:10;';
    nextBtn.textContent = '›';
    nextBtn.onclick = nextSlide;

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

function showEmptyState() {
    const blogsContainer = document.querySelector('.blog-carousel');
    if (blogsContainer) {
        blogsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.7);">
                <p style="font-size: 18px;">Nenhum post publicado ainda</p>
                <p style="font-size: 14px; margin-top: 10px;">Fique atento para as próximas novidades!</p>
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

function initializeCarousel() {
    const slides = document.querySelectorAll('.blog-carousel .hero-slide');
    currentSlide = 0;
    updateCarouselDisplay(slides);
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

document.addEventListener('DOMContentLoaded', loadBlogPosts);
