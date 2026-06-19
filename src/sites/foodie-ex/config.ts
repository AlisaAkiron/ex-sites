import { type SiteConfig } from '#/features/dominance-map/types.ts'
import svg from './map.svg?raw'

export const foodieEx: SiteConfig = {
  id: 'foodie-ex',
  title: '吃货制霸生成器',
  description: '中国各地特色美食制霸标记生成工具',
  svg,
  levels: [
    { value: 5, label: '天天吃', color: '#FF7E7E' },
    { value: 4, label: '会做', color: '#FFB57E' },
    { value: 3, label: '喜欢', color: '#FFE57E' },
    { value: 2, label: '吃过', color: '#A8FFBE' },
    { value: 1, label: '害怕', color: '#88AEFF' },
    { value: 0, label: '没见过', color: '#FFFFFF' },
  ],
  storageKey: 'foodie-ex-levels',
  filenameBase: '[吃货制霸]',
  brandBg: '#efb4b4',
  regionGroupId: '地区',
  scoreElementId: '分数',
  // The map's title text uses id="title" (not "标题" like china-ex); the score
  // uses id="分数". Both float on the export background and follow the theme.
  floatingTextIds: ['title', '分数'],
  coverSrc: '/cover/foodie-ex.webp',
  route: '/foodie-ex',
  canvas: { w: 1134, h: 976, ratio: 2 },
  credit: { author: 'lvwzhen/foodie-ex', url: 'https://github.com/lvwzhen/foodie-ex' },
}
