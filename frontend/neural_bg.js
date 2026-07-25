/**
 * FRONTEND/NEURAL_BG.JS — Living Canvas Neural Network Background for Aria
 */

class AriaNeuralBackground {
    constructor() {
        this.canvas = document.getElementById('hero-neural-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numParticles = 50;
        this.maxDistance = 140;

        this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

        this.resize();
        this.initParticles();
        this.bindEvents();
        this.render();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.width = this.canvas.width = parent ? parent.offsetWidth : window.innerWidth;
        this.height = this.canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.targetX = e.clientX - rect.left;
            this.mouse.targetY = e.clientY - rect.top;
        }, { passive: true });
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.3, // Ultra-slow gentle drift
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.6 + 0.8,
                alpha: Math.random() * 0.45 + 0.2,
                baseAlpha: Math.random() * 0.45 + 0.2,
                pulseAngle: Math.random() * Math.PI * 2
            });
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Smooth mouse position lerp
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];

            // Slow drift
            p1.x += p1.vx;
            p1.y += p1.vy;

            // Soft boundaries
            if (p1.x < 0 || p1.x > this.width) p1.vx *= -1;
            if (p1.y < 0 || p1.y > this.height) p1.vy *= -1;

            // Gentle pulse
            p1.pulseAngle += 0.015;
            p1.alpha = p1.baseAlpha + Math.sin(p1.pulseAngle) * 0.15;

            // Subtle mouse repulsion/drift
            const dxMouse = p1.x - this.mouse.x;
            const dyMouse = p1.y - this.mouse.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            if (distMouse < 180) {
                const force = (180 - distMouse) / 180;
                p1.x += (dxMouse / distMouse) * force * 0.5;
                p1.y += (dyMouse / distMouse) * force * 0.5;
            }

            // Draw floating particle dot with soft lavender glow
            this.ctx.beginPath();
            this.ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(192, 132, 252, ${Math.max(0, p1.alpha)})`;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(192, 132, 252, 0.7)';
            this.ctx.fill();

            // Connect neural lines between nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.maxDistance) {
                    const lineAlpha = (1 - dist / this.maxDistance) * 0.16;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(192, 132, 252, ${lineAlpha})`;
                    this.ctx.lineWidth = 0.7;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.render());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaNeuralBg = new AriaNeuralBackground();
});
