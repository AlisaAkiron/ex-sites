import { BG_PRESETS, type ExportBg, type ExportFormat, type SiteConfig } from './types.ts'

export function mimeFor(format: ExportFormat): string {
  return format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png'
}

export function extFor(format: ExportFormat): string {
  return format === 'jpeg' ? 'jpg' : format
}

// Concrete colors used when the export background follows the app theme.
const THEME_DARK = { color: '#1a1a1a', textColor: '#ffffff' }
const THEME_LIGHT = { color: '#ffffff', textColor: '#111111' }

function isDarkTheme(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
}

function presetFor(bg: ExportBg): { color: string; textColor: string } {
  if (bg === 'theme') {
    return isDarkTheme() ? THEME_DARK : THEME_LIGHT
  }
  const preset = BG_PRESETS.find((p) => p.value === bg)
  return preset ?? THEME_LIGHT
}

export function bgColorFor(bg: ExportBg): string {
  return presetFor(bg).color
}

// Fill color for the floating title/score text so it stays legible on the bg.
function textColorFor(bg: ExportBg): string {
  return presetFor(bg).textColor
}

export function buildExportSvg(
  innerSvg: string,
  config: SiteConfig,
  fontDataUrl: string,
  textColor: string,
): string {
  const { w, h } = config.canvas
  const floatRule = config.floatingTextIds?.length
    ? `${config.floatingTextIds.map((id) => `#${id}`).join(',')}{fill:${textColor}}`
    : ''
  return `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}px" height="${h}px"><style>@font-face{font-family:'ZCOOLKuaiLe';src:url(${fontDataUrl}) format('truetype')}${floatRule}</style>${innerSvg}</svg>`
}

let fontDataUrlCache: string | null = null

async function loadFontDataUrl(): Promise<string> {
  if (fontDataUrlCache) {
    return fontDataUrlCache
  }
  const res = await fetch('/fonts/zcool-kuaile.ttf')
  const blob = await res.blob()
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
  fontDataUrlCache = dataUrl
  return dataUrl
}

function svgToImage(svgText: string): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }))
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Defer one tick so the embedded font is applied before draw.
      setTimeout(() => {
        URL.revokeObjectURL(url)
        resolve(img)
      }, 50)
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    img.src = url
  })
}

interface ExportOpts {
  innerSvg: string
  config: SiteConfig
  format: ExportFormat
  bg: ExportBg
}

export async function exportImage(opts: ExportOpts): Promise<{ blob: Blob; filename: string }> {
  const { innerSvg, config, format, bg } = opts
  const { w, h, ratio } = config.canvas

  await document.fonts.ready
  const fontDataUrl = await loadFontDataUrl()
  const svgText = buildExportSvg(innerSvg, config, fontDataUrl, textColorFor(bg))
  const img = await svgToImage(svgText)

  const canvas = document.createElement('canvas')
  canvas.width = w * ratio
  canvas.height = w * ratio
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = bgColorFor(bg)
  ctx.fillRect(0, 0, w * ratio, w * ratio)
  ctx.drawImage(img, 0, 0, w, h, 0, ((w - h) * ratio) / 2, w * ratio, h * ratio)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
      mimeFor(format),
      0.95,
    )
  })
  return { blob, filename: `${config.filenameBase}.${extFor(format)}` }
}
