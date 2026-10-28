# PLAN: Hành Tẩu — dải nổi kiểu Task Bar Hero, phong cách tu tiên, 100% web

> **Trạng thái**: 📝 Lập 2026-10-28, sửa cùng ngày: **bỏ Tauri, toàn bộ chạy trên web**. Chờ chốt mục 9.
> **Tham chiếu**: *TBH: Task Bar Hero* (Nugem Studio, Steam, 2026): party 3 hero pixel tự đánh side-scroll trong cửa sổ nhỏ đè lên taskbar Windows; quái rớt rương → gear + nguyên liệu → Cube/rune tree → mạnh hơn → qua stage nhanh hơn; 3 act × 4 độ khó ≈ 120 stage; người chơi chỉ thao tác giữa các trận.
> **Đã chốt với mày**: (1) **Hybrid**: giữ game idle hiện tại, thêm lớp auto-battle real-time; (2) **chỉ web**, không shell desktop; dải nổi dùng **Document Picture-in-Picture** (Chrome/Edge), fallback cửa sổ popup; (3) hình ảnh **thủy mặc silhouette SVG/CSS**, không pixel art; (4) **gộp cốt truyện Kiếm Lai**: vùng = hồi, party = Trần Bình An + đồng hành. Plan [PLAN-cot-truyen-kiem-lai.md](PLAN-cot-truyen-kiem-lai.md) chuyển thành lớp nội dung làm ở P11.
> **Tiền đề**: Phase 0–8 xong, save v5, 106 test, sim guardrail.

---

## 1. Mục tiêu

Game hiện tại là thanh linh khí tăng dần, không có gì để **nhìn**. Mục tiêu:

1. Thêm **Hành Tẩu**: tu sĩ (bóng mực) đi ngang qua sơn thủy, gặp yêu thú tự đánh, rớt rương, mở rương ra pháp bảo có độ hiếm. Chạy **liên tục, song song** với tích linh khí. Đây là cái "nhìn được" và là nguồn dopamine loot.
2. Chế độ **dải nổi**: một cửa sổ nhỏ **always-on-top** do trình duyệt cấp (Document Picture-in-Picture), mày kéo xuống sát taskbar, rộng tùy ý, cao 56–72px; nhân vật đánh nhau trong lúc mày làm việc ở app khác. Bấm là quay về tab đầy đủ.
3. Không cài gì thêm: vẫn là PWA, GitHub Pages, một codebase. Trình duyệt không hỗ trợ PiP thì dùng popup thường hoặc chơi trong tab.
4. Không phá save (migration v6), không phá đường cong cảnh giới (sim guardrail cũ giữ nguyên).

Tiêu chí xong P9: mở tab Hành tẩu thấy tu sĩ đi, đánh, chết thì lết về, qua stage, rớt rương, mở rương ra pháp bảo rarity, mặc vào mạnh lên rõ rệt, treo 1 giờ thấy tiến bộ. Tiêu chí xong P10: bấm "Thả nổi" ra cửa sổ nhỏ luôn nổi trên các app khác trên Chrome/Edge, kéo xuống đáy màn hình, tab chính thu nhỏ mà cửa sổ vẫn đánh và vẫn lưu; đóng cửa sổ nổi thì về tab không mất tiến độ.

---

## 2. Phản biện và quyết định thiết kế

### 2.1 Hệ Bí cảnh cũ: thay, không giữ song song

Bí cảnh hiện tại là "bấm xuất phát → đợi 3–15 phút → một báo cáo combat theo lượt". Hành Tẩu làm đúng việc đó nhưng liên tục và nhìn thấy được. Giữ cả hai là hai hệ combat chồng nhau, người chơi bối rối, tao phải cân bằng hai lần.

