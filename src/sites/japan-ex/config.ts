import { type SiteConfig } from '#/features/dominance-map/types.ts'
import svg from './map.svg?raw'

export const japanEx: SiteConfig = {
  id: 'japan-ex',
  title: '日本制霸生成器',
  description: '日本四十七都道府县制霸标记生成工具',
  svg,
  levels: [
    { value: 5, label: '居住', color: '#e84c3d' },
    { value: 4, label: '住宿', color: '#d58337' },
    { value: 3, label: '游玩', color: '#f3c218' },
    { value: 2, label: '落脚', color: '#30cc70' },
    { value: 1, label: '路过', color: '#3598db' },
    { value: 0, label: '没去过', color: '#ffffff' },
  ],
  storageKey: 'japan-ex-levels',
  filenameBase: '[日本制霸]',
  brandBg: '#9dc3fb',
  regionGroupId: '地区',
  scoreElementId: '分数',
  // The title text uses id="标题" and the score uses id="分数"; both float on the
  // export background and follow the theme. The map's name labels are baked-in
  // vector outlines (id="地名"), not <text>, so they need no font.
  floatingTextIds: ['标题', '分数'],
  coverSrc: '/cover/japan-ex.webp',
  route: '/japan-ex',
  // Source viewBox was 318 -317.5 1147.5 1147.5; normalized to a 0-origin square
  // via a translate wrapper in map.svg, so the canvas is square (no letterbox).
  canvas: { w: 1147.5, h: 1147.5, ratio: 2 },
  credit: { author: 'ukyouz/JapanEx', url: 'https://github.com/ukyouz/JapanEx' },
}
