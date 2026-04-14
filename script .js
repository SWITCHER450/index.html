/* ========================================
   CONFIGURATION
   ======================================== */

const CONFIG = {
    whatsappNumber: '260XXXXXXXXX',
    whatsappMessage: 'Hi! I want to join the gym. Can you tell me more about the free trial?',
    spotCount: 15,
    spotUpdateInterval: 10000, // 10 seconds
    countdownDuration: 900, // 15 minutes in seconds
};

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * Scroll to a specific section smoothly
 * @param {string} id - Section ID to scroll to
 */
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Encode text for WhatsApp URL
 * @param {string} text - Text to encode
 * @returns {string} Encoded text
 */
function encodeWhatsAppMessage(text) {
    return encodeURIComponent(text);
}

/**
 * Generate WhatsApp URL
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} message - Message text
 * @returns {string} WhatsApp URL
 */
function generateWhatsAppUrl(phoneNumber, message) {
    return `https://wa.me/${phoneNumber}?text=${encodeWhatsAppMessage(message)}`;
}

/**
 * Open URL in new tab
 * @param {string} url - URL to open
 */
function openUrl(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

/* ========================================
   WHATSAPP INTEGRATION
   ======================================== */

/**
 * Generate smart WhatsApp message based on time of day
 * @returns {string} Message text
 */
function generateSmartMessage() {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good morning! I want to start my fitness journey. Can you tell me about the free trial?";
    } else if (hour < 18) {
        return "Hi! I'm interested in joining the gym. What's the best plan for me?";
    } else {
        return "Hey! I want to join the gym. Can we discuss the free trial tomorrow?";
    }
}

/**
 * Initiate WhatsApp chat with smart message
 */
function whatsappChat() {
    const message = generateSmartMessage();
    const url = generateWhatsAppUrl(CONFIG.whatsappNumber, message);
    openUrl(url);
}

/**
 * Initiate WhatsApp chat with custom message
 * @param {string} customMessage - Custom message to send
 */
function whatsappChatWithMessage(customMessage = null) {
    const message = customMessage || generateSmartMessage();
    const url = generateWhatsAppUrl(CONFIG.whatsappNumber, message);
    openUrl(url);
}

/* ========================================
   LEAD CAPTURE
   ======================================== */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Capture lead from form
 * @param {Event} event - Form submit event
 */
function captureLead(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();

    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Log lead (replace with actual API call)
    console.log('Lead captured:', { email, timestamp: new Date() });

    // Show success message
    showNotification(
        `✅ Check your email! Your free workout plan is on the way to ${email}`,
        'success',
        4000
    );

    // Clear form
    emailInput.value = '';

    // Open WhatsApp after a short delay
    setTimeout(() => {
        whatsappChat();
    }, 1000);
}

/**
 * Capture WhatsApp lead with name
 * @param {string} name - User name
 */
function captureWhatsAppLead(name = null) {
    if (name && name.trim()) {
        const message = `Hi, my name is ${name}. I want the free trial.`;
        whatsappChatWithMessage(message);
    } else {
        whatsappChat();
    }
}

/* ========================================
   NOTIFICATIONS
   ======================================== */

/**
 * Show notification to user
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info'
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: '10000',
        padding: '16px 24px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '600',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        animation: 'slideInRight 0.3s ease-out',
        backdropFilter: 'blur(10px)',
    });

    switch (type) {
        case 'success':
            notification.style.background = '#25d366';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.background = '#FF3D00';
            notification.style.color = 'white';
            break;
        case 'info':
            notification.style.background = '#FFD700';
            notification.style.color = '#0a0a0a';
            break;
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

/* ========================================
   COUNTDOWN TIMER
   ======================================== */

/**
 * Initialize countdown timer (15 minutes)
 */
function initializeCountdownTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;

    let timeLeft = CONFIG.countdownDuration;

    setInterval(() => {
        if (timeLeft <= 0) {
            timeLeft = CONFIG.countdownDuration;
        }

        timeLeft--;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const display = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        timerElement.textContent = display;

        // Pulse animation when time is running out
        if (timeLeft < 60) {
            timerElement.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                timerElement.style.animation = '';
            }, 600);
        }
    }, 1000);
}

/* ========================================
   SPOT COUNTER
   ======================================== */

/**
 * Initialize spot counter animation
 */
