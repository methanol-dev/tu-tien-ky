# PLAN: Cốt truyện Kiếm Lai — Phase 9 → 11

> **Trạng thái**: 📝 Đang lập, chờ chốt mục 8.
> **Ngày lập**: 2026-10-28
> **Tiền đề**: Phase 0–8 xong (xem [PLAN-tu-tien-idle-rpg.md](PLAN-tu-tien-idle-rpg.md), [walkthrough.md](walkthrough.md)). Engine 106 test, save v5, sim guardrail khóa đường cong.
> **Scope**: Thêm **lớp cốt truyện tuyến tính theo hồi** lấy khung từ tiểu thuyết *Kiếm Lai* (剑来, Phong Hỏa Hí Chư Hầu) bọc lên vòng lặp idle hiện có. Tình tiết chi tiết mày viết sau; plan này xây **bộ máy kể chuyện + khung sườn hồi + quy trình mày đổ nội dung vào**.

---

## 1. Mục tiêu

Hiện tại game là idle thuần có 32 sự kiện rời rạc, không có "lý do để tu luyện". Mục tiêu phase này:

1. Người chơi mở game lên là **đang ở trong một câu chuyện**: có nhân vật, có địa điểm, có việc phải làm, có hậu quả.
2. Mỗi mốc cảnh giới lớn mở ra **một hồi truyện mới**, truyện kéo người chơi đi tiếp thay vì chỉ nhìn thanh linh khí.
3. Nội dung truyện **data-driven**, mày viết tình tiết bằng Markdown tiếng Việt, tao chuyển thành content TS. Thêm hồi mới không đụng engine.
4. Không phá save, không phá balance: sim guardrail vẫn pass sau khi cộng thưởng truyện.

Tiêu chí xong P9 (vertical slice): chơi mới từ đầu → thấy Hồi 0 trong 10 giây đầu → đến Trúc Cơ (~22–30 phút) thì xong Hồi 1 với ít nhất 1 lựa chọn đổi cờ nhân quả, 1 NPC có hảo cảm, 1 bí cảnh gắn truyện.

---

## 2. Quyết định thiết kế (tao đề xuất, mày chốt ở mục 8)

### 2.1 Người chơi là ai?

| Phương án | Ưu | Nhược |
|---|---|---|
| **(A) Mày là Trần Bình An** | Bám sát truyện, cảm xúc mạnh nhất, dễ viết vì có sẵn mạch | Tu vi trong truyện (võ phu trước, luyện khí sĩ sau, lên chậm) lệch hẳn thang 40 cảnh của game. Người chơi "biết trước" nếu đã đọc truyện |
| (B) Nhân vật gốc sống cùng thời, cùng trấn | Tự do thêm bớt, không bị soi "sai nguyên tác", chuyển thế hợp lý hơn | Trần Bình An thành NPC, cảm giác "xem" chứ không "sống" truyện. Mày nói muốn dùng Kiếm Lai làm **cốt truyện chính**, phương án này làm nó thành phông nền |

> [!IMPORTANT]
> **Tao đề xuất (A)**, kèm 2 quy ước để khỏi gãy:
> - **Game bám tình tiết, không bám tu vi.** Cảnh giới trong game là thang riêng (Luyện Khí → Phi Thăng), hồi truyện gắn theo mốc cảnh giới chứ không cố khớp "Trần Bình An lúc này là cảnh mấy".
> - **Chuyển thế = "đọc lại từ đầu hồi đang dở".** Tiến độ truyện (hồi đã xong, hảo cảm, cờ `story:*`, Sơn Thủy Chí) lưu **xuyên kiếp** như Đạo Vận. Kiếp mới tu lại từ đầu nhưng truyện không mất, hồi đang dở mở lại từ cảnh đầu hồi đó. Giải thích trong game: "Ký ức tiền kiếp".

### 2.2 Có đổi tên cảnh giới sang hệ 14 cảnh của Kiếm Lai không?

