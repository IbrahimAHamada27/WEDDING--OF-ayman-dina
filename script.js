document.addEventListener('DOMContentLoaded', () => {
    // 0. Envelope Animation Logic
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');

    if (envelopeWrapper && envelopeOverlay) {
        // Lock body scrolling initially
        document.body.classList.add('locked');

        const handleEnvelopeOpen = () => {
            // Open envelope flap
            envelopeWrapper.classList.add('is-open');
            
            // Wait for flap to open (0.8s) then fade out overlay
            setTimeout(() => {
                envelopeOverlay.classList.add('hidden');
                
                // Allow scrolling again
                document.body.classList.remove('locked');
                
                // Remove from DOM after fade out transition
                setTimeout(() => {
                    envelopeOverlay.style.display = 'none';
                }, 1000);
            }, 600);
        };

        // Open when clicking anywhere on the wrapper/overlay
        envelopeWrapper.addEventListener('click', handleEnvelopeOpen);
    }

    // 1. Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50
    });

    // 2. Language Switcher
    const langToggleBtn = document.getElementById('langToggle');
    const htmlElement = document.documentElement;
    const translatableElements = document.querySelectorAll('[data-en]');
    const translatableInputs = document.querySelectorAll('[data-placeholder-en]');

    // Retrieve saved language from localStorage, default to English ('en')
    let currentLang = localStorage.getItem('wedding_lang') || 'en';
    
    function updateLanguage(lang) {
        if (lang === 'ar') {
            htmlElement.setAttribute('dir', 'rtl');
            htmlElement.setAttribute('lang', 'ar');
        } else {
            htmlElement.setAttribute('dir', 'ltr');
            htmlElement.setAttribute('lang', 'en');
        }

        // Update text content
        translatableElements.forEach(el => {
            if (el.tagName === 'INPUT' && el.type === 'submit') {
                el.value = el.getAttribute(`data-${lang}`);
            } else {
                el.innerHTML = el.getAttribute(`data-${lang}`);
            }
        });

        // Update placeholders
        translatableInputs.forEach(input => {
            input.setAttribute('placeholder', input.getAttribute(`data-placeholder-${lang}`));
        });
    }

    // Apply language on initial load
    updateLanguage(currentLang);

    // Handle toggle click
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('wedding_lang', currentLang);
        updateLanguage(currentLang);
    });

    // 2.5 Countdown Timer
    const targetDate = new Date('July 26, 2026 18:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 3. Floating Rose Petals
    const petalsContainer = document.getElementById('petals-container');
    const MAX_PETALS = 20;

    function createPetal() {
        if (document.querySelectorAll('.petal').length > MAX_PETALS) return;

        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Randomize starting position, size, and duration
        const startX = Math.random() * window.innerWidth;
        const size = Math.random() * 10 + 10; // 10px to 20px
        const duration = Math.random() * 5 + 5; // 5s to 10s
        const delay = Math.random() * 2;

        petal.style.left = `${startX}px`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${delay}s`;

        petalsContainer.appendChild(petal);

        // Remove petal after animation to prevent DOM bloat
        setTimeout(() => {
            petal.remove();
        }, (duration + delay) * 1000);
    }

    // Continuously create petals
    setInterval(createPetal, 800);
    
    // Initial batch
    for(let i=0; i<5; i++) {
        setTimeout(createPetal, i * 500);
    }
});
