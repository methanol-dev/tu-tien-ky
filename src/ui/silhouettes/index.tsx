import type { ReactElement, SVGProps } from 'react'
import type { SilhouetteId } from '@/content/regions'

/**
 * Ink silhouettes. Every figure lives in a 100x100 box, feet on y=100, facing +x
 * (enemies are flipped by the stage). Fill is `currentColor` so the palette decides the ink.
 */
type Props = SVGProps<SVGSVGElement>

function Frame({ children, ...rest }: Props) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" fill="currentColor" aria-hidden {...rest}>
      {children}
    </svg>
  )
}

/** The cultivator: robe, topknot, sword held forward. */
export function HeroSilhouette(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="46" cy="16" r="9" />
      <path d="M44 6 l3 -6 l4 5 z" />
      <path d="M38 24 h16 l6 14 l-3 2 l-2 -6 l4 46 h-6 l-4 -24 l-4 24 h-6 l2 -42 l-3 7 l-4 -2 z" />
      <path d="M57 36 l30 -14 l2 3 l-29 16 z" />
      <path d="M86 20 l6 -4 l2 2 l-5 5 z" />
      <path d="M30 60 q-6 18 -2 40 h5 q-2 -20 3 -36 z" opacity="0.9" />
    </Frame>
  )
}

function Wolf(props: Props) {
  return (
    <Frame {...props}>
      <path d="M8 60 q10 -22 40 -20 l20 -4 l14 -10 l2 8 l6 2 l-6 8 l-10 4 l-6 10 q10 10 6 42 h-7 q1 -22 -6 -28 l-10 3 l-2 25 h-7 l-1 -26 l-12 -2 l-3 28 h-7 l-1 -30 q-10 -4 -10 -10 z" />
    </Frame>
  )
}

function Bear(props: Props) {
  return (
    <Frame {...props}>
      <path d="M10 100 v-40 q0 -30 30 -36 l12 -10 l8 4 l10 -4 l10 10 q12 6 14 20 l-4 10 l4 46 h-14 l-4 -30 l-10 2 l-2 28 h-14 l-2 -28 l-10 -2 l-2 30 z" />
    </Frame>
  )
}

function Bat(props: Props) {
  return (
    <Frame {...props}>
      <path d="M50 44 q-4 -12 -14 -12 q-16 -2 -34 10 q12 8 20 22 q6 -8 14 -4 q6 4 8 14 q2 -10 8 -14 q8 -4 14 4 q8 -14 20 -22 q-18 -12 -34 -10 q-10 0 -14 12 z" />
      <path d="M46 28 l2 -8 l2 8 M52 28 l2 -8 l2 8" strokeWidth="3" stroke="currentColor" />
    </Frame>
  )
}

function Snake(props: Props) {
  return (
    <Frame {...props}>
      <path d="M6 96 q10 -16 30 -10 q22 8 30 -6 q10 -16 -4 -26 q-10 -6 -20 2 q-6 6 2 12 q10 6 16 -4 l4 4 q-6 14 -22 8 q-14 -8 -8 -22 q8 -16 28 -10 q24 10 14 38 q-8 18 -32 14 q-18 -4 -30 4 z" />
      <path d="M66 50 l12 -4 l-2 6 l6 4 l-14 2 z" />
    </Frame>
  )
}

function Cultist(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="16" r="9" />
      <path d="M36 26 h28 l10 18 l-6 2 l-6 -8 l6 62 h-36 l6 -62 l-6 8 l-6 -2 z" />
      <path d="M70 40 l18 -26 l3 2 l-17 28 z" />
      <path d="M26 44 q-14 6 -16 20 l4 2 q4 -12 14 -16 z" />
    </Frame>
  )
}

function Skeleton(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="14" r="9" />
      <path d="M46 24 h8 v10 h-8 z" />
      <path d="M38 34 h24 l2 24 h-6 l-1 -14 h-14 l-1 14 h-6 z" />
      <path d="M40 40 h20 v3 h-20 z M41 46 h18 v3 h-18 z M42 52 h16 v3 h-16 z" opacity="0.8" />
      <path d="M62 36 l22 -14 l3 3 l-21 18 z M38 36 l-12 14 l3 3 l12 -12 z" />
      <path d="M44 58 l-6 42 h6 l6 -34 l6 34 h6 l-6 -42 z" />
      <path d="M80 10 l6 -2 l-4 10 z" />
    </Frame>
  )
}

function SkeletonLord(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="16" r="11" />
      <path d="M38 6 l4 -6 l8 6 l8 -6 l4 6 z" />
      <path d="M34 30 h32 l4 26 h-8 l-2 -16 h-20 l-2 16 h-8 z" />
      <path d="M66 32 l26 -20 l3 3 l-25 24 z M34 32 l-14 16 l3 3 l14 -14 z" />
      <path d="M40 56 l-8 44 h8 l8 -36 l8 36 h8 l-8 -44 z" />
      <path d="M90 0 l8 4 l-6 14 l-4 -4 z" />
    </Frame>
  )
}