**Không, chưa.** Hệ Kiếm Lai (Hạ ngũ cảnh → Trung ngũ cảnh: Quan Hải, Long Môn, Kim Đan, Nguyên Anh, Ngọc Phác → Thượng ngũ cảnh: Tiên Nhân, Phi Thăng, Thập Tứ Cảnh) không map 1:1 với 11 đại cảnh hiện tại, đổi là đụng `realms.ts`, 40 id dùng khắp content, sim guardrail và save. Để P11 làm **"skin" tên hiển thị** nếu lúc đó còn muốn. Tên 4 cảnh đầu hạ ngũ cảnh tao không chắc nhớ đúng, mày kiểm tra lại nếu làm.

### 2.3 Truyện lưu theo tài khoản hay theo kiếp?

**Theo tài khoản** (xuyên kiếp), như 2.1. Lý do: hồi 4–6 nằm ở Nguyên Anh trở lên, tức là ngày thứ 2–3 trở đi; nếu truyện reset theo kiếp thì ai chuyển thế cũng phải đọc lại hồi 0–3, chán chết.

### 2.4 Mày viết tình tiết ở đâu, định dạng gì?

Mày viết **Markdown tiếng Việt** trong `docs/story/hoi-XX-<slug>.md` theo template mục 7. Tao chuyển sang TS trong `src/content/story/chapters/`. Lý do không cho mày viết TS thẳng: prose dài trong TS khó đọc, dễ lỗi dấu nháy; Markdown thì mày viết như viết truyện, `pnpm test` sẽ validate bản TS tao chuyển.

### 2.5 Bản quyền

> [!WARNING]
> *Kiếm Lai* là tác phẩm có bản quyền. Dùng tên nhân vật, địa danh, khung tình tiết để làm fan game cá nhân thì ổn; **không copy nguyên văn** bản dịch vào game, toàn bộ lời thoại và mô tả phải tự viết. Nếu sau này public lên Pages thì để rõ "fan-made, phi thương mại, dựa trên Kiếm Lai của Phong Hỏa Hí Chư Hầu" trong Cài đặt.

---

## 3. Khung sườn hồi truyện (skeleton — tình tiết mày bổ sung)

> Đây là mạch tao nhớ từ truyện, **chi tiết có thể sai lệch**, mày sửa thoải mái. Mỗi hồi gắn một dải cảnh giới và thời gian thực dự kiến từ sim (active). Hồi dài thì tách bằng **mục tiêu** (objectives) chứ không chỉ chờ cảnh giới.

