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
        this.avatars = document.querySelectorAll('.aria-avatar-img, #aria-portrait, .hero-aria-portrait, .cta-aria-img, .audit-aria-avatar img');
    }

    /**
     * Mouse Parallax: Aria gently turns her head and looks toward the user's cursor
     */
    bindMouseTracking() {
        window.addEventListener('mousemove', (e) => {
            if (!this.isTabActive) return;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const deltaX = (e.clientX - centerX) / centerX;
            const deltaY = (e.clientY - centerY) / centerY;

            // Natural 10px shift
            this.targetPos.x = deltaX * 10;
            this.targetPos.y = deltaY * 7;

            // Interactive mouse lighting direction shift
            const lightSweep = document.querySelector('.aria-light-sweep');
            if (lightSweep) {
                const lightX = deltaX * 24;
                const lightY = deltaY * 18;
                lightSweep.style.transform = `translate3d(${lightX}px, ${lightY}px, 0) rotate(${12 + deltaX * 8}deg)`;
            }

            this.resetIdleTimer();
        }, { passive: true });
    }

    /**
     * 60 FPS Combined Physics Loop: Mouse Parallax + Breathing + Head Tilt + Micro-Eye Shift
     */
    initBreathingLoop() {
        const loop = (timestamp) => {
            if (this.isTabActive) {
                const elapsed = (timestamp - this.startTime) * 0.001; // Seconds

                // Organic breathing wave (chest rise, shoulder lift, subtle neck follow)
                this.breathY = Math.sin(elapsed * 1.1) * 2.2 + Math.sin(elapsed * 2.2) * 0.6;

                // Smooth position lerp
                this.mousePos.x += (this.targetPos.x + this.eyeShift.x - this.mousePos.x) * 0.08;
                this.mousePos.y += (this.targetPos.y + this.eyeShift.y + this.breathY - this.mousePos.y) * 0.08;

                // Apply transforms
                this.avatars.forEach(avatar => {
                    if (avatar) {
                        let baseScale = 1;
                        if (avatar.classList.contains('aria-circular-img') || avatar.classList.contains('hero-aria-portrait')) {
                            baseScale = 1.06;
                        } else if (avatar.classList.contains('nova-3d-anime-img')) {
                            baseScale = 1.4;
                        }

                        avatar.style.transform = `scale(${baseScale}) translate3d(${this.mousePos.x}px, ${this.mousePos.y}px, 0) rotate(${this.headTilt}deg)`;
                    }
                });
            }

            this.rafId = requestAnimationFrame(loop);
        };

        this.rafId = requestAnimationFrame(loop);
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
