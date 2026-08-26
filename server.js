const http = require('http');

let activeSwapToken = "NONE";

const server = http.createServer((req, res) => {
    // Force clean performance response headers to stop internal proxy caching
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

    // Process Outbound and Inbound Swap Parameters Natively on Root Path
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
                console.log(`[🟢 CLOUD DATA SYNCED]: ${activeSwapToken}`);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(activeSwapToken);
            } catch (err) {
                activeSwapToken = body.trim();
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(activeSwapToken);
            }
        });
    } else if (req.method === 'GET') {
        if (req.url.includes('set=NONE') || req.url.includes('clear')) {
            activeSwapToken = "NONE";
            console.log(`[🔄 CLOUD SYSTEM RESET] Database wiped to NONE`);
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(activeSwapToken);
    }
});

// 🔓 FIXED ENVIRONMENT PORT EXPOSURE GATE:
// Render dynamically populates process.env.PORT. We must listen on it exactly!
const PORT = process.env.PORT || 10000; 
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`Pipeline fully open to proxy routing networks on port ${PORT}`);
});
