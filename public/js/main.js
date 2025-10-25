document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider Configuration
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Slide data
    const slideData = [
        {
            title: 'PERSONALIZE AND CUSTOMIZE',
            subtitle: 'Creating extraordinary architectural experiences'
        },
        {
            title: 'INNOVATIVE DESIGN',
            subtitle: 'Pushing boundaries in modern architecture'
        },
        {
            title: 'SUSTAINABLE ARCHITECTURE',
            subtitle: 'Building for a better tomorrow'
        },
        {
            title: 'LUXURY LIVING SPACES',
            subtitle: 'Where elegance meets functionality'
        }
    ];

    // Initialize slider
    function initSlider() {
        // Set background images
        slides.forEach((slide, index) => {
            const bgImage = slide.getAttribute('data-bg');
            slide.style.backgroundImage = `url(${bgImage})`;
        });
        
        // Start autoplay
        startAutoplay();
    }

    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Update text content with animation
        updateSlideText(index);
        
        currentSlide = index;
    }

    // Update slide text with fade animation
    function updateSlideText(index) {
        const data = slideData[index];
        
        // Fade out
        heroTitle.style.opacity = '0';
        heroSubtitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroSubtitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroTitle.textContent = data.title;
            heroSubtitle.textContent = data.subtitle;
            
            // Fade in
            heroTitle.style.opacity = '1';
            heroSubtitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 300);
    }

    // Next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Start autoplay
    function startAutoplay() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Stop autoplay
    function stopAutoplay() {
        clearInterval(slideInterval);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoplay();
            nextSlide();
            setTimeout(startAutoplay, 10000); // Restart after 10 seconds
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoplay();
            prevSlide();
            setTimeout(startAutoplay, 10000); // Restart after 10 seconds
        });
    }

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoplay();
            showSlide(index);
            setTimeout(startAutoplay, 10000); // Restart after 10 seconds
        });
    });

    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoplay);
        heroSection.addEventListener('mouseleave', startAutoplay);
    }

    // Initialize the slider
    initSlider();

    // Menu toggle (resto del codice esistente)
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }

    // Smooth scrolling
    const ctaLink = document.getElementById('ctaLink');
    if (ctaLink) {
        ctaLink.addEventListener('click', function(e) {
            e.preventDefault();
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Load projects
    loadProjects();

    async function loadProjects() {
        try {
            const response = await fetch('/api/projects');
            const projects = await response.json();
            const projectsGrid = document.getElementById('projectsGrid');
            
            if (projectsGrid) {
                projects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    projectCard.innerHTML = `
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    `;
                    
                    projectCard.addEventListener('click', function() {
                        window.location.href = `/project/${project.id}`;
                    });
                    
                    projectsGrid.appendChild(projectCard);
                });
            }
        } catch (error) {
            console.error('Errore nel caricamento dei progetti:', error);
        }
    }

    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(44, 44, 44, 0.95)';
            } else {
                header.style.background = 'transparent';
            }
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.about, .projects').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
});
