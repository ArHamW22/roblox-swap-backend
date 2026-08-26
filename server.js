const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.text());

let latestJobId = "NONE";

// Main game server writes the active JobId here
app.post('/swap', (req, res) => {
    latestJobId = req.body;
    console.log(`[LOG] New active swap ticket stored: ${latestJobId}`);
    res.status(200).send("STORED");
});

// Alt account constantly reads the active JobId here
app.get('/swap', (req, res) => {
    res.status(200).send(latestJobId);
});

app.listen(PORT, () => {
    console.log(`Zero-delay pipeline router active on port ${PORT}`);
});
