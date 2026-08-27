const express = require('express');
const app = express();
app.use(express.json());

let globalTargetJobId = "NONE";
let globalToken       = "NONE";
let globalPlayerName  = "NONE";
let globalJoined      = false;
let rejoinData = { altRejoin: false, rejoinJobId: "NONE" };

// main game posts swap signal
app.post('/', (req, res) => {
    const { targetJobId, token, playerName } = req.body;
    if (targetJobId && token) {
        globalTargetJobId = targetJobId;
        globalToken       = token;
        globalPlayerName  = playerName || "NONE";
        globalJoined      = false;
        rejoinData        = { altRejoin: false, rejoinJobId: "NONE" };
        return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: "Missing data fields" });
});

// alt 1 reads swap signal
app.get('/', (req, res) => {
    return res.status(200).json({
        targetJobId: globalTargetJobId,
        token:       globalToken,
        playerName:  globalPlayerName,
        joined:      globalJoined
    });
});

// alt 2 posts when teleported player joins
app.post('/rejoin', (req, res) => {
    const { altRejoin, rejoinJobId } = req.body;
    if (typeof altRejoin === 'boolean' && rejoinJobId) {
        rejoinData   = { altRejoin, rejoinJobId };
        if (altRejoin === true) globalJoined = true;
        return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: "Missing data fields" });
});

// joiner account polls this
app.get('/rejoin', (req, res) => {
    return res.status(200).json({ ...rejoinData, joined: globalJoined });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Matrix Web Pipeline active on port ${PORT}`));
