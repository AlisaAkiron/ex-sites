import { describe, expect, it } from 'vitest'
import { bgColorFor, buildExportSvg, extFor, mimeFor } from './exportImage.ts'
import { type SiteConfig } from './types.ts'

const config = {
  brandBg: '#efb4b4',
  canvas: { w: 1134, h: 976, ratio: 2 },
  floatingTextIds: ['标题', '分数'],
} as SiteConfig

describe('mimeFor / extFor', () => {
  it('maps formats to mime types', () => {
    expect(mimeFor('png')).toBe('image/png')
    expect(mimeFor('jpeg')).toBe('image/jpeg')
    expect(mimeFor('webp')).toBe('image/webp')
  })
  it('maps formats to file extensions', () => {
    expect(extFor('png')).toBe('png')
    expect(extFor('jpeg')).toBe('jpg')
    expect(extFor('webp')).toBe('webp')
  })
})

describe('bgColorFor', () => {
  it('resolves background presets to their colors', () => {
    expect(bgColorFor('pink')).toBe('#efb4b4')
    expect(bgColorFor('white')).toBe('#ffffff')
    expect(bgColorFor('dark')).toBe('#1a1a1a')
    expect(bgColorFor('mint')).toBe('#bdeccb')
    expect(bgColorFor('black')).toBe('#000000')
  })
})

describe('buildExportSvg', () => {
  it('wraps inner markup with viewBox, embeds the font, and bakes the floating text color', () => {
    const out = buildExportSvg('<g id="地区"></g>', config, 'data:font/ttf;base64,AAAA', '#ffffff')
    expect(out).toContain('viewBox="0 0 1134 976"')
    expect(out).toContain('<g id="地区"></g>')
    expect(out).toContain('@font-face')
    expect(out).toContain('ZCOOLKuaiLe')
    expect(out).toContain('data:font/ttf;base64,AAAA')
    expect(out).toContain('#标题,#分数{fill:#ffffff}')
  })
})
