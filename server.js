const express = require('express');
const app = express();
app.use(express.json());

// Memory cache to hold active server tracking data
let activeHandshakes = {};

// Main game server hits this endpoint to post a tracking token
app.post('/sync', (req, res) => {
    const { targetJobId, token } = req.body;
    if (targetJobId && token) {
        activeHandshakes[targetJobId] = token;
        return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: "Missing data fields" });
});

// Alt account loops this endpoint to verify state matches
app.get('/check/:jobId', (req, res) => {
    const jobId = req.params.jobId;
    const token = activeHandshakes[jobId] || "NONE";
    return res.status(200).json({ token: token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Matrix Web Pipeline running on port ${PORT}`));
