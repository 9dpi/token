/**
 * ==========================================
 * Q TOKEN & NFT ECOSYSTEM - BACKEND BRIDGE
 * ==========================================
 * 
 * Hướng dẫn triển khai (Deployment Guide):
 * 1. Truy cập https://script.google.com/ và tạo một Project mới.
 * 2. Copy toàn bộ code trong file này và dán vào file Code.gs.
 * 3. Tạo một Google Sheet mới, copy URL hoặc ID của Sheet đó.
 * 4. Dán ID của Sheet vào biến SHEET_ID bên dưới.
 * 5. Bấm Deploy > New Deployment.
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy URL Web App được tạo ra và thay vào biến BACKEND_URL trong dự án của bạn (file nft_data_model.js).
 */

const SHEET_ID = 'ĐIỀN_ID_CỦA_GOOGLE_SHEET_VÀO_ĐÂY'; 
const RAW_SHEET_NAME = 'RawData'; // Đổi tên Sheet1 thành RawData

// Helper để lấy hoặc tạo Sheet mới
function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const rawSheet = getOrCreateSheet(ss, RAW_SHEET_NAME);
    const dbString = rawSheet.getRange('A1').getValue();
    
    if (!dbString) {
      return ContentService.createTextOutput(JSON.stringify({ status: "empty" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(dbString).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    
    if (requestData.action === 'save') {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const db = requestData.database;
      
      // 1. Lưu bản Raw (Chuỗi JSON) để hệ thống Web đọc cho nhanh
      const rawSheet = getOrCreateSheet(ss, RAW_SHEET_NAME);
      rawSheet.getRange('A1').setValue(JSON.stringify(db));
      
      // 2. Tự động bung data ra các tab riêng biệt để Human (Admin) dễ quản lý
      exportUsersToSheet(ss, db.users);
      exportTransactionsToSheet(ss, db.transactions);
      exportNFTsToSheet(ss, db.nfts);
      exportListingsToSheet(ss, db.listings);
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "DB Saved & Exported to Tabs" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// HÀM XUẤT RA CÁC TAB QUẢN LÝ (DỄ ĐỌC)
// ==========================================

function exportUsersToSheet(ss, users) {
  if (!users || users.length === 0) return;
  const sheet = getOrCreateSheet(ss, 'Users');
  sheet.clear();
  
  // Headers
  const headers = ['User ID', 'Username', 'Wallet Address', 'Q Balance'];
  const rows = [headers];
  
  // Data
  users.forEach(u => {
    rows.push([u.id, u.username, u.wallet_address, u.q_balance]);
  });
  
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  // Format Header
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');
}

function exportTransactionsToSheet(ss, txs) {
  if (!txs || txs.length === 0) return;
  const sheet = getOrCreateSheet(ss, 'Transactions');
  sheet.clear();
  
  const headers = ['TX ID', 'Time', 'Type', 'From', 'To', 'Amount (Q)', 'NFT ID'];
  const rows = [headers];
  
  txs.forEach(tx => {
    rows.push([tx.id, tx.timestamp, tx.type, tx.from, tx.to, tx.amount_q, tx.nft_id || '']);
  });
  
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');
}

function exportNFTsToSheet(ss, nfts) {
  if (!nfts || nfts.length === 0) return;
  const sheet = getOrCreateSheet(ss, 'NFTs');
  sheet.clear();
  
  const headers = ['NFT ID', 'Title', 'Owner ID', 'Type', 'Size (MB)', 'AI Score', 'Minted Reward (Q)', 'Status', 'Created At'];
  const rows = [headers];
  
  nfts.forEach(nft => {
    rows.push([nft.id, nft.title, nft.owner_id, nft.file_type, nft.size_mb, nft.ai_score, nft.q_reward_minted, nft.status, nft.created_at]);
  });
  
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');
}

function exportListingsToSheet(ss, listings) {
  if (!listings || listings.length === 0) return;
  const sheet = getOrCreateSheet(ss, 'Listings (Market)');
  sheet.clear();
  
  const headers = ['NFT ID', 'Title', 'Type', 'Creator', 'Listed Price (Q)', 'AI Score'];
  const rows = [headers];
  
  listings.forEach(l => {
    rows.push([l.id, l.title, l.type, l.creator, l.price, l.ai_score]);
  });
  
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');
}

// Bật CORS cho phép gọi từ bất kỳ domain nào
function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