| Hồi | Tên tạm | Cảnh giới | Thời gian thực (sim) | Địa điểm | NPC chính | Khung tình tiết |
|---|---|---|---|---|---|---|
| 0 | Nê Bình Hạng | Phàm Nhân | 0–2 phút | Tiểu trấn (Ly Châu Động Thiên) | Lưu Tiện Dương, Tống Tập Tân, Trĩ Khuê | Thằng nhóc mồ côi nung gốm ở Long Diêu. Tutorial: tu luyện, đột phá lần đầu. Kết: nhặt được thứ gì đó / gặp người lạ đến trấn |
| 1 | Ly Châu Động Thiên | Luyện Khí 1–9 | 2–25 phút | Tiểu trấn, Phúc Lộc Nhai, Kỵ Long Hạng, Lão Hòe Thụ, Thanh Ngưu Bối | Ninh Diêu, Tề Tĩnh Xuân, Nguyễn Cung, Nguyễn Tú, Thái Kim Giản, Phù Nam Hoa | Động thiên sắp sập, ngoại nhân vào trấn tranh cơ duyên. Chọn giúp ai, giữ gì, bán gì. Cao trào: Tề Tĩnh Xuân đứng ra, động thiên sụp. Kết: rời trấn, Trúc Cơ |
| 2 | Thiên lý tống thư | Trúc Cơ | 25 phút – 4 giờ | Đường xuống nam Bảo Bình Châu → Đại Tùy | Lý Bảo Bình, Lý Hòe, Lâm Thủ Nhất, Vu Lộc, Tạ Tạ, A Lương | Đưa lũ trẻ đến Sơn Nhai thư viện Đại Tùy. Hành trình nhiều trạm, mỗi trạm 1 bí cảnh / sự kiện. A Lương xuất hiện dạy kiếm. Kết: giao được người, Kim Đan |
| 3 | Lạc Phách Sơn | Kim Đan | 4 – 11 giờ | Lạc Phách Sơn, Long Tuyền quận, Đảo Chi Sơn (đi xa) | Thôi Đông Sơn, Bùi Tiền, Chu Liễm, Ngụy Bách... | Về quê lập sơn môn. Quản lý "cơ nghiệp" (hook kinh tế: linh thạch, phường thị). Chuyến đi xa đầu tiên. Kết: Nguyên Anh |
| 4 | Kiếm Khí Trường Thành | Nguyên Anh – Hóa Thần | 11 giờ – ngày 2–3 | Kiếm Khí Trường Thành, Man Hoang | Ninh Diêu (gặp lại), Trần Thanh Đô, Tả Hữu, ẩn quan | Chiến tranh với yêu tộc. Trở thành Ẩn Quan. Thiên kiếp Nguyên Anh/Hóa Thần lồng vào trận chiến. Kết: thành bị phá / rút lui |
| 5 | Hạo Nhiên thiên hạ | Luyện Hư – Đại Thừa | ngày 3+ | Văn Miếu, Trung Thổ Thần Châu, các châu | Văn Thánh, Lục Trầm, Bạch Dã, Thôi Sàm | Nghị sự Văn Miếu, Lạc Phách Sơn thành phái, đối đầu Thôi Sàm. Lựa chọn lớn về "đạo" đổi kết cục |
| 6 | Kiếm lai | Độ Kiếp – Phi Thăng | end-game | — | — | Kết. Nhiều kết cục theo cờ nhân quả + hảo cảm tích từ hồi 1. Màn kết riêng |

Quy ước nội dung:
- Mỗi hồi **5–10 cảnh** (scene), **3–6 mục tiêu**, **1–2 bí cảnh riêng**, **8–15 sự kiện ngẫu nhiên gắn hồi** (chỉ roll khi đang ở hồi/địa điểm đó).
- 32 sự kiện cũ giữ làm "thế giới nền", gắn tag địa điểm nếu hợp (ví dụ "Tông môn chiêu mộ" → đổi Thanh Vân Môn thành tông môn trong Kiếm Lai hoặc tắt khi đang ở trấn).
- Hảo cảm NPC là **cốt lõi phân nhánh**: ngưỡng hảo cảm mở lựa chọn, đổi outcome, quyết định kết cục hồi 6.

---

## 4. Kiến trúc hệ thống truyện

Nguyên tắc giữ nguyên: engine thuần TS, pure `state → state`, RNG inject, thời gian theo `playedMs`, mọi field mới qua migration + zod.

### 4.1 State mới (save v5 → v6)

```ts
interface StoryState {
  chapterId: string | null            // hồi đang mở
  completed: string[]                 // hồi đã xong (xuyên kiếp)
  sceneCursor: number                 // cảnh kế tiếp trong hồi
  pendingScene: { chapterId: string; sceneId: string } | null  // cảnh đang chờ đọc / chọn
  baseline: Partial<GameStats>        // snapshot stats lúc vào hồi, để tính mục tiêu kiểu "thắng 3 bí cảnh"
  affinity: Record<string, number>    // npcId → hảo cảm (-100..100), xuyên kiếp
  location: string                    // locationId hiện tại
  codex: string[]                     // mục Sơn Thủy Chí đã mở, xuyên kiếp
}
// GameState.story: StoryState
// LogKind thêm 'story'
```

