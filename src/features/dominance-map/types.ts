export type Level = 0 | 1 | 2 | 3 | 4 | 5

export interface LevelDef {
  value: Level
  label: string
  color: string
}

export type ExportFormat = 'png' | 'jpeg' | 'webp'

export interface BgPreset {
  value: string
  label: string
  color: string
  // Fill for the floating title/score text so it stays legible on this color.
  textColor: string
}

// Fixed export-background presets. The special `theme` option (resolved at
// runtime to the current light/dark theme) is not listed here. Add a color by
// appending one row.
export const BG_PRESETS = [
  { value: 'pink', label: '粉', color: '#efb4b4', textColor: '#111111' },
  { value: 'white', label: '白', color: '#ffffff', textColor: '#111111' },
  { value: 'cream', label: '米', color: '#f7f0e3', textColor: '#111111' },
  { value: 'yellow', label: '黄', color: '#ffe9a8', textColor: '#111111' },
  { value: 'mint', label: '绿', color: '#bdeccb', textColor: '#111111' },
  { value: 'sky', label: '蓝', color: '#aed1ff', textColor: '#111111' },
  { value: 'lavender', label: '紫', color: '#d9c8ff', textColor: '#111111' },
  { value: 'slate', label: '灰', color: '#6b7280', textColor: '#ffffff' },
  { value: 'dark', label: '深', color: '#1a1a1a', textColor: '#ffffff' },
  { value: 'black', label: '黑', color: '#000000', textColor: '#ffffff' },
] as const satisfies readonly BgPreset[]

export type ExportBg = 'theme' | (typeof BG_PRESETS)[number]['value']

export interface SiteConfig {
  id: string
  title: string
  description: string
  svg: string
  levels: LevelDef[]
  storageKey: string
  filenameBase: string
  brandBg: string
  regionGroupId: string
  scoreElementId: string
  // Text elements that float directly on the background (title + score) and
  // must flip to a light fill on a dark export background to stay legible.
  floatingTextIds: string[]
  coverSrc: string
  route: string
  canvas: { w: number; h: number; ratio: number }
  // Attribution for the original work this generator is based on.
  credit?: { author: string; url: string }
}
