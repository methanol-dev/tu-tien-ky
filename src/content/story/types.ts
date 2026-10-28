export interface NpcDef {
  id: string
  name: string
  glyph: string
  title: string
  description: string
  avatarUrl?: string
}

export interface StoryChoice {
  id: string
  text: string
  outcomeText: string
  npcId?: string
  affinityDelta?: number
  rewardDescription?: string
}

export interface StoryBlock {
  speaker?: string // NPC id or name, undefined = narration
  text: string
}

export interface StoryScene {
  id: string
  chapterId: string
  title: string
  minRealmIndex: number
  blocks: StoryBlock[]
  choices?: StoryChoice[]
}

export interface StoryChapter {
  id: string
  index: number
  title: string
  subtitle: string
  summary: string
  scenes: StoryScene[]
}

