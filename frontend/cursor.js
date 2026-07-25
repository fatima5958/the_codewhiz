/**
 * FRONTEND/CURSOR.JS — Apple-Quality Premium Interactive Magnetic Cursor for Aria
 */

class AriaLuxuryCursor {
    constructor() {
        this.dot = null;
        this.follower = null;

        this.mouse = { x: -100, y: -100 };
        this.dotPos = { x: -100, y: -100 };
        this.followerPos = { x: -100, y: -100 };

        this.isHovering = false;
        this.interactiveEls = [];

        this.initDOM();
        this.bindEvents();
        this.initMagneticButtons();
        this.render();
    }

    initDOM() {
        this.dot = document.createElement('div');
        this.dot.className = 'custom-cursor-dot';

        this.follower = document.createElement('div');
        this.follower.className = 'custom-cursor-follower';

        document.body.appendChild(this.dot);
        document.body.appendChild(this.follower);
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }, { passive: true });

        window.addEventListener('mousedown', () => {
            if (this.follower) this.follower.classList.add('is-active');
        });

        window.addEventListener('mouseup', () => {
            if (this.follower) this.follower.classList.remove('is-active');
        });

        this.updateInteractiveListeners();
    }

    updateInteractiveListeners() {
        const selectors = 'a, button, input, select, textarea, .audit-opt-btn, .case-study-card, .roi-card, .btn-talk-glass, .os-chip, .chat-bubble-pill, .btn-primary-glow';
        this.interactiveEls = document.querySelectorAll(selectors);

        this.interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isHovering = true;
                if (this.dot) this.dot.classList.add('is-hovering');
                if (this.follower) this.follower.classList.add('is-hovering');
            });

            el.addEventListener('mouseleave', () => {
                this.isHovering = false;
                if (this.dot) this.dot.classList.remove('is-hovering');
                if (this.follower) this.follower.classList.remove('is-hovering');
            });
        });
    }

    /**
     * Subtle Magnetic Attraction for Buttons (Apple-Grade Physics)
     */
    initMagneticButtons() {
        const buttons = document.querySelectorAll('button, .btn-talk-glass, .audit-opt-btn, .btn-primary-glow');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const btnCenterX = rect.left + rect.width / 2;
                const btnCenterY = rect.top + rect.height / 2;

                const distanceX = e.clientX - btnCenterX;
                const distanceY = e.clientY - btnCenterY;

                // Subtle 6px pull
                btn.style.transform = `translate3d(${distanceX * 0.18}px, ${distanceY * 0.18}px, 0)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate3d(0px, 0px, 0)`;
                btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            });

            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'none';
            });
        });
    }

    /**
     * 60 FPS Ultra-Responsive Cursor Loop (Zero Lag)
     */
    render() {
        // 1-to-1 instant center tracking (zero lag!)
        this.dotPos.x = this.mouse.x;
        this.dotPos.y = this.mouse.y;

        // High-speed follower tracking (0.45 lerp factor for crisp responsiveness)
        this.followerPos.x += (this.mouse.x - this.followerPos.x) * 0.45;
        this.followerPos.y += (this.mouse.y - this.followerPos.y) * 0.45;

        if (this.dot) {
            this.dot.style.transform = `translate3d(${this.dotPos.x}px, ${this.dotPos.y}px, 0) translate(-50%, -50%)`;
        }

        if (this.follower) {
            this.follower.style.transform = `translate3d(${this.followerPos.x}px, ${this.followerPos.y}px, 0) translate(-50%, -50%)`;
        }

        requestAnimationFrame(() => this.render());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Enable custom cursor for desktop pointer devices
    if (window.matchMedia('(pointer: fine)').matches) {
        window.ariaCursor = new AriaLuxuryCursor();
    }
});
