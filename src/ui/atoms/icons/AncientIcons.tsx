import type { FC, SVGProps } from 'react'
import type { ClassId } from '@/content/classes'
import type { Screen } from '@/store/gameStore'

export type IconProps = SVGProps<SVGSVGElement> & {
  className?: string
  size?: number | string
}

// ============================================================================
// 1. NHÓM ĐIỀU HƯỚNG CHÍNH (NAVBAR TABS)
// ============================================================================

/** Động Phủ: Lầu gác cổ phong phi diêm lợp ngói uốn cong, bậc thềm đá */
export const IconPavilion: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    {/* Đỉnh chóp hồ lô tụ linh */}
    <path d="M12 2v2" />
    <circle cx="12" cy="3" r="0.8" fill="currentColor" />
    {/* Mái cong tầng thượng */}
    <path d="M4.5 8c2.2-1.2 5-1.8 7.5-1.8s5.3.6 7.5 1.8c-1.5-1.8-4.2-3-7.5-3s-6 1.2-7.5 3z" />
    {/* Cột tầng trên */}
    <line x1="9" y1="8" x2="9" y2="10.5" />
    <line x1="15" y1="8" x2="15" y2="10.5" />
    {/* Mái hiên tầng hạ cong vút phong cách thủy mặc */}
    <path d="M2 13.5c3-1.8 6.5-2.5 10-2.5s7 .7 10 2.5c-2-2-6-3.5-10-3.5s-8 1.5-10 3.5z" />
    {/* 4 Cột đình hiên */}
    <line x1="5.5" y1="13.5" x2="5.5" y2="20" />
    <line x1="9.5" y1="13.5" x2="9.5" y2="20" />
    <line x1="14.5" y1="13.5" x2="14.5" y2="20" />
    <line x1="18.5" y1="13.5" x2="18.5" y2="20" />
    {/* Bậc thềm đá động phủ */}
    <path d="M3.5 20h17" />
    <path d="M2 22h20" strokeWidth="1.4" />
  </svg>
)

/** Công Pháp: Cuốn trúc giản kinh thư cổ phong mở ra mang phù văn bí tịch */
export const IconScroll: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    {/* Trục cuốn kinh thư bên tả */}
    <rect x="2.5" y="4" width="3.5" height="16" rx="1.5" />
    {/* Thân trang sách thư tịch mở ra */}
    <path d="M6 6c2.5-1.4 5.5-1.4 8 0s5.5 1.4 7.5 0v12c-2 1.4-5 1.4-7.5 0s-5.5-1.4-8 0" />
    {/* Trục cuốn bên hữu cuộn lại */}
    <path d="M21.5 6v12a1.5 1.5 0 0 1-3 0V6a1.5 1.5 0 0 1 3 0z" />
    {/* Các dòng phù văn kiếm pháp */}
    <line x1="9" y1="9" x2="15" y2="9" strokeWidth="1.3" />
    <line x1="9" y1="12" x2="15.5" y2="12" strokeWidth="1.3" />
    <line x1="9" y1="15" x2="13.5" y2="15" strokeWidth="1.3" />
    {/* Thẻ đánh dấu trang sách */}
    <path d="M12 3.5v2.5" strokeWidth="1.8" />
  </svg>
)

/** Túi Đồ: Túi Càn Khôn / Trữ Vật Đại thắt nút đồng tâm kết và ngọc bội */
export const IconQiankunBag: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    {/* Miệng túi xếp nếp bèo lụa */}
    <path d="M8 4.5c0 1.5 1.8 2.3 4 2.3s4-.8 4-2.3c-.8 1.8-3.2 1.8-4 1.8s-3.2 0-4-1.8z" />
    <path d="M8 4.5h8" />
    {/* Dây lụa buộc thắt cổ túi */}
    <path d="M6.5 7h11" strokeWidth="2.2" />
    {/* Thân bầu túi càn khôn phồng to chứa vạn dặm sơn hà */}
    <path d="M6.5 7.5c-3 3-3.2 8-1.7 11.5a4 4 0 0 0 3.7 2.5h7a4 4 0 0 0 3.7-2.5c1.5-3.5 1.3-8.5-1.7-11.5" />
    {/* Nút thắt đồng tâm kết & hạt ngọc */}
    <circle cx="12" cy="9" r="1.5" fill="currentColor" />
    <path d="M12 10.5v3.5" strokeWidth="1.5" />
    <path d="M10.5 14h3" strokeWidth="1.5" />
    {/* Hoa văn mây cuộn phù vân */}
    <path d="M10 16.5q2-1.5 4 0" strokeWidth="1.3" />
  </svg>
)

