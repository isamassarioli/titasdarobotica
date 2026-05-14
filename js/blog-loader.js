/**
 * Blog Loader - Carrega posts dinamicamente da API
 */

const API_URL = window.location.protocol === 'https:' 
    ? 'https://titasdarobotica-prod.up.railway.app/api'
    : 'http://localhost:8000/api';

async function loadBlogPosts() {
    try {
        console.log('📚 Carregando posts do blog...');
        
        // Buscar apenas posts publicados
        const response = await fetch(`${API_URL}/posts/?status=published`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar posts: ${response.status}`);
        }

        const data = await response.json();
        const posts = Array.isArray(data) ? data : (data.results || []);

        console.log(`✅ ${posts.length} posts carregados`);

        if (posts.length === 0) {
            showEmptyState();
            return;
        }

        renderBlogPosts(posts);
    } catch (error) {
        console.error('❌ Erro ao carregar posts:', error);
        showErrorState(error.message);
    }
}

function renderBlogPosts(posts) {
    const blogsContainer = document.querySelector('.blog-carousel');
    
    if (!blogsContainer) {
        console.warn('⚠️ Container .blog-carousel não encontrado');
        return;
    }

    // Limpar conteúdo anterior (slides vazios)
    blogsContainer.innerHTML = '';

    // Agrupar posts em slides (3 por slide)
    const postsPerSlide = 3;
    const slides = [];
    
    for (let i = 0; i < posts.length; i += postsPerSlide) {
        slides.push(posts.slice(i, i + postsPerSlide));
    }

    // Criar slides
    slides.forEach((slideContent, slideIndex) => {
        const slideHtml = createSlideHtml(slideContent);
        const slideDiv = document.createElement('div');
        slideDiv.className = 'hero-slide';
        slideDiv.style.display = slideIndex === 0 ? 'block' : 'none';
        slideDiv.innerHTML = slideHtml;
        blogsContainer.appendChild(slideDiv);
    });

    // Recriar controles
    createCarouselControls(blogsContainer, slides.length);

    // Inicializar carousel
    initializeCarousel();
}

function createSlideHtml(slideContent) {
    const cardsHtml = slideContent.map(post => `
        <div class="blog-card">
            ${post.cover_image ? `<img src="${post.cover_image}" alt="${post.title}" class="blog-image">` : '<img src="images/image.png" alt="Imagem" class="blog-image">'}
            <div class="blog-content">
                <p class="blog-date">${formatDate(post.published_at)}</p>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.summary}</p>
                <a href="/blog/${post.slug}/" class="blog-read-more">Leia mais →</a>
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
    if (slideCount <= 1) return; // Não mostrar controles se houver apenas 1 slide

    // Botões de navegação
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

    // Indicadores
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = date.toLocaleDateString('pt-BR', options);
    // Capitalizar primeira letra do mês
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function showEmptyState() {
    const blogsContainer = document.querySelector('.blog-carousel');
    if (blogsContainer) {
        blogsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.7);">
                <p style="font-size: 18px;">📝 Nenhum post publicado ainda</p>
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
                <p style="font-size: 16px;">⚠️ Erro ao carregar posts</p>
                <p style="font-size: 12px; margin-top: 10px; color: rgba(255,0,0,0.8);">${errorMsg}</p>
            </div>
        `;
    }
}

let currentSlide = 0;

function initializeCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    currentSlide = 0;
    updateCarouselDisplay(slides);
}

function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarouselDisplay(slides);
}

function previousSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarouselDisplay(slides);
}

function goToSlide(index) {
    currentSlide = index;
    const slides = document.querySelectorAll('.hero-slide');
    updateCarouselDisplay(slides);
}

function updateCarouselDisplay(slides) {
    slides.forEach((slide, index) => {
        slide.style.display = index === currentSlide ? 'block' : 'none';
    });

    // Atualizar indicadores
    const indicators = document.querySelectorAll('.hero-indicators .indicator');
    indicators.forEach((indicator, index) => {
        indicator.style.background = index === currentSlide 
            ? 'rgba(255,255,255,0.9)' 
            : 'rgba(255,255,255,0.5)';
    });
}

// Carregar posts ao iniciar página
document.addEventListener('DOMContentLoaded', loadBlogPosts);
