// ==========================================
// WALLET & NFT FRONTEND LOGIC (Phase 2)
// ==========================================

// Current logged in user
let CURRENT_USER_ID = "U001";
if (typeof window !== 'undefined' && window.getCurrentUserId) {
    CURRENT_USER_ID = window.getCurrentUserId();
}

// DOM Elements
const qBalanceDisplay = document.getElementById('qBalanceDisplay');
const fileInput = document.getElementById('fileInput');
const nftTitleInput = document.getElementById('nftTitle');
const nftTypeInput = document.getElementById('nftType');
const previewBox = document.getElementById('previewBox');
const previewSize = document.getElementById('previewSize');
const previewReward = document.getElementById('previewReward');
const btnMint = document.getElementById('btnMint');
const nftGallery = document.getElementById('nftGallery');

// Initialize Dashboard
function initDashboard() {
    updateBalance();
    renderGallery();
    renderTransactionHistory();
}

// Update Balance & Profile Display
function updateBalance() {
    // Get user from DB in nft_data_model.js
    const user = window.NFTDatabase.users.find(u => u.id === CURRENT_USER_ID);
    if (user) {
        // Update Profile
        const elName = document.getElementById('profileName');
        if(elName) elName.innerText = "@" + user.username;
        const elId = document.getElementById('profileId');
        if(elId) elId.innerText = user.id;
        const elWallet = document.getElementById('profileWallet');
        if(elWallet) elWallet.innerText = user.wallet_address;
        
        // Update balance
        qBalanceDisplay.innerHTML = `${user.q_balance.toFixed(2)} <span class="currency">Q</span>`;
    }
}

// Render Transaction History
function renderTransactionHistory() {
    const txTable = document.getElementById('txHistoryTable');
    if (!txTable) return;
    
    txTable.innerHTML = '';
    
    // Filter transactions involving current user
    const userTxs = window.NFTDatabase.transactions.filter(tx => tx.to === CURRENT_USER_ID || tx.from === CURRENT_USER_ID);
    
    if (userTxs.length === 0) {
        txTable.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color: var(--text-muted);">No transactions yet.</td></tr>';
        return;
    }
    
    // Sort newest first
    const sortedTxs = [...userTxs].reverse();
    sortedTxs.forEach(tx => {
        let typeColor = 'var(--text-main)';
        if (tx.type === 'MINT_NFT') typeColor = 'var(--green)';
        if (tx.type === 'BURN_NFT') typeColor = 'var(--red)';
        if (tx.type === 'BUY_NFT') typeColor = 'var(--cyan)';
        if (tx.type === 'DEPOSIT') typeColor = 'var(--gold)';
        
        // Is it incoming or outgoing?
        const isIncoming = tx.to === CURRENT_USER_ID;
        const sign = isIncoming ? '+' : (tx.amount_q > 0 ? '-' : '');
        const amountDisplay = isIncoming ? Math.abs(tx.amount_q).toFixed(2) : Math.abs(tx.amount_q).toFixed(2);
        const amountColor = isIncoming ? 'var(--green)' : 'var(--red)';
        
        const time = new Date(tx.timestamp).toLocaleString();
        const details = tx.nft_id ? `NFT: ${tx.nft_id}` : (tx.type === 'DEPOSIT' ? 'Deposit via Gateway' : '—');
        
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        tr.innerHTML = `
            <td style="padding: 12px 10px; font-size: 0.85rem; color: var(--text-muted);">${time}</td>
            <td style="padding: 12px 10px; font-weight: 700; color: ${typeColor};">${tx.type}</td>
            <td style="padding: 12px 10px; font-family: 'JetBrains Mono'; font-weight: 700; color: ${amountColor};">${sign}${amountDisplay}</td>
            <td style="padding: 12px 10px; font-size: 0.85rem; color: var(--text-muted);">${details}</td>
        `;
        txTable.appendChild(tr);
    });
}

