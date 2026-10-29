# HƯỚNG DẪN KIẾN TRÚC & HỆ THỐNG GAME KIẾM LAI · TU TIÊN KÝ
> **Dự án**: Kiếm Lai · Tu Tiên Ký (`tu-tien-ky`)  
> **Phiên bản tài liệu**: 2.0 (Đồng bộ Save v10 & GDD Kiếm Lai)  
> **Cập nhật ngày**: 29/10/2026  
> **Tác giả**: Multi-Agent Architecture Team (`meth`)

---

## ☯️ I. HỆ THỐNG CẢNH GIỚI TU HÀNH (DUAL CULTIVATION SYSTEM)

Hệ thống cho phép người chơi lựa chọn đi theo một trong hai đại đạo lộ độc lập hoàn toàn, hoặc hợp nhất qua luân hồi:

### 1. Thuần Túy Võ Đạo (11 Cảnh Giới Võ Đạo)
Con đường nghịch thiên tự cường của Trần Bình An. Võ phu tôi luyện thể phách kim cương, tích lũy Quyền Lực và uẩn dưỡng Hám Sơn Quyền Ý.

| Bậc Cảnh Giới | Tên Cảnh Giới | Số Quyền Tối Thiểu | Đặc Điểm & Ý Nghĩa Lore Kiếm Lai |
| :--- | :--- | :--- | :--- |
| **Luyện Thể Tam Cảnh** | 1. Nê Phôi Cảnh | 0 quyền | Nhục thân như bùn đất lò gốm, bắt đầu gọt giũa kình lực. |
| | 2. Mộc Thai Cảnh | 50 quyền | Gân cốt vững chắc như cây già ngàn năm, xuất quyền có tiếng gió rít. |
| | 3. Thủy Ngân Cảnh | 200 quyền | Khí huyết cô đọng chảy cuồn cuộn như thủy ngân, vượt khảo nghiệm *Ni Bồ Tát Quá Giang*. |
| **Luyện Khí Tam Cảnh** | 4. Anh Hồn Cảnh | 600 quyền | Hơi thở ngưng tụ anh hồn, quyền ý câu thông sinh tử. |
| | 5. Hùng Phách Cảnh | 1.500 quyền | Phách lực hùng hậu, khí thế áp đảo tà ma ngoại đạo. |
| | 6. Võ Đảm Cảnh | 3.500 quyền | Đúc thành võ đảm kiên cường, đối diện cường địch trời đất không chút dao động. |
| **Luyện Thần Tam Cảnh** | 7. Kim Thân Cảnh | 8.000 quyền | Đúc thành Kim Thân bất hoại, đao kiếm phàm tục chém vào như gãi ngứa. |
| | 8. Viễn Du Cảnh | 18.000 quyền | Thần du vạn dặm, quyền phong vượt ngàn dặm chấn động sơn hà. |
| | 9. Sơn Điên Cảnh | 40.000 quyền | Đứng trên đỉnh núi nhìn xuống nhân gian, võ đạo chín tầng viên mãn. |
| **Đỉnh Cao Võ Đạo** | 10. Chỉ Cảnh (Quy Chân) | 80.000 quyền | Võ phu thập cảnh chí tôn, sánh ngang đại tu sĩ Thượng Ngũ Cảnh. |
| | 11. Võ Thần Cảnh | 150.000 quyền | Vô địch thiên hạ, một quyền phá vạn pháp, trường sinh cùng nhật nguyệt! |

> [!NOTE]
> **Quy Tắc Đột Phá Võ Đạo**: Võ phu không cướp đoạt thiên địa linh khí, do đó **miễn nhiễm 100% với Lôi Kiếp Thiên Phạt**! Khi số quyền tích lũy đạt mốc, người chơi có thể tiến hành đột phá thành công ngay lập tức.

---

### 2. Luyện Khí Tiên Đạo (15 Cảnh Giới Luyện Khí Sĩ)
Hệ thống tu đạo thuận thiên ứng nhân, cướp đoạt tạo hóa trời đất, chia làm 15 Đại Cảnh Giới (43 tầng):

