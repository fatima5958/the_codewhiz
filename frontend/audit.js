/**
 * FRONTEND/AUDIT.JS — Interactive AI Business Audit & McKinsey-Style Report Generator
 */

class AriaBusinessAudit {
    constructor() {
        this.answers = {
            industry: null,
            challenge: null,
            employees: null
        };

        this.currentStep = 1;
        this.initDOMElements();
        this.bindEvents();
    }

    initDOMElements() {
        this.auditSection = document.getElementById('audit');
        this.stepIndicator = document.getElementById('audit-step-indicator');
        this.panes = {
            1: document.getElementById('audit-step-1'),
            2: document.getElementById('audit-step-2'),
            3: document.getElementById('audit-step-3'),
            loading: document.getElementById('audit-step-loading'),
            report: document.getElementById('audit-step-report')
        };
        this.loadingText = document.getElementById('audit-loading-text');
        this.loadingFill = document.getElementById('audit-loading-fill');
        this.btnBookStrategy = document.getElementById('btn-book-strategy');
    }

    bindEvents() {
        // Handle Option Button Clicks
        document.querySelectorAll('.audit-opt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const step = parseInt(target.getAttribute('data-step'), 10);
                const value = target.getAttribute('data-value');

                this.handleOptionSelect(step, value, target);
            });
        });

        // Book Strategy Call CTA Button
        if (this.btnBookStrategy) {
            this.btnBookStrategy.addEventListener('click', () => {
                const contactSection = document.getElementById('contact') || document.getElementById('audit-stage-card');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    handleOptionSelect(step, value, buttonElement) {
        // Highlight clicked button
        const parentPane = buttonElement.closest('.audit-step-pane');
        if (parentPane) {
            parentPane.querySelectorAll('.audit-opt-btn').forEach(b => b.classList.remove('selected'));
        }
        buttonElement.classList.add('selected');

        // Store Answer
        if (step === 1) this.answers.industry = value;
        if (step === 2) this.answers.challenge = value;
        if (step === 3) this.answers.employees = value;

        // Transition to Next Step
        if (step === 1) {
            this.goToStep(2);
        } else if (step === 2) {
            this.goToStep(3);
        } else if (step === 3) {
            this.runLoadingAnalysis();
        }
    }

    goToStep(stepNumber) {
        this.currentStep = stepNumber;

        // Update Step Indicator Badge
        if (this.stepIndicator) {
            this.stepIndicator.textContent = `Step ${stepNumber} of 3`;
        }

        // Hide all panes & show target
        Object.keys(this.panes).forEach(key => {
            if (this.panes[key]) {
                this.panes[key].classList.remove('active');
            }
        });

        if (this.panes[stepNumber]) {
            this.panes[stepNumber].classList.add('active');
        }
    }

    /**
     * Run Step 4: Premium AI Loading Sequence
     */
    runLoadingAnalysis() {
        if (this.stepIndicator) {
            this.stepIndicator.textContent = 'AI Analysis in Progress';
        }

        // Hide all panes & show loading
        Object.keys(this.panes).forEach(key => {
            if (this.panes[key]) this.panes[key].classList.remove('active');
        });
        if (this.panes.loading) this.panes.loading.classList.add('active');

        // Reset Fill Bar
        if (this.loadingFill) this.loadingFill.style.width = '0%';

        const phases = [
            { text: "Initializing AI...", progress: '25%', delay: 0 },
            { text: "Analyzing...", progress: '50%', delay: 900 },
            { text: "Generating Strategy...", progress: '75%', delay: 1800 },
            { text: "Preparing Report...", progress: '100%', delay: 2700 }
        ];

        phases.forEach(phase => {
            setTimeout(() => {
                if (this.loadingText) {
                    this.loadingText.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease';
                    this.loadingText.style.opacity = '0';
                    this.loadingText.style.transform = 'translateY(6px)';
                    
                    setTimeout(() => {
                        this.loadingText.textContent = phase.text;
                        this.loadingText.style.opacity = '1';
                        this.loadingText.style.transform = 'translateY(0px)';
                    }, 140);
                }
                if (this.loadingFill) {
                    this.loadingFill.style.transition = 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    this.loadingFill.style.width = phase.progress;
                }
            }, phase.delay);
        });

        // Show Report Card after 3.7s
        setTimeout(() => {
            this.renderReportCard();
        }, 3700);
    }

    /**
     * Generate & Render McKinsey-style AI Report Card
     */
    renderReportCard() {
        if (this.stepIndicator) {
            this.stepIndicator.textContent = 'Audit Complete';
        }

        if (this.panes.loading) this.panes.loading.classList.remove('active');
        if (this.panes.report) this.panes.report.classList.add('active');

        // Dynamic Calculations based on answers
        const ind = this.answers.industry || 'Business';
        const ch = this.answers.challenge || 'Growth';
        const emp = this.answers.employees || '5-20';

        let score = 92;
        let potential = '85%';
        let timeSaved = '24 hrs';
        let progressScore = 92;
        let progressPotential = 85;
        let progressTime = 80;

        if (emp === '100+') {
            score = 96;
            potential = '92%';
            timeSaved = '120+ hrs';
            progressScore = 96;
            progressPotential = 92;
            progressTime = 95;
        } else if (emp === '20-100') {
            score = 94;
            potential = '88%';
            timeSaved = '55 hrs';
            progressScore = 94;
            progressPotential = 88;
            progressTime = 85;
        } else if (emp === '1-5') {
            score = 88;
            potential = '82%';
            timeSaved = '16 hrs';
            progressScore = 88;
            progressPotential = 82;
            progressTime = 70;
        }

        // Set Text Content
        const repScoreEl = document.getElementById('rep-val-score');
        const repPotEl = document.getElementById('rep-val-potential');
        const repTimeEl = document.getElementById('rep-val-time');
        const repTitleEl = document.getElementById('report-title');
        const repSumEl = document.getElementById('report-summary');

        if (repScoreEl) repScoreEl.textContent = score;
        if (repPotEl) repPotEl.textContent = potential;
        if (repTimeEl) repTimeEl.textContent = timeSaved;
        if (repTitleEl) repTitleEl.textContent = `${ind} AI Strategy Report`;
        if (repSumEl) repSumEl.textContent = `Tailored for ${emp} team scale • Goal: ${ch}`;

        // Animate Progress Bars
        setTimeout(() => {
            const barScore = document.getElementById('rep-bar-score');
            const barPot = document.getElementById('rep-bar-potential');
            const barTime = document.getElementById('rep-bar-time');

            if (barScore) barScore.style.width = `${progressScore}%`;
            if (barPot) barPot.style.width = `${progressPotential}%`;
            if (barTime) barTime.style.width = `${progressTime}%`;
        }, 150);

        // Customize Opportunities & Recommended Services
        this.customizeReportLists(ind, ch);

        // Voice Output via Aria
        if (window.ariaVoiceEngine) {
            const speechText = `Your AI business audit is complete for your ${ind} business. We identified an automation potential of ${potential}, with an estimated ${timeSaved} saved per week.`;
            window.ariaVoiceEngine.speak(speechText);
        }
    }

    customizeReportLists(industry, challenge) {
        const growthList = document.getElementById('report-growth-list');
        const servicesTags = document.getElementById('report-services-tags');

        if (growthList) {
            growthList.innerHTML = `
                <li>Automated 24/7 customer engagement & ${challenge.toLowerCase()} pipeline</li>
                <li>Eliminate manual data entry across ${industry} operations</li>
                <li>Predictive lead scoring & conversion boost</li>
            `;
        }

        if (servicesTags) {
            servicesTags.innerHTML = `
                <span class="service-pill">AI Customer Agent</span>
                <span class="service-pill">Workflow Automation Pipeline</span>
                <span class="service-pill">Custom ${industry} AI Engine</span>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaBusinessAudit = new AriaBusinessAudit();
});
