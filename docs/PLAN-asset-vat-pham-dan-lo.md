# KẾ HOẠCH BỘ ASSET 2D: TRANG BỊ, ĐAN DƯỢC, LINH DƯỢC, PHÙ LỤC & ĐAN LÔ (KIẾM LAI)

> **Mục tiêu**: Nâng cấp toàn diện hệ thống biểu tượng (Item Visuals), thẻ bài vật phẩm và sân khấu Luyện Đan Lô đạt chuẩn thẩm mỹ Thủy Mặc Cổ Phong (Sumi-e / Xianxia Ink Wash), xoá bỏ hoàn toàn các khung chữ Hán trần trụi.

---

## 🧭 CẤU TRÚC 5 GÓI ASSET VẬT PHẨM

```
+-----------------------------------------------------------------------------------------+
|                  HỆ THỐNG ASSET VẬT PHẨM & ĐAN LÔ (KIẾM LAI)                            |
+-------------------+--------------------+--------------------+---------------------------+
| 1. Trang Bị       | 2. Đan Dược        | 3. Linh Dược       | 4. Phù Lục & Đan Lô       |
| - 15 Base Gear    | - 5 Loại Đan Dược  | - 5 Loại Thảo Dược | - 5 Loại Bùa Chú Đạo Gia  |
| - 6 Pháp Bảo Bản  | - Viên đan phát    | - Thảo mộc, nấm,   | - Đan Lô Luyện Dược       |
|   Mệnh Kiếm Lai   |   sáng theo phẩm   |   hoa sen tuyết    |   (Lò Gốm Long Diêu /     |
|                   |   cấp (Tier 1..5)  |   (Tier 1..5)      |   Tử Kim Lô có lửa lò)    |
+-------------------+--------------------+--------------------+---------------------------+
```

---

## 📋 CHI TIẾT TỪNG DANH MỤC ASSET

### ⚔️ Gói 1: Bộ 21 Trang Bị & Pháp Bảo Bản Mệnh (Gear Assets)
- **Công nghệ**: Vector SVG tinh xảo kết hợp ánh sáng hào quang (Glow FX) theo 5 phẩm cấp (Phàm, Linh, Bảo, Tiên, Thần).
- **Phân loại**:
  1. **Kiếm (Vũ khí)**:
     - `thiet-kiem-tho`: Thanh đoản kiếm sắt xỉn màu, góc cạnh thô ráp.
     - `thanh-cuong-kiem`: Thanh kiếm thép xanh lưỡi sắc lạnh, chuôi quấn vải chàm.
     - `linh-kiem`: Kiếm có rãnh linh khí màu lam ngọc phát sáng.
     - `phi-kiem`: Thanh kiếm thon dài nhẹ tênh, có luồng kiếm khí xoáy quanh mũi kiếm.
     - `tien-kiem`: Thân kiếm trong suốt như pha lê, kiếm quang kim sắc ngút trời.
     - **Pháp bảo bản mệnh**:
       - *Hòe Mộc Kiếm*: Kiếm gỗ hòe ngàn năm của thiếu niên Trần Bình An, vân gỗ cổ kính trừ tà.
       - *Phi Kiếm · Lung Trung Tước*: Thanh phi kiếm bản mệnh vàng kim tỏa hào quang giam cầm thiên địa.
  2. **Giáp (Phòng cụ)**:
     - `bo-giap`: Áo vải độn bông giản dị.
     - `bi-giap`: Áo giáp da dã thú dẻo dai.
     - `lan-giap`: Áo giáp vảy giao long xanh thẫm.
     - `huyen-giap`: Khối giáp thép đen tuyền kiên cố.
     - `tien-giap`: Tiên giáp kim quang hộ thể.
     - **Pháp bảo bản mệnh**:
       - *Trúc Y Bình An (Huyền Quy Giáp)*: Bộ áo giáp đan bằng tre trúc xanh bóng mượt mà bền chắc.
       - *Bào Xanh Ẩn Quan (Thiên Ma Giáp)*: Đại bào màu xanh của Ẩn Quan đầu tường Kiếm Khí Trường Thành.
  3. **Pháp khí (Trang sức & Phụ kiện)**:
     - `moc-phu`: Bùa gỗ đào khắc lôi triện.
     - `ngoc-boi`: Miếng ngọc bội tròn ôn nhuận dưỡng thần.
     - `linh-chau`: Viên ngọc tụ khí phát sáng trong đêm.
     - `ho-tam-kinh`: Tấm gương đồng hộ vệ trước ngực.
     - `bat-quai-kinh`: Kính bát quái đồng cổ trấn áp tà khí.
     - **Pháp bảo bản mệnh**:
       - *Gùi Trúc & Giày Cỏ (Ngưng Thần Phù)*: Biểu tượng gùi trúc nhỏ và đôi giày cỏ vượt ngàn dặm của Bình An.
       - *Trâm Bích Ngọc (Băng Tâm Châu)*: Chiếc trâm cài tóc xanh ngọc bích linh khí băng tuyết thanh tịnh.

---

