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
    const wantsHTML = req.headers.accept && req.headers.accept.includes('text/html');
    if (!wantsHTML) {
        return res.status(200).json({
            targetJobId: globalTargetJobId,
            token:       globalToken,
            playerName:  globalPlayerName,
            joined:      globalJoined
        });
    }
    res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Swap Panel</title>
  <meta charset="utf-8">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Courier New',monospace;background:#0f0f0f;color:#e0e0e0;
         display:flex;flex-direction:column;align-items:center;
         justify-content:center;min-height:100vh;gap:24px}
    h1{font-size:16px;color:#888;letter-spacing:3px;text-transform:uppercase}
    .card{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;
          padding:28px 36px;min-width:340px}
    .row{display:flex;justify-content:space-between;align-items:center;
         padding:9px 0;border-bottom:1px solid #1f1f1f}
    .row:last-child{border-bottom:none}
    .key{color:#666;font-size:12px;letter-spacing:1px}
    .val{color:#e0e0e0;font-size:13px;max-width:210px;overflow:hidden;
         text-overflow:ellipsis;white-space:nowrap}
    .t{color:#4caf50}.f{color:#e24b4a}
    button{padding:12px 36px;font-size:13px;font-family:'Courier New',monospace;
           background:#e24b4a;color:#fff;border:none;border-radius:8px;
           cursor:pointer;letter-spacing:2px;text-transform:uppercase;
           transition:background .2s}
    button:hover{background:#c93938}
    #msg{font-size:11px;color:#555;min-height:16px;letter-spacing:1px}
    .dot{width:7px;height:7px;border-radius:50%;background:#4caf50;
         display:inline-block;margin-right:10px;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
  </style>
</head>
<body>
  <h1><span class="dot"></span>Swap Backend</h1>
  <div class="card">
    <div class="row"><span class="key">TARGET JOB ID</span><span class="val" id="v-job">—</span></div>
    <div class="row"><span class="key">TOKEN</span><span class="val" id="v-tok">—</span></div>
    <div class="row"><span class="key">PLAYER NAME</span><span class="val" id="v-name">—</span></div>
    <div class="row"><span class="key">JOINED</span><span class="val" id="v-joined">—</span></div>
  </div>
  <button onclick="clearIt()">Clear Logs</button>
  <p id="msg"></p>
  <script>
    async function poll(){
      try{
        const r=await fetch('/',{headers:{Accept:'application/json'}});
        const d=await r.json();
        document.getElementById('v-job').textContent  = d.targetJobId;
        document.getElementById('v-tok').textContent  = d.token;
        document.getElementById('v-name').textContent = d.playerName;
        const j=document.getElementById('v-joined');
        j.textContent=String(d.joined);
        j.className='val '+(d.joined?'t':'f');
      }catch(_){}
    }
    async function clearIt(){
      const msg=document.getElementById('msg');
      msg.textContent='Clearing...';
      const r=await fetch('/clear',{method:'POST'});
      msg.textContent=r.ok?'✓ Cleared.':'✗ Failed.';
      poll();
    }
    poll();
    setInterval(poll,2000);
  </script>
</body>
</html>`);
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
