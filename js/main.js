// Visitor Tracking and Analytics
class VisitorTracker {
    constructor() {
        this.visitorCount = 0;
        this.lastVisit = null;
        this.init();
    }

    init() {
        this.loadVisitorData();
        this.incrementVisitorCount();
        this.updateLastVisit();
        this.saveVisitorData();
        this.updateDisplay();
    }

    loadVisitorData() {
        const savedCount = localStorage.getItem('visitorCount');
        const savedLastVisit = localStorage.getItem('lastVisit');
        
        if (savedCount) {
            this.visitorCount = parseInt(savedCount);
        }
        
        if (savedLastVisit) {
            this.lastVisit = new Date(savedLastVisit);
        }
    }

    incrementVisitorCount() {
        this.visitorCount++;
    }

    updateLastVisit() {
        this.lastVisit = new Date();
    }

    saveVisitorData() {
        localStorage.setItem('visitorCount', this.visitorCount.toString());
        localStorage.setItem('lastVisit', this.lastVisit.toISOString());
    }

    updateDisplay() {
        const visitorCountElement = document.getElementById('visitor-count');
        const footerVisitorCountElement = document.getElementById('footer-visitor-count');
        const lastVisitElement = document.getElementById('last-visit');

        if (visitorCountElement) {
            visitorCountElement.textContent = this.visitorCount;
        }
        
        if (footerVisitorCountElement) {
            footerVisitorCountElement.textContent = this.visitorCount;
        }

        if (lastVisitElement && this.lastVisit) {
            const now = new Date();
            const timeDiff = now - this.lastVisit;
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 0) {
                lastVisitElement.textContent = 'Today';
            } else if (daysDiff === 1) {
                lastVisitElement.textContent = 'Yesterday';
            } else {
                lastVisitElement.textContent = `${daysDiff} days ago`;
            }
        }
    }
}

// Cookie Management
class CookieManager {
    constructor() {
        this.cookieConsent = false;
        this.init();
    }

    init() {
        this.checkCookieConsent();
        if (!this.cookieConsent) {
            this.showCookieBanner();
        }
    }

    checkCookieConsent() {
        this.cookieConsent = localStorage.getItem('cookieConsent') === 'true';
    }

    showCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>This website uses cookies to enhance your experience and track visitor statistics. 
                By continuing to use this site, you consent to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button onclick="cookieManager.acceptCookies()" class="btn btn-primary">Accept</button>
                    <button onclick="cookieManager.declineCookies()" class="btn btn-secondary">Decline</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
    }

    acceptCookies() {
        localStorage.setItem('cookieConsent', 'true');
        this.cookieConsent = true;
        this.hideCookieBanner();
    }

    declineCookies() {
        localStorage.setItem('cookieConsent', 'false');
        this.cookieConsent = false;
        this.hideCookieBanner();
    }

    hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.remove();
        }
    }
}

// Smooth Scrolling and Active Nav Link
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Adjust scroll position to account for fixed header height
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Nav Toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('nav--visible');
        navToggle.classList.toggle('nav-open');
    });

    // Close mobile nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav--visible')) {
                nav.classList.remove('nav--visible');
                navToggle.classList.remove('nav-open');
            }
        });
    });
}

// Skill Card Interactions
function openSkillLink(url) {
    if (cookieManager.cookieConsent) {
        // Track skill clicks
        const skillClicks = JSON.parse(localStorage.getItem('skillClicks') || '{}');
        const skillName = url.split('/').pop() || 'unknown';
        skillClicks[skillName] = (skillClicks[skillName] || 0) + 1;
        localStorage.setItem('skillClicks', JSON.stringify(skillClicks));
    }
    
    window.open(url, '_blank');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add notification styles
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }
        
        .notification-success {
            background: #28a745;
        }
        
        .notification-error {
            background: #dc3545;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        #cookie-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #333;
            color: white;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
        }
        
        .cookie-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
        }
        
        .cookie-buttons {
            display: flex;
            gap: 10px;
        }
        
        @media (max-width: 768px) {
            .cookie-content {
                flex-direction: column;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Add scroll animation styles
function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .skill-card, .project-card, .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .skill-card.animate-in, .project-card.animate-in, .contact-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Header scroll effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header-main');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loading...');
    
    // Initialize all features
    const visitorTracker = new VisitorTracker();
    const cookieManager = new CookieManager();
    
    // Make cookieManager globally accessible
    window.cookieManager = cookieManager;
    
    // Initialize other features
    initScrollAnimations();
    initHeaderScrollEffect();
    
    // Add styles
    addNotificationStyles();
    addScrollAnimationStyles();
    
    // Add header transition
    const header = document.querySelector('.header-main');
    if (header) {
        header.style.transition = 'transform 0.3s ease';
    }
    
    // Debug: Check if image exists
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        console.log('Profile image found:', profileImage.src);
        profileImage.addEventListener('load', function() {
            console.log('Profile image loaded successfully');
        });
        profileImage.addEventListener('error', function() {
            console.error('Profile image failed to load:', this.src);
        });
    } else {
        console.error('Profile image element not found');
    }
    
    // Debug: Check navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    console.log('Navigation links found:', navLinks.length);
    navLinks.forEach(link => {
        console.log('Nav link:', link.href, link.textContent);
    });
    
    console.log('Portfolio loaded successfully!');
    console.log(`Total visitors: ${visitorTracker.visitorCount}`);
});

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading after DOM is loaded
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Cookie Consent
const cookieBanner = document.getElementById('cookie-consent-banner');
const cookieAcceptButton = document.getElementById('cookie-consent-button');

if (cookieBanner && cookieAcceptButton) {
    if (!localStorage.getItem('cookie_consent')) {
        cookieBanner.style.display = 'block';
    }

    cookieAcceptButton.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'true');
        cookieBanner.style.display = 'none';
    });
}

// Visitor Counter and Last Visit
function updateVisitorInfo() {
    let count = localStorage.getItem('visitor_count');
    count = count ? parseInt(count) : 0;
    
    if (document.visibilityState === 'visible') {
        const now = new Date();
        const lastVisit = localStorage.getItem('last_visit');
        
        if (!lastVisit) {
            count++;
        } else {
            const lastVisitDate = new Date(lastVisit);
            const timeDiff = now.getTime() - lastVisitDate.getTime();
            if (timeDiff > 24 * 60 * 60 * 1000) { // 24 hours
                count++;
            }
        }

        localStorage.setItem('visitor_count', count);
        localStorage.setItem('last_visit', now.toISOString());
    }

    const visitorCountElement = document.getElementById('visitor-count');
    if (visitorCountElement) {
        visitorCountElement.textContent = count;
    }

    const footerVisitorCount = document.getElementById('footer-visitor-count');
    if (footerVisitorCount) {
        footerVisitorCount.textContent = count;
    }

    const lastVisitElement = document.getElementById('last-visit');
    if (lastVisitElement) {
        const lastVisit = localStorage.getItem('last_visit');
        lastVisitElement.textContent = lastVisit ? new Date(lastVisit).toLocaleString() : 'Never';
    }
}

updateVisitorInfo();
document.addEventListener('visibilitychange', updateVisitorInfo);