1. **Hạ Ngũ Cảnh (Giai đoạn Leo Núi)**:
   - *Đồng Bì Cảnh*: Rèn da đồng, giảm sát thương vật lý cơ bản.
   - *Thảo Căn Cảnh*: Rễ cỏ sinh sôi, tăng tốc độ hồi phục sinh lực.
   - *Liễu Cân Cảnh*: Tôi luyện gân cốt như cành liễu dẻo dai (Lưu Nhân Cảnh).
   - *Khí Cốt Cảnh*: Xương cốt ngàn cân, làm nền tảng cho khí phủ.
   - *Trúc Thể Cảnh*: Lấy thân thể làm lò luyện khí (Trúc Lô).
2. **Trung Ngũ Cảnh (Địa Tiên Nhân Gian)**:
   - *Động Phủ Cảnh*: Khai mở các khiếu huyệt như tiểu động thiên trong cơ thể.
   - *Quan Hải Cảnh*: Kinh mạch mở rộng mênh mông như biển lớn.
   - *Long Môn Cảnh*: Cửa ải sinh tử, cá chép vượt Vũ Môn hóa rồng.
   - *Kim Đan Cảnh*: Kết Đan thất, Kiếm Tu bắt đầu uẩn dưỡng Bản Mệnh Phi Kiếm hoàn chỉnh.
   - *Nguyên Anh Cảnh*: Âm Thần / Dương Thần xuất khiếu chu du thiên hạ.
3. **Thượng Ngũ Cảnh & Thất Truyền (Tiên Nhân / Hợp Đạo)**:
   - *Ngọc Phác Cảnh*: Thân thể lưu ly vô cấu, miễn nhiễm tà khí độc tố.
   - *Tiên Nhân Cảnh*: Tích lũy khí số nhân gian hoặc công đức tông môn.
   - *Phi Thăng Cảnh*: Đỉnh cao nhân gian, chạm tới ngưỡng cửa thiên môn.
   - *Thập Tứ Cảnh*: Hợp Đạo trời đất (Thiên Thời, Địa Lợi, Nhân Hòa).
   - *Thập Ngũ Cảnh*: Tuyệt đỉnh cửu châu, chưởng quản đại đạo càn khôn.

---

## ⚔️ II. LỤC ĐẠI HỆ PHÁI & CƠ CHẾ CHIẾN ĐẤU CẬN CHIẾN - TẦM XA

```mermaid
flowchart TD
    Origin["Khởi Lập Đạo Đồ"] --> Choice{"Lựa Chọn Đạo Lộ"}
    
    Choice -->|"Thuần Túy Võ Đạo"| Martial["👊 THUẦN VÕ PHU<br/>• Cận Chiến (Melee)<br/>• Áp Chế 10 Trượng (+35% Atk)<br/>• 11 Cảnh Giới Võ Đạo<br/>• Quyền Kình Xung Kích"]
    
    Choice -->|"Luyện Khí Tiên Đạo"| QiPath["LUYỆN KHÍ SĨ<br/>• Tầm Xa (Ranged)<br/>• 15 Cảnh Giới Luyện Khí<br/>• Lôi Kiếp & Long Môn"]
    
    QiPath --> F1["⚔️ Kiếm Tu: Bản Mệnh Phi Kiếm, Bạo Kích x2.5"]
    QiPath --> F2["📿 Đạo Gia: Phù Trận Ngũ Lôi, Khiên 25% HP"]
    QiPath --> F3["📖 Nho Sĩ: Khẩu Hàm Thiên Hiến, Áp Chế Địch"]
    QiPath --> F4["🚩 Binh Gia: Cận Chiến, Hút Máu & Cuồng Nộ"]
    QiPath --> F5["⚙️ Mặc Gia: Khôi Lỗi Thú, Bào Mòn Giáp Boss"]

    Legacy["Luân Hồi Kiếp 2+"] -.-> Dual["🌟 KIẾM VÕ SONG TU (Đạo Cốt Huyền Thoại)"]
```

### 1. Phân Định Chiến Đấu Cận Chiến (Melee) vs Tầm Xa (Ranged)

