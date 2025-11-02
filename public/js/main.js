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
    

    // Initialize slider
    async function initSlider() {
        const response = await fetch('/api/slideData');
        slideData = await response.json();
       
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
    // Cancella l'intervallo precedente se esiste
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null; // Resetta il riferimento
    }
}

    // Event listeners
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        startAutoplay();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        startAutoplay();
    });
}

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        stopAutoplay();
        showSlide(index);
        startAutoplay();
    });
});

    // Pause on hover
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
        if (slideInterval) stopAutoplay();
    });
    
    heroSection.addEventListener('mouseleave', () => {
        if (!slideInterval) startAutoplay();
    });
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
            const projectsSection = document.getElementById('portfolio');
            if (projectsSection) {
                projectsSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    let allProjects = [];
    let currentPage = 1;
    const projectsPerPage = 6;

    // Load projects
    loadProjects();

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            displayProjects(currentPage);
            updateLoadMoreButton();
            
            // Smooth scroll verso i nuovi progetti
            setTimeout(() => {
                const portfolioGrid = document.getElementById('portfolioGrid');
                const newItems = portfolioGrid.querySelectorAll('.portfolio-item');
                const lastOldItem = newItems[newItems.length - projectsPerPage - 1];
                
                if (lastOldItem) {
                    lastOldItem.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }
            }, 100);
        });
    }
    async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        allProjects = await response.json();
        
        // Mostra i primi 6 progetti
        displayProjects(currentPage);
        
        // Mostra il pulsante Load More se ci sono più di 6 progetti
        updateLoadMoreButton();
        
    } catch (error) {
        console.error('Errore nel caricamento del portfolio:', error);
    }
}

// Visualizza progetti per la pagina corrente
function displayProjects(page) {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;
    
    const startIndex = (page - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const projectsToShow = allProjects.slice(startIndex, endIndex);
    
    projectsToShow.forEach(project => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.style.opacity = '0';
        portfolioItem.style.transform = 'translateY(30px)';
        
        portfolioItem.innerHTML = `
            <div class="portfolio-image">
                <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
                <div class="portfolio-overlay">
                    <div class="portfolio-info">
                        <h3>${project.title}</h3>
                    </div>
                </div>
            </div>
        `;
        
        portfolioItem.addEventListener('click', function() {
            openProjectModal(project.id);
        });
        
        portfolioGrid.appendChild(portfolioItem);
        
        // Animazione di entrata
        setTimeout(() => {
            portfolioItem.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            portfolioItem.style.opacity = '1';
            portfolioItem.style.transform = 'translateY(0)';
        }, 50);
    });
}

// Project Modal System
let currentProject = null;
let currentImageIndex = 0;

// Apri modal progetto
function openProjectModal(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    currentProject = project;
    currentImageIndex = 0;
    
    // Popola modal con i dati del progetto
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectDescription').textContent = project.fullDescription || project.description;
    document.getElementById('projectLocation').textContent = project.location || '—';
    document.getElementById('projectYear').textContent = project.data || '—';    

    document.getElementById('projectType').textContent = project.type || '—';    
    document.getElementById('projectCollab').textContent = project.collaboration || '—';    
    document.getElementById('projectStatus').textContent = project.status || '—';    
    // Imposta immagini
    updateModalImage();
    
    // Mostra modal
    const modal = document.getElementById('projectModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Aggiorna immagine nel modal
function updateModalImage() {
    if (!currentProject || !currentProject.images) return;
    
    const mainImage = document.getElementById('mainImage');
    const currentIndexEl = document.getElementById('currentImageIndex');
    const totalImagesEl = document.getElementById('totalImages');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    
    // Aggiorna immagine
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.src = currentProject.images[currentImageIndex];
        mainImage.alt = `${currentProject.title} - Image ${currentImageIndex + 1}`;
        mainImage.style.opacity = '1';
    }, 200);
    
    // Aggiorna counter
    currentIndexEl.textContent = currentImageIndex + 1;
    totalImagesEl.textContent = currentProject.images.length;
    
    // Gestisci pulsanti
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === currentProject.images.length - 1;
}

// Chiudi modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentProject = null;
    currentImageIndex = 0;
}

// Naviga immagini
function navigateGallery(direction) {
    if (!currentProject || !currentProject.images) return;
    
    if (direction === 'next' && currentImageIndex < currentProject.images.length - 1) {
        currentImageIndex++;
    } else if (direction === 'prev' && currentImageIndex > 0) {
        currentImageIndex--;
    }
    
    updateModalImage();
}

// Expand/fullscreen
function toggleFullscreen() {
    const modal = document.getElementById('projectModal');
    
    if (!document.fullscreenElement) {
        modal.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Aggiorna il pulsante Load More
function updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const projectsCount = document.getElementById('projectsCount');
    
    if (!loadMoreContainer) return;
    
    const totalProjects = allProjects.length;
    const shownProjects = currentPage * projectsPerPage;
    
    // Mostra il pulsante se ci sono ancora progetti da caricare
    if (shownProjects < totalProjects) {
        loadMoreContainer.style.display = 'block';
        const remainingProjects = totalProjects - shownProjects;
        projectsCount.textContent = `${shownProjects} di ${totalProjects}`;
    } else {
        // Nascondi il pulsante quando tutti i progetti sono visibili
        loadMoreContainer.style.display = 'none';
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

        // Modal close
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }
    
    // Modal expand
    const modalExpand = document.getElementById('modalExpand');
    if (modalExpand) {
        modalExpand.addEventListener('click', toggleFullscreen);
    }
    
    // Gallery navigation
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    
    if (galleryPrev) {
        galleryPrev.addEventListener('click', () => navigateGallery('prev'));
    }
    
    if (galleryNext) {
        galleryNext.addEventListener('click', () => navigateGallery('next'));
    }
    
    // Close modal con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
        } else if (e.key === 'ArrowLeft' && currentProject) {
            navigateGallery('prev');
        } else if (e.key === 'ArrowRight' && currentProject) {
            navigateGallery('next');
        }
    });
    
    // Close modal cliccando fuori
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
    }

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        privacy: document.getElementById('privacy').checked
    };
    
    // Mostra loader
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'INVIO IN CORSO...';
    
    try {
        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (response.ok) {
            showDialog('Messaggio inviato con successo!', 'success');
            document.getElementById('contactForm').reset();
        } else {
            showDialog('Errore: ' + result.error, 'error');
        }
    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        showDialog('Errore durante l\'invio del messaggio', 'error');
        console.error(error);
    }
});

function showDialog(message, type) {
    const dialog = document.createElement('div');
    dialog.className = `custom-dialog ${type}`;
    dialog.innerHTML = `
        <div class="custom-dialog-content">
            <p>${message}</p>
            <button class="dialog-btn">OK</button>
        </div>
    `;
    document.body.appendChild(dialog);
    
    // Event listener sul bottone
    dialog.querySelector('.dialog-btn').addEventListener('click', () => {
        dialog.remove();
    });
    
    // Chiudi anche cliccando sullo sfondo
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.remove();
        }
    });
    
    // Auto-chiudi dopo 5 secondi
    setTimeout(() => {
        if (dialog.parentElement) {
            dialog.remove();
        }
    }, 5000);
}
});


