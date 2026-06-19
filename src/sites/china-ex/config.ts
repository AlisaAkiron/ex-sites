import { type SiteConfig } from '#/features/dominance-map/types.ts'
import svg from './map.svg?raw'

export const chinaEx: SiteConfig = {
  id: 'china-ex',
  title: '中国制霸生成器',
  description: '中国三十四省级行政区域制霸标记生成工具',
  svg,
  levels: [
    { value: 5, label: '居住', color: '#FF7E7E' },
    { value: 4, label: '短居', color: '#FFB57E' },
    { value: 3, label: '游玩', color: '#FFE57E' },
    { value: 2, label: '出差', color: '#A8FFBE' },
    { value: 1, label: '路过', color: '#88AEFF' },
    { value: 0, label: '没去过', color: '#FFFFFF' },
  ],
  storageKey: 'china-ex-levels',
  filenameBase: '[中国制霸]',
  brandBg: '#efb4b4',
  regionGroupId: '地区',
  scoreElementId: '分数',
  floatingTextIds: ['标题', '分数'],
  coverSrc: '/cover/china-ex.webp',
  route: '/china-ex',
  canvas: { w: 1134, h: 976, ratio: 2 },
  credit: { author: 'itorr/china-ex', url: 'https://github.com/itorr/china-ex' },
}
