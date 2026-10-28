# Tu Tiên Ký 修仙記

Game idle tu tiên + sự kiện RPG chơi trên web. Single-player, offline (PWA), lưu trong trình duyệt, không cần đăng nhập.

Tích linh khí → đột phá 40 cảnh giới (Phàm Nhân → Phi Thăng) → công pháp, luyện đan, sự kiện có lựa chọn, thiên kiếp, luân hồi chuyển thế. Song song là **Hành tẩu**: tu sĩ bóng mực tự đánh yêu thú qua 6 vùng, rớt rương, mở ra pháp bảo có độ hiếm và affix (kiểu Task Bar Hero, phong cách thủy mặc).

## Chạy dự án

```bash
pnpm install
pnpm dev            # dev server
pnpm test           # Vitest (engine, store, jsdom smoke, fixture migration)
pnpm test:coverage  # coverage lõi engine
pnpm lint           # ESLint
pnpm build          # type-check + build + PWA ra dist/
pnpm sim 24 1       # mô phỏng 24h chơi active (seed 1); thêm "passive" để treo máy
```

## Cấu trúc

- `src/engine/` — lõi game (TypeScript thuần, **không** import React/Zustand; ESLint chặn). Pure functions `state → state`, RNG inject được.
- `src/content/` — dữ liệu: cảnh giới, công pháp, vật phẩm, đan phương, vùng hành tẩu (`regions.ts`), pháp bảo (`gear.ts`, `affixes.ts`), nâng cấp luân hồi, sự kiện (`events/*`).
- `src/store/` — Zustand store + game loop (rAF đo bằng timestamp, publish 10Hz).
- `src/ui/` — React components (atoms → screens), phong cách thủy mặc bằng Tailwind 4 tokens; `silhouettes/` là SVG bóng mực cho sân khấu hành tẩu.
- `src/lib/` — format số, mô tả hiệu ứng.
- `tests/` — Vitest, gồm guardrail cân bằng (`sim.test.ts`).
- `scripts/` — `sim.ts` (balance CLI), `gen-icons.ts` (icon PWA không cần thư viện ảnh).
- `docs/` — [kế hoạch gốc](docs/PLAN-tu-tien-idle-rpg.md), [kế hoạch Hành tẩu / dải nổi / cốt truyện](docs/PLAN-hanh-tau-taskbar.md), [walkthrough bàn giao](docs/walkthrough.md).

## Quy ước

- Mỗi thay đổi `GameState` phải bump `SAVE_VERSION` + migration + zod schema. Save người chơi không được mất.
- Số liệu cân bằng gom ở `src/engine/constants.ts` (kể cả nhóm `JOURNEY_*`) và `src/content/realms.ts`. Sửa xong chạy `pnpm sim` rồi cập nhật dải trong `tests/sim.test.ts` có chủ đích. Thưởng hành tẩu không được cho linh khí trực tiếp.
- Code và comment tiếng Anh, tài liệu tiếng Việt.
