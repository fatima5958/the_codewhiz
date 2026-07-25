/**
 * FRONTEND/ASSISTANT.JS — AI Business Consultant Assistant Engine
 */

class AriaAssistant {
    constructor() {
        this.state = 'IDLE'; // IDLE | LISTENING | THINKING | SPEAKING
        this.voiceEngine = window.ariaVoiceEngine;
        this.chatUI = window.ariaChatUI;
        this.apiEndpoint = 'http://localhost:3001/api/aria/chat';

        this.initDOMElements();
        this.bindEvents();
    }

    initDOMElements() {
        this.statusBadgeText = document.getElementById('hero-status-text') || document.querySelector('.status-badge-text');
        this.statusDot = document.getElementById('hero-status-dot') || document.querySelector('.status-dot-online');
        this.typingPillText = document.getElementById('aria-typing-text');
        this.ambientGlow = document.getElementById('aria-glow') || document.querySelector('.aria-ambient-glow');
        this.btnTalkList = document.querySelectorAll('#btn-talk-with-aria, .btn-talk-glass');
        this.waveform = document.getElementById('aria-waveform');
        this.chatStream = document.getElementById('aria-chat-stream');
    }

    bindEvents() {
        this.btnTalkList.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleVoiceButtonClick();
            });
        });
    }

    handleVoiceButtonClick() {
        if (this.state === 'LISTENING') {
            this.voiceEngine.stopListening();
            this.setState('IDLE');
            return;
        }

        if (this.state === 'SPEAKING') {
            this.voiceEngine.stopSpeaking();
            this.setState('IDLE');
            return;
        }

        this.setState('LISTENING');

        const success = this.voiceEngine.startListening(
            (transcript, isFinal) => {
                if (this.chatUI) {
                    this.chatUI.updateUserMessage(transcript);
                }

                if (isFinal) {
                    this.processUserQuery(transcript);
                }
            },
            (errorMsg) => {
                console.warn('[AriaAssistant] Voice input notice:', errorMsg);
                this.processUserQuery("How can AI help my business?");
            },
            () => {
                if (this.state === 'LISTENING') {
                    const currentQuery = this.chatUI && this.chatUI.userBubbleText ? 
                        this.chatUI.userBubbleText.textContent.replace(/"/g, '') : '';

                    if (currentQuery && currentQuery !== 'How can AI help my business?') {
                        this.processUserQuery(currentQuery);
                    } else {
                        this.setState('IDLE');
                    }
                }
            }
        );

        if (!success) {
            this.processUserQuery("How can AI help my business?");
        }
    }

    /**
     * Process User Query via Backend API (/api/aria/chat)
     */
    async processUserQuery(queryText) {
        if (this.chatUI) {
            this.chatUI.updateUserMessage(queryText);
        }

        this.updateChatStream(queryText, null);
        this.setState('THINKING');

        try {
            const historyPayload = this.chatUI ? this.chatUI.history : [];

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: queryText,
                    history: historyPayload
                })
            });

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }

            const data = await response.json();

            if (data && data.success && data.response) {
                this.handleAriaResponse(data.response, queryText);
            } else {
                throw new Error(data.error || 'Invalid API response format');
            }
        } catch (err) {
            console.warn('[AriaAssistant] Backend API unavailable or offline, using consultant fallback module:', err);
            const fallbackResp = this.getFallbackConsultantResponse(queryText);
            this.handleAriaResponse(fallbackResp, queryText);
        }
    }

    /**
     * Handle AI Response Text, Chat UI Update, and Voice Output
     */
    handleAriaResponse(aiResponseText, originalQuery = "") {
        if (this.chatUI) {
            this.chatUI.updateAriaMessage(aiResponseText);
        }

        this.updateChatStream(originalQuery, aiResponseText);
        this.setState('SPEAKING');

        this.voiceEngine.speak(
            aiResponseText,
            () => { this.setState('SPEAKING'); },
            () => { this.setState('IDLE'); }
        );
    }

    updateChatStream(userText, ariaText) {
        if (!this.chatStream) return;

        if (userText && !ariaText) {
            this.chatStream.innerHTML = `
                <div class="chat-bubble-pill bubble-user">
                    <span class="b-icon">👤</span>
                    <span class="b-text">"${userText}"</span>
                </div>
                <div class="bubble-flow-arrow">↓</div>
                <div class="chat-bubble-pill bubble-aria">
                    <span class="b-icon">✨</span>
                    <span class="b-text">Aria is creating response...</span>
                </div>
            `;
        } else if (userText && ariaText) {
            const shortAria = ariaText.length > 50 ? ariaText.substring(0, 48) + '...' : ariaText;
            this.chatStream.innerHTML = `
                <div class="chat-bubble-pill bubble-user">
                    <span class="b-icon">👤</span>
                    <span class="b-text">"${userText}"</span>
                </div>
                <div class="bubble-flow-arrow">↓</div>
                <div class="chat-bubble-pill bubble-aria">
                    <span class="b-icon">✨</span>
                    <span class="b-text">"${shortAria}"</span>
                </div>
            `;
        }
    }

    /**
     * Local Consultant Fallback Matrix if API is unreachable
     */
    getFallbackConsultantResponse(query) {
        const q = query.toLowerCase();

        if (q.includes('restaurant') || q.includes('food') || q.includes('cafe')) {
            return "AI can automate reservations, answer customer questions 24/7, collect reviews, and help you bring more customers through targeted marketing.";
        }
        if (q.includes('automate') || q.includes('automation') || q.includes('workflow')) {
            return "AI automation streamlines your repetitive workflows, eliminates manual data entry, and integrates your business tools into a 24/7 autonomous pipeline.";
        }
        if (q.includes('strategy') || q.includes('company') || q.includes('roadmap')) {
            return "We start with a thorough audit of your current bottleneck workflows, identify high-ROI AI integration points, and deploy custom intelligent agents tailored to your scale.";
        }
        if (q.includes('service') || q.includes('provide') || q.includes('offer')) {
            return "We specialize in autonomous AI business agents, workflow automation pipelines, custom digital platforms, and predictive analytics engines.";
        }

        return "AI can help your business by automating routine operations, enhancing customer touchpoints 24/7, and unlocking actionable growth insights from your data.";
    }

    /**
     * State Machine Controller
     */
    setState(newState) {
        this.state = newState;

        if (this.statusDot) {
            this.statusDot.classList.remove('listening', 'thinking', 'speaking');
        }

        if (this.ambientGlow) {
            this.ambientGlow.classList.remove('is-listening', 'is-speaking');
        }

        if (this.waveform) {
            this.waveform.classList.remove('active');
        }

        switch (newState) {
            case 'IDLE':
                if (this.statusBadgeText) this.statusBadgeText.textContent = 'ARIA ONLINE';
                if (this.typingPillText) this.typingPillText.textContent = 'Ready to help.';
                break;

            case 'LISTENING':
                if (this.statusBadgeText) this.statusBadgeText.textContent = 'ARIA LISTENING';
                if (this.statusDot) this.statusDot.classList.add('listening');
                if (this.typingPillText) this.typingPillText.textContent = 'Listening to your prompt...';
                if (this.ambientGlow) this.ambientGlow.classList.add('is-listening');
                break;

            case 'THINKING':
                if (this.statusBadgeText) this.statusBadgeText.textContent = 'ARIA THINKING';
                if (this.statusDot) this.statusDot.classList.add('thinking');
                if (this.typingPillText) this.typingPillText.textContent = 'Aria is creating strategy...';
                break;

            case 'SPEAKING':
                if (this.statusBadgeText) this.statusBadgeText.textContent = 'ARIA SPEAKING';
                if (this.statusDot) this.statusDot.classList.add('speaking');
                if (this.typingPillText) this.typingPillText.textContent = 'Aria is speaking';
                if (this.ambientGlow) this.ambientGlow.classList.add('is-speaking');
                if (this.waveform) this.waveform.classList.add('active');
                break;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaAssistant = new AriaAssistant();
});