> [!IMPORTANT]
> **Đề xuất: Hành Tẩu thay thế Bí cảnh.** 6 bí cảnh cũ thành 6 **vùng** đầu tiên của Hành Tẩu (giữ tên, quái, loot table, boss drop). Hàm `rollDamage`, `getCombatStats`, `EnemyDef`, `LootEntry` tái dùng. `simulateCombat` theo lượt giữ lại cho test/sim nhưng không còn là gameplay. Tab "Bí cảnh" đổi thành "Hành tẩu". Save: `expedition` → null, thêm `journey`.

### 2.2 Combat real-time nhưng engine vẫn pure

Engine không được biết gì về hoạt ảnh. `journeyTick(state, dtMs, rng)` chạy theo **bước cố định 500ms** (tích lũy dt, chạy N bước), mỗi bước: hero đánh / quái đánh theo tốc độ đánh, HP đổi, quái chết → rương rơi vào `journey.chests`, hết quái → `stage` tăng, hero chết → `journey.phase = 'retreat'` với `retreatUntilMs`. UI đọc `phase` + `playedMs` để chọn animation CSS, không có logic game nào trong React. Offline/AFK = gọi `journeyTick` với dt lớn (cap theo `offlineCapMs`), 8 giờ = 57.600 bước, dưới 1 giây.

Hệ quả hay: **AFK và tắt hẳn đều tiến** (TBH tắt hẳn thì gần như không tiến). Mình hào phóng hơn vì có offline progress sẵn.

### 2.3 Gear thật: instance + độ hiếm + affix

Pháp bảo hiện tại là "có/không có" (6 cái, passive cố định). Vòng lặp kiểu TBH cần **mở rương ra đồ ngẫu nhiên, so sánh, mặc, bỏ**. Thêm:

- `GearInstance { uid, defId, rarity, affixes: Affix[], level }`, lưu trong `state.gear: GearInstance[]` và `state.equipped: Record<Slot, uid | null>`.
- 4 slot: **Kiếm** (vũ khí), **Giáp** (hộ thể), **Pháp khí** (bùa/châu, bonus hỗn hợp), **Phù lục** (tiêu hao theo thời gian, P11).
- 5 độ hiếm: Phàm / Linh / Bảo / Tiên / Thần, màu theo token hiện có (paper / jade / qi / gold / vermilion).
- Affix pool: `atk%`, `hp%`, `def%`, `crit%`, `critDmg%`, `atkSpeed%`, `lifesteal%`, `qiRate%`, `stoneRate%`, `lootChance%`. Số affix = theo rarity (1–5), giá trị theo tier vùng.
- 6 pháp bảo cũ chuyển thành **gear định danh** (named, rarity Bảo+) rơi từ boss, giữ tên và cảm giác "hiếm". `TreasurePassive` cũ → migration thành 1 instance tương ứng cho ai đang sở hữu.
- Rương: **thường** (quái) và **đỏ** (boss). Mở tay lúc đầu; công pháp "Tụ Bảo Quyết" nâng cấp có tầng **tự mở rương** (đúng hook "Far North rune" của TBH).

### 2.4 Party: làm sau, thiết kế trước

Party 3 là linh hồn TBH và là chỗ gộp Kiếm Lai (Trần Bình An + Ninh Diêu + A Lương…). Nhưng party kéo theo vai trò, kỹ năng, AI chọn mục tiêu, UI 3 thanh HP. **P9 làm 1 hero**, nhưng `journey.party: Fighter[]` là mảng ngay từ đầu, combat loop duyệt mảng. P11 thêm đồng hành qua cốt truyện, không refactor.

### 2.5 Dải nổi trên web: Document Picture-in-Picture

Web **không** đè được lên taskbar và không có cửa sổ không viền. Cái gần nhất trình duyệt cho là **Document Picture-in-Picture API** (`documentPictureInPicture.requestWindow({ width, height })`, Chrome/Edge 116+): một cửa sổ nhỏ **luôn nổi trên mọi app**, mày kéo đặt đâu cũng được (sát taskbar là xong), có thể render DOM tùy ý chứ không chỉ video. Đây đúng là trải nghiệm "vừa làm việc vừa nhìn nhân vật đánh" của TBH, chỉ khác là có viền mỏng của trình duyệt và không full chiều rộng.