/** Luyện Đan: Đan Lô 3 chân cổ kính với làn khói tiên xoắn lượn bốc lên */
export const IconCauldron: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    {/* Khói thơm đan dược bốc lên từ nắp lò */}
    <path d="M10 4q1-2 2-2t2 2" strokeDasharray="1.5 1.5" strokeWidth="1.3" />
    <path d="M12 2.5c1 1.5 0 2.5 0 3.5" strokeWidth="1.3" />
    {/* Nắp đan đỉnh */}
    <path d="M8 8c0-1.6 1.8-2.5 4-2.5s4 .9 4 2.5" />
    <circle cx="12" cy="5.5" r="0.8" fill="currentColor" />
    {/* Vành miệng đỉnh */}
    <rect x="6" y="8" width="12" height="2" rx="1" />
    {/* Hai quai đỉnh hình rồng uốn lượn */}
    <path d="M6 9H4a1 1 0 0 0-1 1v1.5a1 1 0 0 0 1 1h2" />
    <path d="M18 9h2a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1h-2" />
    {/* Bụng đỉnh đan bầu tròn vững chãi */}
    <path d="M6 10c0 4.8 2.7 7.5 6 7.5s6-2.7 6-7.5" />
    {/* 3 Chân đỉnh thế chân vạc */}
    <path d="M7 17.2l-1.5 4" />
    <path d="M12 17.5v3.7" />
    <path d="M17 17.2l1.5 4" />
    {/* Lửa đan tâm */}
    <circle cx="12" cy="13" r="1.3" fill="currentColor" />
  </svg>
)

/** Hành Tẩu: Song kiếm giao thoa sắc bén mang kiếm ý xé gió */
export const IconCrossSwords: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    {/* Kiếm thứ nhất: hướng từ dưới trái lên trên phải */}
    <path d="M4.5 19.5l3.5-3.5" />
    <path d="M8 16L18 6l2-2-2 2-10 10" />
    <path d="M7 14.5l2.5 2.5" strokeWidth="2" />
    <circle cx="3.5" cy="20.5" r="1" fill="currentColor" />
    {/* Kiếm thứ hai: hướng từ dưới phải lên trên trái */}
    <path d="M19.5 19.5l-3.5-3.5" />
    <path d="M16 16L6 6 4 4l2 2 10 10" />
    <path d="M17 14.5l-2.5 2.5" strokeWidth="2" />
    <circle cx="20.5" cy="20.5" r="1" fill="currentColor" />
    {/* Điểm chạm kiếm khí chém đứt không gian */}
    <path d="M12 9v-2M12 17v-2M9 12H7M17 12h-2" strokeWidth="1.2" opacity="0.6" />
  </svg>
)

/** Luân Hồi: Vòng Thái Cực Luân Chuyển Bát Quái vần xoay bất tận */
export const IconSamsaraWheel: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    {/* Vòng luân hồi chu thiên */}
    <circle cx="12" cy="12" r="9" />
    {/* 4 Trục âm dương đông tây nam bắc */}
    <path d="M12 3v2.5M12 18.5v2.5M3 12h2.5M18.5 12h2.5" strokeWidth="1.8" />
    {/* Vệt âm dương thái cực ở tâm */}
    <path d="M12 7.5a4.5 4.5 0 0 0 0 9c2.5 0 2.25-2.25 0-4.5s-2.5-4.5 0-4.5z" strokeWidth="1.4" />
    <circle cx="12" cy="9.75" r="0.8" fill="currentColor" />
    <circle cx="12" cy="14.25" r="0.8" fill="currentColor" />
  </svg>
)

/** Cài Đặt: Thiên Cơ Bàn Bát Quái xoay vần */
export const IconDivination: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    {/* Khung Bát Quái 8 cạnh cân đối */}
    <polygon points="8,2.5 16,2.5 21.5,8 21.5,16 16,21.5 8,21.5 2.5,16 2.5,8" />
    {/* Thiên cơ hoàn ở trung tâm */}
    <circle cx="12" cy="12" r="4.2" strokeWidth="1.4" />
    {/* Kim chỉ nam thiên cơ hình thoi */}
    <polygon points="12,8.5 13.5,12 12,11 10.5,12" fill="currentColor" />
    <polygon points="12,15.5 13.5,12 12,13 10.5,12" fill="none" />
    {/* 4 Khắc thiên cơ độ số */}
    <line x1="12" y1="4.5" x2="12" y2="6" strokeWidth="1.6" />
    <line x1="12" y1="18" x2="12" y2="19.5" strokeWidth="1.6" />
    <line x1="4.5" y1="12" x2="6" y2="12" strokeWidth="1.6" />
    <line x1="18" y1="12" x2="19.5" y2="12" strokeWidth="1.6" />
  </svg>
)