// Render NFT Gallery
function renderGallery() {
    nftGallery.innerHTML = '';
    
    const userNfts = window.NFTDatabase.nfts.filter(n => n.owner_id === CURRENT_USER_ID && n.status !== 'listed');
    
    if (userNfts.length === 0) {
        nftGallery.innerHTML = '<p class="sub-text">You don\'t own any NFTs yet. Mint one above!</p>';
        return;
    }

    userNfts.reverse().forEach(nft => {
        // Simple icon based on type
        let icon = '📄';
        if(nft.file_type === 'image') icon = '🖼️';
        if(nft.file_type === 'video') icon = '🎬';
        if(nft.file_type === 'audio') icon = '🎵';
        if(nft.file_type === '3d') icon = '🧊';
        if(nft.file_type === 'code') icon = '💻';

        const card = document.createElement('div');
        card.className = 'nft-card';
        card.innerHTML = `
            <div class="nft-image">${icon}</div>
            <div class="nft-info">
                <h3 class="nft-title" title="${nft.title}">${nft.title}</h3>
                <span class="nft-type">${nft.file_type}</span>
                <div class="nft-value">${nft.q_reward_minted.toFixed(2)} Q</div>
                <div class="nft-footer">
                    <span class="nft-id">#${nft.id.split('_')[1] || nft.id}</span>
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="sellNFT('${nft.id}')">Sell</button>
                    <button class="btn" style="padding: 5px 10px; font-size: 0.8rem; background: rgba(246, 70, 93, 0.2); color: #F6465D; border: 1px solid rgba(246, 70, 93, 0.5); margin-left: 5px;" onclick="burnNFT('${nft.id}')">🔥 Burn</button>
                </div>
            </div>
        `;
        nftGallery.appendChild(card);
    });
}

// Handle File Selection (Preview)
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
        previewBox.style.display = 'none';
        return;
    }

    // Auto-fill title if empty
    if (!nftTitleInput.value) {
        nftTitleInput.value = file.name.split('.')[0];
    }

    // Calculate mock size in MB
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    previewSize.innerText = sizeMB;

    // Estimate Reward (Assuming AI Score 1.0 and Uniqueness 1.0 for preview)
    const type = nftTypeInput.value;
    const multipliers = {
        "video": 3.0, "audio": 2.0, "image": 1.5, "3d": 1.5, "document": 1.0, "code": 1.0
    };
    const typeMultiplier = multipliers[type] || 1.0;
    const estimatedQ = (sizeMB * typeMultiplier * 1.0 * 1.0).toFixed(2);
    
    previewReward.innerText = estimatedQ;
    previewBox.style.display = 'block';
});

// Update Preview on Type Change
nftTypeInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        const event = new Event('change');
        fileInput.dispatchEvent(event);
    }
});

// Handle Mint Button
btnMint.addEventListener('click', () => {
    const file = fileInput.files[0];
    const title = nftTitleInput.value;
    const type = nftTypeInput.value;

    if (!file || !title) {
        alert("Please select a file and enter a title.");
        return;
    }

    // Change button state
    btnMint.innerText = "Processing AI Evaluation...";
    btnMint.disabled = true;

    // Simulate network delay for AI Evaluation
    setTimeout(() => {
        try {
            // Create mock file object
            const sizeMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));
            // Create a fake hash from file name and last modified (to allow testing duplicate later if needed, but usually unique)
            const hash = "hash_" + btoa(file.name + file.lastModified).substring(0, 10);
            
            const fileObj = {
                hash: hash,
                type: type,
                sizeMB: sizeMB === 0 ? 0.1 : sizeMB, // prevent 0 size
                qualityHint: "high" // For demo, we assume high
            };

            const metadata = {
                title: title,
                description: "Minted via Unit Q Wallet"
            };

            // Call backend logic
            const newNft = window.mintNFT(CURRENT_USER_ID, fileObj, metadata);
            
            // Success
            alert(`🎉 NFT Minted Successfully!\nAI Score: ${newNft.ai_score}\nReward: +${newNft.q_reward_minted} Q Token`);
            
            // Reset form
            document.getElementById('mintForm').reset();
            previewBox.style.display = 'none';
            btnMint.innerText = "Mint NFT (Cost: 0.01 GPT-4o)";
            btnMint.disabled = false;

            // Update UI
            updateBalance();
            renderGallery();
            renderTransactionHistory();

        } catch (error) {
            alert(`❌ Mint Failed: ${error.message}`);
            btnMint.innerText = "Mint NFT (Cost: 0.01 GPT-4o)";
            btnMint.disabled = false;
        }
    }, 1500);
});

