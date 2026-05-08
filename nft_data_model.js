// ==========================================
// NFT & Q TOKEN ECOSYSTEM - CORE DATA MODEL
// Giai đoạn: Tuần 1-2 (Cấu trúc DB & Định giá)
// ==========================================

/**
 * 1. CẤU TRÚC DATABASE (MÔ PHỎNG IN-MEMORY)
 * Trong thực tế sẽ được lưu trên MongoDB / PostgreSQL hoặc Smart Contract.
 */
let DB = {
    users: [
        { id: "U001", username: "alex_dev", wallet_address: "0x123...abc", q_balance: 500 },
        { id: "U002", username: "maria_art", wallet_address: "0x456...def", q_balance: 1500 }
    ],
    nfts: [],
    listings: [
        { id: "M001", title: "Cyberpunk Cityscape", type: "image", creator: "@neo_artist", price: 1250, ai_score: 1.45, icon: "🌃", gradient: "linear-gradient(45deg, #FF007A, #4200FF)" },
        { id: "M002", title: "Quantum Computing Algorithm", type: "code", creator: "@dev_genius", price: 850, ai_score: 1.32, icon: "💻", gradient: "linear-gradient(45deg, #00FF87, #60EFFF)" },
        { id: "M003", title: "Lo-Fi Beats Vol. 4", type: "audio", creator: "@chill_vibes", price: 300, ai_score: 1.15, icon: "🎧", gradient: "linear-gradient(45deg, #FAD961, #F76B1C)" },
        { id: "M004", title: "Mecha Robot Unit-01", type: "3d", creator: "@poly_master", price: 3400, ai_score: 1.48, icon: "🦾", gradient: "linear-gradient(45deg, #8A2387, #E94057, #F27121)" },
        { id: "M005", title: "AI Generated Abstract", type: "image", creator: "@ai_dreamer", price: 450, ai_score: 1.25, icon: "🎨", gradient: "linear-gradient(45deg, #00C9FF, #92FE9D)" }
    ],
    transactions: []
};

// Khôi phục dữ liệu từ localStorage nếu có
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('NFT_DB');
    if (saved) {
        try {
            DB = JSON.parse(saved);
        } catch (e) {
            console.error("Lỗi khi load dữ liệu DB", e);
        }
    }
}

// Nếu mảng listings trống (do localStorage cũ), tự động thêm mock data
if (DB.listings.length === 0) {
    DB.listings = [
        { id: "M001", title: "Cyberpunk Cityscape", type: "image", creator: "@neo_artist", price: 1250, ai_score: 1.45, icon: "🌃", gradient: "linear-gradient(45deg, #FF007A, #4200FF)" },
        { id: "M002", title: "Quantum Computing Algorithm", type: "code", creator: "@dev_genius", price: 850, ai_score: 1.32, icon: "💻", gradient: "linear-gradient(45deg, #00FF87, #60EFFF)" },
        { id: "M003", title: "Lo-Fi Beats Vol. 4", type: "audio", creator: "@chill_vibes", price: 300, ai_score: 1.15, icon: "🎧", gradient: "linear-gradient(45deg, #FAD961, #F76B1C)" },
        { id: "M004", title: "Mecha Robot Unit-01", type: "3d", creator: "@poly_master", price: 3400, ai_score: 1.48, icon: "🦾", gradient: "linear-gradient(45deg, #8A2387, #E94057, #F27121)" },
        { id: "M005", title: "AI Generated Abstract", type: "image", creator: "@ai_dreamer", price: 450, ai_score: 1.25, icon: "🎨", gradient: "linear-gradient(45deg, #00C9FF, #92FE9D)" }
    ];
}

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxxoIr2AGjT-eg3nxrPr9vkPNpfrr_VHJzJRELDMvFd6AcaLupaTTCcnyKtTAhd9QYK/exec";

// Hàm lưu dữ liệu
function saveDB() {
    if (typeof window !== 'undefined') {
        DB.last_updated = Date.now(); // Đánh dấu thời gian lưu
        const dbStr = JSON.stringify(DB);
        // Lưu LocalStorage cho nhanh
        localStorage.setItem('NFT_DB', dbStr);
        
        // Background Sync lên Google Sheets
        if (BACKEND_URL) {
            fetch(BACKEND_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'save',
                    database: DB
                })
            }).then(res => res.json())
              .then(data => console.log("Cloud Sync Success:", data))
              .catch(err => console.error("Cloud Sync Failed:", err));
        }
    }
}

