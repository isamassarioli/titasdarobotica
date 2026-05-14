/**
 * Blog API Client - Consome a API Django backend
 * Carrega posts e editais dinamicamente
 */

const API_URL = (function() {
    if (typeof window !== 'undefined') {
        if (window.API_URL) return window.API_URL;
        try {
            const ls = localStorage.getItem('apiUrl');
            if (ls) return ls;
        } catch (e) {
            // localStorage may be unavailable in some contexts
        }
        return `${window.location.origin}/api`;
    }
    return 'http://localhost:8000/api';
})();

class BlogApiClient {
    constructor(baseUrl = API_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Busca posts publicados
     */
    async getPosts(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.search) params.append('search', filters.search);
            if (filters.page) params.append('page', filters.page);

            const url = `${this.baseUrl}/posts/?${params.toString()}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar posts:', error);
            return { results: [], count: 0 };
        }
    }

    /**
     * Busca últimos 3 posts
     */
    async getLatestPosts() {
        try {
            const url = `${this.baseUrl}/posts/latest/`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar últimos posts:', error);
            return [];
        }
    }

    /**
     * Busca um post específico pelo slug
     */
    async getPostBySlug(slug) {
        try {
            const url = `${this.baseUrl}/posts/${slug}/`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar post:', error);
            return null;
        }
    }

    /**
     * Busca posts por categoria
     */
    async getPostsByCategory(category) {
        try {
            const url = `${this.baseUrl}/posts/by_category/?category=${category}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar posts por categoria:', error);
            return [];
        }
    }

    /**
     * Busca editais publicados
     */
    async getEditals(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const url = `${this.baseUrl}/editals/?${params.toString()}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar editais:', error);
            return { results: [], count: 0 };
        }
    }

    /**
     * Busca editais abertos para inscrição
     */
    async getOpenEditals() {
        try {
            const url = `${this.baseUrl}/editals/open/`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar editais abertos:', error);
            return [];
        }
    }

    /**
     * Busca editais fechados/arquivados
     */
    async getClosedEditals() {
        try {
            const url = `${this.baseUrl}/editals/closed/`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar editais fechados:', error);
            return [];
        }
    }

    /**
     * Busca um edital específico pelo slug
     */
    async getEditalBySlug(slug) {
        try {
            const url = `${this.baseUrl}/editals/${slug}/`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar edital:', error);
            return null;
        }
    }

    /**
     * Formata data ISO para formato brasileiro
     */
    formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Traduz categoria para português
     */
    translateCategory(category) {
        const translations = {
            'competicoes': 'Competições',
            'workshops': 'Workshops',
            'projetos': 'Projetos',
            'eventos': 'Eventos',
            'novidades': 'Novidades'
        };
        return translations[category] || category;
    }
}

// Instância global
const blogApi = new BlogApiClient();

/**
 * Renderiza posts em um carousel
 */
async function renderPostsCarousel(containerId = '.blog-carousel') {
    const posts = await blogApi.getLatestPosts();
    const container = document.querySelector(containerId);
    
    if (!container || posts.length === 0) return;

    // Limpar slides existentes
    const slides = container.querySelectorAll('.hero-slide');
    slides.forEach(slide => slide.remove());

    // Agrupar posts em slides de 3 (assumindo 3 cards por slide)
    const itemsPerSlide = 3;
    for (let i = 0; i < posts.length; i += itemsPerSlide) {
        const slideItems = posts.slice(i, i + itemsPerSlide);
        
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        slide.style.display = i === 0 ? 'block' : 'none';
        
        const grid = document.createElement('div');
        grid.className = 'blog-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        grid.style.gap = '24px';
        
        slideItems.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.innerHTML = `
                <img src="${post.cover_image}" alt="${post.title}" class="blog-image">
                <div class="blog-content">
                    <p class="blog-date">${blogApi.formatDate(post.published_at)}</p>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.summary}</p>
                    <a href="blog-detail.html?slug=${post.slug}" class="blog-read-more">Leia mais →</a>
                </div>
            `;
            grid.appendChild(card);
        });
        
        slide.appendChild(grid);
        container.appendChild(slide);
    }

    // Atualizar indicadores
    const indicators = container.querySelector('.hero-indicators');
    if (indicators) {
        indicators.innerHTML = '';
        const numSlides = Math.ceil(posts.length / itemsPerSlide);
        for (let i = 0; i < numSlides; i++) {
            const indicator = document.createElement('span');
            indicator.className = 'indicator' + (i === 0 ? ' active' : '');
            indicators.appendChild(indicator);
        }
    }

    // Reiniciar carousel
    if (typeof Carousel !== 'undefined') {
        const carousel = new Carousel(containerId);
    }
}

/**
 * Renderiza editais em uma lista
 */
async function renderEditals(containerId = '#editals-container') {
    const editals = await blogApi.getOpenEditals();
    const container = document.querySelector(containerId);
    
    if (!container) return;

    container.innerHTML = '';

    if (editals.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #aaa;">Nenhum edital aberto no momento.</p>';
        return;
    }

    editals.forEach(edital => {
        const editalCard = document.createElement('div');
        editalCard.className = 'edital-card';
        editalCard.style.cssText = `
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            transition: transform 0.3s ease;
        `;
        
        editalCard.innerHTML = `
            <div style="display: flex; gap: 20px;">
                <img src="${edital.image}" alt="${edital.title}" 
                     style="width: 150px; height: 150px; border-radius: 8px; object-fit: cover;">
                <div style="flex: 1;">
                    <h3 style="color: #FFA500; margin-bottom: 10px;">${edital.title}</h3>
                    <p style="color: #aaa; margin-bottom: 10px;">${edital.description}</p>
                    <p style="font-size: 14px; color: #888;">
                        Início: ${blogApi.formatDate(edital.start_date)}<br>
                        Término: ${blogApi.formatDate(edital.end_date)}
                    </p>
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <a href="edital-detail.html?slug=${edital.slug}" 
                           class="btn" style="background: #FFA500; color: #000; padding: 8px 16px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                            Ver Edital
                        </a>
                        <a href="${edital.document}" target="_blank"
                           class="btn" style="background: #333; color: #FFA500; padding: 8px 16px; border-radius: 5px; text-decoration: none; border: 1px solid #FFA500;">
                            📄 Regulamento
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(editalCard);
    });
}

// Inicializar ao carregar o DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Blog API Client carregado');
    
    // Carregar posts no carousel se estiver em blog.html
    if (document.querySelector('.blog-carousel')) {
        renderPostsCarousel('.blog-carousel');
    }
    
    // Carregar editais se estiver em inscreva-se.html
    if (document.querySelector('#editals-container')) {
        renderEditals('#editals-container');
    }
});
