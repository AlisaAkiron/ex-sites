#!/usr/bin/env node
// Generate an OG cover card (2560×1280) for an ex-site, matching the china-ex
// style: brand-pink background, the clean region map on the left, title +
// description on the right in the bundled ZCOOLKuaiLe font.
//
// Usage:
//   node build-cover.mjs <repoRoot> <siteId> "<title>" "<description>" [outWebp]
//
// Output is lossless WebP — for these flat-color/sharp-edge cards it's ~5× smaller
// than PNG with no quality loss (and smaller than JPEG, which also softens the
// black borders). Renders with headless Google Chrome (which emits PNG), then
// converts via ImageMagick (`magick`). On macOS the default Chrome path is used;
// elsewhere set CHROME=/path/to/chrome. The font is embedded as a data URI so it
// renders accurately, and a spread of regions is auto-colored for visual
// interest. Labels/title/score/legend inside the map are hidden so the card
// shows just the colored boxes (like china-ex's cover).

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [, , repoRoot, siteId, title, description, outArg] = process.argv
if (!repoRoot || !siteId || !title || !description) {
  console.error('Usage: node build-cover.mjs <repoRoot> <siteId> "<title>" "<description>" [outWebp]')
  process.exit(1)
}

const out = outArg ?? join(repoRoot, 'public', 'cover', `${siteId}.webp`)
const brandBg = '#efb4b4' // china-ex brand background; override if your site differs

let svg = readFileSync(join(repoRoot, 'src', 'sites', siteId, 'map.svg'), 'utf8')
const fontB64 = readFileSync(join(repoRoot, 'public', 'fonts', 'zcool-kuaile.ttf')).toString('base64')

// Auto-color a spread of regions across the map (rotating levels) so the card
// reads like a marked-up map rather than a blank one.
const ids = [...svg.matchAll(/<path id="([^"]+)"/g)].map((m) => m[1])
const LEVELS = [5, 4, 3, 2, 1]
const step = Math.max(1, Math.floor(ids.length / 12))
let n = 0
for (let i = 1; i < ids.length; i += step) {
  const level = LEVELS[n % LEVELS.length]
  n += 1
  svg = svg.replace(new RegExp(`(<path id="${ids[i]}")`), `$1 level="${level}"`)
}

const html = `<!doctype html>
<html lang="zh-Hans"><head><meta charset="utf-8"><style>
@font-face{font-family:'ZCOOLKuaiLe';src:url(data:font/ttf;base64,${fontB64}) format('truetype');font-display:block;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:2560px;height:1280px;}
body{background:${brandBg};display:flex;align-items:center;font-family:'ZCOOLKuaiLe',sans-serif;overflow:hidden;}
.map{width:1120px;height:1120px;margin-left:120px;flex:none;display:flex;align-items:center;justify-content:center;}
.map svg{width:100%;height:100%;display:block;}
/* Clean map: just the region boxes — hide labels, title, score, legend. */
.map #地名,.map #title,.map #标题,.map #分数,.map #等级,.map #qrcode{display:none;}
.text{margin-left:60px;}
.title{font-size:150px;color:#111;line-height:1.05;letter-spacing:4px;white-space:nowrap;}
.desc{font-size:56px;color:rgba(17,17,17,0.48);margin-top:30px;letter-spacing:2px;white-space:nowrap;}
</style></head>
<body>
  <div class="map">${svg}</div>
  <div class="text">
    <div class="title">${title}</div>
    <div class="desc">${description}</div>
  </div>
</body></html>`

const htmlPath = join(tmpdir(), `cover-${siteId}.html`)
writeFileSync(htmlPath, html)

const chrome =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Chrome's --screenshot always emits PNG; render to a temp PNG, then convert.
const pngPath = join(tmpdir(), `cover-${siteId}.png`)
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=2560,1280',
  '--default-background-color=ffffffff',
  '--virtual-time-budget=4000',
  `--screenshot=${pngPath}`,
  `file://${htmlPath}`,
], { stdio: ['ignore', 'ignore', 'ignore'] })

// Lossless WebP keeps the borders/text crisp and is the smallest option here.
execFileSync('magick', [pngPath, '-define', 'webp:lossless=true', '-strip', out], {
  stdio: ['ignore', 'ignore', 'ignore'],
})

rmSync(htmlPath, { force: true })
rmSync(pngPath, { force: true })
console.log(`wrote ${out}`)
