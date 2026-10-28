# Walkthrough — Tu Tiên Ký

> Bản ghi bàn giao sau Phase 0–9 (2026-10-27 → 2026-10-28). Đọc kèm [PLAN-tu-tien-idle-rpg.md](PLAN-tu-tien-idle-rpg.md) (Phase 0–8) và [PLAN-hanh-tau-taskbar.md](PLAN-hanh-tau-taskbar.md) (Phase 9–11).

## 1. Game là gì

Game idle tu tiên chạy trên trình duyệt, single-player, offline, lưu trong `localStorage`. Lõi là tích linh khí → đột phá cảnh giới (40 bậc, Phàm Nhân → Phi Thăng), bọc thêm:

| Hệ thống | Mô tả ngắn |
|---|---|
| Công pháp | 7 công pháp mua bằng linh thạch, nhân tốc độ / tỉ lệ đột phá / bế quan offline... Tụ Bảo Quyết tầng 5/10 tự mở rương |
| Kinh tế | Linh thạch tích theo √(tốc độ linh khí), thưởng khi đột phá, phường thị mua dược liệu, phân giải pháp bảo |
| Luyện đan | 5 đan phương, đan lô 1 slot chạy theo đồng hồ game, roll thành/bại khi thu |
| Hái thuốc | Cooldown 60s, rơi theo tier cảnh giới |
| Sự kiện | 32 sự kiện có lựa chọn, kết quả xác suất, cờ nhân quả nối chuỗi |
| **Hành tẩu** (P9) | Tu sĩ bóng mực đi ngang sơn thủy, tự đánh yêu thú theo nhịp, 6 vùng × 10 ải × 4 độ khó, boss ở ải 10. Chạy liên tục song song với tu luyện, cả khi offline |
| **Pháp bảo** (P9) | Rương thường/đỏ mở ra gear 3 slot (Kiếm / Giáp / Pháp khí), 5 độ hiếm (Phàm → Thần), 1–5 affix ngẫu nhiên; 6 pháp bảo định danh rơi từ boss |
| Thiên kiếp | Từ Kim Đan: 3–9 đạo lôi, chọn ngạnh kháng / né / dùng đan |
| Luân hồi | Chuyển thế lấy Đạo Vận, 6 nâng cấp vĩnh viễn; Tàng Bảo Các giữ pháp bảo **đang mặc** |

## 2. Chạy & kiểm thử

```bash
pnpm install
pnpm dev            # http://localhost:5173
pnpm test           # 122 test (engine + store + jsdom smoke)
pnpm lint
pnpm build          # tsc + vite + PWA (dist/)
pnpm sim 24 1       # mô phỏng 24h chơi active, seed 1
pnpm sim 24 2 passive
```

## 3. Kiến trúc

```
src/engine/    lõi thuần TS, không import React (ESLint chặn). Mọi hàm nhận state trả state mới.
src/content/   dữ liệu: realms, techniques, items, recipes, regions, gear, affixes, legacy, events/*
src/store/     Zustand store + game loop (rAF, đo bằng timestamp, publish 10Hz)
src/ui/        atoms / molecules / organisms / screens / silhouettes (SVG bóng mực)
src/lib/       format số, mô tả hiệu ứng, màu độ hiếm
tests/         Vitest (+ fixtures/save-v5.json cho migration)
scripts/       sim.ts (balance), gen-icons.ts (PWA icons)
```

Nguyên tắc đã giữ xuyên suốt:

- **Thời gian = `playedMs`** trong state, không đếm frame. Cooldown, đan lô, buff, lịch sự kiện và hành tẩu đều so với `playedMs` nên offline progress (1 lần `tick` + 1 lần `journeyTick` lớn) tự đẩy mọi thứ tiến tới.
- **Hành tẩu chạy bước cố định 500ms** (`journeyTick` tích lũy dt rồi chạy N bước, mỗi bước có mốc thời gian riêng). Tick 100ms hay catch-up 8 giờ cho cùng lịch sử với cùng seed; 8 giờ = 57.600 bước, dưới 1 giây. UI không có logic game: chỉ đọc `journey.phase` và `journey.events` (ring buffer 24 sự kiện gần nhất) để chọn animation CSS.
- **RNG inject** (`rng: () => number`) vào mọi hàm có ngẫu nhiên → test deterministic, simulator chạy được.
- **Save có version** (hiện v6). Mỗi lần đổi `GameState` → bump `SAVE_VERSION`, thêm migration, cập nhật zod schema. Import save là input không tin cậy, luôn qua zod. Migration 5→6 đổi pháp bảo trong túi thành gear định danh đã mặc, bỏ `expedition`, thêm `journey`/`gear`/`equipped`; test bằng fixture save v5 thật.

