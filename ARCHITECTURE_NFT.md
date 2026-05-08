# Kiến Trúc Hệ Thống: NFT & Q Token Ecosystem

Tài liệu này mô tả chi tiết về hệ sinh thái NFT kết hợp Q Token, được tích hợp trực tiếp vào AI Token Index hiện tại.

## 1. Thành phần & Vai trò trong hệ thống

- **Q Token**: Đồng tiền nội bộ (fungible token), dùng để giao dịch, quy đổi qua lại với USD, AI Token, Gold, Crypto theo tỷ giá index hiện tại.
- **Digital File**: Tác phẩm số của user (ảnh, nhạc, video, 3D, code, ebook...). Mỗi file được "token hóa" thành một NFT duy nhất.
- **NFT (Non-Fungible Token)**: Đại diện cho quyền sở hữu một digital file cụ thể. Không thể thay thế, có thể mua/bán/trao đổi bằng Q Token.
- **Mint NFT**: Hành động submit file lên hệ thống, được chấp nhận và đúc thành NFT. Khi mint, user sẽ nhận được một lượng Q Token thưởng (hoặc file được định giá sẵn thành Q Token).

**Luồng chính xác:**
User submit digital file → Hệ thống định giá (bằng AI hoặc cộng đồng) → Mint NFT + thưởng Q Token cho chủ sở hữu → NFT và Q Token đều có thể giao dịch trên thị trường.

---

## 2. Kiến trúc tổng thể – Các module chức năng

```text
AI Token Index (hiện tại) → Quy đổi USD, AI token, Gold, Crypto
          │
          ▼
[Module 1] NFT Minting: Upload file → định giá → mint NFT → thưởng Q Token
          │
          ▼
[Module 2] Quản lý NFT & Ví Q Token (ví chứa cả Q Token và các NFT sở hữu)
          │
          ▼
[Module 3] Marketplace NFT: Mua/bán NFT bằng Q Token (đấu giá hoặc giá cố định)
          │
          ▼
[Module 4] (Tùy chọn) Quy đổi ngược: NFT → burn → lấy lại Q Token hoặc file gốc
```

### Module 1 – Mint NFT từ digital file (Quan trọng nhất)
**Mục tiêu:** Biến mỗi file hợp lệ thành một NFT độc nhất, đồng thời tạo ra Q Token thưởng cho người tạo.

**Các bước xử lý logic:**
1. **Upload file:** Hỗ trợ nhiều định dạng: jpg, png, mp3, mp4, pdf, zip, code...
2. **Tính toán định giá file → số Q Token thưởng:**
   Công thức đề xuất:
   `Q_reward = (Dung lượng MB) × (Hệ số loại file) × (Hệ số chất lượng AI) × (Hệ số độc bản)`
   - *Dung lượng:* khuyến khích file chất lượng cao.
   - *Hệ số loại:* video 3.0, ảnh/3D 1.5, nhạc 2.0, văn bản/code 1.0.
   - *Hệ số chất lượng AI:* sử dụng một AI model (GPT-4o hoặc Claude) để chấm điểm nội dung (1.0 – 1.5). Phí AI được trả bằng AI Token.
   - *Hệ số độc bản:* nếu file chưa từng có hash trùng trong hệ thống → 1.0; nếu trùng (copy) → 0 (từ chối mint).
3. **Mint NFT:** Tạo một NFT với metadata gồm:
   - Tên file, mô tả (do AI sinh hoặc user nhập).
   - Đường dẫn lưu file gốc (trên IPFS hoặc storage).
   - Ngày mint, chủ sở hữu (địa chỉ ví user).
   - Số Q Token đã thưởng khi mint.
4. **Chuyển Q_reward** vào ví user.
5. **Lưu NFT** vào danh sách sở hữu của user.

**Cơ chế chống spam:**
- Mỗi user chỉ được mint tối đa 5 NFT/ngày (giai đoạn đầu).
- Phải trả một khoản phí nhỏ bằng AI Token (hoặc USD) để mint, tránh upload rác.

### Module 2 – Ví Q Token + NFT
User cần một nơi quản lý cả hai loại tài sản:

| Loại tài sản | Hiển thị trong ví | Thao tác |
| :--- | :--- | :--- |
| **Q Token** | Số dư (fungible) | Gửi cho user khác, đổi lấy NFT, đổi sang USD/AI Token. |
| **NFT** | Danh sách các NFT đang sở hữu (thumbnail, tên, metadata, định giá Q Token). | Đem bán, hủy niêm yết, chuyển NFT cho user khác (gift). |

- **Chức năng gửi Q Token giữa các user:** Tương tự ví crypto: nhập username hoặc địa chỉ ví, số lượng, xác nhận.

### Module 3 – Marketplace NFT
Nơi người dùng có thể:
- **Mua NFT:** Duyệt danh sách NFT đang rao bán, mua bằng Q Token (giá do người bán đặt hoặc đấu giá).
- **Bán NFT:** Chọn một NFT trong ví, đặt giá (Q Token), đưa lên sàn. Khi bán được, người bán nhận Q Token, người mua nhận NFT (chuyển quyền sở hữu).
- **Lịch sử giao dịch của từng NFT:** Ai mint, từng lần chuyển nhượng, giá bán.

