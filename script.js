/* =========================================
   OknaPomorze — JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ============ Header scroll effect ============
    const header = document.getElementById('header');
    const onScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ============ Hamburger menu ============
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============ Smooth scroll for all anchor links ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============ Scroll-triggered animations ============
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ============ Stats counter animation ============
    const counters = document.querySelectorAll('.stats__number[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const start = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * eased);

            element.textContent = current.toLocaleString('pl-PL');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ============ Active nav link on scroll ============
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));

    // ============ Gallery lightbox ============
    const galleryItems = document.querySelectorAll('.gallery__item');

    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox__close" aria-label="Zamknij">&times;</button>
        <img src="" alt="Powiększone zdjęcie">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox__close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ============ Contact form ============
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation
            const name = form.querySelector('#name');
            const phone = form.querySelector('#phone');

            if (!name.value.trim() || !phone.value.trim()) {
                // Shake animation for empty fields
                [name, phone].forEach(input => {
                    if (!input.value.trim()) {
                        input.style.borderColor = '#ef4444';
                        input.style.animation = 'shake 0.4s ease';
                        setTimeout(() => {
                            input.style.borderColor = '';
                            input.style.animation = '';
                        }, 2000);
                    }
                });
                return;
            }

            // Show success message
            success.classList.add('show');

            // Reset form after 3 seconds
            setTimeout(() => {
                success.classList.remove('show');
                form.reset();
            }, 4000);
        });
    }

    // ============ Parallax effect on hero ============
    const heroBg = document.querySelector('.hero__bg');

    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }, { passive: true });
    }

    // ============ Map dot hover tooltips ============
    const dots = document.querySelectorAll('.coverage__dot');
    dots.forEach(dot => {
        const city = dot.getAttribute('data-city');
        if (city) {
            dot.addEventListener('mouseenter', () => {
                dot.style.filter = 'drop-shadow(0 0 10px rgba(37,99,235,0.6))';
            });
            dot.addEventListener('mouseleave', () => {
                dot.style.filter = dot.classList.contains('coverage__dot--main')
                    ? 'drop-shadow(0 0 6px rgba(37,99,235,0.25))'
                    : '';
            });
        }
    });

    // ============ Add shake keyframe ============
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
        }
    `;
    document.head.appendChild(style);
});
