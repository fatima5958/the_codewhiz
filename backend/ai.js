const https = require('https');
const config = require('./config');

/**
 * Generate Aria AI Business Consultant response
 */
async function generateAriaResponse(userQuery, conversationHistory = []) {
    const apiKey = config.geminiApiKey;

    // Use intelligent fallback consultant response if no API key is provided
    if (!apiKey) {
        return getFallbackConsultantResponse(userQuery);
    }

    try {
        const contents = [
            {
                role: 'user',
                parts: [{ text: `${config.systemPrompt}\n\nUser Question: ${userQuery}` }]
            }
        ];

        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
            const historyParts = conversationHistory
                .filter(msg => msg && msg.text)
                .slice(-4)
                .map(msg => `${msg.sender || 'User'}: ${msg.text}`)
                .join('\n');

            if (historyParts) {
                contents[0].parts[0].text = `${config.systemPrompt}\n\nRecent Conversation History:\n${historyParts}\n\nUser Question: ${userQuery}`;
            }
        }

        const requestData = JSON.stringify({
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 250
            }
        });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        return new Promise((resolve) => {
            const req = https.request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestData)
                }
            }, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(body);
                        if (json.candidates && json.candidates[0] && json.candidates[0].content) {
                            const text = json.candidates[0].content.parts[0].text.trim();
                            resolve({ success: true, response: text });
                        } else {
                            console.warn('[Backend AI] Gemini API response parsing fallback:', body);
                            resolve(getFallbackConsultantResponse(userQuery));
                        }
                    } catch (err) {
                        console.error('[Backend AI] JSON error:', err);
                        resolve(getFallbackConsultantResponse(userQuery));
                    }
                });
            });

            req.on('error', (err) => {
                console.error('[Backend AI] Network request error:', err);
                resolve(getFallbackConsultantResponse(userQuery));
            });

            req.write(requestData);
            req.end();
        });
    } catch (e) {
        console.error('[Backend AI] Error:', e);
        return getFallbackConsultantResponse(userQuery);
    }
}

/**
 * Intelligent Consultant Fallback Matrix
 */
function getFallbackConsultantResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('restaurant') || q.includes('food') || q.includes('cafe')) {
        return {
            success: true,
            response: "AI can automate reservations, answer customer questions 24/7, collect reviews, and help you bring more customers through targeted marketing."
        };
    }
    if (q.includes('automate') || q.includes('automation') || q.includes('workflow')) {
        return {
            success: true,
            response: "AI automation streamlines your repetitive workflows, eliminates manual data entry, and integrates your business tools into a 24/7 autonomous pipeline."
        };
    }
    if (q.includes('strategy') || q.includes('company') || q.includes('roadmap')) {
        return {
            success: true,
            response: "We start with a thorough audit of your current bottleneck workflows, identify high-ROI AI integration points, and deploy custom intelligent agents tailored to your scale."
        };
    }
    if (q.includes('service') || q.includes('provide') || q.includes('offer')) {
        return {
            success: true,
            response: "We specialize in autonomous AI business agents, workflow automation pipelines, custom digital platforms, and predictive analytics engines."
        };
    }

    return {
        success: true,
        response: "AI can help your business by automating routine operations, enhancing customer touchpoints 24/7, and unlocking actionable growth insights from your data."
    };
}

module.exports = {
    generateAriaResponse
};
