const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// ── Helper: forward API call to Anthropic ──
function callAnthropic(body, callback) {
  const data = JSON.stringify(body);
  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': ANTHROPIC_API_KEY,
      'Content-Length': Buffer.byteLength(data),
    },
  };
  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      try { callback(null, JSON.parse(body)); }
      catch(e) { callback(e); }
    });
  });
  req.on('error', callback);
  req.write(data);
  req.end();
}

const server = http.createServer((req, res) => {
  // CORS headers — allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve wayfari.html
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const filePath = path.join(__dirname, 'wayfari.html');
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('wayfari.html not found'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // AI destination generator endpoint
  if (req.method === 'POST' && req.url === '/api/generate') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { destName, emoji, days, budget, people, interests } = JSON.parse(body);

        if (!ANTHROPIC_API_KEY) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set. See setup instructions.' }));
          return;
        }

        const prompt =
          `You are a world-class travel expert for ${destName}. Create a REAL ${days}-day itinerary for ${people} people, $${budget} budget, interests: ${interests}.\n` +
          `CRITICAL: Use ONLY real famous places that actually exist in ${destName}. Real restaurant names, real museum names, real landmark names. NO generic names ever.\n` +
          `Return ONLY valid JSON no markdown:\n` +
          `{"days":[{"day":1,"theme":"Theme name","activities":[` +
          `{"time":"9:00am","name":"REAL place name in ${destName}","cost":15,"icon":"emoji","tip":"Specific insider tip for this exact place"}` +
          `]}],` +
          `"hotels":[{"id":"h1","name":"Real hotel in ${destName}","stars":4,"area":"Real neighbourhood","price":90,"orig":130,"rating":4.7,"reviews":1200,"perks":["perk1","perk2","perk3"],"badge":"Best Value","bc":"#10b981","commission":"7%"}],` +
          `"tours":[{"id":"t1","name":"Real tour in ${destName}","dur":"3 hrs","price":35,"orig":55,"rating":4.8,"reviews":1500,"includes":"specific inclusions","icon":"emoji","badge":"Top Rated","bc":"#f59e0b","commission":"12%"}],` +
          `"bestTime":"best months to visit","localTip":"powerful insider tip","highlight":"why visit ${destName}",` +
          `"budgetTiers":{"budget":{"daily":50,"label":"Backpacker","covers":"hostels and street food"},"mid":{"daily":120,"label":"Comfortable","covers":"hotels and restaurants"},"luxury":{"daily":300,"label":"Premium","covers":"5-star and fine dining"}}}\n` +
          `Generate exactly ${days} days 5 unique REAL activities each 3 real hotels 3 real tours. ONLY JSON.`;

        callAnthropic({
          model: 'claude-haiku-4-5',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }]
        }, (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
          const text = data.content && data.content[0] ? data.content[0].text : '';
          const start = text.indexOf('{');
          const end = text.lastIndexOf('}');
          if (start === -1 || end === -1) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid AI response' }));
            return;
          }
          try {
            const parsed = JSON.parse(text.substring(start, end + 1));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(parsed));
          } catch(e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'JSON parse failed' }));
          }
        });
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('\n🌍 Wayfari Server Running!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Open in browser: http://localhost:${PORT}`);
  console.log(`✅ Open on phone:   http://YOUR_IP:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (!ANTHROPIC_API_KEY) {
    console.log('\n⚠️  WARNING: ANTHROPIC_API_KEY not set!');
    console.log('   Custom destinations will not work.');
    console.log('   Set it with: export ANTHROPIC_API_KEY=your_key_here\n');
  } else {
    console.log('✅ AI generation ready for any destination!\n');
  }
});