Cách làm, giữ **một JS context, một store**:
- Cửa sổ PiP là một `Window` con cùng origin; ta `createPortal` component `JourneyStage compact` vào `pipWindow.document.body`, copy stylesheet sang. Store Zustand vẫn ở tab chính, không sync gì cả.
- Tab chính bị ẩn thì Chrome throttle rAF/timer, nhưng game đo bằng timestamp và có offline catch-up nên **không lệch**; cửa sổ PiP visible nên animation trong đó mượt. Để tick đều khi tab ẩn: `gameLoop` thêm fallback `setInterval` 1s (Chrome vẫn cho 1 lần/giây trong 5 phút đầu, sau đó 1 lần/phút → catch-up xử lý).
- **Fallback** không có API: `window.open(url + '?mode=strip', 'tu-tien-strip', 'popup,width=720,height=72')` ra cửa sổ popup (không always-on-top, phải tự xếp cạnh). Firefox/Safari chỉ có fallback này. `?mode=strip` ở tab thường cũng render layout dải, dùng để dev và test.
- Yêu cầu user gesture để mở PiP: nút **Thả nổi** trong tab Hành tẩu và trong header.

> [!NOTE]
> Giới hạn tao chưa chắc, kiểm chứng ở P10-01: kích thước tối đa cửa sổ PiP (Chrome clamp theo màn hình), có cho ẩn thanh tiêu đề không (Chrome có `disallowReturnToOpener`, và tùy phiên bản có `preferInitialWindowPlacement`), hành vi khi tab chính bị đóng (PiP đóng theo, save đã autosave 30s + `pagehide`).

### 2.6 Hình ảnh thủy mặc

Không pixel. Mọi thứ là SVG + CSS tao tự làm:
- **Nhân vật/quái = silhouette** đen mực, viền loang nhẹ (`filter: url(#ink)` turbulence), 1 SVG mỗi loại. Hoạt ảnh bằng CSS keyframes theo `phase`: đi (bob + chân xoay), đánh (lao tới 120ms), trúng đòn (flash đỏ son + rung), chết (tan thành mực, scale + blur + opacity). Boss to gấp 1.6, viền vàng kim.
- **Nền = 3 lớp parallax** SVG núi mực nhạt / cây / sương, trôi theo vận tốc đi. Mỗi vùng đổi palette (Tuyết Sơn trắng xanh, Hỏa Diệm đỏ cam…).
- **Hiệu ứng**: tái dùng `InkSplash` khi trúng đòn, `QiMotes` khi hồi phục, số sát thương bay lên font Hán.
- Vì 56px thấp, dải chỉ hiện: hero + quái + HP bar mảnh + số dmg. Chi tiết (gear, rương) ở layout full.

---

## 3. Vòng lặp Hành Tẩu

```
Đi ──gặp quái──▶ Đánh (auto, theo nhịp) ──thắng──▶ Rương rơi ──▶ đi tiếp, stage +1
 ▲                     │                                   │
 │                   thua ──▶ Lết về (retreat 30–120s, mất chút linh khí) ──▶ hồi lại, stage giữ nguyên
 │                                                         ▼
 └── Mở rương (tay / tự động) ──▶ Gear rarity ──▶ Mặc / Bỏ(→ linh thạch) ──▶ mạnh hơn ──▶ qua stage nhanh hơn
```

**Vùng & stage**: mỗi vùng có `stages: 10`, quái lấy từ pool vùng, **stage 10 = boss** (rương đỏ, cơ hội gear định danh). Qua boss → mở vùng kế (nếu đủ cảnh giới) **hoặc** độ khó kế của vùng này (Thường / Hiểm / Tử / Tuyệt, nhân stats quái ×1 / ×3 / ×9 / ×27, loot tier +1 mỗi bậc). Người chơi chọn vùng và độ khó bất kỳ đã mở; **mặc định tự đẩy lên** khi thắng liên tục 10 stage không chết, tự lùi khi chết 3 lần liên tiếp (có tắt được).