**Tính năng nâng cao (Tương lai):**
- Đấu giá tăng dần.
- Royalty: Mỗi lần NFT được bán lại, người mint nhận được % phí (ví dụ 5% bằng Q Token).

### Module 4 – Quy đổi ngược (Burn NFT)
Nếu user không muốn giữ NFT nữa, có thể burn (hủy) NFT để lấy lại một phần Q Token (hoặc lấy lại file gốc).
- **Lý do:** Kiểm soát lạm phát NFT, thu hồi file kém chất lượng.
- **Công thức:** `Q_refund = Q_reward_original × (1 - khấu hao thời gian)` – càng để lâu càng mất giá trị quy đổi.

---

## 3. Lộ trình triển khai chi tiết

- **Tuần 1-2: Thiết kế cấu trúc dữ liệu NFT & định giá file**
  - Cấu trúc Database:
    - `Users`: id, địa chỉ ví (hoặc username), số dư Q Token.
    - `NFTs`: id, owner_id, file_hash, file_type, size_mb, ai_score, q_reward_minted, metadata_url (IPFS), created_at, status.
    - `Listings`: nft_id, price_q, seller_id, listed_at.
    - `Transactions`: từ ai, đến ai, loại (mua NFT, gửi Q Token, mint NFT).
  - Xây dựng công thức định giá file mẫu và chạy thử với 10 file mẫu (ảnh, video ngắn, file pdf).

- **Tuần 3-4: Tạo giao diện quản lý NFT & ví**
  - Trang "My NFTs": Hiển thị tất cả NFT user đang sở hữu.
  - Trang "Ví Q Token": Hiển thị số dư, lịch sử giao dịch, nút gửi.
  - Form Mint NFT: Upload file, xem trước, AI tự động sinh mô tả, hiển thị Q Token dự kiến, nút xác nhận.

- **Tuần 5-6: Xây dựng Marketplace cơ bản**
  - Trang Marketplace: Danh sách NFT rao bán, bộ lọc.
  - Form đăng bán.
  - Chức năng mua NFT và trừ/cộng Q Token, chuyển quyền sở hữu.

- **Tuần 7-8: Tích hợp AI Token Index hiện tại**
  - Sửa giao diện index: thêm box "Q Token Balance" và "My NFTs".
  - Cho phép nạp Q Token bằng cách đổi từ USD, Gold, Crypto hoặc AI Token (tỷ giá realtime).
  - Trả phí mint NFT bằng AI Token (ví dụ 0.01 GPT-4o token).
  - Đồng bộ tỷ giá Q Token / USD.

- **Tuần 9-10: Kiểm thử toàn diện, tài liệu & beta**
  - Kiểm thử kịch bản: mint NFT, mua bán, chuyển Q Token.
  - Viết hướng dẫn chi tiết sử dụng.
  - Thu thập phản hồi, điều chỉnh công thức định giá.

---

## 4. Rủi ro và Giải pháp

| Rủi ro đặc thù | Giải pháp |
| :--- | :--- |
| **Bản quyền file không rõ ràng** | Yêu cầu cam kết bản quyền khi mint. Cho phép report NFT vi phạm. Nếu xác thực vi phạm, NFT bị burn, không hoàn lại Q Token. |
| **Thị trường NFT ảm đạm** | Khuyến khích tạo NFT có giá trị thực (mã giảm giá, vé, khóa học). Tổ chức sự kiện "Mint-a-thon" thưởng Q Token. |
| **Lạm phát Q Token** | Áp dụng phí mint bằng AI Token. Giới hạn số NFT/ngày. Định giá khắt khe theo chất lượng AI. |
| **Khó quản lý file gốc khi chuyển chủ** | Lưu file trên IPFS. Quyền truy cập file gốc đi kèm với quyền sở hữu NFT. Giai đoạn đầu cấp link tải cho chủ sở hữu. |

---

## 5. Gợi ý Công nghệ triển khai

- **Lưu file & metadata NFT:** IPFS (thông qua Pinata hoặc Web3.Storage) để đảm bảo phi tập trung.
- **Smart contract NFT (Tùy chọn):** Dùng chuẩn ERC-721/ERC-1155 trên testnet (Ethereum Goerli, Polygon Mumbai) hoặc tự xây dựng ledger trong Database cho MVP.
- **Frontend:** GitHub Pages + HTML/CSS/JS hiện tại. Gọi API qua Web3.js/Ethers.js (nếu dùng blockchain).
- **Backend:** Node.js + Express (hoặc Firebase/Supabase) để xử lý upload file, mint, lưu metadata, quản lý Q Token.

*Với bản nâng cấp này, AI Token Index vừa là công cụ quy đổi định giá, vừa là nguồn thanh khoản trung tâm cho hệ sinh thái Q Token.*
