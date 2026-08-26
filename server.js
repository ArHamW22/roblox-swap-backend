const http = require('http');

let activeSwapToken = "NONE";

const server = http.createServer((req, res) => {
    // Inject performance response headers to fully stop proxy caching states
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

    // ✅ FIXED CRASH-PROOF STRING PARSING:
    // Strips away complex URL engines. Natively extracts text parameters directly from the address line!
    if (req.method === 'GET') {
        const urlString = req.url || '';
        
        if (urlString.includes('?set=')) {
            const splitParts = urlString.split('?set=');
            if (splitParts[1]) {
                // Decode the data safely from the address bar layout
                activeSwapToken = decodeURIComponent(splitParts[1].trim());
                console.log(`[🟢 CLOUD KEY MATRIX LOCKED]: ${activeSwapToken}`);
            }
        } else if (urlString.includes('set=NONE') || urlString.includes('clear')) {
            activeSwapToken = "NONE";
            console.log(`[🔄 CLOUD SYSTEM RESET] Wiped back to NONE`);
        }
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(activeSwapToken);
});

// ✅ FIXED ENVIRONMENT EXPOSURE:
// Reads Render's exact dynamic host port strings cleanly
const PORT = process.env.PORT || 10000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Pipeline fully open to proxy routing networks on port ${PORT}`);
});
