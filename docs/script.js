document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        // Animate hamburger to X
        const bars = mobileBtn.querySelectorAll('.bar');
        if (nav.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                const bars = mobileBtn.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });

    // Smooth Scrolling for anchor links (polyfill support)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Sticky Nav Horizontal Scroll Arrows
    const navScrollContainer = document.querySelector('.nav-scroll-container');
    const leftArrow = document.querySelector('.nav-arrow-left');
    const rightArrow = document.querySelector('.nav-arrow-right');

    if (navScrollContainer && leftArrow && rightArrow) {
        const scrollAmount = 200; // pixels to scroll on each click

        // Function to update arrow visibility
        function updateArrowVisibility() {
            const scrollLeft = navScrollContainer.scrollLeft;
            const maxScroll = navScrollContainer.scrollWidth - navScrollContainer.clientWidth;

            // Hide left arrow if at the start
            if (scrollLeft <= 0) {
                leftArrow.classList.add('hidden');
            } else {
                leftArrow.classList.remove('hidden');
            }

            // Hide right arrow if at the end
            if (scrollLeft >= maxScroll - 1) {
                rightArrow.classList.add('hidden');
            } else {
                rightArrow.classList.remove('hidden');
            }
        }

        // Scroll left
        leftArrow.addEventListener('click', () => {
            navScrollContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Scroll right
        rightArrow.addEventListener('click', () => {
            navScrollContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update arrow visibility on scroll
        navScrollContainer.addEventListener('scroll', updateArrowVisibility);

        // Initial check
        updateArrowVisibility();

        // Update on window resize
        window.addEventListener('resize', updateArrowVisibility);
    }

    // Fade-in animation on scroll using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.service-card, .value-card, .about-content, .hero-content');

    // Add initial styles via JS to keep CSS clean if JS is disabled
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-up {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        .service-card, .value-card, .about-content, .hero-content {
            opacity: 0;
            transform: translateY(20px);
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    animatedElements.forEach(el => observer.observe(el));
});
