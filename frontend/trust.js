/**
 * FRONTEND/TRUST.JS — Interactive ROI Calculator, Animated Counters, Marquee & Social Proof Controller
 */

class TrustAndSocialProof {
    constructor() {
        this.initDOMElements();
        this.bindEvents();
        this.initAnimatedCounters();
        this.updateROICalculations();
    }

    initDOMElements() {
        // ROI Calculator Elements
        this.sliderEmployees = document.getElementById('roi-emp-slider');
        this.sliderHours = document.getElementById('roi-hrs-slider');
        this.sliderCost = document.getElementById('roi-cost-slider');

        this.valEmployees = document.getElementById('roi-emp-val');
        this.valHours = document.getElementById('roi-hrs-val');
        this.valCost = document.getElementById('roi-cost-val');

        this.resSavings = document.getElementById('roi-res-savings');
        this.resHours = document.getElementById('roi-res-hours');
        this.resROI = document.getElementById('roi-res-roi');

        // CTA Buttons
        this.btnFinalBook = document.getElementById('btn-final-book-call');
        this.btnFinalDemo = document.getElementById('btn-final-watch-demo');
    }

    bindEvents() {
        // ROI Calculator Input Events
        const sliders = [this.sliderEmployees, this.sliderHours, this.sliderCost];
        sliders.forEach(slider => {
            if (slider) {
                slider.addEventListener('input', () => {
                    this.updateROICalculations();
                });
            }
        });

        // Final CTA Navigation
        if (this.btnFinalBook) {
            this.btnFinalBook.addEventListener('click', () => {
                const auditSec = document.getElementById('audit') || document.getElementById('contact');
                if (auditSec) auditSec.scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (this.btnFinalDemo) {
            this.btnFinalDemo.addEventListener('click', () => {
                const heroSec = document.getElementById('hero');
                if (heroSec) heroSec.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    /**
     * Interactive ROI Calculator Math & Count-Up
     */
    updateROICalculations() {
        if (!this.sliderEmployees || !this.sliderHours || !this.sliderCost) return;

        const emp = parseInt(this.sliderEmployees.value, 10) || 15;
        const hrs = parseInt(this.sliderHours.value, 10) || 12;
        const cost = parseInt(this.sliderCost.value, 10) || 45;

        // Display Slider Values
        if (this.valEmployees) this.valEmployees.textContent = emp;
        if (this.valHours) this.valHours.textContent = `${hrs} hrs/wk`;
        if (this.valCost) this.valCost.textContent = `$${cost}/hr`;

        // Formulas:
        // Weekly hours saved = emp * hrs * 0.65 (65% automation efficiency)
        // Yearly hours saved = weekly hours * 52
        // Yearly savings = yearly hours saved * cost
        const yearlyHoursSaved = Math.round(emp * hrs * 0.65 * 52);
        const yearlySavings = Math.round(yearlyHoursSaved * cost);
        const roiMultiplier = (3.5 + (emp > 20 ? 1.2 : 0.4)).toFixed(1);

        // Format Currency & Numbers
        const formattedSavings = `$${yearlySavings.toLocaleString()}`;
        const formattedHours = `${yearlyHoursSaved.toLocaleString()} hrs`;
        const formattedROI = `${roiMultiplier}x`;

        if (this.resSavings) this.resSavings.textContent = formattedSavings;
        if (this.resHours) this.resHours.textContent = formattedHours;
        if (this.resROI) this.resROI.textContent = formattedROI;
    }

    /**
     * IntersectionObserver for Case Study Animated Number Counters
     */
    initAnimatedCounters() {
        const counterElements = document.querySelectorAll('.count-number');
        if (!counterElements.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetVal = parseFloat(el.getAttribute('data-count'));
                    const prefix = el.getAttribute('data-prefix') || '';
                    const suffix = el.getAttribute('data-suffix') || '';

                    this.animateCount(el, targetVal, prefix, suffix);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => observer.observe(el));
    }

    animateCount(element, target, prefix, suffix) {
        let current = 0;
        const duration = 1600; // ms
        const frameRate = 30;
        const step = target / (duration / frameRate);

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            const displayVal = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
            element.textContent = `${prefix}${displayVal}${suffix}`;
        }, frameRate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.trustAndSocialProof = new TrustAndSocialProof();
});
