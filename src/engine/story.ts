import { CHAPTERS, type StoryChoice, type StoryScene } from '@/content/story'
import { pushLog } from './log'
import type { GameState } from './types'

export function isSceneSeen(state: GameState, sceneId: string): boolean {
  return Boolean(state.flags[`story:seen:${sceneId}`])
}

/** Returns all scenes that the player's realm qualifies for and hasn't read yet. */
export function getEligibleScenes(state: GameState): StoryScene[] {
  const eligible: StoryScene[] = []
  for (const chapter of CHAPTERS) {
    for (const scene of chapter.scenes) {
      if (state.realmIndex >= scene.minRealmIndex && !isSceneSeen(state, scene.id)) {
        eligible.push(scene)
      }
    }
  }
  return eligible
}

/** Get the next pending unread story scene, if any. */
export function getPendingStoryScene(state: GameState): StoryScene | null {
  const eligible = getEligibleScenes(state)
  return eligible[0] ?? null
}

export interface StoryResolution {
  scene: StoryScene
  choice?: StoryChoice
  text: string
}

export function resolveStoryScene(
  state: GameState,
  sceneId: string,
  choiceId?: string,
): { state: GameState; resolution: StoryResolution } {
  let targetScene: StoryScene | null = null
  for (const chapter of CHAPTERS) {
    for (const s of chapter.scenes) {
      if (s.id === sceneId) {
        targetScene = s
        break
      }
    }
    if (targetScene) break
  }

  if (!targetScene) {
    return {
      state,
      resolution: {
        scene: {
          id: sceneId,
          chapterId: '',
          title: 'Vô danh',
          minRealmIndex: 0,
          blocks: [],
        },
        text: 'Cảnh truyện không tồn tại.',
      },
    }
  }

  let choice: StoryChoice | undefined
  if (choiceId && targetScene.choices) {
    choice = targetScene.choices.find((c) => c.id === choiceId)
  }

  const nextFlags = {
    ...state.flags,
    [`story:seen:${sceneId}`]: true,
  }

  if (choice) {
    nextFlags[`story:choice:${choice.id}`] = true
    if (choice.npcId && choice.affinityDelta) {
      const cur = Number(state.flags[`story:aff:${choice.npcId}`] ?? 0)
      nextFlags[`story:aff:${choice.npcId}`] = Boolean(cur + choice.affinityDelta)
    }
  }

  const outcomeMessage = choice
    ? `${choice.text} ➔ ${choice.outcomeText}`
    : `Đã chứng kiến: ${targetScene.title}`

  const loggedState = pushLog(
    { ...state, flags: nextFlags },
    `[Cốt truyện Kiếm Lai] ${targetScene.title}: ${choice?.outcomeText ?? 'Một đoạn ký ức giang hồ được khắc ghi.'}`,
    'event',
  )

  return {
    state: loggedState,
    resolution: {
      scene: targetScene,
      choice,
      text: outcomeMessage,
    },
  }
}