function initializeSpotCounter() {
    const spotsUpdateElement = document.getElementById('spots-update');
    const warningSpots = document.getElementById('warning-spots');

    if (!spotsUpdateElement && !warningSpots) return;

    let spots = CONFIG.spotCount;

    setInterval(() => {
        if (spots > 1) {
            spots--;
        } else {
            spots = CONFIG.spotCount;
        }

        if (spotsUpdateElement) {
            spotsUpdateElement.textContent = spots;
            spotsUpdateElement.style.animation = 'pulse 0.6s ease-out';
        }

        if (warningSpots) {
            warningSpots.textContent = spots;
        }

        // Log social proof
        if (Math.random() > 0.7) {
            console.log(`🔥 Someone just joined! ${spots} spots remaining.`);
        }
    }, CONFIG.spotUpdateInterval);
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */

/**
 * Initialize intersection observer for scroll animations
 */
function initializeScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `fadeIn 0.6s ease-out forwards`;
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    const cards = document.querySelectorAll(
        '.service-card, .transformation-card, .testimonial-card, .pricing-card'
    );

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.05}s`;
        observer.observe(card);
    });
}

/* ========================================
   HEADER SCROLL EFFECT
   ======================================== */

/**
 * Initialize header scroll effects
 */
function initializeHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 0) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

/* ========================================
   FORM VALIDATION
   ======================================== */

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    const emailInput = document.getElementById('email');

    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !isValidEmail(email)) {
            emailInput.style.borderColor = '#FF3D00';
            emailInput.style.boxShadow = '0 0 0 3px rgba(255, 61, 0, 0.1)';
        } else {
            emailInput.style.borderColor = '';
            emailInput.style.boxShadow = '';
        }
    });

    emailInput.addEventListener('focus', () => {
        emailInput.style.borderColor = '';
        emailInput.style.boxShadow = '';
    });
}

/* ========================================
   EXIT INTENT POPUP
   ======================================== */

/**
 * Initialize exit intent popup
 */
function initializeExitIntent() {
    let triggered = false;

    document.addEventListener('mouseout', (e) => {
        if (e.clientY < 10 && !triggered) {
            triggered = true;
            showNotification(
                '⏰ WAIT! Claim your FREE 3-day trial before you go!',
                'info',
                5000
            );
        }
    });

    // Reset after 30 seconds to allow triggering again
    setInterval(() => {
        triggered = false;
    }, 30000);
}

/* ========================================
   ACCESSIBILITY
   ======================================== */

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#services';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #FF3D00;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach((n) => n.remove());
        }
    });
}

/* ========================================
   ANALYTICS TRACKING
   ======================================== */

/**
 * Track user events
 * @param {string} eventName - Event name
 * @param {object} eventData - Event data
 */
function trackEvent(eventName, eventData = {}) {
    console.log(`📊 Event: ${eventName}`, eventData);

    // Send to Google Analytics if available
    if (window.gtag) {
        window.gtag('event', eventName, eventData);
    }
}

/**
 * Initialize click tracking
 */
function initializeClickTracking() {
    // Track button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            trackEvent('button_click', {
                text: button.textContent.trim(),
                type: button.className,
            });
        });
    });

    // Track WhatsApp clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.whatsapp-float')) {
            trackEvent('whatsapp_click');
        }
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (currentScroll > maxScroll) {
            maxScroll = currentScroll;
            if (Math.floor(maxScroll) % 25 === 0) {
                trackEvent('scroll_depth', { percentage: Math.floor(maxScroll) });
            }
        }
    });
}

/* ========================================
   DOM READY / INITIALIZATION
   ======================================== */

/**
 * Initialize all features when DOM is ready
 */
function initializePage() {
    console.log('🚀 Initializing ELITE FITNESS website...');

    initializeCountdownTimer();
    initializeSpotCounter();
    initializeScrollAnimations();
    initializeHeaderScroll();
    initializeFormValidation();
    initializeExitIntent();
    initializeAccessibility();
    initializeClickTracking();

    console.log('✅ Website initialized successfully!');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

/* ========================================
   PERFORMANCE OPTIMIZATION
   ======================================== */

/**
 * Preload critical images
 */
function preloadResources() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1566626171429-22eed5eaf97f?w=300&h=350&fit=crop',
    ];

    criticalImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Preload when page is idle
if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadResources);
} else {
    setTimeout(preloadResources, 2000);
}

/* ========================================
   ERROR HANDLING
   ======================================== */

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('❌ Error occurred:', event.error);
    // In production, send to error tracking service
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
    // In production, send to error tracking service
});

/* ========================================
   EXPORTS (for testing)
   ======================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        whatsappChat,
        whatsappChatWithMessage,
        captureLead,
        captureWhatsAppLead,
        isValidEmail,
        showNotification,
        trackEvent,
    };
}
