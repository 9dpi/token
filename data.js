// ===== SYSTEM DATA: AI TOKEN INDEX =====
// This file is automatically updated by price_scanner.js
// Last Scan: 2026-03-10 01:18 AM

const AI_PRICING = {
    "Q": {
        "name": "Unit Q",
        "input": 1,
        "output": 1,
        "icon": "🪙",
        "color": "#D4AF37",
        "benefit": "Stable Internal Index"
    },
    "GPT4O": {
        "name": "GPT-4o",
        "input": 2.5,
        "output": 10,
        "icon": "logos/chatgpt.svg",
        "color": "#10A37F",
        "benefit": "Smartest & Reliable"
    },
    "CLAUDE": {
        "name": "Claude 3.5",
        "input": 3,
        "output": 15,
        "icon": "logos/claude.svg",
        "color": "#D97706",
        "benefit": "Creative & Precise Writing"
    },
    "GEMINI": {
        "name": "Gemini 2 Pro",
        "input": 3.5,
        "output": 10.5,
        "icon": "logos/gemini.svg",
        "color": "#4285F4",
        "benefit": "Massive Context Window"
    },
    "DEEPSEEK": {
        "name": "DeepSeek-V3",
        "input": 0.28,
        "output": 0.42,
        "icon": "logos/deepseek.svg",
        "color": "#6366F1",
        "benefit": "90% Cost Savings"
    },
    "LLAMA": {
        "name": "Llama 3.1 405B",
        "input": 5.33,
        "output": 16,
        "icon": "logos/llama.svg",
        "color": "#0668E1",
        "benefit": "Open-Source Powerhouse"
    },
    "MISTRAL": {
        "name": "Mistral Large",
        "input": 0.5,
        "output": 1.5,
        "icon": "logos/mistral.svg",
        "color": "#FD5339",
        "benefit": "European Efficiency"
    }
};

const AI_BENEFITS_DATA = [
    {
        "id": "GPT4O",
        "model": "GPT-4o",
        "provider": "openai",
        "price": 2.5,
        "savings": "Market Rate",
        "speed": "Dynamic",
        "vfm": "9.8/10",
        "benefit": "Smartest & Reliable",
        "buyUrl": "https://openrouter.ai/models/openai/gpt-4o"
    },
    {
        "id": "CLAUDE",
        "model": "Claude 3.5",
        "provider": "anthropic",
        "price": 3,
        "savings": "Market Rate",
        "speed": "Dynamic",
        "vfm": "9.7/10",
        "benefit": "Creative & Precise Writing",
        "buyUrl": "https://www.anthropic.com/claude"
    },
    {
        "id": "GEMINI",
        "model": "Gemini 2 Pro",
        "provider": "gemini",
        "price": 3.5,
        "savings": "Market Rate",
        "speed": "Dynamic",
        "vfm": "9.7/10",
        "benefit": "Massive Context Window",
        "buyUrl": "https://cloud.google.com/vertex-ai"
    },
    {
        "id": "DEEPSEEK",
        "model": "DeepSeek-V3",
        "provider": "deepseek",
        "price": 0.28,
        "savings": "90%",
        "speed": "Dynamic",
        "vfm": "10.0/10",
        "benefit": "90% Cost Savings",
        "buyUrl": "https://www.together.ai/models/deepseek-v3"
    },
    {
        "id": "LLAMA",
        "model": "Llama 3.1 405B",
        "provider": "azure_ai",
        "price": 5.33,
        "savings": "Market Rate",
        "speed": "Dynamic",
        "vfm": "9.5/10",
        "benefit": "Open-Source Powerhouse",
        "buyUrl": "https://azure.microsoft.com/pricing"
    },
    {
        "id": "MISTRAL",
        "model": "Mistral Large",
        "provider": "mistral",
        "price": 0.5,
        "savings": "Market Rate",
        "speed": "Dynamic",
        "vfm": "9.9/10",
        "benefit": "European Efficiency",
        "buyUrl": "https://mistral.ai/en/technology#pricing"
    }
];

const MARKET_PAIRS = [
    { id: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', binance: 'BTCUSDT', fallback: 96000 },
    { id: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto', binance: 'ETHUSDT', fallback: 3800 },
    { id: 'XAU', name: 'GOLD', symbol: '🥇', type: 'metal', binance: 'PAXGUSDT', fallback: 2650 },
    { id: 'EUR', name: 'Euro', symbol: '🇪🇺', type: 'fiat', binance: 'EURUSDT', fallback: 1.08 },
    { id: 'GBP', name: 'Pound', symbol: '🇬🇧', type: 'fiat', binance: 'GBPUSDT', fallback: 1.27 },
    { id: 'USD', name: 'US Dollar', symbol: '🇺🇸', type: 'fiat', binance: null, fallback: 1.0 }
];

const LAST_UPDATE = "2026-03-10 01:18 AM";