**Sức mạnh hero** = `getCombatStats` hiện tại (theo cảnh giới) × gear × công pháp. Cảnh giới vẫn là trục chính (giữ đúng tinh thần idle hiện tại), gear là trục phụ nhưng cảm nhận được (+30–150%).

**Phần thưởng** chảy về hệ cũ: linh thạch (theo giây thu nhập như sự kiện, không tuyệt đối), dược liệu (loot table cũ), đan dược hiếm. Bán gear thừa ra linh thạch theo rarity. **Không cho linh khí trực tiếp** để không đụng guardrail cảnh giới.

---

## 4. Kiến trúc

### 4.1 State mới (save v5 → v6)

```ts
type Slot = 'kiem' | 'giap' | 'phap-khi' | 'phu-luc'
type Rarity = 'pham' | 'linh' | 'bao' | 'tien' | 'than'
interface Affix { key: AffixKey; value: number }
interface GearInstance { uid: string; defId: string; rarity: Rarity; affixes: Affix[]; tier: number }

interface Fighter {                 // hero hoặc đồng hành
  id: string                        // 'player' | npcId
  hp: number; maxHp: number
  nextAttackAtMs: number
}
interface Enemy { defId: string; name: string; hp: number; maxHp: number; atk: number; def: number; boss: boolean; nextAttackAtMs: number }

interface JourneyState {
  regionId: string
  difficulty: 0 | 1 | 2 | 3
  stage: number                     // 1..10
  phase: 'walk' | 'fight' | 'retreat'
  phaseUntilMs: number              // walk: tới lúc gặp quái; retreat: tới lúc hồi
  party: Fighter[]
  enemies: Enemy[]
  chests: { normal: number; red: number }
  autoAdvance: boolean
  unlocked: Record<string, number>  // regionId → độ khó cao nhất đã mở
  streak: number; deaths: number
  lastEvents: JourneyEvent[]        // 20 sự kiện gần nhất để UI render số dmg / log: { atMs, kind, amount?, who }
}
// GameState: journey: JourneyState; gear: GearInstance[]; equipped: Record<Slot, string | null>
// bỏ: expedition (migration → null, không lưu nữa)
// stats thêm: enemiesSlain, bossesSlain, chestsOpened, gearFound
```

### 4.2 Content

```
src/content/
├── regions.ts        6 vùng từ dungeons.ts (đổi tên file), thêm enemyPool, bossDef, palette, stages=10
├── gear.ts           GearDef (slot, tên gốc theo tier, glyph), 6 pháp bảo cũ thành named gear
├── affixes.ts        pool affix, dải giá trị theo tier, số affix theo rarity, bảng tỉ lệ rarity theo loại rương & độ khó
└── silhouettes/      SVG nhân vật & quái (hero, lang, xa, buc, kho-lau, ma-tu, bang-lang, hoa-lan, ma-binh, boss variants)
```

### 4.3 Engine `src/engine/journey.ts`, `gear.ts`

- `journeyTick(state, dtMs, rng)`: tích lũy dt vào `journey.accMs`, chạy bước 500ms. Pure, deterministic.
- `startRegion(state, regionId, difficulty)`, `setAutoAdvance`, `openChest(state, kind, rng)`, `equip(state, uid)`, `unequip`, `salvage(state, uids)`.
- `rollGear(tier, rarityTable, rng)`, `getGearStats(state)` gộp vào `getCombatStats` và `getModifiers` (affix `qiRate%`, `stoneRate%`, `lootChance%`).
- `offline.ts`: sau `tick()` gọi `journeyTick` với cùng dt đã cap.
- `sim.ts`: bot mở rương, mặc gear tốt hơn (so tổng stat), bật autoAdvance. Guardrail thêm: 24h active phải qua ít nhất vùng 3 độ khó Hiểm; không được farm linh thạch nhanh hơn ×1.5 so với hiện tại (chống lạm phát).
- `validateRegions()`, `validateGear()` cho test content.

