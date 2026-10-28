import { useState } from 'react'
import type { StoryScene } from '@/content/story'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

interface StoryModalProps {
  scene: StoryScene | null
  onResolve: (choiceId?: string) => void
}

export function StoryModal({ scene, onResolve }: StoryModalProps) {
  const [chosenText, setChosenText] = useState<string | null>(null)

  if (!scene) return null

  if (chosenText) {
    return (
      <Modal
        open
        title={scene.title}
        onClose={() => {
          setChosenText(null)
        }}
        footer={
          <Button
            variant="primary"
            onClick={() => {
              setChosenText(null)
            }}
            autoFocus
          >
            Tiếp tục hành trình
          </Button>
        }
      >
        <div className="rounded-lg border border-gold-500/30 bg-ink-900/90 p-4">
          <p className="font-han text-base leading-relaxed text-paper-100">{chosenText}</p>
        </div>
      </Modal>
    )
  }

  const hasChoices = scene.choices && scene.choices.length > 0

  return (
    <Modal
      open
      title={scene.title}
      maxWidth="max-w-xl"
      onClose={() => {
        if (!hasChoices) onResolve()
      }}
      footer={
        !hasChoices ? (
          <Button variant="primary" onClick={() => onResolve()} autoFocus>
            Lĩnh ngộ & Tiếp tục
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-3">
        {scene.blocks.map((b, i) => {
          if (!b.speaker) {
            return (
              <p
                key={i}
                className="rounded-md border border-paper-400/10 bg-ink-900/40 p-3 font-serif text-sm italic leading-relaxed text-paper-300"
              >
                {b.text}
              </p>
            )
          }

          const isMain = b.speaker.includes('Trần Bình An')
          return (
            <div
              key={i}
              className={`rounded-lg border p-3.5 ${
                isMain
                  ? 'border-jade-500/30 bg-jade-950/20 text-jade-200'
                  : 'border-gold-500/30 bg-ink-900/70 text-paper-100'
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="font-han text-xs font-bold uppercase tracking-wider text-gold-400">
                  {b.speaker}
                </span>
              </div>
              <p className="font-han text-sm leading-relaxed">{b.text}</p>
            </div>
          )
        })}

        {hasChoices && (
          <div className="mt-4 space-y-2 pt-2">
            <p className="font-han text-xs font-semibold uppercase tracking-wider text-gold-400">
              Lựa chọn của ngươi:
            </p>
            {scene.choices!.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onResolve(c.id)
                  setChosenText(c.outcomeText)
                }}
                className="flex w-full min-h-12 flex-col items-start rounded-md border border-paper-400/20 bg-ink-900/70 p-3 text-left transition-colors hover:border-gold-500 hover:bg-ink-700"
              >
                <span className="font-han text-sm font-medium text-paper-100">{c.text}</span>
                {c.rewardDescription && (
                  <span className="mt-1 text-xs text-jade-400">❖ {c.rewardDescription}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

