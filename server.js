const express = require('express');
const app = express();
app.use(express.json());

// Stores the last triggered job ID at the root level
let globalTargetJobId = "NONE";
let globalToken = "NONE";

// Main game posts straight to the root domain
app.post('/', (req, res) => {
    const { targetJobId, token } = req.body;
    if (targetJobId && token) {
        globalTargetJobId = targetJobId;
        globalToken = token;
        return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: "Missing data fields" });
});

// Alt account reads straight from the root domain
app.get('/', (req, res) => {
    return res.status(200).json({ 
        targetJobId: globalTargetJobId, 
        token: globalToken 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Matrix Web Pipeline active on port ${PORT}`));
