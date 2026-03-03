const fs = require('fs');

async function scanPrices() {
    console.log("🚀 Starting Global AI Price Scan...");

    try {
        const response = await fetch('https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json');
        const data = await response.json();

        // Case-insensitive mapping with partial match support
        const findPrice = (ids) => {
            const allKeys = Object.keys(data);
            for (const id of ids) {
                // Try exact match first
                if (data[id]) return data[id];

                // Try case-insensitive exact match
                const ciMatch = allKeys.find(k => k.toLowerCase() === id.toLowerCase());
                if (ciMatch) return data[ciMatch];

                // Try partial match
                const partialMatch = allKeys.find(k => k.toLowerCase().includes(id.toLowerCase()));
                if (partialMatch) return data[partialMatch];
            }
            return null;
        };

        const config = {
            GPT4O: {
                ids: ['gpt-4o', 'openai/gpt-4o'],
                name: 'GPT-4o', logo: 'logos/chatgpt.svg', color: '#10A37F', benefit: 'Smartest & Reliable',
                buyUrl: 'https://openrouter.ai/models/openai/gpt-4o'
            },
            CLAUDE: {
                ids: ['claude-3-5-sonnet-20240620', 'claude-3-5-sonnet', 'anthropic/claude-3-5-sonnet'],
                name: 'Claude 3.5', logo: 'logos/claude.svg', color: '#D97706', benefit: 'Creative & Precise Writing',
                buyUrl: 'https://www.anthropic.com/claude'
            },
            GEMINI: {
                ids: ['gemini/gemini-1.5-pro', 'google/gemini-1.5-pro', 'gemini-1.5-pro'],
                name: 'Gemini 2 Pro', logo: 'logos/gemini.svg', color: '#4285F4', benefit: 'Massive Context Window',
                buyUrl: 'https://cloud.google.com/vertex-ai'
            },
            DEEPSEEK: {
                ids: ['deepseek/deepseek-chat', 'deepseek-v3', 'deepseek-chat'],
                name: 'DeepSeek-V3', logo: 'logos/deepseek.svg', color: '#6366F1', benefit: '90% Cost Savings',
                buyUrl: 'https://www.together.ai/models/deepseek-v3'
            },
            LLAMA: {
                ids: ['meta-llama/llama-3.1-405b-instruct', 'azure/llama-3.1-405b', 'llama-3.1-405b'],
                name: 'Llama 3.1 405B', logo: 'logos/llama.svg', color: '#0668E1', benefit: 'Open-Source Powerhouse',
                buyUrl: 'https://azure.microsoft.com/pricing'
            },
            MISTRAL: {
                ids: ['mistral/mistral-large-latest', 'mistral/mistral-large', 'azure/mistral-large'],
                name: 'Mistral Large', logo: 'logos/mistral.svg', color: '#FD5339', benefit: 'European Efficiency',
                buyUrl: 'https://mistral.ai/en/technology#pricing'
            },
            GROQ: {
                ids: ['groq/llama3-70b-8192', 'groq/llama3-8b-8192'],
                name: 'Llama 3 (Groq)', logo: 'logos/groq.svg', color: '#F55036', benefit: 'Ultra-Fast LPU Speed',
                buyUrl: 'https://groq.com/pricing'
            }
        };

        const updatedPricing = {
            Q: { name: 'Unit Q', input: 1.00, output: 1.00, icon: '🪙', color: '#D4AF37', benefit: 'Stable Internal Index' }
        };

        const updatedBenefits = [];

        for (const [internalId, meta] of Object.entries(config)) {
            const modelData = findPrice(meta.ids);
            if (modelData) {
                const inputPrice = (modelData.input_cost_per_token || 0) * 1000000;
                const outputPrice = (modelData.output_cost_per_token || 0) * 1000000;

                updatedPricing[internalId] = {
                    name: meta.name,
                    input: inputPrice || 0,
                    output: outputPrice || 0,
                    icon: meta.logo, // Logo URL
                    color: meta.color,
                    benefit: meta.benefit
                };

                updatedBenefits.push({
                    id: internalId,
                    model: meta.name,
                    provider: modelData.litellm_provider || 'Main API',
                    price: inputPrice,
                    savings: internalId === 'DEEPSEEK' ? '90%' : 'Market Rate',
                    speed: 'Dynamic',
                    vfm: (10 - (inputPrice / 10)).toFixed(1) + '/10',
                    benefit: meta.benefit,
                    buyUrl: meta.buyUrl
                });
            } else {
                console.warn(`⚠️ Model ${internalId} not found in source.`);
            }
        }

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0] + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const fileContent = `// ===== SYSTEM DATA: AI TOKEN INDEX =====
// This file is automatically updated by price_scanner.js
// Last Scan: ${dateStr}

const AI_PRICING = ${JSON.stringify(updatedPricing, null, 4)};

const AI_BENEFITS_DATA = ${JSON.stringify(updatedBenefits, null, 4)};

const MARKET_PAIRS = [
    { id: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', binance: 'BTCUSDT', fallback: 96000 },
    { id: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto', binance: 'ETHUSDT', fallback: 3800 },
    { id: 'XAU', name: 'GOLD', symbol: '🥇', type: 'metal', binance: 'PAXGUSDT', fallback: 2650 },
    { id: 'EUR', name: 'Euro', symbol: '🇪🇺', type: 'fiat', binance: 'EURUSDT', fallback: 1.08 },
    { id: 'GBP', name: 'Pound', symbol: '🇬🇧', type: 'fiat', binance: 'GBPUSDT', fallback: 1.27 },
    { id: 'USD', name: 'US Dollar', symbol: '🇺🇸', type: 'fiat', binance: null, fallback: 1.0 }
];

const LAST_UPDATE = "${dateStr}";
`;

        fs.writeFileSync('data.js', fileContent);
        console.log("✅ data.js updated successfully.");

    } catch (error) {
        console.error("❌ Error scanning prices:", error);
    }
}

scanPrices();
