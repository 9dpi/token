// T? ??ng c?p nh?t t? Google AppScript
const AI_PRICING = {
  "Q": {
    "name": "Unit Q",
    "input": 1,
    "output": 1,
    "icon": "?",
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
  "GEMINI": {
    "name": "Gemini 1.5 Pro",
    "input": 1.25,
    "output": 5,
    "icon": "logos/gemini.svg",
    "color": "#4285F4",
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
    "id": "GEMINI",
    "model": "Gemini 1.5 Pro",
    "provider": "vertex_ai-language-models",
    "price": 1.25,
    "savings": "Market Rate",
    "speed": "High",
    "vfm": "9.5/10",
    "benefit": "Official Pricing",
    "buyUrl": "https://cloud.google.com/vertex-ai/pricing"
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
const LAST_UPDATE = "3/3/2026, 11:42:37 AM";