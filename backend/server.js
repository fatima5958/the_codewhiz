const http = require('http');
const config = require('./config');
const { generateAriaResponse } = require('./ai');

const server = http.createServer(async (req, res) => {
    // CORS headers for secure frontend requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Health check endpoint
    if (req.method === 'GET' && req.url === '/api/aria/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'online', service: 'Aria AI Consultant Backend' }));
        return;
    }

    // AI Chat API endpoint
    if (req.method === 'POST' && req.url === '/api/aria/chat') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                let data = {};
                try {
                    data = JSON.parse(body || '{}');
                } catch (pErr) {
                    try {
                        const cleaned = (body || '{}').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                        data = JSON.parse(cleaned);
                    } catch (e2) {
                        data = { message: (body || '').replace(/[^a-zA-Z0-9\s?]/g, ' ').trim() };
                    }
                }
                
                const userQuery = data.message || '';
                const history = data.history || [];

                if (!userQuery) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User message query is required.' }));
                    return;
                }

                const result = await generateAriaResponse(userQuery, history);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (err) {
                console.error('[Server Error]', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Aria is temporarily unavailable. Please try again.' }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(config.port, () => {
    console.log(`[Aria Backend] Server running at http://localhost:${config.port}/api/aria/chat`);
});
