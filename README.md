# 🌍 Wayfari — AI Travel Planner

> **Discover the world your way** — A fully featured travel planning app built in a single HTML file.

---

## 🚀 Quick Start

### Option A — Open directly in browser (36 cities, works offline)
1. Download `wayfari.html`
2. Double-click to open in Chrome, Safari or Firefox
3. Search any of the 36 built-in cities — loads instantly!

### Option B — Run with server (ALL cities via AI)
```bash
# 1. Install Node.js from https://nodejs.org

# 2. Set your free API key (get it at console.anthropic.com)
export ANTHROPIC_API_KEY=your_key_here    # Mac/Linux
set ANTHROPIC_API_KEY=your_key_here       # Windows

# 3. Run
node server.js

# 4. Open http://localhost:3000
```

---

## ✨ Features

- 🌍 **36 Cities** with real places, restaurants and insider tips
- 🤖 **AI City Generator** — any city not in DB → AI generates real itinerary
- 💰 **Budget Planner** — Backpacker / Comfortable / Premium tiers
- 🗓️ **Day-by-Day Itinerary** — up to 14 days with unique activities
- 🏨 **Hotels & Tours** — real recommendations with pricing
- 🗺️ **Getting Around** — transport card with city-specific travel tips
- 🚗 **Parking & Driving** — per-city driving advice
- 💸 **Spend Tracker** — live budget tracking
- ❤️ **Wishlist** — save hotels and tours
- 🤖 **AI Chat** — ask anything about your destination

---

## 🌍 36 Cities with Real Data

🇺🇸 Atlanta · New York · Los Angeles · Chicago · Miami · Nashville · Dallas · Boston · Charlotte · Raleigh
🇬🇧 London  🇫🇷 Paris  🇮🇹 Rome  🇪🇸 Barcelona · Madrid  🇳🇱 Amsterdam  🇵🇹 Lisbon  🇨🇿 Prague  🇦🇹 Vienna  🇩🇪 Berlin  🇲🇦 Marrakech
🇯🇵 Tokyo · Kyoto  🇰🇷 Seoul  🇭🇰 Hong Kong  🇸🇬 Singapore  🇹🇷 Istanbul  🇮🇳 Delhi  🇻🇳 Hanoi  🇮🇩 Bali  🇹🇭 Bangkok
🇦🇺 Sydney · Melbourne  🇿🇦 Cape Town  🇧🇷 Rio de Janeiro  🇦🇪 Dubai

---

## 🛠️ Tech Stack

- **Frontend:** Pure HTML + CSS + JavaScript (zero frameworks!)
- **Backend:** Node.js (optional)
- **AI:** Claude claude-haiku-4-5 via Anthropic API
- **Design:** Custom dark UI, Sora font, amber gradient theme

---

## 📂 Files

```
wayfari/
├── wayfari.html  ← The entire app
├── server.js     ← Backend for AI cities
└── README.md     ← This file
```

---

*Built entirely with Claude AI · © 2025 Wayfari*
