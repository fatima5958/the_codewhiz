/**
 * FRONTEND/NAVBAR.JS — Apple-Grade Luxury Navbar Engine for Aria
 */

class AriaNavbarEngine {
    constructor() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = [];
        this.lastScrollY = window.scrollY;
        this.ticking = false;

        this.initSections();
        this.bindScrollObserver();
        this.initActiveSectionObserver();
    }

    initSections() {
        const ids = ['hero', 'services', 'audit', 'cases', 'comparison', 'roi-calculator', 'final-cta'];
        this.sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    }

    bindScrollObserver() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.onScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });

        this.onScroll();
    }

    onScroll() {
        const currentScrollY = window.scrollY;

        if (!this.header) return;

        // 1. Transparent on top, Glass Blur while scrolling
        if (currentScrollY <= 20) {
            this.header.classList.add('is-top');
            this.header.classList.remove('is-scrolled', 'is-hidden');
        } else {
            this.header.classList.remove('is-top');
            this.header.classList.add('is-scrolled');

            // 2. Smooth Hide on scroll down, Show on scroll up
            if (currentScrollY > 150 && currentScrollY > this.lastScrollY + 5) {
                this.header.classList.add('is-hidden');
            } else if (currentScrollY < this.lastScrollY - 5) {
                this.header.classList.remove('is-hidden');
            }
        }

        this.lastScrollY = currentScrollY;
    }

    /**
     * Active Section Link Indicator Observer
     */
    initActiveSectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('is-active');
                        } else {
                            link.classList.remove('is-active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        this.sections.forEach(sec => observer.observe(sec));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaNavbar = new AriaNavbarEngine();
});
