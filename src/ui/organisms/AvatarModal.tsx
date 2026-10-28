import { AVATARS, type AvatarDef } from '@/content/avatars'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

interface AvatarModalProps {
  open: boolean
  onClose: () => void
  currentAvatarId: string
  onSelectAvatar: (id: string) => void
}

export function AvatarModal({
  open,
  onClose,
  currentAvatarId,
  onSelectAvatar,
}: AvatarModalProps) {
  if (!open) return null

  return (
    <Modal
      open={open}
      title="Hoán Đổi Đạo Thân · Diện Mạo Kiếm Lai"
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <Button variant="primary" onClick={onClose}>
          Đóng
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-paper-300">
          Chọn một diện mạo nhân vật để hiển thị làm chân dung đại diện cho đạo thân của ngươi trên hành trình cầu đạo.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-h-[60vh] overflow-y-auto pr-1">
          {AVATARS.map((a: AvatarDef) => {
            const isSelected = a.id === currentAvatarId

            return (
              <div
                key={a.id}
                onClick={() => {
                  onSelectAvatar(a.id)
                  onClose()
                }}
                className={`group flex cursor-pointer gap-3 rounded-lg border p-3 transition-all duration-200 ${
                  isSelected
                    ? 'border-gold-500 bg-gold-500/10 shadow-lg ring-1 ring-gold-400'
                    : 'border-paper-400/15 bg-ink-900/60 hover:border-gold-500/50 hover:bg-ink-800/80'
                }`}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gold-500/40">
                  <img
                    src={a.image}
                    alt={a.name}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gold-500/20">
                      <span className="text-xs font-bold text-gold-300">✓</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-han text-sm font-bold text-paper-100 group-hover:text-gold-400">
                        {a.name}
                      </h4>
                      {isSelected ? (
                        <span className="rounded bg-gold-500/20 px-1.5 py-0.5 text-[10px] font-bold text-gold-400 border border-gold-500/40">
                          Đang Dùng
                        </span>
                      ) : (
                        <span className="text-[10px] text-paper-400">{a.origin}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gold-400/90 font-serif">
                      {a.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[10px] text-paper-400">
                      {a.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