// Handle Burn NFT
window.burnNFT = function(nftId) {
    const confirmBurn = confirm("Are you sure you want to burn this NFT? You will receive 70% of its original Q Token value, but the file will be permanently destroyed.");
    if(!confirmBurn) return;
    
    const nftIndex = window.NFTDatabase.nfts.findIndex(n => n.id === nftId);
    if(nftIndex > -1) {
        const nft = window.NFTDatabase.nfts[nftIndex];
        const burnValue = parseFloat((nft.q_reward_minted * 0.7).toFixed(2));
        
        // Remove from DB
        window.NFTDatabase.nfts.splice(nftIndex, 1);
        
        // Add Q Tokens back to user
        const user = window.NFTDatabase.users.find(u => u.id === CURRENT_USER_ID);
        if(user) {
            user.q_balance += burnValue;
        }
        
        // Log transaction
        window.NFTDatabase.transactions.push({
            id: "TX_" + Date.now(),
            from: "SYSTEM",
            to: CURRENT_USER_ID,
            type: "BURN_NFT",
            amount_q: burnValue,
            nft_id: nftId,
            timestamp: new Date().toISOString()
        });

        // Free up the file hash
        if (window.NFTDatabase.fileHashes) {
            delete window.NFTDatabase.fileHashes[nft.file_hash];
        }
        
        if (window.saveDB) window.saveDB(); // Lưu thay đổi
        
        alert(`🔥 NFT Burned Successfully!\nYou received ${burnValue} Q Tokens (70% of original value).`);
        
        updateBalance();
        renderGallery();
        renderTransactionHistory();
    }
}

// Handle Sell NFT
window.sellNFT = function(nftId) {
    const nftIndex = window.NFTDatabase.nfts.findIndex(n => n.id === nftId);
    if(nftIndex > -1) {
        const nft = window.NFTDatabase.nfts[nftIndex];
        
        // Ask for price
        const priceStr = prompt(`Enter the price (in Q Tokens) you want to list "${nft.title}" for:`, (nft.q_reward_minted * 2).toFixed(2));
        if(!priceStr) return; // User cancelled
        
        const price = parseFloat(priceStr);
        if(isNaN(price) || price <= 0) {
            alert("Invalid price.");
            return;
        }

        // Change NFT status
        nft.status = 'listed';
        
        // Create Listing
        let icon = '📄';
        if(nft.file_type === 'image') icon = '🖼️';
        if(nft.file_type === 'video') icon = '🎬';
        if(nft.file_type === 'audio') icon = '🎵';
        if(nft.file_type === '3d') icon = '🧊';
        if(nft.file_type === 'code') icon = '💻';
        
        const user = window.NFTDatabase.users.find(u => u.id === CURRENT_USER_ID);
        const username = user ? "@" + user.username : "Unknown";

        const newListing = {
            id: nft.id,
            title: nft.title,
            type: nft.file_type,
            creator: username,
            price: price,
            ai_score: nft.ai_score,
            icon: icon,
            gradient: "linear-gradient(45deg, #00C9FF, #92FE9D)" // Custom gradient
        };

        window.NFTDatabase.listings.push(newListing);
        
        // Log transaction (Listing)
        window.NFTDatabase.transactions.push({
            id: "TX_" + Date.now(),
            from: CURRENT_USER_ID,
            to: "MARKET_ESCROW",
            type: "LIST_NFT",
            amount_q: 0,
            nft_id: nft.id,
            timestamp: new Date().toISOString()
        });

        if (window.saveDB) window.saveDB();
        
        alert(`✅ NFT listed successfully on the market for ${price} Q Tokens!`);
        
        renderGallery();
        renderTransactionHistory();
    }
}

// Run Init on Load
document.addEventListener('DOMContentLoaded', initDashboard);
