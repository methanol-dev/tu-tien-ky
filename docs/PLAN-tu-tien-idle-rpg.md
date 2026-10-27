# PLAN: Tu Tiên Ký — Game Idle Tu Tiên + Sự kiện RPG trên Web

> **Trạng thái**: 🟢 Đã duyệt 2026-10-27 — React/DOM first, Phaser đẩy xuống Phase 7 (optional). Tên tạm "Tu Tiên Ký", 1s thực = 1 ngày game.
> **Ngày lập**: 2026-10-27
> **Scope**: Single-player, offline, lưu localStorage, deploy static (GitHub Pages / Vercel).

---

## 1. Mục tiêu

Làm 1 game tu tiên chơi trên trình duyệt, lõi là **idle/incremental** (tu luyện tự động tích linh khí, đột phá cảnh giới), bọc thêm **lớp RPG** gồm sự kiện ngẫu nhiên có lựa chọn, bí cảnh text-based, và vòng lặp prestige "chuyển thế".

Tiêu chí thành công cho MVP (hết Phase 2):
- Mở web lên là chơi được ngay, không cần đăng nhập.
- Tắt tab 8 tiếng mở lại thấy linh khí đã tích (offline progress).
- Đột phá được ít nhất 3 đại cảnh giới (Luyện Khí → Trúc Cơ → Kim Đan) với cảm giác "nghiện" rõ ràng.
- Save không bao giờ mất, export/import được JSON.

---

## 2. Quyết định kiến trúc

### 2.1 Stack

> [!WARNING]
> **Phản biện về Phaser 3**: Mày chọn Phaser + "UI thuần CSS thủy mặc". Hai cái này đá nhau.
> Game idle + sự kiện RPG là **95% UI dạng panel/list/text** (thanh linh khí, túi đồ, log sự kiện, popup lựa chọn). Phaser render lên canvas, làm layout text/list/scroll trên Phaser cực kỳ cực, không responsive, không dùng được CSS, không accessible. Dùng Phaser cho game này là lấy xe tải chở rau.
>
> **Đề xuất**: Lõi game viết bằng **TypeScript thuần, không phụ thuộc framework** (`src/engine/`). UI dùng **React + Vite + Tailwind** (DOM, CSS thủy mặc đúng ý mày). **Phaser chỉ dùng cho 1 canvas scene ở Phase 7** (view "Động phủ": hạt linh khí xoay quanh nhân vật, hiệu ứng thiên kiếp) nếu lúc đó thấy CSS/SVG không đủ "wow". Vì engine tách biệt nên sau này gắn Phaser vào hay bỏ đi không ảnh hưởng gameplay.
>
> Nếu mày vẫn muốn Phaser-first thì nói, tao làm, nhưng tao cảnh báo trước là Phase 2–4 sẽ chậm gấp 2–3 lần và UI xấu hơn.

| Lớp | Công nghệ | Lý do |
|---|---|---|
| Engine | TypeScript thuần, pure functions `tick(state, dt)` | Test được bằng Vitest, deterministic, không phụ thuộc UI |
| State | Zustand | Nhẹ, subscribe theo slice, không re-render thừa |
| UI | React 19 + Vite 7 + Tailwind 4 | Nhanh, ecosystem lớn, hợp dx-toolkit |
| Content | File `.ts` data-driven (realms, techniques, events, items) | Thêm nội dung không đụng logic |
| Lưu trữ | localStorage + schema versioning + migration | Offline hoàn toàn |
| Test | Vitest (engine) + Playwright smoke (sau) | Công thức số phải có test |
| Canvas (optional) | Phaser 3 scene cho "Động phủ" | Chỉ Phase 7 |
| Deploy | GitHub Pages hoặc Vercel static | Miễn phí |

### 2.2 Cấu trúc thư mục

```
tu-tien/
├── docs/                    # Plan, GDD, walkthrough
├── src/
│   ├── engine/              # Lõi game, KHÔNG import React
│   │   ├── state.ts         # GameState type + createInitialState()
│   │   ├── tick.ts          # tick(state, dtMs) → state
│   │   ├── cultivation.ts   # công thức linh khí, đột phá
│   │   ├── realms.ts        # bảng cảnh giới
│   │   ├── events/          # event engine + điều kiện + hiệu ứng
│   │   ├── expedition.ts    # bí cảnh, auto-combat
│   │   ├── alchemy.ts       # luyện đan
│   │   ├── prestige.ts      # chuyển thế
│   │   ├── offline.ts       # tính offline progress
│   │   └── save/            # serialize, migrate, export/import
│   ├── content/             # Data thuần: realms, techniques, items, events, recipes
│   ├── store/               # Zustand store, game loop (requestAnimationFrame)
│   ├── ui/                  # React components (atomic)
│   │   ├── atoms/ molecules/ organisms/ screens/
│   ├── styles/              # tokens thủy mặc, fonts
│   └── main.tsx
├── tests/                   # Vitest
└── public/
```

