import { type SiteConfig } from '#/features/dominance-map/types.ts'
import svg from './map.svg?raw'

export const usEx: SiteConfig = {
  id: 'us-ex',
  title: '美国制霸生成器',
  description: '美国五十州及海外属地制霸标记生成工具',
  svg,
  levels: [
    { value: 5, label: 'Lived', color: '#FF7E7E' },
    { value: 4, label: 'Stayed', color: '#FFB57E' },
    { value: 3, label: 'Visited', color: '#FFE57E' },
    { value: 2, label: 'Stopped', color: '#A8FFBE' },
    { value: 1, label: 'Passed', color: '#88AEFF' },
    { value: 0, label: 'Never', color: '#FFFFFF' },
  ],
  storageKey: 'us-ex-levels',
  filenameBase: '[美国制霸]',
  brandBg: '#9aa9e0',
  regionGroupId: '地区',
  scoreElementId: '分数',
  // The in-map UI (title/score/legend) is English; the score label too.
  scoreLabel: 'Score',
  // The title text uses id="标题" and the score uses id="分数"; both float on the
  // export background and follow the theme. The map's state labels (id="地名") are
  // 2-letter abbreviations rendered in the bundled ZCOOLKuaiLe font.
  floatingTextIds: ['标题', '分数'],
  coverSrc: '/cover/us-ex.webp',
  route: '/us-ex',
  // Source viewBox is 0 0 1146.1 912.5 (landscape; letterboxes in the square card).
  canvas: { w: 1146.1, h: 912.5, ratio: 2 },
  credit: { author: 'tenpages/us-level', url: 'https://github.com/tenpages/us-level' },
}
