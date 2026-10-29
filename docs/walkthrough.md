# Walkthrough — Kiếm Lai · Tu Tiên Ký

> Bản ghi bàn giao hệ thống sau các đợt đại tu toàn diện (2026-10-27 $\rightarrow$ 2026-10-29).  
> Đọc kèm [KIEM_LAI_GAME_GUIDE.vi.md](KIEM_LAI_GAME_GUIDE.vi.md) và Game Design Document [docs.md](../docs.md).

---

## 1. Tổng Quan Dự Án

Game 2D Xianxia Idle / Incremental RPG phong cách Thủy Mặc Cổ Phong dựa trên thế giới quan nguyên tác **Kiếm Lai (Phong Hỏa Hí Chư Hầu)** và gameplay **Quỷ Cốc Bát Hoang**. Chạy trên Web Browser, PWA Offline, lưu trữ IndexedDB/LocalStorage, Zero Data Loss.

| Hệ Thống | Hiện Trạng (Save v10) |
|---|---|
| **Cảnh Giới Luyện Khí Sĩ** | **15 Cảnh Giới Kiếm Lai** (Đồng Bì $\rightarrow$ Thập Ngũ Cảnh, 43 tầng). Xóa bỏ hoàn toàn các cảnh giới tiên hiệp cũ. |
| **Cảnh Giới Thuần Túy Võ Đạo** | **11 Cảnh Giới Võ Đạo** (Nê Phôi $\rightarrow$ Kim Thân $\rightarrow$ Sơn Điên $\rightarrow$ Chỉ Cảnh $\rightarrow$ Võ Thần). Luyện quyền tích lũy Khí Huyết & Quyền Ý, không chịu Lôi Kiếp. |
| **Bản Mệnh Phi Kiếm (Kiếm Tu)** | **Khí Phủ Kiếm Thai (Tối đa 4 kiếm)**: Sơ Thập, Thập Ngũ, Tỉnh Để, Mạch Thượng, Ánh Tuyết, Huyền Hoàng Trảm Tiên. Đa thần thông tự động thức tỉnh ở cấp 3 & 6, Kiếm Tu Bảng 7 bậc danh xưng thiên hạ. |
| **Giao Diện Đạo Thân Võ Lâm** | **Paper Doll 3 Cột Kinh Điển (Võ Lâm Truyền Kỳ)**: Đạo thân avatar ở giữa với vòng Bát Quái tu vi, 12 ô xếp 2 bên cân đối với Silhouette mờ khi trống; Nút **Mặc Nhanh** & **Gỡ Hết** thần tốc; Popup so sánh thuộc tính hơn kém trực quan. |
| **Khởi Lập Đạo Đồ** | Modal vấn đạo khi New Game: Tự do chọn con đường **Thuần Túy Võ Phu** (Cận chiến) hoặc **Luyện Khí Tiên Đạo** (Tầm xa). |
| **Kiếm Võ Song Tu** | Đạo cốt huyền thoại mở khóa ở Luân Hồi Kiếp 2+ cho phép đồng thời tu cả 2 con đường như Trần Bình An. |
| **Lục Đại Hệ Phái** | 6 class chuẩn GDD: Kiếm Tu, Võ Phu, Đạo Gia Phương Sĩ, Nho Sĩ, Binh Gia, Mặc Gia Cơ Quan Sư. |
| **Combat Melee vs Ranged** | Phân hóa rõ rệt: Cận chiến áp sát (`journey-melee-rush`) kích hoạt **Áp Chế 10 Trượng (+35% Atk)** và quyền kình sóng xung kích (không rung màn hình); Đánh xa phóng Bản Mệnh Phi Kiếm hoàng kim (`flying-sword-bolt`). |
| **12 Ô Trang Bị & Set Bonus** | Đầu, áo, quần, giày, đai, vũ khí, phù lục, dây chuyền, 2 nhẫn, 2 bông tai; Set bonus kích hoạt theo số món. |
| **Hành Tẩu Sơn Thủy** | Các vùng đất chuẩn Kiếm Lai: Ly Châu Động Thiên, Thư Giản Hồ, Kiếm Khí Trường Thành... kèm tranh vẽ lập hội Thủy Mặc nhân vật và quái vật. |
| **Lưu Trữ & Migration** | **Save v11**. Chuỗi di chuyển dữ liệu tự động từ v1 đến v11 an toàn 100%, bảo toàn tiến trình người chơi. |

---

## 2. Lệnh Chạy & Kiểm Thử

```bash
pnpm install
pnpm dev            # http://localhost:5173
pnpm test           # 176 tests Vitest (Engine, Combat, Migration v1-v11, Balance Sim, Gear Paper Doll)
pnpm lint           # ESLint 0 errors / 0 warnings
pnpm build          # tsc + vite + PWA build ra dist/
pnpm sim 24 1       # Mô phỏng bot 24h active (seed 1)
pnpm sim 24 1 passive # Mô phỏng bot 24h treo máy
```

---

## 3. Kiến Trúc Mã Nguồn

```text
src/
 ├── content/       # Dữ liệu tĩnh: realms, martialRealms, classes, gear, gearSets, items, recipes, regions...
 ├── engine/        # Pure TS Simulation (combat, cultivation, journey, save/migrate, tick...)
 ├── store/         # Zustand state & 10Hz fixed-step accumulator game loop
 ├── ui/            # React 19 UI: atoms, molecules, organisms, screens, silhouettes
 ├── lib/           # Formatter, math, idempotent asset resolver
 └── styles/        # CSS Token Thủy Mặc, animations GPU-accelerated
tests/              # 32 file test suites (161 tests pass 100%)
docs/               # Tài liệu GDD, kiến trúc, kế hoạch
```

---

## 4. Quyết Định Thiết Kế Cốt Lõi (Architecture Decisions)

1. **Zero Allocation trên Hot-Path**:
   - Vòng lặp combat loop và fixed-step accumulator (100ms) sử dụng các phép toán số học thuần túy (`pure functions`), không khởi tạo object rác liên tục trên Heap.
2. **Deterministic Simulation**:
   - Mọi trận đấu, sát thương, bạo kích đều chạy qua Seeded PRNG (`rng()`), đảm bảo kết quả offline progress đồng nhất tuyệt đối với khi cắm máy online.
3. **Màn Hình Tĩnh Lặng (Zero Screen-Shake)**:
   - Đòn đánh của Võ phu tạo hiệu ứng sóng xung kích quyền kình (`punch-impact-ring`) bộc phát trực tiếp trên thân thể quái vật, tuyệt đối không rung lắc giật màn hình viewport để bảo vệ mắt người chơi khi cắm máy lâu.
4. **Idempotent Asset Resolver**:
   - Hàm `resolveAsset()` hỗ trợ subpath base URL của Vite (GitHub Pages `/tu-tien-ky/`) an toàn, chống triệt để lỗi nối đúp đường dẫn làm ảnh quái biến thành stickman.

---

## 5. Trạng Thái Hiện Tại & Bàn Giao

- Codebase sạch sẽ, không có console warning hoặc lint error.
- Đã merge và push đầy đủ lên nhánh `main` trên GitHub remote (`methanol-dev/tu-tien-ky`).
- GitHub Actions tự động kích hoạt CI/CD build và deploy lên GitHub Pages.