---

## 3. Thiết kế Game (GDD rút gọn)

### 3.1 Core loop
```
Tu luyện (tự động) → Linh khí tăng → Đủ ngưỡng → Đột phá (có tỉ lệ thất bại)
     ↑                                                  ↓
Công pháp / Đan dược / Pháp bảo  ←  Linh thạch, loot  ←  Cảnh giới mới (x tốc độ, + tuổi thọ)
     ↑
Sự kiện ngẫu nhiên (kỳ ngộ / tâm ma / cướp bóc) + Bí cảnh
```

### 3.2 Cảnh giới (realms)
Phàm Nhân → Luyện Khí (9 tầng) → Trúc Cơ (Sơ/Trung/Hậu/Viên Mãn) → Kim Đan → Nguyên Anh → Hóa Thần → Luyện Hư → Hợp Thể → Đại Thừa → Độ Kiếp → Phi Thăng (end-game / prestige lớn).

Mỗi cảnh giới: `qiRequired`, `qiRateMultiplier`, `lifespanBonus`, `breakthroughBaseChance`, `tribulation?` (thiên kiếp ở đại cảnh giới).

### 3.3 Công thức lõi (sẽ tinh chỉnh ở Phase 6)
- `qiPerSec = base × realmMult × techniqueMult × spiritRootMult × (1 + buffs)`
- `breakthroughChance = baseChance + đan dược + công pháp − tâm ma`, thất bại → mất 10–30% linh khí, có thể bị thương (debuff tạm).
- **Tuổi thọ**: 1 giây thực = 1 ngày game (tùy chỉnh). Hết thọ → **Chuyển thế** (prestige): giữ lại "Đạo Vận" (điểm prestige) mua bonus vĩnh viễn.

### 3.4 Hệ thống theo phase
| Hệ thống | Phase | Mô tả |
|---|---|---|
| Tu luyện + Đột phá | 1 | Lõi idle |
| Save/Load/Offline | 1 | Bắt buộc có từ đầu |
| Công pháp | 3 | Mua/nâng cấp, nhân tốc độ |
| Linh thạch + Túi đồ | 3 | Tiền tệ, item |
| Luyện đan | 3 | Recipe + timer, đan tăng tỉ lệ đột phá |
| Sự kiện RPG | 4 | Engine điều kiện + trọng số + lựa chọn; 30+ sự kiện ban đầu |
| Bí cảnh | 5 | Thám hiểm text-based, auto-combat log, loot, rủi ro |
| Thiên kiếp + Chuyển thế | 6 | Prestige loop |
| Tông môn | 7+ | Gia nhập, nhiệm vụ, cống hiến (nếu còn hứng) |

---

## 4. Lộ trình & Task

### Phase 0 — Scaffold `[P0]` ✅ (2026-10-27)
- `P0-01` Vite + React + TS, Tailwind 4, ESLint + Prettier, Vitest.
- `P0-02` Cấu trúc thư mục như mục 2.2, README tiếng Việt.
- `P0-03` Design tokens thủy mặc: palette (mực đen, giấy dó, đỏ son, vàng kim), font serif Hán tự (Noto Serif TC/SC + fallback), spacing 4/8px.
- **Verify**: `pnpm dev` chạy, `pnpm test` pass (1 test dummy), `pnpm build` ra `dist/`.

### Phase 1 — Engine lõi `[P1]` ✅ (2026-10-27, 31 test, coverage 89%)
- `P1-01` `GameState` + `createInitialState()`.
- `P1-02` `tick()` thuần, linh khí tích theo dt, tuổi tăng.
- `P1-03` Bảng realms + `canBreakthrough()` + `attemptBreakthrough(rng)` (inject RNG để test).
- `P1-04` Save: serialize, version, migrate, autosave 30s, export/import JSON.
- `P1-05` Offline progress: tính dt khi load, cap 8h (nâng cấp sau).
- **Verify**: Vitest ≥ 15 test cho công thức, đột phá, offline cap, migration. Coverage engine ≥ 80%.

### Phase 2 — UI MVP `[P2]` ✅ (2026-10-28, tag v0.1.0)
- `P2-01` Zustand store + game loop rAF, pause khi tab ẩn (dùng timestamp, không dùng interval count).
- `P2-02` Màn chính: tên cảnh giới, thanh linh khí, tốc độ/s, tuổi/thọ, nút **Đột phá**.
- `P2-03` Log sự kiện (nhật ký tu luyện) cuộn tự động.
- `P2-04` Màn Cài đặt: export/import save, reset. ~~tốc độ thời gian~~ (bỏ khỏi UI: chỉ làm già nhanh hơn, không có lợi cho người chơi; giữ `settings.timeScale` trong state cho hệ thống sự kiện sau).
- `P2-05` Popup "Trong lúc bế quan..." khi quay lại sau offline.
- `P2-06` Responsive mobile-first, touch target ≥ 44px.
- **Verify**: Chơi tay 10 phút lên được Trúc Cơ; tắt tab mở lại thấy popup offline; Lighthouse ≥ 90.
- **🏁 MVP checkpoint — commit tag `v0.1.0`**

