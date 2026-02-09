/**
 * Carrossel de Imagens
 */

class Carousel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.hero-slide');
        this.indicators = this.container.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.showSlide(0);
        this.initIndicators();
        this.startAutoPlay();
        this.initSwipe();
    }
    
    showSlide(index) {
        // Garantir que o índice está dentro dos limites
        this.currentSlide = (index + this.slides.length) % this.slides.length;
        
        // Esconder todos os slides
        this.slides.forEach((slide, i) => {
            slide.style.display = i === this.currentSlide ? 'block' : 'none';
            slide.style.opacity = i === this.currentSlide ? '1' : '0';
        });
        
        // Atualizar indicadores
        this.indicators.forEach((indicator, i) => {
            if (i === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }
    
    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }
    
    initIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }
    
    startAutoPlay(interval = 5000) {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    initSwipe() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.nextSlide();
                this.resetAutoPlay();
            }
            if (touchEndX > touchStartX + 50) {
                this.prevSlide();
                this.resetAutoPlay();
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
}

// Inicializar carrossel
function initCarousel() {
    const carousel = new Carousel('.hero-section');
    return carousel;
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Carousel, initCarousel };
}