// ============================================================================
// 2. NHÓM HEADER & ĐẠO THÂN
// ============================================================================

/** Phi Kiếm Bản Mệnh (Kiếm Thai Button) */
export const IconFlyingSword: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    {/* Thân kiếm thanh thoát chém vút lên cao */}
    <path d="M19.5 4.5L10 14" strokeWidth="2.2" />
    <path d="M18.5 3.5l2 2-9 9-2-2 9-9z" fill="currentColor" fillOpacity="0.15" />
    {/* Tai kiếm / Hộ thủ ngang */}
    <path d="M8 12.5l3.5 3.5" strokeWidth="2.2" />
    {/* Chuôi kiếm & Đốc kiếm đính ngọc */}
    <path d="M8.5 15.5L5 19" strokeWidth="2.2" />
    <circle cx="4" cy="20" r="1.2" fill="currentColor" />
    {/* Dải tua kiếm tung bay */}
    <path d="M3.5 21.5c-1 1.5.5 2.5 0 3.5" strokeWidth="1.2" opacity="0.7" />
    {/* Vệt kiếm khí xé gió hình cánh cung */}
    <path d="M14 3q4 1 6 5" strokeDasharray="1.5 1.5" strokeWidth="1.3" opacity="0.6" />
  </svg>
)

/** Đạo Thân Tiên Thể (Chỉ Số Button) */
export const IconDaoistBody: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    {/* Vầng hào quang tụ linh sau gáy */}
    <path d="M8 8a4 4 0 1 1 8 0" strokeDasharray="1.8 1.8" strokeWidth="1.2" opacity="0.5" />
    {/* Đầu & búi tóc đạo sĩ cài trâm */}
    <circle cx="12" cy="7" r="2.5" />
    <path d="M11 4.5h2" strokeWidth="2" />
    {/* Thân áo đạo bào phong trần */}
    <path d="M9.5 10.5L7 16h10l-2.5-5.5" />
    {/* Hai tay kết ấn trước ngực */}
    <path d="M10 13.5h4" strokeWidth="1.8" />
    {/* Thế tọa thiền xếp bằng kiết già */}
    <path d="M4 19.5c1.5-1.5 4-2 8-2s6.5.5 8 2c-2 1.5-5.5 2-8 2s-6-.5-8-2z" />
  </svg>
)

// ============================================================================
// 3. NHÓM 10 ĐẠO THỐNG (CLASS FACTION BADGES)
// ============================================================================

/** Kiếm Tu: Kiếm quyết chỉ thiên chém rách hư không */
export const IconClassKiemTu: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M12 2v14" strokeWidth="2.2" />
    <path d="M10 4l2-2 2 2" strokeWidth="2" />
    <path d="M8 14h8" strokeWidth="2.2" />
    <path d="M12 16v4" strokeWidth="2" />
    <circle cx="12" cy="21" r="1" fill="currentColor" />
    <path d="M7 8q5-3 10 0" strokeDasharray="1.5 1.5" strokeWidth="1.2" opacity="0.7" />
  </svg>
)

/** Võ Phu: Thiết quyền quyền ý phá toái sơn hà */
export const IconClassVoPhu: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M7 11V7a2 2 0 0 1 4 0v4" />
    <path d="M11 7a2 2 0 0 1 4 0v4" />
    <path d="M15 8a2 2 0 0 1 4 0v5a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-3a2 2 0 0 1 4 0v1" />
    <path d="M12 17v4" strokeWidth="2" />
  </svg>
)

/** Đạo Gia: Bát quái thái cực thần phù */
export const IconClassDaoGia: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 0 0 18c2.5 0 2.25-2.25 0-4.5s-2.5-4.5 0-4.5 0-4.5 0-9z" />
    <circle cx="12" cy="7.5" r="1" fill="currentColor" />
    <circle cx="12" cy="16.5" r="1" fill="currentColor" />
  </svg>
)

/** Nho Sĩ: Bút lông hạo nhiên chi khí & nghiên mực */
export const IconClassNhoGia: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M18 3l3 3-9 9-4 1 1-4 9-9z" />
    <path d="M15 6l3 3" />
    <path d="M8 16l-4 4h6l2-2" />
    <circle cx="4.5" cy="19.5" r="1.5" fill="currentColor" />
  </svg>
)