function Yeti(props: Props) {
  return (
    <Frame {...props}>
      <path d="M50 4 q22 0 24 22 l6 10 q6 24 -4 40 l2 24 h-12 l-2 -20 l-10 2 l-6 18 h-12 l-2 -22 q-12 -14 -6 -40 l6 -12 q2 -22 16 -22 z" />
      <path d="M22 44 q-14 0 -18 14 l6 2 q4 -10 14 -10 z M78 44 q14 0 18 14 l-6 2 q-4 -10 -14 -10 z" />
    </Frame>
  )
}

function Serpent(props: Props) {
  return (
    <Frame {...props}>
      <path d="M4 100 q6 -24 28 -30 q24 -4 36 -20 q12 -18 -4 -30 q-14 -8 -26 2 q-8 8 0 16 q8 6 16 -2 l4 6 q-10 12 -26 4 q-14 -10 -6 -26 q10 -18 32 -12 q26 10 20 40 q-6 24 -34 30 q-20 4 -28 22 z" />
      <path d="M56 46 l18 -8 l-2 10 l10 6 l-22 2 z" />
      <path d="M30 36 l6 -14 l4 10 z M44 30 l6 -14 l4 10 z" opacity="0.8" />
    </Frame>
  )
}

function Lizard(props: Props) {
  return (
    <Frame {...props}>
      <path d="M4 90 q8 -8 26 -8 l10 -16 q6 -10 20 -10 l14 -2 l16 -10 l2 8 l8 4 l-8 6 l-14 4 l-6 12 q6 8 4 22 h-8 q0 -12 -6 -16 l-12 2 l-2 14 h-8 l0 -16 l-10 0 l-4 10 h-8 l2 -14 q-10 2 -16 10 z" />
      <path d="M46 48 l4 -14 l4 12 M58 46 l4 -12 l4 10" opacity="0.9" />
    </Frame>
  )
}

function Dragonling(props: Props) {
  return (
    <Frame {...props}>
      <path d="M2 94 q10 -14 30 -16 l8 -16 q4 -12 20 -14 l14 -4 l10 -14 l6 2 l0 10 l8 4 l-10 8 l-14 6 l-4 14 q10 8 8 26 h-8 q0 -14 -8 -18 l-12 4 l-2 14 h-8 l2 -16 l-12 2 l-4 12 h-8 l2 -14 q-12 2 -18 10 z" />
      <path d="M40 60 q-16 -36 10 -52 q-12 20 2 44 z" opacity="0.85" />
      <path d="M62 40 l4 -14 l4 12 M72 36 l4 -12 l4 10" />
    </Frame>
  )
}

function Demon(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="18" r="10" />
      <path d="M40 10 l-8 -10 l2 12 z M60 10 l8 -10 l-2 12 z" />
      <path d="M34 28 h32 l8 20 l-6 2 l-6 -10 l6 60 h-14 l-4 -36 l-4 36 h-14 l6 -60 l-6 10 l-6 -2 z" />
      <path d="M74 44 l18 -8 l2 4 l-18 10 z" />
      <path d="M90 30 l8 6 l-4 14 l-6 -8 z" />
    </Frame>
  )
}

function DemonGeneral(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="18" r="11" />
      <path d="M38 8 l-12 -8 l4 14 z M62 8 l12 -8 l-4 14 z" />
      <path d="M30 30 h40 l10 22 l-6 3 l-8 -12 l6 57 h-16 l-4 -34 l-4 34 h-16 l6 -57 l-8 12 l-6 -3 z" />
      <path d="M78 40 l20 -16 l3 3 l-19 20 z M22 40 l-18 -2 l0 4 l16 4 z" />
      <path d="M96 20 l4 10 l-8 10 l-2 -10 z" />
      <path d="M50 44 l-6 10 h12 z" opacity="0.6" />
    </Frame>
  )
}

export const ENEMY_SILHOUETTES: Record<SilhouetteId, (p: Props) => ReactElement> = {
  wolf: Wolf,
  bear: Bear,
  bat: Bat,
  snake: Snake,
  cultist: Cultist,
  skeleton: Skeleton,
  'skeleton-lord': SkeletonLord,
  yeti: Yeti,
  serpent: Serpent,
  lizard: Lizard,
  dragonling: Dragonling,
  demon: Demon,
  'demon-general': DemonGeneral,
}

export function EnemySilhouette({ id, ...rest }: Props & { id: SilhouetteId }) {
  const Comp = ENEMY_SILHOUETTES[id] ?? Wolf
  return <Comp {...rest} />
}
