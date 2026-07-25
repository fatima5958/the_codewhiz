/**
 * FRONTEND/VOICE.JS — Web Speech API, Real-Time Lip-Sync & Host Voice Engine for Aria
 */

class AriaVoiceEngine {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis || null;
        this.selectedVoice = null;
        this.isListening = false;
        this.isSpeaking = false;
        this.lipSyncTimer = null;

        this.initSpeechRecognition();
        this.initVoiceSelection();
    }

    /**
     * Initialize Speech-to-Text Recognition API
     */
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
        } else {
            console.warn('[AriaVoiceEngine] SpeechRecognition is not supported in this browser.');
        }
    }

    /**
     * Find and select a realistic, calm, professional female voice
     */
    initVoiceSelection() {
        if (!this.synthesis) return;

        const updateVoices = () => {
            const voices = this.synthesis.getVoices();
            if (!voices.length) return;

            const preferredVoices = [
                'Google US English',
                'Samantha',
                'Victoria',
                'Zira',
                'Karen',
                'Jenny',
                'Aria',
                'Hazel',
                'Natural'
            ];

            for (const pref of preferredVoices) {
                const found = voices.find(v => v.name.toLowerCase().includes(pref.toLowerCase()) || v.voiceURI.toLowerCase().includes(pref.toLowerCase()));
                if (found) {
                    this.selectedVoice = found;
                    break;
                }
            }

            if (!this.selectedVoice) {
                this.selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) || voices[0];
            }
        };

        updateVoices();
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = updateVoices;
        }
    }

    /**
     * Start capturing user voice
     */
    startListening(onTranscript, onError, onEnd) {
        if (!this.recognition) {
            if (onError) onError('Speech recognition not available in browser.');
            return false;
        }

        if (this.isSpeaking) {
            this.stopSpeaking();
        }

        this.isListening = true;

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const currentText = finalTranscript || interimTranscript;
            if (onTranscript && currentText) {
                onTranscript(currentText, Boolean(finalTranscript));
            }
        };

        this.recognition.onerror = (event) => {
            console.error('[AriaVoiceEngine] Error:', event.error);
            this.isListening = false;
            if (onError) onError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (onEnd) onEnd();
        };

        try {
            this.recognition.start();
            return true;
        } catch (e) {
            console.error('[AriaVoiceEngine] Start error:', e);
            if (onError) onError(e.message);
            return false;
        }
    }

    /**
     * Stop capturing voice
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    /**
     * Speak text using realistic TTS & trigger real-time lip-sync pulse
     */
    speak(text, onStart, onEnd) {
        if (!this.synthesis) return;

        this.stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);
        if (this.selectedVoice) {
            utterance.voice = this.selectedVoice;
        }

        utterance.pitch = 1.05;
        utterance.rate = 0.92;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.startLipSyncAnimation();
            if (onStart) onStart();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.stopLipSyncAnimation();
            if (onEnd) onEnd();
        };

        utterance.onerror = (err) => {
            console.error('[AriaVoiceEngine] TTS error:', err);
            this.isSpeaking = false;
            this.stopLipSyncAnimation();
            if (onEnd) onEnd();
        };

        this.synthesis.speak(utterance);
    }

    /**
     * Real-time Lip-Sync & Viseme Simulation Animation
     */
    startLipSyncAnimation() {
        this.stopLipSyncAnimation();
        const lipSyncEls = document.querySelectorAll('.aria-lip-sync, #hero-aria-lips, #avatar-lips');

        this.lipSyncTimer = setInterval(() => {
            const randomHeight = Math.floor(Math.random() * 8) + 3; // 3px to 11px
            lipSyncEls.forEach(el => {
                if (el) {
                    el.style.height = `${randomHeight}px`;
                    el.style.opacity = '0.9';
                }
            });
        }, 90);
    }

    stopLipSyncAnimation() {
        if (this.lipSyncTimer) {
            clearInterval(this.lipSyncTimer);
            this.lipSyncTimer = null;
        }
        const lipSyncEls = document.querySelectorAll('.aria-lip-sync, #hero-aria-lips, #avatar-lips');
        lipSyncEls.forEach(el => {
            if (el) {
                el.style.height = '3px';
                el.style.opacity = '0';
            }
        });
    }

    /**
     * Stop speaking
     */
    stopSpeaking() {
        if (this.synthesis && this.synthesis.speaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
            this.stopLipSyncAnimation();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaVoiceEngine = new AriaVoiceEngine();
});
