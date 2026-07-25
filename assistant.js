/**
 * ASSISTANT.JS — State Machine, AI NLP Engine & Interaction Controller for Aria
 */

class AriaAssistant {
    constructor() {
        this.state = 'IDLE'; // IDLE | LISTENING | THINKING | SPEAKING
        this.voiceEngine = window.ariaVoiceEngine;

        // Common NLP response database
        this.knowledgeBase = [
            {
                keywords: ['help', 'business', 'automate', 'benefit', 'why ai', 'how can ai'],
                response: "AI can automate repetitive tasks, improve customer experience, and help your business grow faster."
            },
            {
                keywords: ['services', 'offer', 'build', 'do you do', 'what do you build'],
                response: "We design autonomous AI agents, automated workflow pipelines, and custom WebGL platforms to scale your operations."
            },
            {
                keywords: ['cost', 'price', 'pricing', 'audit', 'roi'],
                response: "Every strategy is tailored for your business. Get a free AI audit to discover your potential ROI."
            },
            {
                keywords: ['who are you', 'name', 'who is aria', 'what are you'],
                response: "I'm Aria, your AI business partner at The Code Whiz AI Lab. I help companies discover smarter ways to automate and innovate."
            }
        ];

        this.fallbackResponses = [
            "I can analyze your business workflows, build automated AI systems, and help you scale faster.",
            "Our team at The Code Whiz builds custom AI agents that save hundreds of hours of manual work.",
            "We integrate intelligent automation directly into your business stack for maximum efficiency."
        ];

        this.initDOMElements();
        this.bindEvents();
    }

    initDOMElements() {
        this.statusBadgeText = document.querySelector('.status-badge-text');
        this.statusDot = document.querySelector('.status-dot-online');
        this.typingPillText = document.getElementById('aria-typing-text');
        this.typingPill = document.getElementById('aria-typing-pill');
        this.ambientGlow = document.querySelector('.aria-ambient-glow');
        this.btnTalkList = document.querySelectorAll('#btn-talk-with-aria, .btn-talk-glass');
        this.userBubbleText = document.querySelector('.user-bubble .bubble-text');
        this.ariaBubbleText = document.querySelector('.aria-bubble .bubble-text');
        this.chatCard = document.querySelector('.aria-chat-demo-card');
        this.waveform = document.getElementById('aria-waveform');
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

        // Start listening
        this.setState('LISTENING');

        const success = this.voiceEngine.startListening(
            (transcript, isFinal) => {
                // Update live user chat bubble text
                if (this.userBubbleText) {
                    this.userBubbleText.textContent = `"${transcript}"`;
                }

                if (isFinal) {
                    this.processUserQuery(transcript);
                }
            },
            (errorMsg) => {
                console.warn('[AriaAssistant] Voice input error:', errorMsg);
                // Demo fallback simulation if microphone permission is denied or unavailable
                this.simulateDemoConversation();
            },
            () => {
                if (this.state === 'LISTENING') {
                    // If finished listening without final result, process existing text
                    const currentQuery = this.userBubbleText ? this.userBubbleText.textContent.replace(/"/g, '') : '';
                    if (currentQuery && currentQuery !== 'How can AI help my business?') {
                        this.processUserQuery(currentQuery);
                    } else {
                        this.setState('IDLE');
                    }
                }
            }
        );

        if (!success) {
            // Fallback simulation for unsupported environments
            this.simulateDemoConversation();
        }
    }

    /**
     * Process recognized user query with NLP matching
     */
    processUserQuery(queryText) {
        this.setState('THINKING');

        const normalized = queryText.toLowerCase();
        let match = this.knowledgeBase.find(kb => kb.keywords.some(kw => normalized.includes(kw)));
        let aiResponse = match ? match.response : this.getRandomFallback();

        // Simulate thinking & typing animation
        setTimeout(() => {
            if (this.ariaBubbleText) {
                this.ariaBubbleText.textContent = `"${aiResponse}"`;
            }

            this.setState('SPEAKING');
            this.voiceEngine.speak(
                aiResponse,
                () => { this.setState('SPEAKING'); },
                () => { this.setState('IDLE'); }
            );
        }, 800);
    }

    /**
     * Fallback interactive demo flow
     */
    simulateDemoConversation() {
        this.setState('THINKING');

        const demoQuery = "How can AI help my business?";
        const demoResponse = "AI can automate repetitive tasks, improve customer experience, and help your business grow faster.";

        if (this.userBubbleText) this.userBubbleText.textContent = `"${demoQuery}"`;

        setTimeout(() => {
            if (this.ariaBubbleText) this.ariaBubbleText.textContent = `"${demoResponse}"`;

            this.setState('SPEAKING');
            this.voiceEngine.speak(
                demoResponse,
                () => { this.setState('SPEAKING'); },
                () => { this.setState('IDLE'); }
            );
        }, 700);
    }

    getRandomFallback() {
        const idx = Math.floor(Math.random() * this.fallbackResponses.length);
        return this.fallbackResponses[idx];
    }

    /**
     * State Machine Updater
     */
    setState(newState) {
        this.state = newState;

        // Reset classes
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
                if (this.statusBadgeText) this.statusBadgeText.textContent = 'ARIA • AI Business Assistant';
                if (this.typingPillText) this.typingPillText.textContent = 'Ready to help.';
                break;

            case 'LISTENING':
                if (this.statusBadgeText) this.statusBadgeText.textContent = 'ARIA • Listening...';
                if (this.statusDot) this.statusDot.classList.add('listening');
                if (this.typingPillText) this.typingPillText.textContent = 'Listening to your prompt...';
                if (this.ambientGlow) this.ambientGlow.classList.add('is-listening');
                break;

            case 'THINKING':
                if (this.statusBadgeText) this.statusBadgeText.textContent = 'ARIA • Thinking...';
                if (this.statusDot) this.statusDot.classList.add('thinking');
                if (this.typingPillText) this.typingPillText.textContent = 'Creating response...';
                break;

            case 'SPEAKING':
                if (this.statusBadgeText) this.statusBadgeText.textContent = 'ARIA • Speaking...';
                if (this.statusDot) this.statusDot.classList.add('speaking');
                if (this.typingPillText) this.typingPillText.textContent = 'Aria is speaking';
                if (this.ambientGlow) this.ambientGlow.classList.add('is-speaking');
                if (this.waveform) this.waveform.classList.add('active');
                break;
        }
    }
}

// Initialize when DOM content is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ariaAssistant = new AriaAssistant();
});