### 4.4 UI

- Tab **Hành tẩu** (thay Bí cảnh, glyph 行): trên là **sân khấu** (`JourneyStage`, cao 160px, chính là component dải dùng chung), dưới là: chọn vùng/độ khó, toggle tự đẩy, nút **Mở rương** (badge số lượng), danh sách gear nhặt được gần đây.
- **Túi đồ** thêm mục **Pháp bảo**: 4 slot đang mặc + kho gear, so sánh stat khi hover/tap, bán hàng loạt theo rarity.
- `ChestModal`: mở từng rương có animation mực loang theo màu rarity; "Mở tất cả" khi nhiều.
- `JourneyStage` nhận prop `compact` để render layout dải 56px: parallax, silhouettes, HP mảnh, số dmg; góc phải: cảnh giới + % linh khí + stage + nút rương + nút mở rộng.
- **Strip layout** (P10): `App` đọc `mode` (`'full' | 'strip'`) từ URL `?mode=strip` hoặc từ việc đang render trong PiP; strip chỉ render `JourneyStage compact` + 3 nút (rương / về tab / đóng).

### 4.5 Dải nổi web (P10)

```
src/platform/
├── pip.ts            isPipSupported(), openStrip(), closeStrip(); copy <link>/<style> sang pipWindow.document; lắng nghe 'pagehide' của PiP
└── StripPortal.tsx   createPortal(<StripLayout/>, pipWindow.document.body); giữ store của tab chính
```
- Nút **Thả nổi** → `openStrip()`: có API thì PiP `{ width: 720, height: 64 }`; không thì `window.open` popup `?mode=strip` (popup là context riêng → store riêng; để nó tự hydrate từ localStorage và **chỉ đọc**, tick bằng catch-up khi focus; ghi save vẫn là tab chính). Cách popup kém hơn hẳn, ghi rõ trong UI "Dùng Chrome/Edge để có cửa sổ luôn nổi".
- Nhớ kích thước/vị trí lần trước qua `localStorage` (PiP chỉ cho set size; vị trí Chrome tự nhớ theo origin).
- `gameLoop`: thêm `setInterval` 1s khi `document.hidden` để tick đều khi có PiP; vẫn đo bằng timestamp.
- Khi PiP đóng (user bấm X hoặc tab đóng): gỡ portal, `save()`, về `mode = 'full'`.
- Font CJK trong PiP: `document.fonts` của cửa sổ con tải lại từ cache → ok; kiểm tra FOUT.
- Không có job CI mới, Pages y nguyên.

---

## 5. Lộ trình & Task

### Phase 9 — Hành Tẩu lõi (web) `[P9]`
- `P9-01` Types + `SAVE_VERSION = 6` + migration (expedition → bỏ, `journey` mặc định vùng 1 Thường, treasures cũ → named gear instance đã mặc) + zod + test với fixture save v5.
- `P9-02` Content: `regions.ts` từ dungeons, `gear.ts`, `affixes.ts`; validator + test.
- `P9-03` `engine/gear.ts`: roll, equip, salvage, `getGearStats`; nối vào `getCombatStats`/`getModifiers`. Test phân phối rarity, affix trong dải, equip đổi stat.
- `P9-04` `engine/journey.ts`: `journeyTick` bước 500ms, walk/fight/retreat, stage/boss, rương, auto-advance, unlock. Test deterministic với seeded RNG: hero yếu chết → retreat, hero mạnh qua 10 stage, offline 8h không nổ thời gian.
- `P9-05` Offline + sim: `offline.ts` gọi journey; bot sim mở rương/mặc gear; guardrail mới; chạy `pnpm sim` xác nhận dải cảnh giới cũ không đổi.
- `P9-06` Store + loop: `journeyTick` trong `tick()`; actions `startRegion`, `setAutoAdvance`, `openChest(s)`, `equip`, `unequip`, `salvage`; bỏ expedition actions; `gameLoop` thêm fallback interval khi hidden.
- `P9-07` UI: `JourneyStage` (SVG parallax + silhouettes + CSS animation, prop `compact`), tab Hành tẩu, `ChestModal`, mục Pháp bảo trong Túi đồ. 10 silhouette SVG. jsdom smoke.
- `P9-08` Xóa `ExpeditionScreen`/`ExpeditionReportModal`/`expedition.ts` (giữ `combat.ts`), cập nhật docs, walkthrough, README. Commit theo task.
- **Verify**: `pnpm test` ≥ 130 xanh, lint, build; sim guardrail; tay: treo 30 phút ở Luyện Khí thấy qua vùng 1 Thường, có 5+ gear, mặc vào thấy dmg tăng.

