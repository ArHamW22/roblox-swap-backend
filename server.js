const http = require('http');

let activeSwapToken = "NONE";

const server = http.createServer((req, res) => {
    // Inject headers to bypass internal engine storage states
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            activeSwapToken = body.trim();
            console.log(`[🟢 ACTIVE SWAP PAYLOAD]: ${activeSwapToken}`);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('TOKEN_STORED');
        });
    } else if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(activeSwapToken);
    }
});

server.listen(process.env.PORT || 3000, () => {
    console.log("Data sync pool operational.");
});