// Hàm tải dữ liệu từ Google Sheets
async function loadDBFromCloud() {
    if (BACKEND_URL) {
        try {
            console.log("Đang đồng bộ dữ liệu từ Cloud...");
            const res = await fetch(BACKEND_URL);
            const cloudData = await res.json();
            
            if (cloudData && !cloudData.status && !cloudData.error) {
                // Kiểm tra xung đột: Chỉ lấy từ Cloud nếu Cloud mới hơn Local
                const localTime = DB.last_updated || 0;
                const cloudTime = cloudData.last_updated || 0;
                
                if (cloudTime >= localTime || localTime === 0) {
                    DB = cloudData;
                    localStorage.setItem('NFT_DB', JSON.stringify(DB));
                    console.log("Đã cập nhật DB từ Cloud!");
                    
                    // Refresh UI nếu đang ở trang Admin hoặc Market
                    if (typeof renderAdmin === 'function') renderAdmin();
                    if (typeof renderMarket === 'function') renderMarket(DB.listings);
                    if (typeof updateBalance === 'function') updateBalance();
                } else {
                    console.log("Local DB mới hơn Cloud, bỏ qua sync để tránh mất dữ liệu (Race condition).");
                    // Có thể tự động Push Local lên lại Cloud ở đây
                    saveDB(); 
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải từ Cloud:", error);
        }
    }
}

// Kích hoạt đồng bộ Cloud ngay khi load file
if (typeof window !== 'undefined') {
    loadDBFromCloud();
}

/**
 * 2. CÔNG THỨC ĐỊNH GIÁ & THƯỞNG Q TOKEN
 * Q_reward = (Dung lượng MB) × (Hệ số loại file) × (Hệ số chất lượng AI) × (Hệ số độc bản)
 */
const FILE_TYPE_MULTIPLIERS = {
    "video": 3.0,
    "audio": 2.0,
    "image": 1.5,
    "3d": 1.5,
    "document": 1.0,
    "code": 1.0
};

// Hàm giả lập AI chấm điểm (trong thực tế sẽ gọi API GPT-4o hoặc Claude)
function simulateAIScoring(fileType, quality) {
    // Trả về ngẫu nhiên từ 1.0 đến 1.5 dựa trên chất lượng
    const base = quality === 'high' ? 1.2 : 1.0;
    return parseFloat((base + Math.random() * 0.3).toFixed(2)); 
}

// Hàm giả lập kiểm tra trùng lặp (Hash)
function checkUniqueness(fileHash) {
    const isDuplicate = DB.nfts.some(nft => nft.file_hash === fileHash);
    return isDuplicate ? 0 : 1.0; // Nếu trùng -> hệ số = 0 -> không cho mint
}

function calculateFileReward(fileObj) {
    const { sizeMB, type, hash, qualityHint } = fileObj;

    const typeMultiplier = FILE_TYPE_MULTIPLIERS[type] || 1.0;
    const aiScore = simulateAIScoring(type, qualityHint);
    const uniqueness = checkUniqueness(hash);

    if (uniqueness === 0) {
        throw new Error("File đã tồn tại trên hệ thống (Hash bị trùng). Từ chối Mint.");
    }

    const qReward = sizeMB * typeMultiplier * aiScore * uniqueness;
    
    return {
        qReward: parseFloat(qReward.toFixed(2)),
        details: { sizeMB, typeMultiplier, aiScore, uniqueness }
    };
}

/**
 * 3. HÀM MINT NFT
 */
function mintNFT(userId, fileObj, metadata) {
    // 1. Tính toán định giá
    const evaluation = calculateFileReward(fileObj);
    
    // 2. Tạo record NFT mới
    const newNFT = {
        id: "NFT_" + Date.now() + "_" + Math.floor(Math.random()*1000),
        owner_id: userId,
        file_hash: fileObj.hash,
        file_type: fileObj.type,
        size_mb: fileObj.sizeMB,
        ai_score: evaluation.details.aiScore,
        q_reward_minted: evaluation.qReward,
        metadata_url: "ipfs://" + fileObj.hash + "_meta", 
        title: metadata.title,
        description: metadata.description,
        created_at: new Date().toISOString(),
        status: "wallet" // 'wallet', 'listed'
    };

    // 3. Lưu vào DB
    DB.nfts.push(newNFT);

    // 4. Cộng tiền cho User
    const user = DB.users.find(u => u.id === userId);
    if (user) {
        user.q_balance += evaluation.qReward;
    }

    // 5. Ghi log transaction
    DB.transactions.push({
        id: "TX_" + Date.now(),
        from: "SYSTEM",
        to: userId,
        type: "MINT_NFT",
        amount_q: evaluation.qReward,
        nft_id: newNFT.id,
        timestamp: new Date().toISOString()
    });

    saveDB(); // Lưu vào localStorage

    return newNFT;
}

/**
 * 4. CHẠY THỬ VỚI 10 FILE MẪU (TEST CASE TUẦN 1)
 */
function runTestCases() {
    console.log("=== BẮT ĐẦU CHẠY THỬ NGHIỆM MINT 10 FILE MẪU ===");
    
    const sampleFiles = [
        { obj: { hash: "h_001", type: "image", sizeMB: 5.2, qualityHint: "high" }, meta: { title: "Bức tranh hoàng hôn", description: "Vẽ bằng AI" } },
        { obj: { hash: "h_002", type: "video", sizeMB: 45.5, qualityHint: "high" }, meta: { title: "Trailer dự án", description: "Video 4K" } },
        { obj: { hash: "h_003", type: "audio", sizeMB: 12.0, qualityHint: "low" }, meta: { title: "Beat lofi", description: "Nhạc nền chill" } },
        { obj: { hash: "h_004", type: "document", sizeMB: 2.1, qualityHint: "high" }, meta: { title: "Bản thảo sách", description: "Chương 1" } },
        { obj: { hash: "h_005", type: "code", sizeMB: 0.5, qualityHint: "high" }, meta: { title: "Script Python", description: "Thuật toán AI" } },
        { obj: { hash: "h_006", type: "image", sizeMB: 8.4, qualityHint: "low" }, meta: { title: "Ảnh chụp màn hình", description: "Lỗi log" } },
        { obj: { hash: "h_007", type: "3d", sizeMB: 120.0, qualityHint: "high" }, meta: { title: "Model nhà 3D", file: "Obj file" } },
        { obj: { hash: "h_008", type: "video", sizeMB: 15.0, qualityHint: "low" }, meta: { title: "Video meme", description: "Tiktok clip" } },
        { obj: { hash: "h_001", type: "image", sizeMB: 5.2, qualityHint: "high" }, meta: { title: "Trùng mã Hash", description: "Sẽ bị lỗi" } }, // Duplicate test
        { obj: { hash: "h_010", type: "audio", sizeMB: 35.0, qualityHint: "high" }, meta: { title: "Podcast EP1", description: "Phỏng vấn chuyên gia" } }
    ];

    let mintedCount = 0;
    
    sampleFiles.forEach((file, index) => {
        try {
            console.log(`\n[File ${index + 1}] Đang xử lý: ${file.meta.title} (${file.obj.sizeMB}MB - ${file.obj.type})`);
            const result = mintNFT("U001", file.obj, file.meta);
            console.log(`✅ Mint thành công NFT ID: ${result.id}`);
            console.log(`💰 Thưởng Q Token: +${result.q_reward_minted} Q (AI Score: ${result.ai_score})`);
            mintedCount++;
        } catch (error) {
            console.error(`❌ Thất bại: ${error.message}`);
        }
    });

    console.log("\n=== TỔNG KẾT SAU KHI TEST ===");
    console.log(`Số NFT đã Mint: ${mintedCount}/${sampleFiles.length}`);
    console.log(`Số dư Q Token của User U001: ${DB.users.find(u=>u.id==="U001").q_balance.toFixed(2)} Q`);
    console.log(`Số lượng giao dịch hệ thống: ${DB.transactions.length}`);
}

// Nếu chạy trong môi trường Node (ví dụ để test console)
if (typeof module !== 'undefined' && module.exports) {
    runTestCases();
}

function getCurrentUserId() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('CURRENT_USER_ID') || "U001";
    }
    return "U001";
}

function loginUser(userId) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('CURRENT_USER_ID', userId);
        alert("Switched to user: " + userId);
        location.reload();
    }
}

// Export cho môi trường Browser nếu cần nhúng vào HTML
if (typeof window !== 'undefined') {
    window.NFTDatabase = DB;
    window.mintNFT = mintNFT;
    window.runTestCases = runTestCases;
    window.saveDB = saveDB;
    window.getCurrentUserId = getCurrentUserId;
    window.loginUser = loginUser;
}