Cờ truyện dùng `state.flags` sẵn có với tiền tố `story:`. `reincarnate()` giữ lại: `completed`, `affinity`, `codex`, mọi `flags['story:*']`; reset `sceneCursor = 0`, `pendingScene = null`, `baseline` lấy lại, `location` về địa điểm đầu hồi đang dở.

### 4.2 Content `src/content/story/`

```
story/
├── types.ts        ChapterDef, SceneDef, SceneTrigger, ObjectiveDef, NpcDef, LocationDef
├── npcs.ts         danh bạ NPC: id, tên, glyph Hán (chân dung bằng chữ, không ảnh), mô tả ngắn
├── locations.ts    địa điểm: id, tên, mô tả, dungeonIds, shopTier, gatherTier
├── codex.ts        mục Sơn Thủy Chí
├── chapters/
│   ├── hoi-00-ne-binh-hang.ts
│   ├── hoi-01-ly-chau-dong-thien.ts
│   └── ...
├── dsl.ts          helper: scene(), say(npc, text), choice(), goal.reachRealm()… cho content gọn
└── index.ts        CHAPTERS, CHAPTER_BY_ID, validateStory()
```

```ts
interface ChapterDef {
  id: string; arc: number; title: string; subtitle?: string; summary: string
  unlock: { afterChapter?: string; minRealmIndex?: number; requiredFlags?: string[] }
  startLocation: string
  scenes: SceneDef[]          // theo thứ tự, mỗi cảnh có trigger riêng
  objectives: ObjectiveDef[]  // việc phải làm giữa các cảnh, hiện checklist trên UI
  rewards: EventEffect[]      // thưởng khi xong hồi
}

interface SceneDef {
  id: string
  trigger: SceneTrigger       // 'chapterStart' | { realmIndex } | { objectivesDone: string[] } | { flag } | { dungeonWon } | { affinity: { npc, min } }
  blocks: SceneBlock[]        // { kind: 'narration', text } | { kind: 'line', npc, text }
  choices?: EventChoice[]     // tái dùng EventChoice/EventOutcome/EventEffect của hệ sự kiện
  effects?: EventEffect[]     // áp khi cảnh không có lựa chọn
}

type ObjectiveDef =
  | { id; text; kind: 'reachRealm'; realmIndex }
  | { id; text; kind: 'collectItem'; itemId; count }
  | { id; text; kind: 'winDungeon'; dungeonId; count }
  | { id; text; kind: 'resolveEvents'; count }        // so với baseline
  | { id; text; kind: 'craftPill'; count }            // so với baseline
  | { id; text; kind: 'techniqueLevel'; techniqueId; level }
  | { id; text; kind: 'affinity'; npcId; min }
  | { id; text; kind: 'flag'; key }
```

Mở rộng hệ sự kiện (không phá 32 sự kiện cũ, field đều optional):
- `EventCondition` thêm `chapter?: string`, `location?: string`, `minAffinity?: { npc, min }`.
- `EventEffect` thêm `{ type: 'affinity'; npc; delta }`, `{ type: 'travel'; location }`, `{ type: 'codex'; id }`, `{ type: 'storyFlag'; key; value }` (sugar cho `flag` tiền tố `story:`).
- `validateEvents()` + `validateStory()` kiểm tra: id trùng, item/npc/location/dungeon không tồn tại, cờ `requiredFlags` không ai set, hồi không reach được (chuỗi `afterChapter` phải là DAG có gốc), trigger cảnh tham chiếu objective không có.

### 4.3 Engine `src/engine/story.ts`

