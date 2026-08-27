const express = require('express');
const app = express();
app.use(express.json());

let globalTargetJobId = "NONE";
let globalToken       = "NONE";
let globalPlayerName  = "NONE";
let globalJoined      = false;
let rejoinData = { altRejoin: false, rejoinJobId: "NONE" };

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

app.get('/', (req, res) => {
    return res.status(200).json({
        targetJobId: globalTargetJobId,
        token:       globalToken,
        playerName:  globalPlayerName,
        joined:      globalJoined
    });
});

app.post('/rejoin', (req, res) => {
    const { altRejoin, rejoinJobId } = req.body;
    if (typeof altRejoin === 'boolean' && rejoinJobId) {
        rejoinData   = { altRejoin, rejoinJobId };
        if (altRejoin === true) globalJoined = true;
        return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: "Missing data fields" });
});

app.get('/rejoin', (req, res) => {
    return res.status(200).json({ ...rejoinData, joined: globalJoined });
});

app.post('/clear', (req, res) => {
    globalTargetJobId = "NONE";
    globalToken       = "NONE";
    globalPlayerName  = "NONE";
    globalJoined      = false;
    rejoinData        = { altRejoin: false, rejoinJobId: "NONE" };
    return res.status(200).json({ success: true });
});

app.get('/panel', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Swap Panel</title>
  <style>
    body { font-family: sans-serif; display: flex; flex-direction: column;
           align-items: center; justify-content: center; height: 100vh;
           margin: 0; background: #0f0f0f; color: #fff; }
    button { padding: 14px 36px; font-size: 16px; background: #e24b4a;
             color: #fff; border: none; border-radius: 8px; cursor: pointer; }
    button:hover { background: #c93938; }
    #msg { margin-top: 16px; font-size: 13px; color: #aaa; }
  </style>
</head>
<body>
  <button onclick="clearIt()">Clear logs</button>
  <p id="msg"></p>
  <script>
    async function clearIt() {
      document.getElementById('msg').textContent = 'Clearing...';
      const r = await fetch('/clear', { method: 'POST' });
      document.getElementById('msg').textContent = r.ok ? '✓ Cleared.' : 'Something went wrong.';
    }
  </script>
</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Matrix Web Pipeline active on port ${PORT}`));
