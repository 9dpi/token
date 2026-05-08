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

const SHEET_ID = 'ĐIỀN_ID_CỦA_GOOGLE_SHEET_VÀO_ĐÂY'; // Vd: '1BxiMvs0XRYFgwnAKnZJ-zQ2...'
const DB_CELL = 'A1'; // Nơi lưu trữ toàn bộ chuỗi JSON của DB

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const dbString = sheet.getRange(DB_CELL).getValue();
    
    // Nếu sheet trống, trả về DB rỗng hoặc DB mặc định
    if (!dbString) {
      return ContentService.createTextOutput(JSON.stringify({ status: "empty" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Trả về JSON cho Client
    return ContentService.createTextOutput(dbString).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // Parse dữ liệu gửi lên từ Client (nft_data_model.js)
    const requestData = JSON.parse(e.postData.contents);
    
    // Nếu request yêu cầu lưu DB
    if (requestData.action === 'save') {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
      const newDbString = JSON.stringify(requestData.database);
      
      // Ghi đè chuỗi JSON vào ô A1
      sheet.getRange(DB_CELL).setValue(newDbString);
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "DB Saved Successfully" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Bật CORS cho phép gọi từ bất kỳ domain nào
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
}
