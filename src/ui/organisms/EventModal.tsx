import type { EventDef } from '@/content/events'
import { type EventResolution, type GameState, isChoiceAvailable } from '@/engine'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

interface EventModalProps {
  event: EventDef | null
  result: EventResolution | null
  state: GameState
  onChoose: (choiceId: string) => void
  onDismissResult: () => void
}

/**
 * Two-phase dialog: the pending event with its choices, then the outcome text.
 * The outcome phase takes precedence so the player always reads what happened.
 */
export function EventModal({ event, result, state, onChoose, onDismissResult }: EventModalProps) {
  if (result) {
    return (
      <Modal
        open
        title={result.event.title}
        onClose={onDismissResult}
        footer={
          <Button variant="primary" onClick={onDismissResult} autoFocus>
            Tiếp tục
          </Button>
        }
      >
        <p className="leading-relaxed text-paper-100">{result.outcome.text}</p>
      </Modal>
    )
  }

  if (!event) return null

  return (
    <Modal open title={event.title} onClose={() => undefined}>
      <p className="leading-relaxed text-paper-200">{event.text}</p>
      <ul className="mt-4 space-y-2">
        {event.choices.map((c) => {
          const available = isChoiceAvailable(state, c)
          return (
            <li key={c.id}>
              <button
                type="button"
                disabled={!available}
                onClick={() => onChoose(c.id)}
                className="flex w-full min-h-11 flex-col items-start rounded-md border border-paper-400/20 bg-ink-900/60 px-4 py-2 text-left transition-colors hover:border-gold-500/50 hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="font-han text-paper-100">{c.label}</span>
                {c.hint && <span className="text-xs text-paper-400">{c.hint}</span>}
                {!available && <span className="text-xs text-vermilion-400">Không đủ điều kiện</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}
