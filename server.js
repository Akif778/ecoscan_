const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname)));

// API proxy - OpenRouter'a gönderir
async function chatHandler(req, res) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.post('/api/chat', chatHandler);
app.post('/chat', chatHandler); // eski uyumluluk için

app.listen(3000, () => console.log('EcoScan çalışıyor → http://localhost:3000/login.html'));
