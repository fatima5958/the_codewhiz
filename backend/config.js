const path = require('path');
const fs = require('fs');

/**
 * Environment configuration loader
 */
function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key) {
                    process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
                }
            }
        });
    }
}

loadEnv();

module.exports = {
    port: process.env.PORT || 3001,
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    systemPrompt: `You are Aria, an AI business consultant for an AI automation agency "The Code Whiz AI Lab". You help businesses understand how AI can improve operations, marketing, customer support, and growth. Give concise, highly valuable, and actionable answers (2-3 sentences max). Sound like a premium consultant, not a generic chatbot.`
};