- `checkStory(state): GameState` — gọi trong loop ngay sau `tick()` và sau offline progress, trước `rollEvent()`. Việc làm: mở hồi mới nếu đủ `unlock`; nếu không có `pendingScene`, tìm cảnh kế tiếp có trigger thỏa → set `pendingScene` + log `'story'`; đánh dấu hồi xong khi hết cảnh + hết mục tiêu → áp `rewards`, push `completed`, mở hồi kế.
- `resolveScene(state, choiceId | null, rng): ActionResult` — áp effects/outcome, tăng `sceneCursor`, xóa `pendingScene`.
- `getObjectiveProgress(state, obj): { current, target, done }` — pure, so với `baseline`.
- Khi có `pendingScene`: **không roll sự kiện ngẫu nhiên**, và tuân `settings.pauseOnEvent` như sự kiện. Mỗi lúc chỉ 1 cảnh chờ, offline progress chỉ đẩy tới cảnh chờ đầu tiên (không bắn cả chuỗi).
- `reincarnate()` sửa để mang `story` theo như 4.1.
- `sim.ts`: bot tự đọc cảnh (chọn lựa chọn đầu tiên khả dụng) để thưởng truyện được tính vào guardrail.

### 4.4 UI

- **Tab "Cốt truyện"** (glyph 卷). NavBar đang 7 tab vừa khít 360px → **đưa Cài đặt lên icon bánh răng ở header**, nhường chỗ. Tổng vẫn 7 tab.
- `StoryScreen`: thẻ hồi hiện tại (tên, phụ đề, địa điểm, checklist mục tiêu có tiến độ), danh sách hồi (xong / đang mở / khóa + điều kiện mở), panel NPC đã gặp với thanh hảo cảm, tab con "Sơn Thủy Chí". Hồi đã xong cho **đọc lại** (read-only).
- `SceneModal`: hiện từng block (tap để hiện tiếp, có nút "Hiện hết"), lời thoại có glyph + tên NPC, nét mực loang khi mở, lựa chọn như `EventModal`. Dùng chung style modal.
- `GameScreen`: khi có `pendingScene` hiện nút nổi "Có chuyện xảy ra" (như badge sự kiện); header hiện **địa điểm** hiện tại dưới tên cảnh giới.
- `CultivationLog`: kind `'story'` màu đỏ son, in nghiêng.
- Màn kết (P11): overlay toàn màn, một trang chữ, kèm thống kê cuộc đời.

---

## 5. Lộ trình & Task

### Phase 9 — Bộ máy kể chuyện + Hồi 0–1 `[P9]`
- `P9-01` `StoryState` + `SAVE_VERSION = 6` + migration 5→6 (story mặc định: `chapterId: 'hoi-00'`, location trấn) + zod schema + test migration với fixture save v5 thật (export từ game hiện tại).
- `P9-02` `src/content/story/` types, `npcs.ts`, `locations.ts`, `dsl.ts`, `index.ts` + `validateStory()`. Mở rộng `EventCondition`/`EventEffect` (4.2), cập nhật `validateEvents()`, `describe.ts` cho effect mới.
- `P9-03` `src/engine/story.ts`: `checkStory`, `resolveScene`, `getObjectiveProgress`, chặn roll sự kiện khi có cảnh chờ, `LogKind 'story'`. `reincarnate()` giữ story. Test: mở hồi theo realm, trigger cảnh, mục tiêu theo baseline, chuyển thế giữ hồi đã xong và mở lại hồi dở, offline chỉ bắn 1 cảnh.
- `P9-04` Store + loop: gọi `checkStory` sau tick/offline; actions `resolveScene`, `dismissScene`; selector `pendingScene`.
- `P9-05` UI: NavBar + header (Cài đặt lên bánh răng, hiện địa điểm), `StoryScreen`, `SceneModal`, log kind story. jsdom smoke: mở tab, đọc cảnh, chọn lựa chọn.
- `P9-06` Content Hồi 0 + Hồi 1 theo skeleton mục 3 bằng **prose tạm của tao** (đánh dấu `TODO(story)`), sau đó thay bằng tình tiết mày viết trong `docs/story/hoi-00-*.md`, `hoi-01-*.md`. Kèm 1 bí cảnh mới gắn Hồi 1 và 8–10 sự kiện gắn địa điểm trấn. Gắn tag địa điểm cho 32 sự kiện cũ.
- `P9-07` Sim bot đọc truyện; chạy `pnpm sim 24 1` và `passive`, chỉnh thưởng truyện nếu lệch guardrail; thêm guardrail "Hồi 1 xong trong 15–60 phút active".
- `P9-08` Docs: `docs/STORY-GUIDE.md` (template mục 7 + quy trình), cập nhật walkthrough, README. Commit theo từng task.
- **Verify**: `pnpm test` xanh (≥ 130 test), `pnpm lint`, `pnpm build`; sim guardrail pass; tay: chơi mới 30 phút thấy Hồi 0 → Hồi 1 → mở Hồi 2 khi Trúc Cơ; import save v5 cũ không mất gì và vào thẳng hồi đúng theo cảnh giới hiện tại.

