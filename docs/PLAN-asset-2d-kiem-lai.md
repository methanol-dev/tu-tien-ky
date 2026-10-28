# KẾ HOẠCH TỔNG LỰC: GEN FULL BỘ ASSET 2D KIẾM LAI (TU TIÊN KÝ)

> **Mục tiêu**: Nâng cấp toàn diện trải nghiệm thị giác (Visual Upgrade) của Tu Tiên Ký từ mức khung xương cơ bản lên chuẩn game Thủy Mặc Nghệ Thuật (Ink-Wash Xianxia), đồng bộ 100% với cốt truyện Kiếm Lai.

---

## 🎨 TỔNG QUAN 4 BỘ ASSET 2D CẦN GEN

Hệ thống asset 2D được chia làm 4 gói chính, kết hợp giữa **AI Image Generation** (cho tranh nghệ thuật, chân dung, cảnh nền) và **Vector SVG Ink Art** (cho sprite chiến đấu nhẹ tênh, tương thích di động):

```
+-----------------------------------------------------------------------------------+
|                           HỆ THỐNG ASSET 2D KIẾM LAI                              |
+--------------------------+----------------------------+---------------------------+
| 1. Chân Dung Nhân Vật     | 2. Tranh Nền 6 Vùng Đất    | 3. Sprite Silhouette SVG  |
| - 8 NPC Kiếm Lai         | - Parallax Thủy Mặc        | - Trần Bình An (Gùi trúc) |
| - Định dạng: WebP/PNG     | - Ly Châu -> Man Hoang     | - Dàn Yêu Ma & 6 Boss     |
| - Dùng cho Story/Modal   | - Dùng cho Sân khấu Hành tẩu| - Dùng cho Animation cọ mực|
+--------------------------+----------------------------+---------------------------+
|                          4. Bộ Icon Pháp Bảo & Đan Dược                           |
| - Hòe Mộc Kiếm, Phi Kiếm Lung Trung Tước, Trúc Y, Gùi Trúc & Giày Cỏ...           |
| - Đan dược: Tụ Khí Đan, Phá Cảnh Đan, Thảo dược...                                |
+-----------------------------------------------------------------------------------+
```

---

## 📋 CHI TIẾT CÁC GIAI ĐOẠN TRIỂN KHAI

### 🧑‍🎨 Giai đoạn 1: Bộ 8 Chân Dung Nhân Vật Kiếm Lai (Character Portraits)
*Mục đích: Thay thế các avatar ký tự chữ Hán đơn điệu trong StoryModal và CharacterModal bằng tranh chân dung thủy mặc có hồn.*

- **Phong cách nghệ thuật (Art Prompt Standard)**:
  `Traditional Chinese ink wash painting, xianxia, sumi-e style, muted earthen tones, jade green & vermilion accents, expressive brushstrokes, rough parchment texture, cinematic lighting`.
- **Danh sách 8 chân dung**:
  1. **Trần Bình An (`安`)**: Thiếu niên áo vải xắn gấu, giày cỏ, gùi trúc sau lưng, ánh mắt kiên nghị thuần phác, thanh mộc kiếm dắt hông.
  2. **Ninh Diêu (`寧`)**: Nữ kiếm tiên tuyệt sắc, váy xanh thẫm, mày kiếm mắt sáng, khí khái hiên ngang bất khuất, bội kiếm bên hông.
  3. **Tề Tĩnh Xuân (`春`)**: Đại Nho áo xanh thư sinh, phong thái ôn nhuận như ngọc, nụ cười từ hòa, tay cầm sách thẻ tre hoặc ngọc ấn.
  4. **A Lương (`良`)**: Kiếm khách lãng tử phong trần, đội nón lá rách che nửa mặt, hông giắt hồ lô rượu và thanh trúc đao cùn.
  5. **Lý Bảo Bình (`瓶`)**: Tiểu cô nương áo đỏ tinh nghịch, mắt to tròn lanh lợi, đeo túi sách nhỏ, khí chất thần tiên đĩnh ngộ.
  6. **Thôi Đông Sơn (`山`)**: Thiếu niên áo trắng tóc dài chấm vai, cầm quạt xếp, nụ cười nửa tà nửa chính, khí chất cuồng ngạo khó lường.
  7. **Ngụy Bách (`檗`)**: Sơn thần Lạc Phách Sơn, y phục kim bào cổ xưa, khí độ trầm tĩnh uy nghiêm hòa hợp cùng núi non.
  8. **Trần Thanh Đô (`都`)**: Lão kiếm tiên đầu tường Kiếm Khí Trường Thành, râu tóc bạc phơ như tuyết, ánh mắt nhìn thấu ngàn năm gió cát Man Hoang.
- **Vị trí lưu trữ**: `public/assets/portraits/` (chuẩn WebP 256x256, nén siêu nhẹ).

---

### 🏞️ Giai đoạn 2: Bộ 6 Tranh Nền Parallax 6 Vùng Đất (Region Backgrounds)
*Mục đích: Tạo chiều sâu thị giác (Parallax Depth) cho sân khấu Hành tẩu `JourneyStage.tsx`, biến mỗi bước đi thành một bức họa cuộn mở.*