### Phase 10 — Dải nổi trên web `[P10]`
- `P10-01` Spike 1 buổi: `documentPictureInPicture.requestWindow` trên Chrome/Edge máy mày, đo giới hạn kích thước, thanh tiêu đề, hành vi khi tab ẩn/đóng. Ghi kết quả vào plan này, chỉnh 2.5 nếu sai.
- `P10-02` `StripLayout` (`JourneyStage compact` + 3 nút) render được qua `?mode=strip` trong tab thường; jsdom smoke.
- `P10-03` `src/platform/pip.ts` + `StripPortal.tsx`: mở/đóng PiP, copy style, portal, cleanup, save khi đóng. Nút **Thả nổi** ở tab Hành tẩu và header. Nhớ kích thước.
- `P10-04` Fallback popup `window.open` cho trình duyệt không có API, chế độ chỉ đọc; thông báo khuyên dùng Chrome/Edge.
- `P10-05` `gameLoop` fallback `setInterval` khi `document.hidden`; test store: tab ẩn 10 phút rồi hiện lại không lệch tiến độ.
- `P10-06` Cài đặt: chiều cao dải (56/64/72), hiện/ẩn số dmg, giảm hoạt ảnh (`prefers-reduced-motion`). Docs + walkthrough.
- **Verify**: Chrome/Edge: Thả nổi → kéo xuống sát taskbar → Alt-Tab sang app khác vẫn thấy đánh; thu nhỏ tab chính 10 phút, tiến độ đúng; đóng PiP về tab không mất gì; Firefox ra popup, không crash.

### Phase 11 — Party, Luyện Khí Lô, cốt truyện Kiếm Lai `[P11]`
- `P11-01` Đồng hành: `Fighter` thêm `role` (tiên phong / chủ công / hộ pháp) + 1 kỹ năng theo cooldown (đánh diện rộng / hồi máu / khiên). Slot party mở bằng cốt truyện. UI 3 silhouette.
- `P11-02` **Luyện Khí Lô** (Cube): phân giải gear → linh tài; ghép 3 cùng rarity → 1 bậc trên; đổi 1 affix. Tab trong Luyện đan.
- `P11-03` Gộp cốt truyện: vùng = hồi theo [PLAN-cot-truyen-kiem-lai.md](PLAN-cot-truyen-kiem-lai.md) mục 3 (vùng 1 = Ly Châu Động Thiên, …), cảnh truyện bật ở boss stage, đồng hành gia nhập theo hồi (Ninh Diêu, A Lương, Lý Bảo Bình…). Dùng engine `story.ts` rút gọn từ plan cũ (hồi/cảnh/lựa chọn/hảo cảm), bỏ hệ mục tiêu nếu thừa.
- `P11-04` Phù lục (slot tiêu hao), gear định danh theo nhân vật Kiếm Lai.
- **Verify**: sim 24h party 3 vẫn trong guardrail; đọc hết hồi 0–2 qua boss stage.

### Backlog (sau P11, nếu còn hứng)
- Kinh mạch (rune tree) thay cho cây công pháp phẳng.
- Shell desktop (Tauri) để đè taskbar thật sự, nếu web PiP vẫn chưa đã. Đã bàn và gác lại 2026-10-28.
- Âm thanh (vẫn chờ asset).