## 4. Hành tẩu: quyết định thiết kế cần biết

- **Thay hẳn Bí cảnh.** 6 bí cảnh cũ thành 6 vùng, giữ tên, quái, loot, boss.
- **Chết không mất linh khí.** Gục thì lui về dưỡng thương 45s (nhân dần tới ×5 khi chết liên tiếp), ải giữ nguyên. Lý do: hành tẩu chạy khi AFK/offline, phạt linh khí mỗi lần chết sẽ xóa sạch tiến độ sau 8 giờ treo.
- **Tự lượng sức** (bật mặc định): quét sạch vùng không chết → tiến lên lựa chọn khó hơn gần nhất (vùng kế ở độ khó thấp nhất chưa quét, hoặc độ khó kế của vùng này); gục 3 lần liên tiếp → lùi một bậc.
- **Thưởng không cho linh khí trực tiếp**, chỉ linh thạch theo giây thu nhập (3s/mạng, 30s/boss), dược liệu theo loot table (tỉ lệ ×0.06 mỗi ải, boss ×1), và rương. Nhờ vậy guardrail cảnh giới không đổi.
- **Gear** là % nhân lên baseline theo cảnh giới, bậc (tier = bậc vùng + độ khó, 1–9) chỉ nới dải số ×1 → ×2.2, nên đồ Thần ở vùng 1 vẫn còn giá trị về sau.
- **Túi pháp bảo 60 món**, rương 999. Đầy túi thì không mở được rương, phải phân giải.

## 5. Cân bằng

Simulator `src/engine/sim.ts` là bot tham lam: tap 1/s trong 10 phút đầu, mua công pháp, hái thuốc, luyện đan, dùng đan, tự chọn sự kiện, độ kiếp bằng đan nếu có, mở mọi rương, mặc món điểm cao nhất mỗi slot, phân giải khi túi quá 40.

| Mốc (active, seed 1) | Trước P9 | Sau P9 |
|---|---|---|
| Trúc Cơ | 22 phút | ~20 phút |
| Kim Đan | 3.8 giờ | ~4 giờ |
| Nguyên Anh | 10.8 giờ | 18.1 giờ (seed 2/3: 11.6h / 12.4h so với 15.4h / 13.0h cũ → biến thiên seed, không lệch hệ thống) |
| Linh thạch tích lũy 24h | 8.95M | 8.56M |
| Linh thạch 24h passive | 3.87M | 4.76M (×1.23, dưới trần ×1.5) |

Dải này bị khóa bởi `tests/sim.test.ts`. Muốn chỉnh cảm giác chơi: sửa `src/content/realms.ts`, `src/engine/constants.ts` (nhóm JOURNEY_*, KILL/BOSS_STONE_SECONDS, HERB_STAGE_CHANCE_SCALE), chạy `pnpm sim`, rồi cập nhật dải trong test có chủ đích.

## 6. Bảo mật & chất lượng

- `pnpm audit` (prod + dev): không lỗ hổng đã biết tại thời điểm bàn giao P8; P9 không thêm dependency.
- Không dùng `dangerouslySetInnerHTML`, `eval`, `innerHTML`. Không gọi URL ngoài (font self-host).
- Save import: JSON hoặc base64 → migrate → zod `safeParse` → kiểm tra `realmIndex` trong bảng.

## 7. Deploy

`.github/workflows/ci.yml`: lint + test + build trên mọi push/PR; push lên `main` thì deploy GitHub Pages. `BASE_PATH` tự lấy từ tên repo. Cần bật Pages → Source: GitHub Actions trong Settings của repo. **Chưa push lần nào**, chờ lệnh.

## 8. Chưa làm / hạn chế biết trước

- **Chưa kiểm tra bằng mắt trên trình duyệt thật**, kể cả toàn bộ sân khấu Hành tẩu (silhouette, parallax, số sát thương). Pass jsdom smoke và build, nhưng hình dáng bóng mực, nhịp animation, layout mobile cần mày mở `pnpm dev` lên nhìn và chửi.
- Dải nổi (P10) chưa làm. Trang spike tự kiểm tra Document Picture-in-Picture ở `public/pip-spike.html` (mở `http://localhost:5173/pip-spike.html` khi `pnpm dev`).
- Party đồng hành, Luyện Khí Lô, cốt truyện Kiếm Lai: P11.
- Âm thanh: hoãn, cần asset.
- Nav 7 tab trên mobile vừa khít 360px.
