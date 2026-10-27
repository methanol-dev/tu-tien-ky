# Tu Tiên Ký

Game idle tu tiên + sự kiện RPG chơi trên web. Single-player, offline, lưu trong trình duyệt.

## Chạy dự án

```bash
pnpm install
pnpm dev        # dev server
pnpm test       # unit test (Vitest)
pnpm lint       # ESLint
pnpm build      # type-check + build ra dist/
```

## Cấu trúc

- `src/engine/` — lõi game (TypeScript thuần, **không** import React/Zustand).
- `src/content/` — dữ liệu game: cảnh giới, công pháp, sự kiện, vật phẩm.
- `src/store/` — Zustand store + game loop.
- `src/ui/` — React components (atomic design).
- `src/styles/` — design tokens thủy mặc (Tailwind 4 `@theme`).
- `tests/` — Vitest.
- `docs/` — kế hoạch, GDD, walkthrough.

Kế hoạch chi tiết: [docs/PLAN-tu-tien-idle-rpg.md](docs/PLAN-tu-tien-idle-rpg.md).