- **Kích thước**: 1200x400 (Tỉ lệ banner nằm ngang, tối ưu cho cả desktop và mobile 360px).
- **Danh sách 6 cảnh nền**:
  1. **Ly Châu Động Thiên**: Khói lò gốm Long Diêu mờ ảo, cầu đá vắt qua suối, trấn nhỏ ngõ Nê Bình trong sương sớm.
  2. **Hoang Dã Nam Hạ**: Đường mòn đất đỏ, đồi hoang rừng thưa, ánh hoàng hôn tịch liêu, quán trà rách ven đường.
  3. **Thư Giản Hồ**: Sóng nước mênh mông như mực loang, lau sậy đung đưa trong gió lạnh, thuyền độc mộc trôi dạt.
  4. **Lạc Phách Sơn**: Núi non xanh biếc trập trùng, trúc viện thanh tịnh giữa mây mù, trúc đao và kiếm ý lãng đãng.
  5. **Kiếm Khí Trường Thành**: Tường thành đá đen vĩ đại rách nát ngập tràn vết kiếm chém, trời đất đỏ ối màu máu và cát bụi.
  6. **Man Hoang Thiên Hạ**: Vùng đất yêu khí ngập trời, núi lửa hoang tàn, trăng máu ma mị treo cao giữa hư không.
- **Cơ chế**: Tích hợp Parallax scrolling (Lớp núi xa mờ tĩnh + Lớp sương trôi chậm + Lớp mặt đất chuyển động theo nhịp bước chân).
- **Vị trí lưu trữ**: `public/assets/regions/`.

---

### ⚔️ Giai đoạn 3: Bộ Silhouette & Animation Vector Sân Khấu (Battle Sprites)
*Mục đích: Nâng cấp dàn bóng nhân vật và boss từ hình khối sơ sài thành các hình bóng mực cọ xước phong cách Kiếm Lai chuẩn võ hiệp.*

- **Định dạng**: SVG Vector cọ xước (Brush Stroke Path), `viewBox="0 0 100 100"`, `fill="currentColor"` (ăn theo màu chữ Hán ink/gold/vermilion).
- **Nhân vật**:
  - **Trần Bình An**: Dáng vóc thiếu niên gùi trúc, tay thủ thế Hám Sơn Quyền, sau lưng có bóng phi kiếm Lung Trung Tước xoay tròn.
  - Animation: Động tác ra quyền có vệt gió cọ xước (`punch-streak`), phi kiếm phóng ra (`flying-sword-arc`).
- **6 Đại Boss Kiếm Lai**:
  1. *Trấn Long Mãng Xà* (Thân rồng mãng xà khổng lồ cuộn quanh đá nứt).
  2. *Hắc Sơn Lão Quái* (Bóng ma trượng cao, vuốt dài quỷ dị).
  3. *Lưu Chí Mậu* (Kiếm tu tà phái áo choàng bay, tay kết ấn phù chú).
  4. *Bắc Nhạc Cổ Thần* (Khổng lồ đá uy nghiêm tựa ngọn núi).
  5. *Đại Yêu Man Hoang* (Quái thú sừng nhọn dữ tợn, răng nanh sắc lẹm).
  6. *Yêu Hoàng Thần Thoại* (Cửu vĩ hoặc yêu vương giương cánh bao phủ bầu trời).
- **Vị trí**: `src/ui/silhouettes/` & `src/ui/organisms/JourneyStage.tsx`.

---

### 🛡️ Giai đoạn 4: Bộ Icon Pháp Bảo & Vật Phẩm Bản Mệnh
*Mục đích: Hiển thị trực quan trong Túi đồ (`InventoryScreen`), Bảng Pháp Bảo (`GearPanel`) và Thẻ Trang Bị.*

- **Pháp bảo bản mệnh**:
  - *Hòe Mộc Kiếm* (Thanh kiếm gỗ cổ phong có vân gỗ hòe trấn tà).
  - *Phi Kiếm · Lung Trung Tước* (Lồng chim ánh sáng vàng giam hãm thiên địa).
  - *Trúc Y Bình An* (Áo giáp đan bằng tre trúc thanh mảnh nhưng bền bỉ).
  - *Gùi Trúc & Giày Cỏ* (Cặp pháp khí biểu tượng của thiếu niên ngõ Nê Bình).
  - *Trâm Bích Ngọc* (Chiếc trâm cài tóc xanh biếc linh khí u uẩn).
  - *Bào Xanh Ẩn Quan* (Áo bào đại kiếm tiên đầu tường Trường Thành).
- **Đan dược & Linh thảo**:
  - Tụ Khí Đan, Phá Cảnh Đan, Tăng Thọ Đan, Cửu Chuyển Căn, Thiên Tâm Liên...

---

## 🛠️ QUY TRÌNH THỰC THI (ACTION WORKFLOW)

1. **Step 1**: Dùng công cụ tạo ảnh AI (image generation) xuất toàn bộ 8 chân dung NPC Kiếm Lai -> lưu vào `public/assets/portraits/` -> cập nhật `src/content/story/npcs.ts` và `StoryModal.tsx`.
2. **Step 2**: Tạo 6 tranh nền cảnh vật thủy mặc -> lưu vào `public/assets/regions/` -> cập nhật `JourneyStage.tsx` với hiệu ứng Parallax mượt mà.
3. **Step 3**: Vẽ lại toàn bộ bộ Silhouette SVG cho Trần Bình An và 6 Boss Kiếm Lai -> cập nhật `src/ui/silhouettes/index.tsx`.
4. **Step 4**: Bổ sung bộ Icon pháp bảo/vật phẩm -> cập nhật `GearCard.tsx` và `InventoryScreen.tsx`.
5. **Step 5**: Chạy `pnpm test`, `pnpm lint`, `pnpm build` bảo đảm hiệu năng tải nhanh (< 1.5s trên 3G mobile).
6. **Step 6**: Commit cục bộ từng bước rõ ràng.

