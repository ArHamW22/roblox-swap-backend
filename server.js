const http = require('http');

let activeSwapToken = "NONE";

const server = http.createServer((req, res) => {
    // Inject performance response headers to bypass internal caches
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Handle preflight OPTIONS requests smoothly
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Process endpoints safely
    if (req.url.startsWith('/swap')) {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                activeSwapToken = body.trim();
                console.log(`[🟢 ACTIVE TOKEN REGISTERED]: ${activeSwapToken}`);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('TOKEN_SAVED');
            });
        } else if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(activeSwapToken);
        }
    } else {
        // Fallback root path validation checks
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Server is running! Current Active Slot Token: ${activeSwapToken}`);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Data sync pool operational on port ${PORT}`);
});
