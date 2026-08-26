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

    // ✅ FIXED CORE ROOT DATABANK:
    // Process every single network operation directly on your root home domain path
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            activeSwapToken = body.trim();
            console.log(`[🟢 CLOUD KEY REGISTERED]: ${activeSwapToken}`);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(activeSwapToken);
        });
    } else if (req.method === 'GET') {
        // Automatically checks if a manual reset request has been issued
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const setParam = parsedUrl.searchParams.get('set');
        
        if (setParam) {
            activeSwapToken = setParam;
            console.log(`[🔄 MANUAL CLOUD RESET]: ${activeSwapToken}`);
        }
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(activeSwapToken);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Root alignment database matrix active on port ${PORT}`);
});