### Phase 10 — Thế giới & Hồi 2–3 `[P10]`
- `P10-01` Địa điểm thực sự ảnh hưởng gameplay: bí cảnh / hái thuốc / phường thị lọc theo `location`; `travel` là effect trong cảnh. Màn Bí cảnh hiện tên vùng.
- `P10-02` Đồng hành nhẹ: hảo cảm NPC qua ngưỡng → bonus thụ động data-driven qua `modifiers.ts` (ví dụ: A Lương +ATK bí cảnh, Lý Bảo Bình +số lượng hái thuốc, Thôi Đông Sơn +linh thạch). Không làm hệ party/combat riêng.
- `P10-03` Content Hồi 2 (Thiên lý tống thư, 6–8 trạm) + Hồi 3 (Lạc Phách Sơn) + 3–4 bí cảnh theo vùng + 20–25 sự kiện gắn hồi.
- `P10-04` Sơn Thủy Chí (codex) mở theo cảnh/sự kiện/bí cảnh.
- **Verify**: sim 24h vẫn trong guardrail; Hồi 2 xong ≈ lúc Kim Đan (2–8h); test content reachability toàn bộ hồi.

### Phase 11 — Hồi 4–6, kết cục, polish `[P11]`
- `P11-01` Hồi 4 (Kiếm Khí Trường Thành): lồng thiên kiếp Nguyên Anh/Hóa Thần vào cảnh chiến tranh; sự kiện phòng thủ chuỗi.
- `P11-02` Hồi 5 (Hạo Nhiên) + Hồi 6 (kết): **≥ 3 kết cục** theo tổng hảo cảm + cờ nhân quả; màn kết toàn màn; sau kết vẫn chơi tiếp (NG+ qua chuyển thế).
- `P11-03` Polish: typography cảnh truyện, "skin" tên cảnh giới Kiếm Lai (tùy chọn trong Cài đặt, chỉ đổi hiển thị), dòng ghi công fan-made.
- `P11-04` Audit nội dung: không nguyên văn bản dịch, không link ngoài; cập nhật docs.
- **Verify**: đọc hết 7 hồi bằng debug flag "mở khóa toàn bộ" (chỉ dev build); test mỗi kết cục reach được bằng cờ.

---

## 6. Kế hoạch kiểm thử

| Loại | Nội dung |
|---|---|
| Content validator | `validateStory()` + `validateEvents()` chạy trong test; fail nếu id lạ, hồi không reach, cờ không ai set, trigger lệch |
| Engine | Trigger từng loại; mục tiêu baseline; 1 cảnh chờ tối đa; sự kiện không roll khi có cảnh; chuyển thế giữ/mở lại đúng; migration v5→v6 fixture thật |
| Sim guardrail | Thêm mốc hồi vào `tests/sim.test.ts`; dải cảnh giới cũ **không đổi** |
| UI smoke (jsdom) | Mở tab Cốt truyện, modal cảnh hiện block tuần tự, chọn lựa chọn cập nhật hảo cảm |
| Tay | Chơi mới 30 phút trên mobile 360px; import save cũ; tắt tab 1h mở lại chỉ thấy 1 cảnh chờ |

---

## 7. Template mày viết tình tiết (`docs/story/hoi-XX-<slug>.md`)

