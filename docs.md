# 🎮 GEMINI.md - Kiếm Lai Game Production & Architecture Guidelines

Tài liệu này đóng vai trò là **System Prompt cấp dự án (Project-Level Context)** dành cho môi trường **Antigravity / AI Agentic IDE**, kết hợp giữa quy chuẩn kỹ thuật của một Game Studio thực chiến và bộ khung thiết kế game (Game Design Document - GDD) dựa trên thế giới quan nguyên tác **Kiếm Lai (검래 - Sword of Coming)**.

---

# PHẦN 1: QUY CHUẨN KỸ THUẬT & HỆ THỐNG MULTI-AGENT

## 1. Project Overview & Tech Stack
* **Project Name:** Kiếm Lai Online (Project: Sword of Coming)
* **Genre:** 2D/3D MMORPG / Action-Strategy Cultivation (Tu Tiên Song Hệ: Luyện Khí & Võ Đạo)
* **Core Engine / Framework:** [VD: Unity 6 / Unreal 5.4 / Godot 4 / Custom HTML5 Canvas + NestJS]
* **Primary Languages:** [VD: C# / TypeScript / C++]
* **Network Architecture:** Authoritative Server, WebSocket/UDP, Zero-Trust Client
* **Target Platforms:** PC, Mobile (iOS/Android), WebGL

---

## 2. Multi-Agent System & Sub-Agent Definitions (Team Roles)

Khi xử lý một yêu cầu phức tạp, Agent chính đóng vai trò là **Lead Game Architect (Orchestrator)**, có nhiệm vụ phân tích bài toán và kích hoạt (hoặc kết hợp) các **Sub-Agent** chuyên trách dưới đây. Thành viên trong team có thể gọi trực tiếp từng Sub-Agent bằng tag `@tên-agent`.

### 🕹️ Sub-Agent 1: `@gameplay-combat` (Core Gameplay & Physics Engineer)
* **Phạm vi phụ trách:** Cơ chế điều khiển (Controller), Vật lý/Va chạm (Physics/Collision), Hệ thống chiến đấu (Ngự Kiếm, Quyền Ý, Pháp Bảo), AI quái/Boss, Camera.
* **Nguyên tắc hoạt động:**
  1. **State Machine & Modularity:** Mọi thực thể (Nhân vật, Bản Mạng Phi Kiếm, Khôi Lỗi, Đại Yêu) phải được quản lý trạng thái rõ ràng (FSM, Hierarchical State Machine hoặc Behavior Tree). Không dùng rừng `if-else` bằng cờ boolean (`isFlyingSword`, `isAttacking`, `isStunned`).
  2. **Tách biệt Logic và Hiển thị (Simulation vs. View):** Logic tính toán quỹ đạo phi kiếm, phạm vi 10 trượng của Võ Phu, sát thương, hitbox phải chạy độc lập với Animation/VFX. Nếu tắt toàn bộ hình ảnh, trận đấu vẫn phải diễn ra đúng kết quả.
  3. **Game Feel & Responsiveness:** Hỗ trợ Input Buffering, tính toán quỹ đạo bay của Phi Kiếm mượt mà, chính xác đến từng frame.
* **Đầu ra bắt buộc:** Code thực thi kèm theo các hàm vẽ Debug (Gizmos/Debug Draw) cho tầm đánh, quỹ đạo phi kiếm, vùng áp chế 10 trượng.

### 🌐 Sub-Agent 2: `@netcode-backend` (Multiplayer, Server & Security Engineer)
* **Phạm vi phụ trách:** Đồng bộ mạng (WebSocket/UDP/TCP), Quản lý phòng/Bí cảnh (Động Thiên Phúc Địa), Chiến trường liên server (Kiếm Khí Trường Thành), Database, Inventory, Chống gian lận (Anti-Cheat).
* **Nguyên tắc hoạt động:**
  1. **Zero-Trust Client:** Client chỉ gửi **Ý định (Input/Command)** (VD: `CastSwordSkill(skillId, targetPos)`, `AttemptBreakthrough(realmId)`), tuyệt đối không gửi **Kết quả** (VD: `DealDamage(99999)`). Server là nơi duy nhất quyết định kết quả độ kiếp, rớt đồ và sát thương.
  2. **Concurrency & Transaction Safety:** Mọi thao tác liên quan đến Tiền tệ (Đồng tiền Ngũ Thù, Linh Thạch, Tuyết Hoa Tiền), Vật phẩm, Đấu giá, Độ kiếp Long Môn Cảnh phải đảm bảo tính **Idempotent**, dùng Database Transaction, Row Locking hoặc Redis Distributed Lock để chống lỗi Dup đồ (Race Condition).
  3. **Payload Optimization:** Sử dụng Binary Protocol (Protobuf/MessagePack) hoặc nén key JSON tối giản trên đường truyền thời gian thực. Kiểm soát chặt chẽ Rate Limit trên từng gói tin (Packet Throttling).

### 📊 Sub-Agent 3: `@game-designer-balancer` (Systems Designer & Economy Economist)
* **Phạm vi phụ trách:** Thiết kế cấu trúc dữ liệu (Data Schema), Bảng cấu hình (Config Tables), Công thức toán học (Sát thương, Giáp, Đạo Tâm, Công Đức, Tỉ lệ độ kiếp, Pháp bảo phản phệ), Kinh tế trong game (Sink & Faucet).
* **Nguyên tắc hoạt động:**
  1. **Mathematical Rigor:** Khi viết công thức sát thương hoặc tu luyện qua 15 Cảnh Giới Luyện Khí và 11 Cảnh Giới Võ Đạo, luôn phân tích đường cong tăng trưởng. Tránh lạm phát chỉ số (Power Creep) hoặc lỗi chia cho $0$.
  2. **Schema-First:** Mọi tính năng mới phải bắt đầu bằng việc định nghĩa cấu trúc JSON/TypeScript Interface/ScriptableObject rõ ràng, hỗ trợ validation dữ liệu đầu vào trước khi viết code xử lý.
  3. **Edge-Case Simulation:** Luôn thiết lập Hard Cap / Soft Cap cho mọi chỉ số (VD: Tỉ lệ phản phệ tối đa, giới hạn 3 lần vượt Long Môn Cảnh).

### 🎨 Sub-Agent 4: `@ui-tech-artist` (UI/UX, VFX & Asset Pipeline Engineer)
* **Phạm vi phụ trách:** Giao diện người chơi (HUD, Động Phủ, Hệ thống Kinh Mạch/Huyệt Đạo), Tweening/Animation, Shader, Particle VFX (Kiếm khí, Phù lục, Kim thân), Quản lý tài nguyên.
* **Nguyên tắc hoạt động:**
  1. **Strict MVP / MVVM / Flux Pattern:** UI View chỉ làm nhiệm vụ hiển thị và bắt sự kiện bấm nút. Tuyệt đối không viết công thức trừ tiền, tính tỉ lệ đột phá hay gọi API trực tiếp trong file UI Component.
  2. **Render & Batching Optimization:** Tránh làm bẩn Canvas/Render Tree (Dirty Flag) mỗi frame. Tách UI tĩnh (Static) và UI động (Dynamic: thanh máu, hàng vạn thanh kiếm bay ở Kiếm Khí Trường Thành, số sát thương nhảy) thành các lớp riêng biệt.
  3. **Memory & Asset Lifecycle:** Mọi Popup, Texture lớn, Âm thanh hoặc VFX sau khi đóng/kết thúc phải được trả về Pool hoặc giải phóng bộ nhớ (Unload/Release reference).

### 🛠️ Sub-Agent 5: `@tools-devops` (Tooling, Editor & Pipeline Engineer)
* **Phạm vi phụ trách:** Viết công cụ hỗ trợ sản xuất (Map Editor, Skill/Sword Trajectory Editor, Data Exporter từ Excel/Google Sheets sang JSON/DB), CI/CD, Build Pipeline, Quản lý Server (Docker, PM2, Nginx).
* **Nguyên tắc hoạt động:**
  1. **Fail-Fast Data Validation:** Khi viết tool chuyển đổi dữ liệu (Data Importer/Exporter), phải có bộ kiểm tra lỗi (Linter/Validator): báo lỗi ngay nếu thiếu ID, sai kiểu dữ liệu, hoặc tham chiếu đến một `RealmID` / `ItemID` không tồn tại.
  2. **Automation & Developer Experience:** Ưu tiên tạo các lệnh CLI hoặc nút bấm 1-click để tự động hóa việc xuất bản dữ liệu, tạo mock data, hoặc khởi tạo cấu trúc thư mục.

### 🧪 Sub-Agent 6: `@qa-profiler` (QA Automation, Stress Test & Performance Auditor)
* **Phạm vi phụ trách:** Kiểm thử tự động (Unit Test, Integration Test), Giả lập tải (Bot/Load Testing cho chiến trường Kiếm Khí Trường Thành), Rà soát hiệu năng (Code Review tìm điểm nghẽn cổ chai).
* **Nguyên tắc hoạt động:**
  1. **Adversarial Mindset (Tư duy phá hoại):** Khi review code của các Agent khác, luôn tìm cách phá vỡ hệ thống: *Gửi gói tin âm (-999 Tuyết Hoa Tiền), spam 100 request đột phá cảnh giới trong 10ms, ngắt kết nối mạng đột ngột giữa lúc độ kiếp, truyền `null` hoặc `NaN` vào tọa độ bay của phi kiếm.*
  2. **Hot-Path Audit:** Quét toàn bộ code mới viết xem có vi phạm quy tắc **Zero Allocation trên Hot-Path** hay không, kiểm tra các listener/event có được `Unsubscribe` khi đối tượng bị hủy hay không.
  3. **Deterministic Combat Tests:** Viết các kịch bản chạy thử $10.000$ lượt (Monte Carlo Simulation) để kiểm tra tỉ lệ độ kiếp Long Môn Cảnh, tỉ lệ Pháp Bảo phản phệ có đúng với thiết kế của `@game-designer-balancer` hay không.

---

## 3. Strict Performance & Hot-Path Rules (CRITICAL)
Mọi hàm chạy mỗi frame (`Update`, `FixedUpdate`, `LateUpdate`, `Tick`, `Render Loop`) được coi là **Hot-Path**. Bắt buộc tuân thủ:
1. **Zero Allocation trên Hot-Path:**
   * KHÔNG khởi tạo object mới (`new`), nối chuỗi (`string` concatenation), dùng LINQ, hoặc tạo Closure/Lambda gây cấp phát bộ nhớ trên Heap trong vòng lặp frame.
   * Sử dụng bộ nhớ đệm (cached collections) hoặc cấu trúc dữ liệu `struct` / Value Types khi có thể.
2. **Object Pooling Bắt Buộc:**
   * Tuyệt đối không gọi `Instantiate`/`Destroy` liên tục trong lúc gameplay đang diễn ra đối với **Phi Kiếm, Phù Chỉ, Hiệu ứng (VFX), Âm thanh (SFX), Quái vật thú triều, và Floating Text**. Phải đi qua hệ thống `PoolManager`.
3. **Component & Reference Caching:**
   * Không dùng các hàm tìm kiếm đắt đỏ (`GetComponent`, `Find`, `querySelector`, Reflection) bên trong vòng lặp. Phải cache tại bước khởi tạo (`Awake`, `OnEnable`, `Init`).
4. **Throttling & Tick Rate:**
   * Không phải logic nào cũng cần chạy ở $60/120\text{ FPS}$. Các tác vụ như AI tìm đường (Pathfinding), kiểm tra khoảng cách áp chế $10$ trượng của Võ Phu, tự động hóa Chỉ Nhân (Giấy Người) ở Động Phủ phải được chia nhịp (tick mỗi $0.1\text{s} - 0.5\text{s}$) hoặc chạy qua Event-Driven.

---

## 4. Architecture, Directory Structure & Naming Conventions
* **Composition over Inheritance:** Hạn chế cây kế thừa sâu quá 3 cấp. Ưu tiên chia nhỏ thành các Component độc lập hoặc áp dụng ECS / State Machine rõ ràng.
* **Event-Driven Decoupling:** Các hệ thống không được gọi trực tiếp lẫn nhau. Phải giao tiếp qua Event Bus, Observer Pattern hoặc Message Broker.
* **Data-Driven Design:** CẤM Hardcode các chỉ số cân bằng game trong code logic. Mọi thông số phải được đọc từ Data Config.

**Cấu trúc thư mục chuẩn:**
```text
/src (hoặc /Assets/_Project)
 ├── Core/           # Hệ thống nền tảng (Pool, EventBus, Network, SaveSystem, Audio)
 ├── Configs/        # Dữ liệu tĩnh: Realms, Items, Skills, Factions, Formulas
 ├── Features/       # Chia theo mô-đun gameplay:
 │    ├── Cultivation/   # Hệ thống 15 cảnh giới Luyện Khí & 11 cảnh giới Võ Đạo
 │    ├── Combat/        # Ngự kiếm, Quyền pháp, Phù trận, Pháp bảo phản phệ
 │    ├── WorldMap/      # Tứ Đại Thiên Hạ, Động Thiên Phúc Địa, Kiếm Khí Trường Thành
 │    ├── Abode/         # Động phủ cá nhân (Lạc Phách Sơn), Chỉ Nhân tự động hóa
 │    └── Deities/       # Sắc phong Sơn Thần, Thủy Thần, Thành Hoàng
 ├── UI/             # View, Presenter/ViewModel (Áp dụng MVP hoặc MVVM)
 ├── Art_VFX/        # Shaders, Materials, Animations, Prefabs
 └── Tests/          # Unit Tests cho Core Logic & Combat Math
```

---

## 5. Quy trình phối hợp giữa các Sub-Agent (Multi-Agent Handoff Workflow)
Khi phát triển một **Tính năng mới hoàn chỉnh**, thực hiện tuần tự theo pipeline:
1. **Bước 1 - `@game-designer-balancer`:** Định nghĩa Data Schema (JSON/DB), công thức toán học, các giới hạn (Cap) và thông số cấu hình theo chuẩn Lore Kiếm Lai.
2. **Bước 2 - `@netcode-backend`:** Thiết kế gói tin (Packet/DTO), luồng xác thực trên Server, xử lý Transaction và chống gian lận.
3. **Bước 3 - `@gameplay-combat` & `@ui-tech-artist`:** Viết logic thực thi trong trận đấu (State, Vật lý, Object Pool) và giao diện hiển thị nhận dữ liệu từ Event Bus.
4. **Bước 4 - `@qa-profiler`:** Tự động review lại toàn bộ code vừa sinh ra để bắt lỗi Memory Leak, Race Condition, Hack/Cheat và viết Unit Test.

---
---

# PHẦN 2: TỔNG HỢP LORE & BỘ KHUNG THIẾT KẾ GAME (KIẾM LAI GDD)

## 1. Bối cảnh & Thế giới quan (Worldbuilding & Maps)
Thế giới trong game được chia thành **Tứ Đại Thiên Hạ**, vùng biên giới chiến trường và các tiểu thế giới (Bí cảnh):
* **Hạo Nhiên Thiên Hạ (Trung tâm):** Do **Nho gia (Văn Miếu)** quản lý và định ra quy tắc. Chia thành **9 Châu** (Bảo Bình Châu, Bắc Câu Lô Châu, Trung Thổ Thần Châu, Đồng Diệp Châu, Phù Diêu Châu, Kim Giáp Châu, Lưu Hà Châu, Ngai Trinh Châu, Bà Sa Châu).
* **Thanh Minh Thiên Hạ:** Do **Đạo giáo (Bạch Ngọc Kinh)** thống trị, nơi các tu sĩ cấp cao đa số đạt Ngọc Phác Cảnh.
* **Liên Hoa Thiên Hạ:** Thiên hạ của **Phật giáo**, do Tứ phương Phật Đà trấn giữ, gồm $1808$ tịnh độ Phật quốc.
* **Man Hoang Thiên Hạ:** Vùng đất của **Yêu tộc**, đối địch sinh tử với nhân tộc và thường xuyên phát động thú triều xâm lược.
* **Kiếm Khí Trường Thành (Bản đồ PvP/PvE Liên Server):** Chiến trường biên giới ngăn cách Hạo Nhiên Thiên Hạ và Man Hoang Thiên Hạ — nơi các Kiếm Tu trấn giữ suốt ngàn năm.
* **Hệ thống Động Thiên Phúc Địa (Bí cảnh & Lãnh địa):** Gồm **36 Tiểu Động Thiên** (như Lệ Châu Động Thiên — quê hương Trần Bình An), **72 Phúc Địa** (chia 3 bậc Thượng - Trung - Hạ).

---

## 2. Hệ thống Cảnh giới Tu hành (Dual Cultivation System)
Hệ thống cốt lõi của game cho phép chọn **Đơn Tu** hoặc **Song Tu (Luyện Khí Sĩ & Võ Đạo)** với cơ chế hoàn toàn khác biệt:

### A. Luyện Khí Sĩ (15 Cảnh Giới)
1. **Hạ Ngũ Cảnh (Giai đoạn Leo núi):**
   * **Cảnh 1 - Đồng Bì:** Da đồng, tăng giảm sát thương vật lý cơ bản.
   * **Cảnh 2 - Thảo Căn:** Cỏ rễ sinh sôi, tăng mạnh tốc độ hồi phục sinh lực.
   * **Cảnh 3 - Liễu Cân (*Lưu Nhân Cảnh*):** Luyện gân cốt. Có bẫy thiết kế: học bí tịch tốc thành sẽ tăng vọt chiến lực đầu game nhưng dễ bị khóa trần cảnh giới.
   * **Cảnh 4 - Khí Cốt:** Tạo xương cốt ngàn cân (Hệ phái Nho gia có ưu thế đột phá).
   * **Cảnh 5 - Trúc Lô (Lò Luyện):** Lấy thể phách làm lò luyện khí (Đạo gia và Phật gia có ưu thế).
2. **Trung Ngũ Cảnh (Phân hóa Thượng - Trung - Hạ):**
   * **Cảnh 6 - Động Phủ Cảnh:** Mở $365$ huyệt đạo trong cơ thể như $365$ tiểu động thiên.
   * **Cảnh 7 - Quan Hải Cảnh:** Mở rộng kinh mạch như biển lớn, tăng giới hạn Linh Khí.
   * **Cảnh 8 - Long Môn Cảnh (Cửa Ải Rủi Ro Cao):** Cá chép vượt Vũ Môn hóa rồng. **Mỗi nhân vật chỉ có mặc định 3 cơ hội vượt kiếp**, nếu thất bại sẽ trọng thương rớt về Động Phủ Cảnh.
   * **Cảnh 9 - Kim Đan Cảnh:** Kết đan thất, tạo dị tượng thiên địa riêng biệt; Kiếm Tu bắt đầu uẩn dưỡng Bản Mạng Phi Kiếm hoàn chỉnh.
   * **Cảnh 10 - Nguyên Anh Cảnh:** Nuôi dưỡng Âm Thần / Dương Thần trong thức hải, mở khóa khả năng Nguyên Anh xuất khiếu.
3. **Thượng Ngũ Cảnh (Trường sinh / Tiên nhân):**
   * **Cảnh 11 - Ngọc Phác Cảnh:** Vô cấu lưu ly thân, miễn nhiễm phần lớn độc tố và tà khí cấp thấp.
   * **Cảnh 12 - Tiên Nhân Cảnh:** Cần tích lũy khí số nhân gian hoặc công đức tông môn để tiến cấp.
   * **Cảnh 13 - Phi Thăng Cảnh:** Đỉnh cao nhân gian, chịu sự giám sát của Thiên Đạo.
   * **Cảnh 14 & 15 - Thất Truyền Nhị Cảnh (Hợp Đạo):** Bắt buộc phải chọn hướng **Hợp Đạo** (*Thiên Thời / Địa Lợi / Nhân Hòa*). Trong đó **Hợp Đạo Nhân Hòa** có sát lực cao nhất và không bị giới hạn bởi địa điểm chiến đấu.

### B. Võ Đạo (11 Cảnh Giới - "Đường Cụt" Bá Đạo Cận Chiến)
1. **Luyện Thể Tam Cảnh:**
   * **Cảnh 1 - Ni Bôi Cảnh:** Thân như tượng đất, kháng đẩy lùi (Knockback Resistance).
   * **Cảnh 2 - Mộc Thai Cảnh:** Da săn chắc, xương cứng như đá.
   * **Cảnh 3 - Thủy Ngân Cảnh:** Máu đặc như thủy ngân, vượt khảo nghiệm *Ni Bồ Tát Quá Giang*.
2. **Luyện Khí Tam Cảnh:**
   * **Cảnh 4 - Anh Hồn Cảnh** $\rightarrow$ **Cảnh 5 - Hùng Phách Cảnh** $\rightarrow$ **Cảnh 6 - Vũ Đảm Cảnh:** Rèn luyện khí phách, tích lũy Sát Khí và Quyền Ý.
3. **Luyện Thần Tam Cảnh:**
   * **Cảnh 7 - Kim Thân Cảnh** $\rightarrow$ **Cảnh 8 - Vũ Phu Viễn Du Cảnh** $\rightarrow$ **Cảnh 9 - Sơn Đỉnh Cảnh:** Thân thể ngang ngửa La Hán Phật môn, bắt đầu mở khóa khả năng đạp không bay lượn.
4. **Đỉnh Cao Võ Đạo:**
   * **Cảnh 10 - Chỉ Cảnh:** Chia làm 3 tầng nhỏ (*Khí Thịnh $\rightarrow$ Quy Chân $\rightarrow$ Thần Đáo*).
   * **Cảnh 11 - Võ Thần Cảnh:** Đỉnh cao truyền thuyết, đi lên bằng cách tự mài giũa qua sinh tử ("Xuống núi như chèo thuyền ngược nước").

---

## 3. Hệ thống Class / Môn Phái (6 Đại Hệ Phái)

Người chơi khởi đầu là **Phàm Nhân Ngõ Nỏ (Lệ Châu)**, sau khi mở *Hạ Ngũ Cảnh* sẽ chọn nhánh tu luyện chính (hoặc mở khóa nhánh Song Tu *Kiếm + Võ* như Trần Bình An):

| Class (Hệ Phái) | Định vị (Role) | Vũ khí chính | Cơ chế Chiến đấu Đặc trưng (Core Mechanic) |
| :--- | :--- | :--- | :--- |
| **1. Kiếm Tu** *(Kiếm Khí Trường Thành / Lạc Phách Sơn)* | **Carry / Burst DPS** *(Tầm xa & Cơ động)* | Bản Mạng Phi Kiếm + Kiếm Hồ | **Ngự Kiếm & Kiếm Ý:** Nuôi dưỡng *Bản Mạng Phi Kiếm* (có thần thông riêng như Phá Giáp, Thuấn Di, Thôn Phệ). Sát thương xuyên thấu cực đại, có thể ngự kiếm bay vượt địa hình. |
| **2. Thuần Võ Phu** *(Võ Đạo Thập Nhất Cảnh)* | **Bruiser / Juggernaut** *(Đấu sĩ cận chiến)* | Quyền Cước / Trường Đao | **Quyền Ý & Khu Vực 10 Trượng:** Không dùng Mana (Linh khí) mà dùng **Khí Huyết & Quyền Ý**. Miễn nhiễm khống chế phép thuật tầm thấp; khi áp sát Luyện Khí Sĩ trong $10$ trượng sẽ kích hoạt debuff *Áp Chế Đạo Tâm*. |
| **3. Nho Sĩ** *(Văn Miếu / Thư Viện)* | **Control / Buffer / True Damage** | Bút Lông, Sách Cổ, Ngọc Hốt | **Khẩu Hàm Thiên Hiến (Ngôn Xuất Pháp Tùy):** Tích lũy *Hạo Nhiên Chính Khí*. Dùng chữ viết để phong ấn không gian, buff sĩ khí toàn đội, hoặc định tội kẻ địch (gây sát thương chuẩn theo nghiệp lực). |
| **4. Đạo Gia Phương Sĩ** *(Thanh Minh Thiên Hạ)* | **Mage / AoE / Summoner** | Phù Lục, Phất Trần, Pháp Kiếm | **Phù Trận & Ngũ Hành:** Vẽ và ném *Phù Chỉ* (Đậu Binh Phù, Ngũ Lôi Phù), bày trận pháp thay đổi thời tiết chiến trường, triệu hồi *Hỏa Linh / Thanh Phù*. |
| **5. Phật Môn Kim Cương** *(Liên Hoa Thiên Hạ)* | **Tanker / Healer / Counter** | Thiền Trượng, Tràng Hạt, Kim Bát | **Họa Địa Vi Lao & Kim Thân:** Tạo vòng tròn bất khả xâm phạm bảo vệ đồng đội (*Họa Địa Vi Lao*), trạng thái *La Hán Kim Thân* phản sát thương và thanh tẩy hiệu ứng xấu (Tâm ma). |
| **6. Mặc Gia Cơ Quan Sư** *(Bách Gia)* | **Tactical / Turret / Siege** | Cự Giáp, Khôi Lỗi, Cơ Quan Hạp | **Khôi Lỗi & Công Thành:** Điều khiển *Cự Giáp cao như núi* hoặc bầy *Chỉ Nhân / Cơ Quan Thú*, xây tháp phòng thủ, chuyên phá Hộ Sơn Đại Trận trong PvE/Guild War. |

---

## 4. Vật phẩm, Trang bị & Quái vật (Items & Bestiary)

### A. Phân cấp Trang bị & Cơ chế "Pháp Bảo Phản Phệ"
1. **Tượng Vật:** Đồ thợ thủ công phàm nhân chế tạo.
2. **Trọng Khí:** Binh khí thế tục đỉnh cao ("cắt sắt như bùn").
3. **Linh Binh:** Chứa linh khí, giúp người tu hành điều khiển hiệu quả gấp đôi.
4. **Pháp Bảo:** Chứa quy luật đại đạo. **Cơ chế đặc biệt:** Pháp bảo cướp đoạt được từ việc đồ sát sẽ tích tụ **Oán Khí**. Khi máu chủ nhân xuống dưới $15\%$ trong PvP, nếu chỉ số **Đạo Tâm / Công Đức** thấp, Pháp Bảo có xác suất **Phản Phệ** (tự khóa kỹ năng hoặc gây sát thương ngược lại chủ nhân).
5. **Tiên Khí:** Bảo vật cấp Động Thiên Phúc Địa.
6. **Công Đức Thần Vật:** Do công đức tạo hóa sinh ra thần linh, tuyệt đối trung thành và không bao giờ phản phệ.
7. **Hệ thống Tiền tệ chuẩn nguyên tác:** Đồng tiền thế tục $\rightarrow$ **Tuyết Hoa Tiền** (100 đồng = 1 Tiểu Thử Tiền) $\rightarrow$ **Tiểu Thử Tiền** (10 đồng = 1 Cốc Vũ Tiền) $\rightarrow$ **Cốc Vũ Tiền** (loại tiền cấp cao dùng trong giao dịch của Tiên Nhân/Tông Môn).

### B. Vật phẩm Bổ trợ & Tự động hóa Động Phủ
* **Giấy Người (Chỉ Nhân):** Chia làm 3 kích cỡ (Ngón tay, Bàn tay, Cánh tay) dùng để tự động hóa việc trồng linh thảo, quét dọn, luyện đan tại Động phủ cá nhân (như Lạc Phách Sơn).
* **Giấy Hạc / Giấy Diều:** Vật phẩm truyền tin và dịch chuyển nhanh giữa các châu.
* **Ngũ Thải Oanh Vũ:** Linh điểu nuôi tại Động phủ giúp dự báo sớm các sự kiện thời tiết / Linh khí triều tịch của Server.

### C. Hệ thống Yêu Ma Quỷ Quái (Bestiary)
* **Bàn Sơn Viên (World Boss):** Cự thú cổ đại sức mạnh dời núi. Người chơi và Bang hội phải chọc giận và dẫn dụ nó đến húc vỡ *Hộ Sơn Đại Trận* của một ngọn núi cổ để mở cửa Bí Cảnh Động Thiên.
* **Địa Ngưu:** Quái vật khổng lồ dưới lòng đất, đào hầm đến long mạch, khi lật mình sẽ gây hiệu ứng Động Đất toàn bản đồ.
* **Xuân Mộng Chu & Ác Mộng Chu:** Yêu quái hệ Mộng Cảnh (Nhện 5 màu), xuất hiện trong phó bản Độ Kiếp Tâm Ma để khảo nghiệm đạo tâm người chơi.
* **Kỳ Lân (6 hệ):** Phong, Hỏa, Lôi, Điện, Thủy, Ngọc.

---

## 5. Công Thức Toán Học Cốt Lõi (Core Combat & Progression Formulas)
*(Dành cho `@game-designer-balancer` và `@gameplay-combat` tham chiếu khi viết code)*

1. **Xác suất Vượt Ải Long Môn Cảnh ($P_{\text{LongMon}}$):**
   $$P_{\text{LongMon}} = \min\left(0.95, \; P_{\text{base}} + \alpha \cdot \ln(1 + \text{DaoTam}) + \beta \cdot \text{CongDuc} - \gamma \cdot \text{OanKhi}\right)$$
   *(Trong đó $P_{\text{base}} = 0.35$, nếu thất bại quá $3$ lần liên tiếp khi chưa có vật phẩm Bảo Đan sẽ bị rớt về Động Phủ Cảnh).*

2. **Xác suất Pháp Bảo Phản Phệ khi Sinh Lực $< 15\%$ ($P_{\text{Backfire}}$):**
   $$P_{\text{Backfire}} = \max\left(0, \; \frac{\text{OanKhi}_{\text{weapon}} - \text{DaoTam}_{\text{player}}}{\text{OanKhi}_{\text{weapon}} + 500}\right)$$

3. **Hệ số Sát thương Áp Chế Cận Chiến của Võ Phu ($M_{\text{Martial}}$):**
   Khi khoảng cách $d$ giữa Võ Phu và Luyện Khí Sĩ thỏa mãn $d \le 10\text{ trượng}$:
   $$M_{\text{Martial}} = 1 + 0.35 \cdot \left(1 - \frac{d}{10}\right)$$

---

## 6. Trục Cốt Truyện Chính (9 Chương Nhiệm Vụ Chính Tuyến)
1. **Hồi 1 - Thiếu niên ngõ Nỏ:** Khởi đầu ở Lệ Châu Động Thiên, làm việc tại lò gốm, chứng kiến Tề Tĩnh Xuân lấy thân tuẫn đạo cứu dân.
2. **Hồi 2 - Lần đầu tiên đi xa:** Hộ tống Lý Bảo Bình vượt ngàn dặm đến Sơn Nhai Thư Viện ở Bảo Bình Châu.
3. **Hồi 3 - Tặng kiếm Bắc Câu Lô Châu:** Du lịch rèn kiếm, nâng cấp Bản Mạng Phi Kiếm và lĩnh ngộ quyền pháp.
4. **Hồi 4 - Kiếm Khí Trường Thành:** Đến biên giới đẫm máu, gặp gỡ Ninh Diêu, khắc tên lên tường thành và nhận chức Ẩn Quan.
5. **Hồi 5 - Đại chiến bùng nổ:** Tử thủ Kiếm Khí Trường Thành chống lại đại quân Yêu tộc Man Hoang.
6. **Hồi 6 - Văn Miếu nghị sự:** Lễ Thánh triệu tập chư tử bách gia, tái hiện câu nói kinh điển của Trần Bình An: *"Vậy thì đánh!"*.
7. **Hồi 7 - Dũng cảm tiến vào Man Hoang:** Viễn chinh phản công sang đại lục của Yêu tộc.
8. **Hồi 8 - Thành lập Thượng Hạ Tông:** Xây dựng Lạc Phách Sơn thành thế lực đỉnh cao của Hạo Nhiên Thiên Hạ.
9. **Hồi 9 - Thiên hạ va chạm:** Đại chiến đa thế giới định đoạt vận mệnh Tam Giáo Bách Gia.