/**
 * UNIT Q - CORE AI & BALANCE LOGIC
 * Handles: Token Count (Tiktoken), Rate Calculation, GAS Bridge Calls
 */

// Giả lập tỷ giá khớp với MVP Structure
const Q_RATES = {
    'gpt-4o': {
        input_q_per_m: 50,  // 50 Q cho 1M Input tokens
        output_q_per_m: 150 // 150 Q cho 1M Output tokens
    }
};

/**
 * Tính toán lượng Q tiêu tốn dựa trên số token thực tế
 */
export function calculateQConsumption(model: string, inputTokens: number, outputTokens: number): number {
    const rates = (Q_RATES as any)[model] || Q_RATES['gpt-4o'];

    const inputQ = (inputTokens / 1_000_000) * rates.input_q_per_m;
    const outputQ = (outputTokens / 1_000_000) * rates.output_q_per_m;

    return parseFloat((inputQ + outputQ).toFixed(6));
}

/**
 * Gọi Bridge API (Google Apps Script) để lấy số dư
 */
export async function getUserBalance(email: string) {
    const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
    const gasKey = process.env.NEXT_PUBLIC_GAS_KEY;
    try {
        const res = await fetch(`${gasUrl}?email=${encodeURIComponent(email)}&key=${gasKey}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('GAS Fetch Error:', error);
        return { success: false, error: 'Connection to GAS failed' };
    }
}

/**
 * Gọi Bridge API để trừ tiền sau khi Chat
 */
export async function deductUserBalance(email: string, amountQ: number) {
    const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
    const gasKey = process.env.NEXT_PUBLIC_GAS_KEY;
    try {
        const res = await fetch(`${gasUrl}?key=${gasKey}`, {
            method: 'POST',
            body: JSON.stringify({ email, amount: amountQ }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('GAS Update Error:', error);
        return { success: false, error: 'Update to GAS failed' };
    }
}
