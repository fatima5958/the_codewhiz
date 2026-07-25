/**
 * FRONTEND/SCROLL_REVEAL.JS — Apple-Grade Staggered Scroll Reveal Engine for Aria
 */

class AriaScrollRevealEngine {
    constructor() {
        this.revealEls = [];
        this.observer = null;

        this.initElements();
        this.initObserver();
    }

    initElements() {
        // Target major section components & headers
        const targetSelectors = [
            '.audit-header',
            '.audit-stage-card',
            '.case-study-card',
            '.comparison-card',
            '.roi-card',
            '.final-cta-card',
            '.service-card-editorial',
            '.showcase-card',
            '.moment-glass-card',
            '.project-card',
            '.logos-section',
            '.voice-avatar-stage-wrapper'
        ];

        targetSelectors.forEach(selector => {
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
                el.classList.add('reveal-on-scroll');
            });
        });

        // Apply smooth staggered delays to children inside grid containers
        const gridContainers = document.querySelectorAll('.case-grid, .audit-options-grid, .services-editorial-layout, .comparison-card, .trust-badges-grid');
        gridContainers.forEach(container => {
            const children = container.querySelectorAll('.case-study-card, .audit-opt-btn, .comp-col, .service-card-editorial, .trust-badge');
            children.forEach((child, idx) => {
                child.classList.add('reveal-on-scroll');
                child.style.transitionDelay = `${idx * 0.12}s`;
            });
        });

        this.revealEls = document.querySelectorAll('.reveal-on-scroll');
    }

    initObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older environments
            this.revealEls.forEach(el => el.classList.add('is-revealed'));
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    // Animate strictly ONCE — unobserve immediately
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        this.revealEls.forEach(el => this.observer.observe(el));
        this.initTimelineObserver();
    }

    /**
     * Dynamic How It Works Timeline Scroll Observer
     */
    initTimelineObserver() {
        const processSec = document.getElementById('process');
        const fillBar = document.getElementById('timeline-progress-fill');
        const stepCards = document.querySelectorAll('.how-step-card');

        if (!processSec || !fillBar) return;

        const timelineObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Fill timeline bar
                    fillBar.style.width = '100%';

                    // Stagger active step glow
                    stepCards.forEach((card, idx) => {
                        setTimeout(() => {
                            card.classList.add('is-active');
                        }, idx * 250);
                    });

                    timelineObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        timelineObs.observe(processSec);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaScrollReveal = new AriaScrollRevealEngine();
});
