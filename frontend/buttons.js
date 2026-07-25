/**
 * FRONTEND/BUTTONS.JS — Premium Magnetic, Glow, Press & Ripple Button Engine for Aria
 */

class AriaButtonEngine {
    constructor() {
        this.buttons = [];

        this.initButtons();
        this.bindMagneticHover();
        this.bindRippleEffect();
    }

    initButtons() {
        const selectors = 'button, .btn-talk-glass, .audit-opt-btn, .btn-primary-glow, .btn-secondary-ghost, .threed-cta, .btn-voice-toggle, .nav-cta-btn';
        this.buttons = document.querySelectorAll(selectors);
    }

    /**
     * Magnetic Attraction Physics (Apple-Grade Easing)
     */
    bindMagneticHover() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const btnCenterX = rect.left + rect.width / 2;
                const btnCenterY = rect.top + rect.height / 2;

                const distanceX = e.clientX - btnCenterX;
                const distanceY = e.clientY - btnCenterY;

                // Smooth magnetic pull
                btn.style.transform = `translate3d(${distanceX * 0.22}px, ${distanceY * 0.22}px, 0) scale(1.02)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate3d(0px, 0px, 0) scale(1.0)`;
                btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            });

            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'none';
            });
        });
    }

    /**
     * Radial Ripple Wave Expansion on Click
     */
    bindRippleEffect() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const diameter = Math.max(rect.width, rect.height);
                const radius = diameter / 2;

                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple-wave';
                ripple.style.width = ripple.style.height = `${diameter}px`;
                ripple.style.left = `${e.clientX - rect.left - radius}px`;
                ripple.style.top = `${e.clientY - rect.top - radius}px`;

                const existing = btn.querySelector('.btn-ripple-wave');
                if (existing) existing.remove();

                btn.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaButtonEngine = new AriaButtonEngine();
});
