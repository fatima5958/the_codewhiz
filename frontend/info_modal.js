/**
 * FRONTEND/INFO_MODAL.JS — Apple-Grade Sub-Pages Reader Overlay Engine
 */

class AriaInfoModalEngine {
    constructor() {
        this.modal = document.getElementById('info-modal');
        this.backdrop = document.getElementById('info-modal-backdrop');
        this.closeBtn = document.getElementById('info-modal-close');
        this.badgeEl = document.getElementById('info-modal-badge');
        this.titleEl = document.getElementById('info-modal-title');
        this.bodyEl = document.getElementById('info-modal-body');

        this.docs = {
            'modal-automation': {
                badge: 'SOLUTIONS // WORKFLOW AUTOMATION',
                title: 'AI Workflow Automation Systems',
                content: `
                    <p>Our custom AI workflow automation engines connect your existing CRM, database, email, and ERP systems to process complex business data autonomously.</p>
                    <h4>Key Capabilities</h4>
                    <ul>
                        <li><strong>Self-Healing Pipelines:</strong> Automatically handle edge cases and log anomalies.</li>
                        <li><strong>Instant API Integration:</strong> Native connectors for Salesforce, HubSpot, Stripe, Slack, and custom REST APIs.</li>
                        <li><strong>65% Cost Reduction:</strong> Eliminate repetitive manual data entry and triage queues.</li>
                    </ul>
                `
            },
            'modal-support': {
                badge: 'SOLUTIONS // CUSTOMER SUPPORT',
                title: '24/7 Autonomous AI Customer Support',
                content: `
                    <p>Deploy human-like voice and chat AI agents that resolve customer queries in under 85 milliseconds with 99.8% accuracy.</p>
                    <h4>Key Capabilities</h4>
                    <ul>
                        <li><strong>Multi-Channel Triage:</strong> Seamless execution across web chat, phone voice lines, and email.</li>
                        <li><strong>Sentiment Analysis:</strong> Real-time emotional evaluation for smooth escalation to human managers when needed.</li>
                        <li><strong>24/7 Availability:</strong> Zero downtime, infinite concurrency support.</li>
                    </ul>
                `
            },
            'modal-sales': {
                badge: 'SOLUTIONS // SALES & LEADS',
                title: 'Autonomous AI Sales & Lead Generation',
                content: `
                    <p>Turn website traffic into qualified sales appointments automatically. Aria engages visitors, scores their buying intent, and books strategy meetings.</p>
                    <h4>Key Capabilities</h4>
                    <ul>
                        <li><strong>Instant Lead Speed:</strong> Response time under 30 seconds after inquiry submission.</li>
                        <li><strong>Dynamic Pricing Assistant:</strong> Provide customized estimates based on client parameters.</li>
                        <li><strong>+42% Conversion Lift:</strong> Capture high-value leads before they leave your site.</li>
                    </ul>
                `
            },
            'modal-custom': {
                badge: 'SOLUTIONS // CUSTOM INFRASTRUCTURE',
                title: 'Custom Enterprise AI Infrastructure',
                content: `
                    <p>We design bespoke neural model pipelines tailored strictly to your industry data, compliance standards, and internal knowledge bases.</p>
                    <h4>Key Capabilities</h4>
                    <ul>
                        <li><strong>Private LLM Fine-Tuning:</strong> Train models strictly on your proprietary documentation.</li>
                        <li><strong>Zero Vendor Lock-In:</strong> Fully owned model weights and self-hosted infrastructure options.</li>
                        <li><strong>High Throughput:</strong> Low-latency inference tailored for enterprise workloads.</li>
                    </ul>
                `
            },
            'modal-security': {
                badge: 'LEGAL // DATA SECURITY',
                title: 'Security & Data Protection Protocols',
                content: `
                    <p>Security is baked into every architecture layer. Your enterprise business data is never shared or used for public AI training.</p>
                    <h4>Security Architecture</h4>
                    <ul>
                        <li><strong>Bank-Grade Encryption:</strong> AES-256 encryption at rest and TLS 1.3 in transit.</li>
                        <li><strong>SOC 2 & HIPAA Compliance:</strong> Rigorous access controls, audit logs, and anonymization pipelines.</li>
                        <li><strong>Isolated Tenant Environments:</strong> Isolated database nodes for absolute privacy.</li>
                    </ul>
                `
            },
            'modal-privacy': {
                badge: 'LEGAL // PRIVACY POLICY',
                title: 'Privacy Policy',
                content: `
                    <p>At <strong>The Code Whiz AI Lab</strong>, we respect your privacy and protect your business data. This policy outlines how information is handled across our platforms.</p>
                    <h4>Data Handling Standards</h4>
                    <ul>
                        <li><strong>Confidentiality:</strong> Client consultation data and audit inputs remain 100% confidential.</li>
                        <li><strong>No Model Training:</strong> Your business operational data is NEVER fed into public AI models.</li>
                        <li><strong>Data Retention:</strong> You hold full ownership and can request immediate data deletion at any time.</li>
                    </ul>
                `
            },
            'modal-terms': {
                badge: 'LEGAL // TERMS OF SERVICE',
                title: 'Terms of Service',
                content: `
                    <p>By engaging <strong>The Code Whiz AI Lab</strong> or interacting with Aria, you agree to our standard service and deployment terms.</p>
                    <h4>Service Commitments</h4>
                    <ul>
                        <li><strong>Guaranteed Implementation:</strong> 14-day standard deployment timeline for core AI automation modules.</li>
                        <li><strong>Intellectual Property:</strong> Clients maintain 100% ownership of custom software and workflows developed.</li>
                        <li><strong>24/7 SLA Support:</strong> Proactive system monitoring and uptime SLA guarantees.</li>
                    </ul>
                `
            },
            'modal-report': {
                badge: 'RESOURCES // INDUSTRY BENCHMARK',
                title: 'McKinsey AI Benchmark Report 2026',
                content: `
                    <p>Our proprietary AI readiness audit framework is modeled directly after top enterprise AI adoption studies from McKinsey, Gartner, and OpenAI.</p>
                    <h4>Key Findings</h4>
                    <ul>
                        <li><strong>3.8x ROI Advantage:</strong> Early adopters of autonomous workflow pipelines achieve 3.8x higher profit margins.</li>
                        <li><strong>Speed To Market:</strong> Companies deploying voice AI report 82% faster customer triage response times.</li>
                    </ul>
                `
            }
        };

        this.initTriggers();
        this.bindEvents();
    }

    initTriggers() {
        const links = document.querySelectorAll('.open-info-modal');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetKey = link.getAttribute('data-modal');
                if (targetKey && this.docs[targetKey]) {
                    this.openModal(this.docs[targetKey]);
                }
            });
        });

        // Newsletter subscription handler
        const newsBtn = document.getElementById('btn-newsletter-sub');
        const newsInput = document.getElementById('newsletter-email');
        if (newsBtn && newsInput) {
            newsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = newsInput.value.trim();
                if (email && email.includes('@')) {
                    newsBtn.innerHTML = '<span>Subscribed! ✨</span>';
                    newsInput.value = '';
                    setTimeout(() => {
                        newsBtn.innerHTML = '<span>Subscribe</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
                    }, 3000);
                } else {
                    newsInput.classList.add('error-shake');
                    setTimeout(() => newsInput.classList.remove('error-shake'), 500);
                }
            });
        }
    }

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeModal());
        }
    }

    openModal(data) {
        if (!this.modal) return;
        if (this.badgeEl) this.badgeEl.textContent = data.badge;
        if (this.titleEl) this.titleEl.textContent = data.title;
        if (this.bodyEl) this.bodyEl.innerHTML = data.content;

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaInfoModal = new AriaInfoModalEngine();
});