### Phase 3 — Kinh tế & Công pháp `[P3]` ✅ (2026-10-28, 69 test)
- `P3-01` Linh thạch, drop từ tu luyện/đột phá.
- `P3-02` Công pháp: 6–8 công pháp, cây nâng cấp, multiplier.
- `P3-03` Túi đồ + item type (đan dược, linh thảo, pháp bảo).
- `P3-04` Luyện đan: 5 recipe, timer, tỉ lệ thành công.
- `P3-05` (thêm) Hái thuốc (cooldown 60s, rơi theo tier cảnh giới) + Phường thị mua dược liệu, để luyện đan có nguồn nguyên liệu ngay từ đầu.
- **Verify**: Test công thức multiplier; UI tab Công pháp / Túi đồ / Luyện đan.

### Phase 4 — Sự kiện RPG `[P4]`
- `P4-01` Event engine: `conditions[]`, `weight`, `cooldown`, `choices[]` với `effects[]`.
- `P4-02` 30+ sự kiện: kỳ ngộ (nhặt bí tịch), tâm ma (mất linh khí/chọn ý chí), gặp ma tu (đánh/chạy/hối lộ), thương nhân, thiên tài địa bảo, duyên phận…
- `P4-03` Popup lựa chọn UI, pause tích linh khí khi có sự kiện chờ (tùy chỉnh được).
- **Verify**: Test weighted RNG, điều kiện realm; sự kiện không lặp spam (cooldown).

### Phase 5 — Bí cảnh `[P5]`
- `P5-01` Danh sách bí cảnh theo cảnh giới, thời gian thám hiểm.
- `P5-02` Auto-combat đơn giản (HP/ATK/DEF, log theo lượt), rủi ro trọng thương.
- `P5-03` Loot table, boss cuối bí cảnh.
- **Verify**: Test combat deterministic với seeded RNG; cân bằng không one-shot.

### Phase 6 — Thiên kiếp, Chuyển thế, Balance `[P6]`
- `P6-01` Thiên kiếp ở Kim Đan/Nguyên Anh/… — mini-event nhiều lượt.
- `P6-02` Chuyển thế: Đạo Vận, shop bonus vĩnh viễn, giữ công pháp đã ngộ.
- `P6-03` Balance pass: script mô phỏng 1 run bằng engine (headless), vẽ đường cong tiến độ, chỉnh số.
- **Verify**: Headless sim 24h game < 2s, run đầu lên Kim Đan trong ~2–3h thực.

### Phase 7 — Polish `[P7]`
- `P7-01` Hiệu ứng thủy mặc: nét mực loang khi đột phá, chữ Hán mờ nền, SVG linh khí.
- `P7-02` (Optional) Phaser scene "Động phủ" nếu CSS/SVG không đủ.
- `P7-03` PWA (manifest + service worker) để cài về máy chơi offline thật sự.
- `P7-04` Âm thanh toggle (sau).
- **Verify**: Lighthouse PWA pass; animation không drop frame trên mobile tầm trung.

### Phase 8 — Audit & Deploy `[P8]`
- `P8-01` `/audit`, `/security` (không có backend nên chủ yếu XSS từ import save, dependency scan).
- `P8-02` GitHub Actions build → Pages. **Chỉ push khi mày lệnh.**
- `P8-03` `walkthrough.md`.

---

## 5. Rủi ro

> [!IMPORTANT]
> **Balance là việc khó nhất**, không phải code. Game idle sống chết ở đường cong số. Phase 6 phải có headless simulator, không chỉnh số bằng tay bằng cảm giác.

> [!WARNING]
> **Save tương thích ngược**: Từ Phase 1 mọi thay đổi `GameState` phải kèm migration. Mất save người chơi = mất người chơi.

> [!WARNING]
> **Scope creep**: Tông môn, PvP, cloud save → đẩy hết ra sau `v1.0`. Phase 0–2 phải xong trước khi mơ xa.

> [!NOTE]
> Import save JSON là input không tin cậy → validate schema (zod) trước khi load, không `eval`, không render raw HTML.

---

## 6. Quy ước làm việc
- Mỗi task ID xong → 1 commit, message mô tả việc đã làm. Không push khi chưa có lệnh.
- Code & comment tiếng Anh, docs tiếng Việt.
- Engine không được import React. Vi phạm là reject.
- Mọi công thức số có test.

---

## 7. Cần mày chốt trước khi code
1. **Phaser**: đồng ý đẩy xuống Phase 7 optional, đi React/DOM cho UI? (tao đề xuất CÓ)
2. **Tên game**: tạm gọi "Tu Tiên Ký", đổi được bất cứ lúc nào.
3. **Tỉ lệ thời gian**: 1 giây thực = 1 ngày game, ok?