| Tiêu Chí | Cận Chiến (Võ Phu, Binh Gia, Phật Môn) | Tầm Xa (Kiếm Tu, Đạo Gia, Nho Sĩ, Mặc Gia) |
| :--- | :--- | :--- |
| **Vị trí & Hoạt ảnh** | **Lướt áp sát (`journey-melee-rush`)**: Hero lướt thần tốc từ `left: 12%` đến sát quái `left: 55% - 62%`, tung đòn giáp lá cà cự ly gần. | **Trấn thủ trận địa (`journey-breathe`)**: Hero đứng vững tại chỗ ở `left: 12%`, tà áo bay nhẹ, hai tay bấm quyết. |
| **Hiệu ứng ra đòn** | **Quyền kình sóng xung kích (`punch-impact-ring`)**: Vòng năng lượng Khí Huyết nổ tung trực tiếp trên thân thể quái vật. **Tuyệt đối không rung giật màn hình**. | **Tia đạn đạo phóng xuất (`flying-sword-bolt`)**: Tia Bản Mệnh Phi Kiếm hoàng kim bay vút xé gió qua không gian cắm vào quái vật. |
| **Cơ chế độc bản** | **Áp Chế 10 Trượng**: Công thức $M_{\text{Martial}} = 1 + 0.35 \times (1 - d/10)$. Khi áp sát $d=0$ trượng, nhận trọn vẹn **+35% tổng sát thương**! | **Đạn đạo xuyên thấu**: Tỉ lệ bạo kích cao, khả năng khống chế và debuff quái vật từ xa an toàn. |

---

## 💾 III. KIẾN TRÚC LƯU TRỮ (SAVE V10) & ZERO DATA LOSS

Cấu trúc `GameState` được chuẩn hóa qua Zod schema (`src/engine/save/schema.ts`):
```typescript
export interface GameState {
  version: 10
  createdAt: number
  lastSavedAt: number
  playedMs: number
  classId: ClassId                        // 'kiem-tu' | 'vo-phu' | 'dao-gia' | 'nho-gia'...
  cultivationPath: 'martial' | 'qi' | 'dual' // Đạo đồ khởi đầu
  martialStageIndex: number               // Cảnh giới võ đạo hiện tại (0..10)
  punches: number                         // Số quyền tích lũy
  realmIndex: number                      // Index cảnh giới Luyện Khí Sĩ (0..39)
  qi: number                              // Linh khí
  stones: number                          // Linh thạch tiền tệ
  // ...
}
```

### Chuỗi Migration v9 $\rightarrow$ v10:
- Tự động nhận diện nếu save cũ đang ở `classId === 'vo-phu'` thì gán `cultivationPath = 'martial'`, ngược lại là `'qi'`.
- Tự động tính toán số quyền đã luyện (`punches`) dựa trên số lượng quái và boss người chơi đã tiêu diệt trong quá khứ:
  $$\text{punches} = \text{enemiesSlain} + \text{bossesSlain} \times 10 + \text{stagesCleared} \times 5$$
- Đảm bảo người chơi cũ nâng cấp lên bản mới không bao giờ bị mất đồ, mất cấp hay kẹt game.

---

## 🧪 IV. QUY TRÌNH KIỂM THỬ & GIÁM SÁT HIỆU NĂNG

Mọi thay đổi trong codebase phải vượt qua bộ kiểm thử tự động Vitest:
- `tests/migration.test.ts`: Kiểm tra toàn vẹn chuỗi nâng cấp save từ v1 đến v10.
- `tests/cultivationPath.test.ts`: Kiểm tra logic phân nhánh Võ Phu vs Luyện Khí Sĩ và công thức áp chế 10 trượng.
- `tests/sim.test.ts`: Giả lập bot 24h chạy liên tục, đảm bảo tiến trình cân bằng và không bị lạm phát chỉ số (Power Creep).

```bash
pnpm test       # Chạy 32 test suites (161 tests pass 100%)
pnpm lint       # Kiểm tra 0 lỗi ESLint
pnpm build      # Kiểm tra type-check TypeScript và build PWA
```

---
*Tài liệu nội bộ dự án Kiếm Lai · Tu Tiên Ký.*
