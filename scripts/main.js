// Main JavaScript for Portfolio Website - UPDATED WITH WORKING FORMS

// DOM Content Loaded - SINGLE EVENT LISTENER
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSmoothScroll();
    initializeSkillBars();
    initializeMobileMenu();
    initializeScrollAnimations();
    loadGitHubProjects();
    initializeContactForm();
    initializeImageGallery();
    initializeTestimonialsCarousel();
});

// Theme Toggle Functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Smooth Scroll Functionality
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu) navMenu.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target;
                const level = skillLevel.getAttribute('data-level');
                skillLevel.style.width = level + '%';
                observer.unobserve(skillLevel);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Image Gallery Functionality
function initializeImageGallery() {
    const gallery = document.querySelector('.image-gallery');
    if (!gallery) return;

    const items = gallery.querySelectorAll('.gallery-item');
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    let currentIndex = 0;

    function showSlide(index) {
        items.forEach(item => item.classList.remove('active'));
        items[index].classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        let nextIndex = (currentIndex + 1) % items.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = (currentIndex - 1 + items.length) % items.length;
        showSlide(prevIndex);
    }

    // Auto-rotate every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    gallery.addEventListener('mouseenter', () => clearInterval(slideInterval));
    gallery.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Button controls
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// SIMPLE CONTACT FORM HANDLER - WORKS WITH FORMPREE
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simple fetch to Formspree
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('❌ Failed to send message. Please email me directly at abdikumsa197@gmail.com', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// GitHub API Integration
async function loadGitHubProjects() {
    const githubContainer = document.getElementById('githubProjects');
    
    if (!githubContainer) return;
    
    const username = 'abdi-kumsa';
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('GitHub API limit exceeded or user not found');
        }
        
        const repos = await response.json();
        
        // Clear loading state
        githubContainer.innerHTML = '';
        githubContainer.classList.remove('loading');
        
        // Add GitHub projects to grid
        repos.forEach(repo => {
            if (!repo.fork) {
                const projectCard = createProjectCard(repo);
                githubContainer.appendChild(projectCard);
            }
        });
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        githubContainer.innerHTML = `
            <div class="project-content">
                <h3>GitHub Projects</h3>
                <p>Unable to load projects from GitHub. <a href="https://github.com/${username}" target="_blank">Visit my GitHub</a></p>
            </div>
        `;
        githubContainer.classList.remove('loading');
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
        <div class="project-content">
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description available.'}</p>
            <div class="project-tech">
                ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
                <span class="tech-tag">${repo.stargazers_count} ⭐</span>
            </div>
            <div style="margin-top: 1rem;">
                <a href="${repo.html_url}" target="_blank" class="btn btn-secondary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                    View on GitHub
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Scroll Animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .education-card, .experience-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            if (document.body.classList.contains('dark-mode')) {
                navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            }
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            if (document.body.classList.contains('dark-mode')) {
                navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            }
        }
    }
});

// Testimonials Carousel Functionality
function initializeTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;

    const cards = carousel.querySelectorAll('.testimonial-card');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    let currentIndex = 0;
    const totalCards = cards.length;

    function showCard(index) {
        // Hide all cards
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current card
        cards[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentIndex = index;
        
        // Update button states
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === totalCards - 1;
    }

    function nextCard() {
        const nextIndex = (currentIndex + 1) % totalCards;
        showCard(nextIndex);
    }

    function prevCard() {
        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
        showCard(prevIndex);
    }

    // Auto-rotate every 8 seconds
    let autoRotate = setInterval(nextCard, 8000);

    // Pause auto-rotate on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
    carousel.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextCard, 8000);
    });

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextCard);
    if (prevBtn) prevBtn.addEventListener('click', prevCard);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showCard(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevCard();
        if (e.key === 'ArrowRight') nextCard();
    });

    // Initialize first card
    showCard(0);
}

// Tab Functionality
function openTab(evt, tabName) {
    // 1. Hide all tab content
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    // 2. Deactivate all buttons
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    // 3. Show the clicked tab and activate the button
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}