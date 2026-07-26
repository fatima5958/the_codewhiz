/**
 * FRONTEND/ALIVE.JS — Hyper-Realistic Human Life Simulation Engine for Aria
 */

class AriaLifeEngine {
    constructor() {
        this.avatars = [];
        this.mousePos = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.eyeShift = { x: 0, y: 0 };
        this.headTilt = 0;
        this.breathY = 0;
        this.rafId = null;
        this.blinkTimeout = null;
        this.headTiltTimeout = null;
        this.eyeShiftTimeout = null;
        this.idleTimer = null;
        this.isTabActive = true;
        this.startTime = performance.now();

        this.initAvatars();
        this.bindMouseTracking();
        this.initRandomBlinking();
        this.initHeadTiltCycle();
        this.initEyeMicroShifts();
        this.initBreathingLoop();
        this.initVisibilityObserver();
        this.initScrollHostObserver();
        this.initIdleDetector();
    }

    initAvatars() {
        const nodes = document.querySelectorAll('.aria-avatar-img, #aria-portrait, .hero-aria-portrait, .cta-aria-img, .audit-aria-avatar img');
        this.avatars = Array.from(nodes).map(avatar => {
            let baseScale = 1;
            if (avatar.classList.contains('aria-circular-img') || avatar.classList.contains('hero-aria-portrait')) {
                baseScale = 1.06;
            } else if (avatar.classList.contains('nova-3d-anime-img')) {
                baseScale = 1.4;
            }
            return { el: avatar, baseScale, isVisible: true };
        });

        if ('IntersectionObserver' in window) {
            const avatarObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const found = this.avatars.find(a => a.el === entry.target);
                    if (found) found.isVisible = entry.isIntersecting;
                });
                this.checkAnyVisible();
            }, { threshold: 0.05 });

            this.avatars.forEach(a => avatarObserver.observe(a.el));
        }
    }

    checkAnyVisible() {
        const anyVisible = this.avatars.some(a => a.isVisible);
        if (anyVisible && !this.rafId && this.isTabActive) {
            this.startBreathingLoop();
        }
    }

    startBreathingLoop() {
        if (this.rafId) return;
        const loop = (timestamp) => {
            if (this.isTabActive && this.avatars.some(a => a.isVisible)) {
                const elapsed = (timestamp - this.startTime) * 0.001;

                this.breathY = Math.sin(elapsed * 1.1) * 2.2 + Math.sin(elapsed * 2.2) * 0.6;

                this.mousePos.x += (this.targetPos.x + this.eyeShift.x - this.mousePos.x) * 0.08;
                this.mousePos.y += (this.targetPos.y + this.eyeShift.y + this.breathY - this.mousePos.y) * 0.08;

                for (let i = 0; i < this.avatars.length; i++) {
                    const item = this.avatars[i];
                    if (item.isVisible && item.el) {
                        item.el.style.transform = `scale(${item.baseScale}) translate3d(${this.mousePos.x}px, ${this.mousePos.y}px, 0) rotate(${this.headTilt}deg)`;
                    }
                }
                this.rafId = requestAnimationFrame(loop);
            } else {
                this.rafId = null;
            }
        };
        this.rafId = requestAnimationFrame(loop);
    }

    initBreathingLoop() {
        this.startBreathingLoop();
    }

    /**
     * 1. Dynamic Eye Blinking (Randomized 3.5s - 6.5s, 10% Double Blink Chance)
     */
    initRandomBlinking() {
        const scheduleNextBlink = () => {
            if (!this.isTabActive) {
                this.blinkTimeout = setTimeout(scheduleNextBlink, 3000);
                return;
            }

            const interval = 3500 + Math.random() * 3000; // 3.5s to 6.5s random
            this.blinkTimeout = setTimeout(() => {
                this.triggerEyeBlink(() => {
                    // 10% Chance of double blink
                    if (Math.random() < 0.10) {
                        setTimeout(() => {
                            this.triggerEyeBlink();
                        }, 160);
                    }
                });
                scheduleNextBlink();
            }, interval);
        };

        scheduleNextBlink();
    }

    triggerEyeBlink(callback) {
        const blinkDuration = 120 + Math.floor(Math.random() * 60); // 120ms to 180ms
        this.avatars.forEach(avatar => {
            if (avatar) {
                avatar.classList.add('aria-blinking');
                setTimeout(() => {
                    avatar.classList.remove('aria-blinking');
                    if (callback) callback();
                }, blinkDuration);
            }
        });
    }

    /**
     * 3. Natural Head Tilting (1-2 degrees shift, smooth return)
     */
    initHeadTiltCycle() {
        const scheduleNextTilt = () => {
            if (!this.isTabActive) {
                this.headTiltTimeout = setTimeout(scheduleNextTilt, 5000);
                return;
            }

            const interval = 5000 + Math.random() * 4000; // 5s to 9s
            this.headTiltTimeout = setTimeout(() => {
                // 1 to 1.8 degree tilt left or right
                const dir = Math.random() > 0.5 ? 1 : -1;
                this.headTilt = dir * (1.0 + Math.random() * 0.8);

                // Return to neutral after 2.5s
                setTimeout(() => {
                    this.headTilt = 0;
                }, 2500);

                scheduleNextTilt();
            }, interval);
        };

        scheduleNextTilt();
    }

    /**
     * 4. Eye Micro-Movements (Tiny focus shifts & return)
     */
    initEyeMicroShifts() {
        const scheduleShift = () => {
            if (!this.isTabActive) {
                this.eyeShiftTimeout = setTimeout(scheduleShift, 4000);
                return;
            }

            const interval = 3000 + Math.random() * 3500; // 3s to 6.5s
            this.eyeShiftTimeout = setTimeout(() => {
                this.eyeShift.x = (Math.random() - 0.5) * 2.5; // ±1.25px shift
                this.eyeShift.y = (Math.random() - 0.5) * 1.8;

                // Return to center after 1.8s
                setTimeout(() => {
                    this.eyeShift.x = 0;
                    this.eyeShift.y = 0;
                }, 1800);

                scheduleShift();
            }, interval);
        };

        scheduleShift();
    }

    /**
     * 7. Tab Visibility Observer (Pauses loop when tab is hidden)
     */
    initVisibilityObserver() {
        document.addEventListener('visibilitychange', () => {
            this.isTabActive = !document.hidden;
            if (this.isTabActive) {
                this.startTime = performance.now();
            }
        });
    }

    /**
     * Idle Detector: Reacts gracefully when the user pauses
     */
    initIdleDetector() {
        this.resetIdleTimer();
    }

    resetIdleTimer() {
        clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => {
            this.onUserIdle();
        }, 6000);
    }

    onUserIdle() {
        const typingText = document.getElementById('aria-typing-text');
        if (typingText && (!window.ariaAssistant || window.ariaAssistant.state === 'IDLE')) {
            typingText.textContent = "I'm here whenever you're ready.";
        }

        const glows = document.querySelectorAll('.aria-ambient-glow, .cta-aria-glow');
        glows.forEach(glow => {
            glow.style.transition = 'transform 1s ease, opacity 1s ease';
            glow.style.opacity = '0.95';
        });
    }

    /**
     * Scroll Host Observer: Updates Aria's focus state per chapter section
     */
    initScrollHostObserver() {
        const sections = [
            { id: 'hero', name: 'CHAPTER 01 // PRESENTER', status: 'Ready to build your strategy.' },
            { id: 'audit', name: 'CHAPTER 02 // CONSULTATION', status: 'Analyzing your automation opportunities...' },
            { id: 'comparison', name: 'CHAPTER 03 // THE ADVANTAGE', status: 'Comparing legacy vs AI operations...' },
            { id: 'roi-calculator', name: 'CHAPTER 04 // PROJECTED ROI', status: 'Calculating your annual savings...' },
            { id: 'final-cta', name: 'CHAPTER 05 // STRATEGY CALL', status: 'Ready to build your AI advantage?' }
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const secConfig = sections.find(s => s.id === entry.target.id);
                    if (secConfig) {
                        this.onSectionEnter(secConfig);
                    }
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(sec => {
            const el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });
    }

    onSectionEnter(secConfig) {
        this.currentSection = secConfig.id;

        const statusTextEl = document.getElementById('hero-status-text');
        const typingTextEl = document.getElementById('aria-typing-text');

        if (statusTextEl) statusTextEl.textContent = secConfig.name;
        if (typingTextEl && (!window.ariaAssistant || window.ariaAssistant.state === 'IDLE')) {
            typingTextEl.textContent = secConfig.status;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaLifeEngine = new AriaLifeEngine();
});