### 💊 Gói 2: Bộ 5 Đan Dược Kỳ Trân (Pill Assets)
- **Đặc điểm**: Viên đan dược tròn vo có đan văn (hoa văn mây xoáy) và hào quang dược lực:
  1. **Tụ Khí Đan** (`tu-khi-dan` - Tier 1): Viên đan màu thanh lam (xanh ngọc nhạt), bốc hơi sương linh khí.
  2. **Ngưng Thần Đan** (`ngung-than-dan` - Tier 2): Viên đan màu tím tử hà, tĩnh tâm ngưng thần.
  3. **Phá Cảnh Đan** (`pha-canh-dan` - Tier 3): Viên đan màu hổ phách vàng kim, xung quanh có tia sét nhỏ phá vỡ gông cùm.
  4. **Tăng Thọ Đan** (`tang-tho-dan` - Tier 4): Viên đan màu lục bích trường sinh, hình dáng như quả đào tiên thu nhỏ.
  5. **Kim Nguyên Đan** (`kim-nguyen-dan` - Tier 5): Cực phẩm kim đan chín chuyển rực rỡ kim quang, cửu khiếu thông suốt.

---

### 🌿 Gói 3: Bộ 5 Linh Dược & Dị Thảo (Herb Assets)
- **Đặc điểm**: Tranh vẽ thủy mặc thảo mộc tinh xảo, rễ cây, cuống lá mềm mại:
  1. **Linh Thảo** (`linh-thao` - Tier 1): Cụm cỏ xanh ba lá tỏa ánh huỳnh quang mờ nhạt.
  2. **Huyết Tinh Chi** (`huyet-tinh-chi` - Tier 2): Cây nấm linh chi đỏ thắm như ngọc huyết, mọc trên vách đá.
  3. **Tử Linh Chi** (`tu-linh-chi` - Tier 3): Nấm linh chi tím trăm năm, tai nấm uốn lượn phủ lớp phấn tím kỳ ảo.
  4. **Thiên Tâm Liên** (`thien-tam-lien` - Tier 4): Bông sen trắng tinh khôi nở trên tuyết sơn, nhụy sen phát sáng xanh băng tuyết.
  5. **Cửu Chuyển Căn** (`cuu-chuyen-can` - Tier 5): Rễ cây thần mộc ngàn năm uốn lượn 9 khúc như rồng cuộn.

---

### 📜 Gói 4: Bộ 5 Phù Lục Đạo Gia Kiếm Lai (Talisman Assets)
- **Đặc điểm**: Giấy bùa vàng chu sa đỏ rực (Yellow parchment with cinnabar calligraphy), bay lượn huyền bí:
  1. **Định Thần Phù**: Bùa chú an định tâm thần, chống tà ma nhập thể.
  2. **Thần Hành Phù**: Bùa chú gió cuốn sau gót chân, tăng thân pháp viễn du.
  3. **Tụ Linh Phù**: Bùa chú triệu hoán linh khí đất trời ngưng tụ.
  4. **Hộ Thân Kim Cang Phù**: Bùa chú kim quang tráo bảo vệ thân thể khỏi sát thương trí mạng.
  5. **Ngũ Lôi Trảm Tà Phù**: Bùa lôi pháp Long Hổ Sơn dẫn thiên lôi trừng trị yêu ma.

---

### 🏺 Gói 5: Hoạt Cảnh Đan Lô Thủy Mặc (Alchemy Furnace Stage)
- **Nâng cấp giao diện Lò Luyện Đan (`AlchemyScreen.tsx`)**:
  - Không còn chỉ là thanh tiến độ xám xịt!
  - Thay bằng **Minh Họa Đan Lô Thủy Mặc sống động**:
    - Thân lò đồng cổ (hoặc Lò Gốm Long Diêu men xanh ngọc rạn).
    - Có 3 chân đỉnh vạc, nắp lò chạm rỗng hình kỳ lân nhả khói lam.
    - **Lửa lò Tam Muội Chân Hỏa**: Khi đang luyện đan, ngọn lửa bên dưới lò bập bùng chuyển từ đỏ cam sang vàng kim rực rỡ; khói thơm tỏa ra từ miệng lò theo nhịp thở.
    - Khi đan đã chín (`ready`): Lò nổ bừng kim quang, nắp lò rung rinh báo hiệu thu đan!

---

## 🛠️ QUY TRÌNH THỰC THI

1. **Bước 1**: Tạo component `ItemIcon.tsx` đa năng (render icon vector chi tiết cho cả Đan Dược, Linh Dược, Phù Lục theo id và tier).
2. **Bước 2**: Tích hợp `ItemIcon` vào Túi đồ (`InventoryScreen.tsx`) và danh sách nguyên liệu Luyện Đan (`AlchemyScreen.tsx`).
3. **Bước 3**: Thiết kế component hoạt cảnh `AlchemyCauldron.tsx` (Lò luyện đan hoạt họa cọ mực, khói thơm, lửa lò theo trạng thái luyện đan).
4. **Bước 4**: Bổ sung icon vector đặc biệt cho toàn bộ 21 món Trang bị trong `GearIcon.tsx`.
5. **Bước 5**: Kiểm thử kiểm tra tương thích mobile 360px, chạy tests (`pnpm test`), linter (`pnpm lint`) và production build (`pnpm build`).

