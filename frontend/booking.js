/**
 * FRONTEND/BOOKING.JS — Apple-Grade Strategy Session Booking Modal Engine
 */

class AriaBookingModalEngine {
    constructor() {
        this.modal = document.getElementById('booking-modal');
        this.backdrop = document.getElementById('booking-modal-backdrop');
        this.closeBtn = document.getElementById('booking-modal-close');
        this.btnNext = document.getElementById('btn-booking-next');
        this.btnNextText = document.getElementById('btn-next-text');
        this.btnBack = document.getElementById('btn-booking-back');
        this.btnCloseSuccess = document.getElementById('btn-close-success');

        this.progressFill = document.getElementById('booking-progress-fill');
        this.stepCounter = document.getElementById('booking-step-counter');

        this.currentStep = 1; // 1..5, 6 = Summary, 7 = Success
        this.formData = {
            name: '',
            business: '',
            email: '',
            scale: '',
            challenge: ''
        };

        this.initTriggers();
        this.bindEvents();
    }

    initTriggers() {
        // Collect all trigger buttons across the site
        const triggerSelectors = [
            '#btn-start-consultation',
            '#btn-header-audit',
            '.btn-audit',
            '.btn-consultation'
        ];

        triggerSelectors.forEach(selector => {
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal();
                });
            });
        });
    }

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeModal());
        }

        if (this.btnNext) {
            this.btnNext.addEventListener('click', () => this.handleNext());
        }

        if (this.btnBack) {
            this.btnBack.addEventListener('click', () => this.handleBack());
        }

        if (this.btnCloseSuccess) {
            this.btnCloseSuccess.addEventListener('click', () => this.closeModal());
        }

        // Option cards selection in Step 4 & 5
        const optCards = document.querySelectorAll('.booking-opt-card');
        optCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const parentPane = card.closest('.booking-step-pane');
                if (!parentPane) return;

                // Toggle active state in sibling cards
                const siblings = parentPane.querySelectorAll('.booking-opt-card');
                siblings.forEach(s => s.classList.remove('selected'));
                card.classList.add('selected');

                const val = card.getAttribute('data-val');
                if (parentPane.id === 'booking-step-4') {
                    this.formData.scale = val;
                } else if (parentPane.id === 'booking-step-5') {
                    this.formData.challenge = val;
                }

                // Auto advance to next step after selection
                setTimeout(() => this.handleNext(), 200);
            });
        });

        // Input field enter key press
        const inputs = document.querySelectorAll('.booking-input-field');
        inputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleNext();
                }
            });
        });
    }

    openModal() {
        if (!this.modal) return;
        this.resetForm();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first input field
        setTimeout(() => {
            const firstInput = document.getElementById('book-name');
            if (firstInput) firstInput.focus();
        }, 300);
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    resetForm() {
        this.currentStep = 1;
        this.formData = { name: '', business: '', email: '', scale: '', challenge: '' };

        // Clear input values
        ['book-name', 'book-business', 'book-email'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        // Clear option selections
        document.querySelectorAll('.booking-opt-card').forEach(c => c.classList.remove('selected'));

        this.updateStepUI();
    }

    handleNext() {
        // Validate current step before advancing
        if (!this.validateCurrentStep()) return;

        if (this.currentStep < 6) {
            this.currentStep++;
            this.updateStepUI();
        } else if (this.currentStep === 6) {
            // Final submission from Summary step
            this.submitBooking();
        }
    }

    handleBack() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepUI();
        }
    }

    validateCurrentStep() {
        if (this.currentStep === 1) {
            const input = document.getElementById('book-name');
            const val = input ? input.value.trim() : '';
            if (!val) {
                this.shakeInput(input);
                return false;
            }
            this.formData.name = val;
        } else if (this.currentStep === 2) {
            const input = document.getElementById('book-business');
            const val = input ? input.value.trim() : '';
            if (!val) {
                this.shakeInput(input);
                return false;
            }
            this.formData.business = val;
        } else if (this.currentStep === 3) {
            const input = document.getElementById('book-email');
            const val = input ? input.value.trim() : '';
            if (!val || !val.includes('@')) {
                this.shakeInput(input);
                return false;
            }
            this.formData.email = val;
        } else if (this.currentStep === 4) {
            if (!this.formData.scale) {
                this.formData.scale = '5-20 Employees'; // Default fallback
            }
        } else if (this.currentStep === 5) {
            if (!this.formData.challenge) {
                this.formData.challenge = 'Workflow Automation'; // Default fallback
            }
        }
        return true;
    }

    shakeInput(el) {
        if (!el) return;
        el.classList.add('error-shake');
        el.focus();
        setTimeout(() => el.classList.remove('error-shake'), 500);
    }

    updateStepUI() {
        // Update Step Panes Visibility
        const panes = document.querySelectorAll('.booking-step-pane');
        panes.forEach(pane => pane.classList.remove('active'));

        let currentPaneId = `booking-step-${this.currentStep}`;
        if (this.currentStep === 6) currentPaneId = 'booking-step-summary';
        if (this.currentStep === 7) currentPaneId = 'booking-step-success';

        const targetPane = document.getElementById(currentPaneId);
        if (targetPane) targetPane.classList.add('active');

        // Update Progress Fill Bar & Step Counter
        if (this.progressFill) {
            const percent = Math.min(100, Math.round((this.currentStep / 6) * 100));
            this.progressFill.style.width = `${percent}%`;
        }

        if (this.stepCounter) {
            if (this.currentStep <= 5) {
                this.stepCounter.textContent = `Step ${this.currentStep} of 5`;
            } else if (this.currentStep === 6) {
                this.stepCounter.textContent = `Confirmation`;
            } else {
                this.stepCounter.textContent = `Completed`;
            }
        }

        // Update Back Button Visibility
        if (this.btnBack) {
            this.btnBack.style.visibility = (this.currentStep > 1 && this.currentStep < 7) ? 'visible' : 'hidden';
        }

        // Update Next Button Text
        if (this.btnNextText) {
            if (this.currentStep === 6) {
                this.btnNextText.textContent = 'Book My Free Strategy Session';
            } else {
                this.btnNextText.textContent = 'Continue';
            }
        }

        // Hide Footer in Success Step
        const footer = document.getElementById('booking-modal-footer');
        if (footer) {
            footer.style.display = (this.currentStep === 7) ? 'none' : 'flex';
        }

        // If Summary step, populate summary card
        if (this.currentStep === 6) {
            this.populateSummary();
        }
    }

    populateSummary() {
        const nameEl = document.getElementById('sum-val-name');
        const bizEl = document.getElementById('sum-val-business');
        const emailEl = document.getElementById('sum-val-email');
        const scaleEl = document.getElementById('sum-val-scale');
        const chalEl = document.getElementById('sum-val-challenge');

        if (nameEl) nameEl.textContent = this.formData.name || 'Client';
        if (bizEl) bizEl.textContent = this.formData.business || 'Business';
        if (emailEl) emailEl.textContent = this.formData.email || 'email@company.com';
        if (scaleEl) scaleEl.textContent = this.formData.scale || '5-20 Employees';
        if (chalEl) chalEl.textContent = this.formData.challenge || 'Workflow Automation';
    }

    submitBooking() {
        this.currentStep = 7; // Advance to Success Pane
        this.updateStepUI();

        const successEmail = document.getElementById('success-user-email');
        if (successEmail) {
            successEmail.textContent = this.formData.email || 'your email';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaBookingModal = new AriaBookingModalEngine();
});
