const http = require('http');

let activeSwapToken = "NONE";

const server = http.createServer((req, res) => {
    // Inject headers to fully unlock the public proxy network lanes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                if (body.startsWith('{')) {
                    const data = JSON.parse(body);
                    activeSwapToken = data.token || "NONE";
                } else {
                    activeSwapToken = body.trim();
                }
            } catch (e) {
                activeSwapToken = body.trim();
            }
            console.log(`[🟢 KEY LOCKED]: ${activeSwapToken}`);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(activeSwapToken);
        });
    } else if (req.method === 'GET') {
        if (req.url.includes('set=NONE') || req.url.includes('clear')) {
            activeSwapToken = "NONE";
            console.log(`[🔄 SYSTEM RESET] Token wiped back to NONE`);
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(activeSwapToken);
    }
});

// ✅ THE EXACT PORT BINDING RENDER EXPECTS
// Render automatically handles its own routing by giving you an environment PORT variable.
const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Pipeline fully open to proxy routing networks on port ${PORT}`);
});
