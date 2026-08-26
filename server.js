const http = require('http');

let activeSwapToken = "NONE";

const server = http.createServer((req, res) => {
    // Inject clean performance headers to completely stop network caching states
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Process Incoming Data Actions
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                // Read both raw text or JSON packets perfectly
                if (body.startsWith('{')) {
                    const data = JSON.parse(body);
                    activeSwapToken = data.token || "NONE";
                } else {
                    activeSwapToken = body.trim();
                }
                console.log(`[🟢 KEY MATRIX LOCKED]: ${activeSwapToken}`);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(activeSwapToken);
            } catch (err) {
                activeSwapToken = body.trim();
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(activeSwapToken);
            }
        });
    } else if (req.method === 'GET') {
        // Fallback clear handler checking inside raw query extensions
        if (req.url.includes('set=NONE') || req.url.includes('clear')) {
            activeSwapToken = "NONE";
            console.log(`[🔄 CLOUD SYSTEM RESET] Database wiped to NONE`);
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(activeSwapToken);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Unified pipeline online on port ${PORT}`);
});