---

## 6. Kế hoạch kiểm thử

| Loại | Nội dung |
|---|---|
| Engine | `journeyTick` deterministic; bước 500ms không trôi khi dt lẻ; retreat/auto-advance; roll gear theo bảng; equip/salvage; migration v5→v6 fixture thật |
| Content | validator vùng/gear/affix; mọi vùng có boss; không gear nào thiếu slot |
| Sim | guardrail cảnh giới cũ **không đổi**; thêm mốc Hành tẩu; linh thạch không lạm phát quá ×1.5 |
| UI smoke | tab Hành tẩu render stage; mở rương; equip; `?mode=strip` không vỡ ở 56px |
| Trình duyệt (tay) | PiP trên Chrome và Edge, DPI 125%/150%, 2 màn hình; tab ẩn 10 phút; đóng PiP; Firefox fallback popup |

---

## 7. Rủi ro

> [!IMPORTANT]
> **Dải nổi web không bằng TBH thật.** Không đè taskbar, có viền trình duyệt, chỉ Chrome/Edge có always-on-top, kích thước bị trình duyệt giới hạn. Đây là giới hạn nền tảng, không phải lỗi code. Nếu sau P10 mày thấy chưa đã thì mới quay lại Tauri (backlog), lúc đó toàn bộ P9–P10 vẫn dùng lại được.

> [!WARNING]
> **Loot lạm phát linh thạch.** Hành tẩu chạy liên tục, bán gear ra linh thạch → mua công pháp → nhanh hơn → vỡ guardrail. Mọi thưởng theo giây thu nhập, giá bán gear thấp, sim phải pass trước khi merge.

> [!WARNING]
> **Dải 56px rất ít chỗ.** Phải chấp nhận dải chỉ "nhìn", mọi quyết định ở layout full. Nếu nhìn vẫn rối, tăng lên 72px hoặc chỉ hiện hero + 1 quái.

> [!NOTE]
> Chrome throttle tab ẩn: timer 1 lần/giây trong 5 phút đầu, sau đó 1 lần/phút. Engine đo bằng timestamp + catch-up nên tiến độ không lệch, nhưng **hoạt ảnh trong PiP chỉ mượt nếu rAF của tab chính còn chạy**; nếu không, dùng `pipWindow.requestAnimationFrame` cho animation và chỉ tick engine 1Hz. Kiểm chứng ở P10-01.

---

## 8. Việc với plan cũ

- [PLAN-tu-tien-idle-rpg.md](PLAN-tu-tien-idle-rpg.md): Phase 0–8 giữ nguyên là lịch sử; Bí cảnh (P5) được thay bằng Hành tẩu ở P9 plan này.
- [PLAN-cot-truyen-kiem-lai.md](PLAN-cot-truyen-kiem-lai.md): không làm riêng nữa; mục 2 (quyết định), mục 3 (khung hồi), mục 7 (template mày viết) giữ nguyên giá trị, triển khai ở P11-03 với engine rút gọn. Mục 8 của plan đó (5 câu hỏi) vẫn cần mày trả lời trước P11.

---

## 9. Cần mày chốt trước khi code

1. **Hành Tẩu thay thế hẳn Bí cảnh** (6 bí cảnh thành 6 vùng), không giữ song song. Tao đề xuất **thay**.
2. Dải nổi là **cửa sổ Picture-in-Picture của Chrome/Edge**, có viền mỏng, không đè taskbar, mày tự kéo xuống đáy. Chấp nhận giới hạn này chứ? (Không thì chỉ còn đường Tauri.)
3. **P9 trước (1 hero), P10 dải nổi, P11 party + truyện.** Hay mày muốn tao làm spike PiP (P10-01) ngay đầu để chắc ăn nền tảng rồi mới cày P9? Tao đề xuất **spike trước**, mất một buổi, tránh làm xong P9 mới biết PiP không như mong.