/** Phật Môn: Tràng hạt bồ đề & thiền trượng kim cương */
export const IconClassPhatGia: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <circle cx="12" cy="12" r="8" strokeDasharray="3 3" strokeWidth="2.2" />
    <path d="M12 7v10" strokeWidth="2" />
    <path d="M9 10h6" strokeWidth="2" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

/** Mặc Gia: Cơ quan bánh răng khôi lỗi cổ đại */
export const IconClassMacGia: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" strokeWidth="2" />
  </svg>
)

/** Binh Gia: Chiến kỳ xung trận nhuộm máu */
export const IconClassBinhGia: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M5 21V3" strokeWidth="2.2" />
    <path d="M5 4l14 5-14 5V4z" fill="currentColor" fillOpacity="0.2" />
    <line x1="2" y1="21" x2="8" y2="21" strokeWidth="2" />
  </svg>
)

/** Âm Dương: Bát quái la bàn & tinh tú chiêm tinh */
export const IconClassAmDuong: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.3" />
    <path d="M8 8l2 2M14 14l2 2M8 16l2-2M14 10l2-2" strokeWidth="1.2" opacity="0.6" />
  </svg>
)

/** Dược Gia: Linh chi tiên thảo & dược lô */
export const IconClassDuocGia: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M12 21V9" strokeWidth="2" />
    <path d="M12 13c-4-1-6-4.5-6-8 3.5 0 7 2 6 8z" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 11c4-1 6-4.5 6-8-3.5 0-7 2-6 8z" fill="currentColor" fillOpacity="0.2" />
  </svg>
)

/** Thương Gia: Kim nguyên bảo / Thỏi vàng đĩnh cổ phong */
export const IconClassThuongGia: FC<IconProps> = ({ className = 'h-4 w-4', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <ellipse cx="12" cy="10" rx="7" ry="3.5" />
    <path d="M5 10c0 4.5 3 8 7 8s7-3.5 7-8" />
    <circle cx="12" cy="10" r="2" fill="currentColor" fillOpacity="0.4" />
    <line x1="8" y1="18" x2="16" y2="18" strokeWidth="1.5" />
  </svg>
)

// ============================================================================
// 4. MAPPER CHO SCREEN VÀ CLASS
// ============================================================================

export const SCREEN_ICONS: Record<Screen, FC<IconProps>> = {
  cultivate: IconPavilion,
  techniques: IconScroll,
  inventory: IconQiankunBag,
  alchemy: IconCauldron,
  journey: IconCrossSwords,
  legacy: IconSamsaraWheel,
  settings: IconDivination,
}

export const CLASS_ICONS: Record<ClassId, FC<IconProps>> = {
  'kiem-tu': IconClassKiemTu,
  'vo-phu': IconClassVoPhu,
  'dao-gia': IconClassDaoGia,
  'nho-gia': IconClassNhoGia,
  'phat-gia': IconClassPhatGia,
  'mac-gia': IconClassMacGia,
  'binh-gia': IconClassBinhGia,
  'am-duong-gia': IconClassAmDuong,
  'duoc-gia': IconClassDuocGia,
  'thuong-gia': IconClassThuongGia,
}

// ============================================================================
// 5. NHÓM PHI KIẾM BẢN MỆNH (NATAL SWORDS)
// ============================================================================

/** Sơ Thập: Phi kiếm hoàng kim sấm sét bôn lôi */
export const IconSwordSoThap: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M13 2L3 14h8l-2 8 12-12h-8l2-8z" fill="currentColor" fillOpacity="0.2" />
  </svg>
)

/** Thập Ngũ: Trọng kiếm huyền thiết nặng tựa thái sơn */
export const IconSwordThapNgu: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M12 2v14" strokeWidth="3" />
    <path d="M9 5l3-3 3 3" strokeWidth="2.5" />
    <path d="M7 16h10" strokeWidth="3" />
    <path d="M12 16v5" strokeWidth="2.5" />
    <rect x="10" y="21" width="4" height="2" rx="1" fill="currentColor" />
  </svg>
)

/** Tỉnh Để: Không gian cấm chế tọa tỉnh quan thiên */
export const IconSwordTinhDe: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <circle cx="12" cy="12" r="8" strokeDasharray="3 2" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeWidth="2" />
  </svg>
)

/** Mạch Thượng: Liễu kiếm hoa xuân tràn đầy sinh mệnh */
export const IconSwordMachThuong: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M12 22V2" strokeWidth="2" />
    <path d="M12 6c3 0 6 3 6 6-3 0-6-3-6-6z" fill="currentColor" fillOpacity="0.25" />
    <path d="M12 12c-3 0-6 3-6 6 3 0 6-3 6-6z" fill="currentColor" fillOpacity="0.25" />
  </svg>
)

