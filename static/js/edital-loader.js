/**
 * Edital Loader - Carrega editais do admin local e usa API somente como fallback.
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

const EDITAIS_KEY = 'titas_editais';

function readLocalEditais() {
    try {
        const editais = JSON.parse(localStorage.getItem(EDITAIS_KEY) || '[]');
        return Array.isArray(editais) ? editais : [];
    } catch (e) {
        console.warn('Editais locais inválidos:', e);
        return [];
    }
}

function normalizeEdital(edital) {
    return {
        ...edital,
        image: edital.image || edital.cover_image || null,
        description: edital.description || edital.summary || '',
        start_date: edital.start_date || edital.created_at || new Date().toISOString(),
        end_date: edital.end_date || edital.start_date || edital.created_at || new Date().toISOString()
    };
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
        throw new Error(`Erro ao carregar editais: ${response.status}`);
    }

    if (!contentType.includes('application/json')) {
        throw new Error('A resposta da API não é JSON');
    }

    return response.json();
}

async function loadEditais() {
    try {
        console.log('Carregando editais...');

        const localEditais = readLocalEditais()
            .filter(edital => edital.status === 'published' || edital.status === 'open')
            .map(normalizeEdital)
            .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

        if (localEditais.length > 0) {
            renderEditals(localEditais);
            return;
        }

        const data = await fetchJson(`${API_URL}/editals/?status=published`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        });
        const editals = (Array.isArray(data) ? data : (data.results || [])).map(normalizeEdital);

        if (editals.length === 0) {
            showEmptyState();
            return;
        }

        renderEditals(editals);
    } catch (error) {
        console.error('Erro ao carregar editais:', error);
        showEmptyState();
    }
}

function renderEditals(editals) {
    const editalContainer = document.querySelector('.edital-carousel');

    if (!editalContainer) {
        console.warn('Container .edital-carousel não encontrado');
        return;
    }

    editalContainer.innerHTML = '';

    const editalsPerSlide = 3;
    const slides = [];

    for (let i = 0; i < editals.length; i += editalsPerSlide) {
        slides.push(editals.slice(i, i + editalsPerSlide));
    }

    slides.forEach((slideContent, slideIndex) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'hero-slide';
        slideDiv.style.display = slideIndex === 0 ? 'block' : 'none';
        slideDiv.innerHTML = createEditalSlideHtml(slideContent);
        editalContainer.appendChild(slideDiv);
    });

    createEditalCarouselControls(editalContainer, slides.length);
    initializeEditalCarousel();
}

function createEditalSlideHtml(slideContent) {
    const cardsHtml = slideContent.map(edital => `
        <div class="blog-card">
            <img src="${edital.image || '/static/images/image.png'}" alt="${edital.title}" class="blog-image">
            <div class="blog-content">
                <p class="blog-date">${formatDateRange(edital.start_date, edital.end_date)}</p>
                <h3 class="blog-title">${edital.title}</h3>
                <p class="blog-excerpt">${edital.description}</p>
                ${edital.document ? `<a href="${edital.document}" target="_blank" class="blog-read-more">Abrir edital →</a>` : `<a href="editais.html#${edital.slug || edital.id}" class="blog-read-more">Leia mais →</a>`}
            </div>
        </div>
    `).join('');

    return `
        <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
            ${cardsHtml}
        </div>
    `;
}

function createEditalCarouselControls(container, slideCount) {
    if (slideCount <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-prev';
    prevBtn.setAttribute('aria-label', 'Anterior');
    prevBtn.style.cssText = 'position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:36px;background:transparent;border:none;color:rgba(255,255,255,0.9);cursor:pointer;z-index:10;';
    prevBtn.textContent = '‹';
    prevBtn.onclick = previousEditalSlide;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-next';
    nextBtn.setAttribute('aria-label', 'Próximo');
    nextBtn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:36px;background:transparent;border:none;color:rgba(255,255,255,0.9);cursor:pointer;z-index:10;';
    nextBtn.textContent = '›';
    nextBtn.onclick = nextEditalSlide;

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
        indicator.onclick = () => goToEditalSlide(i);
        indicatorsDiv.appendChild(indicator);
    }

    container.appendChild(indicatorsDiv);
}

function formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';
    const options = { month: 'long', day: 'numeric' };
    const startStr = start.toLocaleDateString('pt-BR', options);
    const endStr = end.toLocaleDateString('pt-BR', { ...options, year: 'numeric' });
    return `${startStr} a ${endStr}`;
}

function showEmptyState() {
    const container = document.querySelector('.edital-carousel');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.7);">
                <p style="font-size: 18px;">Nenhum edital aberto no momento</p>
                <p style="font-size: 14px; margin-top: 10px;">Fique atento para os próximos editais!</p>
            </div>
        `;
    }
}

let currentEditalSlide = 0;

function initializeEditalCarousel() {
    const slides = document.querySelectorAll('.edital-carousel .hero-slide');
    currentEditalSlide = 0;
    updateEditalCarouselDisplay(slides);
}

function nextEditalSlide() {
    const slides = document.querySelectorAll('.edital-carousel .hero-slide');
    if (!slides.length) return;
    currentEditalSlide = (currentEditalSlide + 1) % slides.length;
    updateEditalCarouselDisplay(slides);
}

function previousEditalSlide() {
    const slides = document.querySelectorAll('.edital-carousel .hero-slide');
    if (!slides.length) return;
    currentEditalSlide = (currentEditalSlide - 1 + slides.length) % slides.length;
    updateEditalCarouselDisplay(slides);
}

function goToEditalSlide(index) {
    currentEditalSlide = index;
    const slides = document.querySelectorAll('.edital-carousel .hero-slide');
    updateEditalCarouselDisplay(slides);
}

function updateEditalCarouselDisplay(slides) {
    slides.forEach((slide, index) => {
        slide.style.display = index === currentEditalSlide ? 'block' : 'none';
    });

    const indicators = document.querySelectorAll('.edital-carousel .hero-indicators .indicator');
    indicators.forEach((indicator, index) => {
        indicator.style.background = index === currentEditalSlide
            ? 'rgba(255,255,255,0.9)'
            : 'rgba(255,255,255,0.5)';
    });
}

document.addEventListener('DOMContentLoaded', loadEditais);
