import type { GearSlot, GearType } from '@/content/gear'

interface SlotSilhouetteProps {
  slot: GearType | GearSlot
  className?: string
}

export function SlotSilhouette({ slot, className = 'h-8 w-8 opacity-30 text-paper-400' }: SlotSilhouetteProps) {
  const normSlot = slot.startsWith('nhan')
    ? 'nhan'
    : slot.startsWith('bong-tai')
    ? 'bong-tai'
    : slot

  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 1. VŨ KHÍ: Thanh Phong Thần Kiếm */}
      {normSlot === 'vu-khi' && (
        <g strokeWidth="2">
          {/* Lưỡi kiếm */}
          <path d="M12 36 L36 12 L38 8 L34 10 L10 34 Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M22 26 L12 36" />
          {/* Rãnh sống kiếm */}
          <line x1="16" y1="32" x2="35" y2="13" strokeWidth="1" strokeDasharray="2 1" />
          {/* Đốc kiếm & Bao tay */}
          <path d="M8 40 L12 36" strokeWidth="3" />
          <line x1="7" y1="35" x2="13" y2="41" strokeWidth="2.5" />
          {/* Kiếm tuệ (Tua kiếm bay nhẹ) */}
          <path d="M7 41 Q5 44 9 46 Q10 44 8 40" strokeWidth="1.2" />
        </g>
      )}

      {/* 2. ĐẦU: Đạo Quán & Ngọc Trâm */}
      {normSlot === 'dau' && (
        <g strokeWidth="1.8">
          {/* Mũ đạo quán */}
          <path d="M14 36 C14 26 18 16 24 12 C30 16 34 26 34 36 Z" fill="currentColor" fillOpacity="0.15" />
          <path d="M11 36 H37" strokeWidth="2.5" />
          <path d="M17 26 Q24 22 31 26" strokeWidth="1.2" />
          {/* Đỉnh ngọc chỏm tóc */}
          <circle cx="24" cy="11" r="3" fill="currentColor" fillOpacity="0.3" />
          {/* Cây trâm cài ngang */}
          <line x1="8" y1="20" x2="40" y2="20" strokeWidth="2" />
          <circle cx="9" cy="20" r="1.5" fill="currentColor" />
        </g>
      )}

      {/* 3. ÁO: Đạo Bào Kiếm Hiệp Vạt Bay */}
      {normSlot === 'ao' && (
        <g strokeWidth="1.8">
          {/* Cổ áo giao lĩnh chéo chữ V */}
          <path d="M18 10 L24 22 L30 10" />
          <path d="M14 10 L24 24" strokeWidth="1.2" />
          {/* Thân áo & Vạt áo bay */}
          <path
            d="M14 10 L8 22 L14 24 L12 38 H36 L34 24 L40 22 L34 10 Z"
            fill="currentColor"
            fillOpacity="0.12"
          />
          {/* Hộ tâm kính trước ngực */}
          <circle cx="24" cy="28" r="4" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
          <line x1="12" y1="38" x2="16" y2="38" strokeWidth="2.5" />
          <line x1="32" y1="38" x2="36" y2="38" strokeWidth="2.5" />
        </g>
      )}

      {/* 4. ĐAI LƯNG: Đai Thắt Ngọc Cổ Phong */}
      {normSlot === 'dai-lung' && (
        <g strokeWidth="2">
          {/* Bản thắt lưng ngang */}
          <rect x="8" y="20" width="32" height="8" rx="2" fill="currentColor" fillOpacity="0.15" />
          {/* Khóa ngọc giữa */}
          <rect x="20" y="18" width="8" height="12" rx="2" fill="currentColor" fillOpacity="0.3" />
          <circle cx="24" cy="24" r="2" fill="currentColor" />
          {/* Dải lụa buông rủ 2 bên */}
          <path d="M22 30 V42 L24 40 L26 42 V30" strokeWidth="1.5" />
          <line x1="12" y1="24" x2="18" y2="24" strokeWidth="1" strokeDasharray="1 1" />
          <line x1="30" y1="24" x2="36" y2="24" strokeWidth="1" strokeDasharray="1 1" />
        </g>
      )}

      {/* 5. QUẦN: Khố Giáp / Quần Dũng Sĩ */}
      {normSlot === 'quan' && (
        <g strokeWidth="1.8">
          {/* Cạp quần */}
          <path d="M12 12 H36 V16 H12 Z" fill="currentColor" fillOpacity="0.2" />
          {/* 2 ống quần xắn gấu */}
          <path
            d="M12 16 L10 38 H19 L24 25 L29 38 H38 L36 16 Z"
            fill="currentColor"
            fillOpacity="0.1"
          />
          {/* Nẹp đùi gia cố */}
          <line x1="13" y1="24" x2="19" y2="24" strokeWidth="1.2" />
          <line x1="29" y1="24" x2="35" y2="24" strokeWidth="1.2" />
          <line x1="11" y1="35" x2="19" y2="35" strokeWidth="2" />
          <line x1="29" y1="35" x2="37" y2="35" strokeWidth="2" />
        </g>
      )}

      {/* 6. GIÀY: Chiến Hài Phong Vân */}
      {normSlot === 'giay' && (
        <g strokeWidth="1.8">
          {/* Chiếc hài trái */}
          <path
            d="M12 14 V26 C12 30 14 34 22 34 H25 V28 L18 28 V14 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          {/* Mũi hài uốn cong mây */}
          <path d="M22 34 Q26 34 27 30" strokeWidth="2" />
          {/* Hoa văn mây cuộn trên thân hài */}
          <path d="M14 20 Q17 18 17 22" strokeWidth="1.2" />
          <line x1="12" y1="14" x2="18" y2="14" strokeWidth="2.5" />
        </g>
      )}

      {/* 7. PHÙ LỤC: Bát Quái Chu Sa Phù */}
      {normSlot === 'phu-luc' && (
        <g strokeWidth="1.6">
          {/* Tấm giấy phù lượn sóng */}
          <path
            d="M14 8 H34 V38 C34 38 29 36 24 38 C19 36 14 38 14 38 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          {/* Thái cực bát quái nhỏ trên đầu phù */}
          <circle cx="24" cy="16" r="4.5" />
          <path d="M24 11.5 A2.25 2.25 0 0 1 24 16 A2.25 2.25 0 0 0 24 20.5" strokeWidth="1" />
          {/* Chu sa phù văn ngoằn ngoèo */}
          <path d="M24 22 V28 M20 25 H28 M21 31 Q24 29 27 31 M24 31 V35" strokeWidth="1.5" />
        </g>
      )}

      {/* 8. DÂY CHUYỀN: Hạng Liên Khóa Trường Mệnh */}
      {normSlot === 'day-chuyen' && (
        <g strokeWidth="1.8">
          {/* Vòng chuỗi hạt cong hình chữ U */}
          <path d="M12 10 C12 24 36 24 36 10" strokeDasharray="3 3" />
          {/* Khóa trường mệnh ngọc bội rủ giữa */}
          <path d="M20 22 H28 L27 28 H21 Z" fill="currentColor" fillOpacity="0.25" />
          <circle cx="24" cy="25" r="1.5" fill="currentColor" />
          {/* Giọt ngọc rủ */}
          <path d="M24 28 V34" strokeWidth="1.5" />
          <circle cx="24" cy="36" r="2.5" fill="currentColor" fillOpacity="0.4" />
        </g>
      )}

      {/* 9. NHẪN: Giới Chỉ Linh Tê */}
      {normSlot === 'nhan' && (
        <g strokeWidth="1.8">
          {/* Vành nhẫn góc nghiêng isometric */}
          <ellipse cx="24" cy="26" rx="14" ry="7" fill="currentColor" fillOpacity="0.1" />
          <ellipse cx="24" cy="22" rx="14" ry="7" />
          {/* Mặt nhẫn đính bảo ngọc */}
          <polygon points="24,12 30,17 24,22 18,17" fill="currentColor" fillOpacity="0.35" />
          <circle cx="24" cy="17" r="2" fill="currentColor" />
          {/* Tia sáng ngọc */}
          <line x1="24" y1="8" x2="24" y2="10" strokeWidth="1.5" />
          <line x1="32" y1="13" x2="34" y2="11" strokeWidth="1.5" />
          <line x1="16" y1="13" x2="14" y2="11" strokeWidth="1.5" />
        </g>
      )}

      {/* 10. BÔNG TAI: Nhĩ Hoàn Giọt Nước */}
      {normSlot === 'bong-tai' && (
        <g strokeWidth="1.8">
          {/* Khuyên tai móc xỏ */}
          <path d="M20 10 C20 7 26 7 26 12 L24 18" />
          {/* Viên ngọc giọt nước rủ xuống */}
          <path
            d="M24 20 C21 24 17 28 17 32 C17 36 20 39 24 39 C28 39 31 36 31 32 C31 28 27 24 24 20 Z"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <circle cx="24" cy="32" r="2" fill="currentColor" />
        </g>
      )}
    </svg>
  )
}

