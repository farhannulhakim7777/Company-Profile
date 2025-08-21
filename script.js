// ===== MODERN JAVASCRIPT WITH ES6+ FEATURES =====

// ===== DOM ELEMENTS =====
const elements = {
    formContact: document.getElementById('formContact'),
    menuToggle: document.getElementById('menu-toggle'),
    navLinks: document.getElementById('nav-links'),
    backdrop: document.getElementById('backdrop'),
    navbar: document.querySelector('.navbar'),
    animatedItems: document.querySelectorAll('.animated-item')
};

// Calculate scrollbar width to prevent layout shift when locking body scroll
const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;
const supportsScrollbarGutter = () => !!(window.CSS && CSS.supports && CSS.supports('scrollbar-gutter: stable'));

// ===== CONTACT FORM HANDLER =====
const handleContactForm = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const nama = formData.get('contactNama') || document.getElementById('contactNama').value;
    const email = formData.get('contactEmail') || document.getElementById('contactEmail').value;
    const pesan = formData.get('contactPesan') || document.getElementById('contactPesan').value;
    
    // WhatsApp integration
    const message = `Halo Admin,%0ASaya ingin menghubungi Anda:%0ANama: ${nama}%0AEmail: ${email}%0APesan: ${pesan}`;
    const adminPhone = '628380635439';
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    e.target.reset();
    
    // Show success message (optional)
    showNotification('Pesan berhasil dikirim!', 'success');
};

// ===== ENHANCED MOBILE NAVIGATION =====
const toggleMobileMenu = () => {
    const isOpen = elements.navLinks.classList.contains('show');
    
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
};

const openMobileMenu = () => {
    elements.navLinks.classList.add('show');
    elements.backdrop.classList.add('show');
    elements.menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!supportsScrollbarGutter()) {
        const scrollbarWidth = getScrollbarWidth();
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
    }
    elements.menuToggle.setAttribute('aria-expanded', 'true');
};

const closeMobileMenu = () => {
    elements.navLinks.classList.remove('show');
    elements.backdrop.classList.remove('show');
    elements.menuToggle.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '';
    elements.menuToggle.setAttribute('aria-expanded', 'false');
};

// ===== NAVBAR SCROLL EFFECT =====
const handleNavbarScroll = () => {
    const scrolled = window.scrollY > 50;
    elements.navbar.classList.toggle('scrolled', scrolled);
};

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const createIntersectionObserver = () => {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, options);
    
    return observer;
};

// ===== NOTIFICATION SYSTEM =====
const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#10b981' : '#3b82f6'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};

// ===== ENHANCED SMOOTH SCROLL =====
const handleSmoothScroll = (e) => {
    e.preventDefault();
    const targetLink = (e.target && e.target.closest) ? e.target.closest('a') : null;
    const href = targetLink ? targetLink.getAttribute('href') : null;
    
    if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        
        if (target) {
            // Close mobile menu first
            const wasMobileMenuOpen = elements.navLinks.classList.contains('show');
            closeMobileMenu();

            const doScroll = () => {
                const navbarHeight = elements.navbar.offsetHeight;
                const targetPosition = Math.max(0, target.offsetTop - navbarHeight - 20);
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            };

            // Delay scroll slightly on mobile to avoid being blocked by overflow lock/transition
            if (wasMobileMenuOpen && window.matchMedia('(max-width: 767px)').matches) {
                setTimeout(doScroll, 320);
            } else {
                doScroll();
            }
            
            // Add active state to current section
            updateActiveNavigation(href);
        }
    }
};

// ===== ACTIVE NAVIGATION STATE =====
const updateActiveNavigation = (currentSection) => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
};

// ===== ENHANCED EVENT LISTENERS =====
const initializeEventListeners = () => {
    // Contact form
    if (elements.formContact) {
        elements.formContact.addEventListener('submit', handleContactForm);
    }
    
    // Mobile menu toggle
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', toggleMobileMenu);
        elements.menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        elements.menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Backdrop click
    if (elements.backdrop) {
        elements.backdrop.addEventListener('click', closeMobileMenu);
    }
    
    // Navigation links - use event delegation for robustness on mobile
    if (elements.navLinks) {
        elements.navLinks.removeEventListener('click', handleSmoothScroll);
        elements.navLinks.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            handleSmoothScroll(e);
        }, false);
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });
    
    // Add scroll spy for active navigation
    window.addEventListener('scroll', handleScrollSpy);
};

// (Removed) Dedicated touch handler to avoid blocking native clicks

// ===== SCROLL SPY FOR ACTIVE NAVIGATION =====
const handleScrollSpy = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    const navbarHeight = elements.navbar.offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};

// ===== ENHANCED INITIALIZATION =====
const initializeApp = () => {
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize intersection observer for animations
    const observer = createIntersectionObserver();
    elements.animatedItems.forEach(item => observer.observe(item));
    
    // Add loading class to body
    document.body.classList.add('loaded');
    
    // Set initial active navigation
    updateActiveNavigation('#home');
    
    console.log('App initialized successfully');
};

// ===== PERFORMANCE OPTIMIZATION =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimize scroll handlers
const optimizedScrollHandler = debounce(handleNavbarScroll, 10);
const optimizedScrollSpyHandler = debounce(handleScrollSpy, 100);

window.addEventListener('scroll', optimizedScrollHandler);
window.addEventListener('scroll', optimizedScrollSpyHandler);

// ===== INITIALIZE WHEN DOM IS READY =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ===== EXPORT FOR MODULE SYSTEMS (OPTIONAL) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        handleContactForm,
        toggleMobileMenu
    };
}