// Tự động cập nhật từ Google AppScript
const AI_PRICING = {
  "Q": {
    "name": "Unit Q",
    "input": 1,
    "output": 1,
    "icon": "🪙",
    "color": "#D4AF37",
    "benefit": "Internal Index"
  },
  "GPT4O": {
    "name": "GPT-4o",
    "input": 2.5,
    "output": 10,
    "icon": "logos/chatgpt.svg",
    "color": "#10A37F",
    "benefit": "Market Live Data"
  },
  "MISTRAL": {
    "name": "Mistral Large",
    "input": 0.5,
    "output": 1.5,
    "icon": "logos/mistral.svg",
    "color": "#FD5339",
    "benefit": "Market Live Data"
  }
};
const AI_BENEFITS_DATA = [
  {
    "id": "GPT4O",
    "model": "GPT-4o",
    "provider": "openai",
    "price": 2.5,
    "savings": "Market Rate",
    "speed": "High",
    "vfm": "9.5/10",
    "benefit": "Official Pricing",
    "buyUrl": "https://openai.com/api/pricing"
  },
  {
    "id": "MISTRAL",
    "model": "Mistral Large",
    "provider": "mistral",
    "price": 0.5,
    "savings": "Market Rate",
    "speed": "High",
    "vfm": "9.5/10",
    "benefit": "Official Pricing",
    "buyUrl": "https://mistral.ai/pricing"
  }
];
const LAST_UPDATE = "3/19/2026, 12:05:33 AM";

const MARKET_PAIRS = [
    { id: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', binance: 'BTCUSDT', fallback: 96000 },
    { id: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto', binance: 'ETHUSDT', fallback: 3800 },
    { id: 'XAU', name: 'GOLD', symbol: '🥇', type: 'metal', binance: 'PAXGUSDT', fallback: 2650 },
    { id: 'EUR', name: 'Euro', symbol: '🇪🇺', type: 'fiat', binance: 'EURUSDT', fallback: 1.08 },
    { id: 'GBP', name: 'Pound', symbol: '🇬🇧', type: 'fiat', binance: 'GBPUSDT', fallback: 1.27 },
    { id: 'USD', name: 'US Dollar', symbol: '🇺🇸', type: 'fiat', binance: null, fallback: 1.0 }
];