/* ═══════════════════════════════════════════════════════════════
   PRATISH SHARMA — VEDIC YOGA SQUEEZE PAGE
   JavaScript: Scroll Animations, Carousel, FAQ, Counters, Nav
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── SCROLL ANIMATIONS (Intersection Observer) ───
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger siblings
                const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                const siblingIndex = Array.from(siblings).indexOf(entry.target);
                const delay = siblingIndex * 100;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });


    // ─── STICKY NAVBAR ───
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });


    // ─── MOBILE MENU ───
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


    // ─── ANIMATED COUNTERS ───
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.trust-number');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const trustBar = document.querySelector('.trust-bar');
    if (trustBar) {
        counterObserver.observe(trustBar);
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();
        const startVal = 0;

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + (target - startVal) * ease);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(update);
    }


    // ─── TESTIMONIAL CAROUSEL ───
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let cardsPerView = getCardsPerView();
        let totalSlides = Math.ceil(cards.length / cardsPerView);

        function getCardsPerView() {
            if (window.innerWidth <= 640) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        // Build dots
        function buildDots() {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function goToSlide(index) {
            currentIndex = index;
            const cardWidth = cards[0].offsetWidth + 32; // card width + gap
            const offset = currentIndex * cardsPerView * cardWidth;
            const maxOffset = track.scrollWidth - track.parentElement.offsetWidth;
            track.style.transform = `translateX(-${Math.min(offset, maxOffset)}px)`;
            updateDots();
        }

        function updateDots() {
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(totalSlides - 1);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0);
            }
        });

        // Auto-play carousel
        let autoPlay = setInterval(() => {
            if (currentIndex < totalSlides - 1) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0);
            }
        }, 5000);

        // Pause on hover
        track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
        track.parentElement.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                if (currentIndex < totalSlides - 1) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(0);
                }
            }, 5000);
        });

        // Handle resize
        window.addEventListener('resize', () => {
            cardsPerView = getCardsPerView();
            totalSlides = Math.ceil(cards.length / cardsPerView);
            buildDots();
            goToSlide(0);
        });

        buildDots();
    }


    // ─── FAQ ACCORDION ───
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            // Close all others
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    // ─── SMOOTH SCROLL for anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Skip placeholder links
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ─── PARALLAX EFFECTS (subtle) ───
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;

                // Hero image subtle parallax
                const heroImg = document.querySelector('.hero-img');
                if (heroImg && scrolled < window.innerHeight) {
                    heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

});
