// ===== CONFIGURAÇÃO INICIAL =====
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initScrollAnimations();
    initParallaxEffect();
    initKeyboardNavigation();
    initSmoothScroll();
    initHeaderScroll();
    initServiceCards();
});

// ===== CARROSSEL DE DEPOIMENTOS =====
let currentSlide = 0;
const totalSlides = 3;
let autoPlayTimer;

function initCarousel() {
    showTestimonial(0);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeTestimonial(-1);
        if (e.key === 'ArrowRight') changeTestimonial(1);
    });
}

function showTestimonial(n) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');

    if (!slides.length) return;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (n + totalSlides) % totalSlides;
    
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }

    clearTimeout(autoPlayTimer);
    autoPlayTimer = setTimeout(autoPlay, 5000);
}

function changeTestimonial(n) {
    showTestimonial(currentSlide + n);
}

function currentTestimonial(n) {
    showTestimonial(n);
}

function autoPlay() {
    changeTestimonial(1);
}

// ===== ANIMAÇÕES AO ROLAR A PÁGINA =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-animation');
                
                // Animar números em cards de serviço
                if (entry.target.classList.contains('service-card')) {
                    animateServiceCard(entry.target);
                }
                
                // Animar portfolio items
                if (entry.target.classList.contains('portfolio-item')) {
                    entry.target.classList.add('slide-in');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos
    document.querySelectorAll('.service-card, .portfolio-item, .about-text').forEach(el => {
        observer.observe(el);
    });
}

function animateServiceCard(card) {
    const priceEl = card.querySelector('.service-price');
    if (!priceEl) return;

    const priceText = priceEl.textContent;
    const match = priceText.match(/[\d.,]+/);
    if (!match) return;

    const price = parseFloat(match[0].replace(',', '.'));
    let current = 0;
    const increment = price / 30;
    const timerId = setInterval(() => {
        current += increment;
        if (current >= price) {
            current = price;
            clearInterval(timerId);
        }
        priceEl.textContent = priceText.replace(match[0], current.toFixed(0));
    }, 30);
}

// ===== EFEITO PARALLAX =====
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before');

        parallaxElements.forEach(el => {
            if (el.parentElement) {
                el.parentElement.style.backgroundPosition = `center ${scrolled * 0.5}px`;
            }
        });
    });
}

// ===== NAVEGAÇÃO POR TECLADO =====
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const navLinks = document.querySelectorAll('nav a');
        
        if (e.key === 'Home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        if (e.key === 'End') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== HEADER DINÂMICO =====
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            header.classList.add('header-shadow');
            header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.classList.remove('header-shadow');
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        // Ocultar header ao descer, mostrar ao subir
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
            header.style.transition = 'transform 0.3s ease';
        } else {
            header.style.transform = 'translateY(0)';
            header.style.transition = 'transform 0.3s ease';
        }

        lastScrollY = currentScrollY;
    });
}

// ===== CARDS DE SERVIÇO COM EFEITO 3D =====
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xRotation = ((y - rect.height / 2) / rect.height) * 5;
            const yRotation = ((x - rect.width / 2) / rect.width) * 5;

            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ===== RIPPLE EFFECT EM BOTÕES =====
function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Adicionar ripple effect aos botões
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', createRipple);
});

// ===== SCROLL SPY - DESTAQUE DO MENU =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });
}

initScrollSpy();

// ===== THROTTLE PARA PERFORMANCE =====
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Aplicar throttle ao scroll
window.addEventListener('scroll', throttle(() => {
    // Atualizar posições etc
}, 100));

// ===== PRELOAD DE IMAGENS =====
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const preload = new Image();
        preload.src = img.src;
    });
}

preloadImages();

// ===== SUPORTE A MODO ESCURO (ATIVO) =====
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }
}

initDarkMode();

console.log('✅ Sistema de animações e interações carregado com sucesso!');