/** Ánh Tuyết: Hàn băng tinh thể tuyết hoa ngàn năm */
export const IconSwordAnhTuyet: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="3.3" y1="7" x2="20.7" y2="17" />
    <line x1="3.3" y1="17" x2="20.7" y2="7" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

/** Huyền Hoàng Trảm Tiên: Thượng cổ tuyệt thế kiếm đồ sát tiên ma */
export const IconSwordHuyenHoang: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M12 2l2 4v10l-2 2-2-2V6l2-4z" fill="currentColor" fillOpacity="0.3" strokeWidth="2" />
    <path d="M6 16h12" strokeWidth="2.5" />
    <path d="M12 18v4" strokeWidth="2.5" />
    <circle cx="12" cy="22" r="1.5" fill="currentColor" />
    <path d="M4 10l3 3M20 10l-3 3" strokeWidth="1.5" opacity="0.7" />
  </svg>
)

export const SWORD_ICONS: Record<string, FC<IconProps>> = {
  'so-thap': IconSwordSoThap,
  'thap-ngu': IconSwordThapNgu,
  'tinh-de': IconSwordTinhDe,
  'mach-thuong': IconSwordMachThuong,
  'anh-tuyet': IconSwordAnhTuyet,
  'huyen-hoang-tram-tien': IconSwordHuyenHoang,
}

// ============================================================================
// 6. NHÓM 6 TÒA THIÊN HẠ (WORLDS)
// ============================================================================

/** Hạo Nhiên: Sơn hà tú lệ cửu châu */
export const IconWorldHaoNhien: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M3 19l6-10 4 6 3-4 5 8H3z" fill="currentColor" fillOpacity="0.15" />
    <circle cx="17" cy="6" r="2" fill="currentColor" />
  </svg>
)

/** Kiếm Khí Trường Thành: Biên ải chiến lũy ngạo cốt cắm kiếm */
export const IconWorldKiemKhi: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M2 19V9l3-2 3 2 3-2 3 2 3-2 3 2 2-2v12H2z" fill="currentColor" fillOpacity="0.15" />
    <line x1="12" y1="4" x2="12" y2="12" strokeWidth="2" />
    <line x1="10" y1="7" x2="14" y2="7" strokeWidth="2" />
  </svg>
)

/** Man Hoang: Vuốt thú nanh yêu vương tọa */
export const IconWorldManHoang: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M4 14c2-6 6-9 8-9s6 3 8 9" strokeWidth="2" />
    <path d="M7 14l5-6 5 6" fill="currentColor" fillOpacity="0.2" />
    <path d="M3 19q9-2 18 0" strokeWidth="2" />
  </svg>
)

/** Ngũ Thải: Cầu vồng ngũ sắc kiếm các */
export const IconWorldNguThai: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M4 18a8 8 0 0 1 16 0" strokeWidth="2.5" />
    <path d="M7 18a5 5 0 0 1 10 0" strokeWidth="2" />
    <path d="M10 18a2 2 0 0 1 4 0" strokeWidth="1.5" />
  </svg>
)

/** Thanh Minh: Bạch Ngọc Kinh trên chín tầng mây */
export const IconWorldThanhMinh: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M6 19a4 4 0 0 1-1-7.8 6 6 0 0 1 11.5-2A5 5 0 0 1 20 15a4 4 0 0 1-3 4H6z" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 7V4M10 5h4" strokeWidth="1.5" />
  </svg>
)

/** Liên Hoa: Bồ đề hoa sen tu di sơn thanh tịnh */
export const IconWorldLienHoa: FC<IconProps> = ({ className = 'h-5 w-5', size, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} {...props}>
    <path d="M12 4c-2 4-2 8 0 12 2-4 2-8 0-12z" fill="currentColor" fillOpacity="0.3" strokeWidth="1.8" />
    <path d="M12 8c-3 3-5 6-4 8 2 0 4-1 4-3" />
    <path d="M12 8c3 3 5 6 4 8-2 0-4-1-4-3" />
    <path d="M3 19c5-1 13-1 18 0" strokeWidth="2" />
  </svg>
)

export const WORLD_ICONS: Record<string, FC<IconProps>> = {
  'hao-nhien': IconWorldHaoNhien,
  'kiem-khi': IconWorldKiemKhi,
  'man-hoang': IconWorldManHoang,
  'ngu-thai': IconWorldNguThai,
  'thanh-minh': IconWorldThanhMinh,
  'lien-hoa': IconWorldLienHoa,
}