```markdown
# Hồi 1 — Ly Châu Động Thiên
Mở khi: sau Hồi 0, Luyện Khí tầng 1
Địa điểm đầu: tieu-tran
Tóm tắt: (2–3 câu, hiện trên thẻ hồi)

## NPC xuất hiện
- ninh-dieu: Ninh Diêu — (1 dòng mô tả), glyph 寧
- te-tinh-xuan: Tề Tĩnh Xuân — ...

## Mục tiêu
- [reachRealm luyen-khi-5] Tu đến Luyện Khí tầng 5
- [winDungeon ly-chau-dong-thien 1] Vào động thiên một lần
- [affinity ninh-dieu 20] Được Ninh Diêu tin tưởng

## Cảnh 1: Người lạ đến trấn
Khi: bắt đầu hồi
> (đoạn kể)
**Ninh Diêu**: (lời thoại)
> (đoạn kể)
### Lựa chọn
- Giúp nàng → hảo cảm ninh-dieu +15, cờ story:giup-ninh-dieu
  - (kết quả 70%) văn kết quả... → +linh thạch 5 phút thu nhập
  - (kết quả 30%) văn kết quả... → mất 10% linh khí
- Lờ đi → hảo cảm ninh-dieu −10

## Cảnh 2: ...
Khi: mục tiêu [reachRealm luyen-khi-5] xong
...

## Thưởng hết hồi
- item: pha-canh-dan ×1
- codex: ly-chau-dong-thien
```

Mày chỉ cần viết thế này. Hiệu ứng dùng từ vựng có sẵn: linh khí (%), linh thạch (phút thu nhập), item, buff, cờ, hảo cảm, đi tới địa điểm, mở Sơn Thủy Chí, học công pháp. Cần hiệu ứng mới thì ghi `[CẦN: ...]`, tao bổ sung engine.

---

## 8. Cần mày chốt trước khi code

1. **Người chơi là Trần Bình An** (A) hay nhân vật gốc (B)? Tao đề xuất **A**.
2. **Truyện lưu xuyên kiếp**, chuyển thế mở lại hồi đang dở — ok?
3. **Không đổi tên cảnh giới** sang 14 cảnh, để skin ở P11 — ok?
4. **Khung hồi mục 3**: mạch 7 hồi và mốc cảnh giới có hợp ý mày không, hay muốn gộp/tách? Đặc biệt Hồi 4–6 nằm ở ngày chơi thứ 2–3+, nội dung ở đó mày muốn dày hay mỏng?
5. **Thứ tự làm**: tao code xong bộ máy + Hồi 0–1 bằng prose tạm (P9-01 → P9-05) rồi mày mới cần đưa tình tiết, hay mày muốn viết Hồi 0–1 trước để tao làm content thật ngay từ đầu?

---

## 9. Rủi ro

> [!IMPORTANT]
> **Nội dung là nút cổ chai, không phải code.** Bộ máy xong trong P9 nhưng 7 hồi × 5–10 cảnh × lựa chọn là vài chục nghìn chữ. Nếu mày không có thời gian viết, tao viết prose tạm hết rồi mày sửa dần; đừng để game chờ.

> [!WARNING]
> **Thưởng truyện phá balance.** Mỗi `rewards` và outcome cảnh đều là linh khí/linh thạch chảy vào đường cong đã khóa. Mọi thưởng tính theo `fraction`/`seconds` tương đối như sự kiện, không số tuyệt đối; sim phải pass trước khi merge content.

> [!WARNING]
> **Save v5 ngoài tự nhiên.** Nếu mày đã chơi thật trên bản hiện tại thì export save ra trước khi làm P9-01, dùng làm fixture test migration.

> [!NOTE]
> Hồi 4+ ở ngày 2–3 chơi: nếu sau này chỉnh balance nhanh hơn thì mốc cảnh giới trong `unlock` phải xem lại. Vì vậy trigger cảnh ưu tiên **mục tiêu** hơn **cảnh giới** khi có thể.
