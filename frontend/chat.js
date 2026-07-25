/**
 * FRONTEND/CHAT.JS — Chat UI, Session History & Suggested Prompts for Aria
 */

class AriaChatUI {
    constructor() {
        this.history = [];
        this.suggestedPrompts = [
            "How can AI automate my business?",
            "Create an AI strategy for my company",
            "What services do you provide?"
        ];

        this.initDOMElements();
        this.renderSuggestedPrompts();
    }

    initDOMElements() {
        this.chatCard = document.querySelector('.aria-chat-demo-card');
        this.userBubbleText = document.querySelector('.user-bubble .bubble-text');
        this.ariaBubbleText = document.querySelector('.aria-bubble .bubble-text');
        this.ariaBubbleContainer = document.querySelector('.chat-demo-bubble.aria-bubble');
    }

    /**
     * Render interactive suggested prompt pills under the chat card
     */
    renderSuggestedPrompts() {
        if (!this.chatCard) return;

        let suggestionsContainer = this.chatCard.querySelector('.aria-suggested-prompts');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'aria-suggested-prompts';
            this.chatCard.appendChild(suggestionsContainer);
        }

        suggestionsContainer.innerHTML = '';
        this.suggestedPrompts.forEach(prompt => {
            const pill = document.createElement('button');
            pill.className = 'suggested-pill';
            pill.textContent = prompt;
            pill.addEventListener('click', () => {
                if (window.ariaAssistant) {
                    window.ariaAssistant.processUserQuery(prompt);
                }
            });
            suggestionsContainer.appendChild(pill);
        });
    }

    /**
     * Add message to session conversation history
     */
    addToHistory(sender, text) {
        this.history.push({ sender, text, timestamp: new Date().toISOString() });
    }

    /**
     * Update User Message Bubble
     */
    updateUserMessage(text) {
        if (this.userBubbleText) {
            this.userBubbleText.textContent = `"${text}"`;
        }
        this.addToHistory('User', text);
    }

    /**
     * Update Aria Response Bubble with smooth text animation
     */
    updateAriaMessage(text) {
        if (this.ariaBubbleText) {
            this.ariaBubbleText.textContent = `"${text}"`;
        }
        this.addToHistory('Aria', text);
    }

    /**
     * Display Error Message if AI service fails
     */
    showError(errorMsg = "Aria is temporarily unavailable. Please try again.") {
        if (this.ariaBubbleText) {
            this.ariaBubbleText.textContent = `"${errorMsg}"`;
        }
    }
}

window.ariaChatUI = new AriaChatUI();
