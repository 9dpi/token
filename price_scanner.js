/**
 * AI PRICE SCANNER (MVP)
 * Script này giả lập việc quét bảng giá từ các nhà cung cấp hoặc 
 * từ các nguồn dữ liệu cộng đồng (như LiteLLM JSON).
 * Dự kiến chạy: 1 lần/ngày.
 */

async function scanPrices() {
    console.log("🚀 Starting AI Price Scan...");

    // Trong thực tế, bạn có thể fetch từ: 
    // https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json

    const latestRates = {
        'gpt-4o': { input: 2.50, output: 10.00, benefit: 'High Intelligence, Fast' },
        'claude-3-5-sonnet': { input: 3.00, output: 15.00, benefit: 'Best Reasoning, Creative' },
        'gemini-1-5-pro': { input: 1.25, output: 5.00, benefit: 'Large context, Video support' },
        'deepseek-v3': { input: 0.14, output: 0.28, benefit: 'Extremely Cheap, Coding Expert' }
    };

    console.log("📊 Latest Rates Scanned:", latestRates);

    // Xác định mô hình rẻ nhất (Best Value)
    let cheapest = 'deepseek-v3';
    let minCost = latestRates[cheapest].input + latestRates[cheapest].output;

    for (const [model, rates] of Object.entries(latestRates)) {
        const total = rates.input + rates.output;
        if (total < minCost) {
            minCost = total;
            cheapest = model;
        }
    }

    console.log(`✨ Recommendation: ${cheapest.toUpperCase()} is currently the Best Value.`);

    // Ghi dữ liệu vào file JSON để Frontend sử dụng
    // fs.writeFileSync('./ai_rates.json', JSON.stringify(latestRates));
}

scanPrices();
