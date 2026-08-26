const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ THE CRITICAL BUG FIX: Allows the server to read BOTH JSON and raw text streams flawlessly
app.use(express.json());
app.use(express.text());

let latestJobId = "NONE";

// Main game server writes the data here
app.post('/swap', (req, res) => {
    // Safely parse out the ID whether Roblox sends it as JSON or basic text
    if (req.body && typeof req.body === 'object' && req.body.TargetJobId) {
        latestJobId = req.body.TargetJobId;
    } else if (typeof req.body === 'string') {
        latestJobId = req.body;
    }
    
    console.log(`[🟢 SUCCESS] New active swap ticket stored in memory: ${latestJobId}`);
    res.status(200).send("STORED");
});

// Alt account constantly reads the active JobId here
app.get('/swap', (req, res) => {
    res.status(200).send(latestJobId);
});

// Root check route to stop the "Cannot GET /" warning screen
app.get('/', (req, res) => {
    res.status(200).send(`Server is running! Current Active Slot Token: ${latestJobId}`);
});

app.listen(PORT, () => {
    console.log(`Zero-delay pipeline router active on port ${PORT}`);
});
