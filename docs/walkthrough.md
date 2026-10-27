# Walkthrough — Tu Tiên Ký

> Bản ghi bàn giao sau khi hoàn thành Phase 0–8 (2026-10-27 → 2026-10-28). Đọc kèm [PLAN-tu-tien-idle-rpg.md](PLAN-tu-tien-idle-rpg.md).

## 1. Game là gì

Game idle tu tiên chạy trên trình duyệt, single-player, offline, lưu trong `localStorage`. Lõi là tích linh khí → đột phá cảnh giới (40 bậc, Phàm Nhân → Phi Thăng), bọc thêm:

| Hệ thống | Mô tả ngắn |
|---|---|
| Công pháp | 7 công pháp mua bằng linh thạch, nhân tốc độ / tỉ lệ đột phá / bế quan offline... |
| Kinh tế | Linh thạch tích theo √(tốc độ linh khí), thưởng khi đột phá, phường thị mua dược liệu |
| Luyện đan | 5 đan phương, đan lô 1 slot chạy theo đồng hồ game, roll thành/bại khi thu |
| Hái thuốc | Cooldown 60s, rơi theo tier cảnh giới |
| Sự kiện | 32 sự kiện có lựa chọn, kết quả xác suất, cờ nhân quả nối chuỗi |
| Bí cảnh | 6 bí cảnh, auto-combat theo lượt, loot, boss rơi pháp bảo |
| Thiên kiếp | Từ Kim Đan: 3–9 đạo lôi, chọn ngạnh kháng / né / dùng đan |
| Luân hồi | Chuyển thế lấy Đạo Vận, 6 nâng cấp vĩnh viễn |

## 2. Chạy & kiểm thử

```bash
pnpm install
pnpm dev            # http://localhost:5173
pnpm test           # 106 test (engine + store + jsdom smoke)
pnpm lint
pnpm build          # tsc + vite + PWA (dist/)
pnpm sim 24 1       # mô phỏng 24h chơi active, seed 1
pnpm sim 24 2 passive
```

## 3. Kiến trúc

```
src/engine/    lõi thuần TS, không import React (ESLint chặn). Mọi hàm nhận state trả state mới.
src/content/   dữ liệu: realms, techniques, items, recipes, dungeons, legacy, events/*
src/store/     Zustand store + game loop (rAF, đo bằng timestamp, publish 10Hz)
src/ui/        atoms / molecules / organisms / screens
src/lib/       format số, mô tả hiệu ứng
tests/         Vitest
scripts/       sim.ts (balance), gen-icons.ts (PWA icons)
```

Nguyên tắc đã giữ xuyên suốt:

- **Thời gian = `playedMs`** trong state, không đếm frame. Cooldown, đan lô, bí cảnh, buff, lịch sự kiện đều so với `playedMs` nên offline progress (1 lần `tick` lớn) tự đẩy mọi thứ tiến tới.
- **RNG inject** (`rng: () => number`) vào mọi hàm có ngẫu nhiên → test deterministic, simulator chạy được.
- **Save có version** (hiện v5). Mỗi lần đổi `GameState` → bump `SAVE_VERSION`, thêm migration, cập nhật zod schema. Import save là input không tin cậy, luôn qua zod.

## 4. Cân bằng (Phase 6)

Simulator `src/engine/sim.ts` là bot tham lam: tap 1/s trong 10 phút đầu, mua công pháp, hái thuốc, luyện đan, dùng đan, đi bí cảnh, tự chọn sự kiện, độ kiếp bằng đan nếu có. Kết quả hiện tại:

| Mốc | Active | Passive |
|---|---|---|
| Trúc Cơ | 22 phút | 30 phút |
| Kim Đan | 3.8 giờ | 4.7 giờ |
| Nguyên Anh | 10.8 giờ | 20 giờ |
| Hóa Thần | > 24 giờ | > 24 giờ |

Dải này bị khóa bởi `tests/sim.test.ts`. Muốn chỉnh cảm giác chơi: sửa `src/content/realms.ts` (baseReq, reqGrowth) hoặc `src/engine/constants.ts`, chạy `pnpm sim`, rồi cập nhật dải trong test có chủ đích.

## 5. Bảo mật & chất lượng

- `pnpm audit` (prod + dev): không lỗ hổng đã biết tại thời điểm bàn giao.
- Không dùng `dangerouslySetInnerHTML`, `eval`, `innerHTML`. Không gọi URL ngoài (font self-host).
- Save import: JSON hoặc base64 → migrate → zod `safeParse` → kiểm tra `realmIndex` trong bảng.
- Engine coverage ~89% (`pnpm test:coverage`).

## 6. Deploy

`.github/workflows/ci.yml`: lint + test + build trên mọi push/PR; push lên `main` thì deploy GitHub Pages. `BASE_PATH` tự lấy từ tên repo. Cần bật Pages → Source: GitHub Actions trong Settings của repo. **Chưa push lần nào**, chờ lệnh.

## 7. Chưa làm / hạn chế biết trước

- **Chưa kiểm tra bằng mắt trên trình duyệt thật** trong suốt quá trình (không có browser tool). Toàn bộ UI pass jsdom smoke và build, nhưng layout mobile, màu, animation cần mày mở lên nhìn.
- Âm thanh: hoãn, cần asset.
- Tông môn: chỉ có qua sự kiện (gia nhập Thanh Vân Môn → nhiệm vụ), chưa có màn riêng.
- Nav 7 tab trên mobile hơi chật (min 44px mỗi tab, vừa khít 360px).
- Lighthouse chưa chạy (cần Chrome). CSS ~115KB gzip do font-face CJK chunk, chấp nhận được cho PWA cache một lần.
