import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ThemeToggle } from '#/components/theme-toggle'
import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { type DominanceMapApi, DominanceMap } from './DominanceMap.tsx'
import { exportImage } from './exportImage.ts'
import { BG_PRESETS, type ExportBg, type ExportFormat, type SiteConfig } from './types.ts'

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
]
const BGS: { value: ExportBg; label: string }[] = [
  { value: 'theme', label: '主题' },
  ...BG_PRESETS.map((p) => ({ value: p.value, label: p.label })),
]

export function DominanceTool({ config }: { config: SiteConfig }) {
  const apiRef = useRef<DominanceMapApi | null>(null)
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('png')
  const [bg, setBg] = useState<ExportBg>('theme')
  const [generating, setGenerating] = useState(false)
  const [preview, setPreview] = useState<{ url: string; filename: string } | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleReady = useCallback((api: DominanceMapApi) => {
    apiRef.current = api
  }, [])

  useEffect(() => () => clearTimeout(clearTimer.current), [])

  // First tap arms the confirm (3s); second tap clears all markings.
  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true)
      clearTimer.current = setTimeout(() => setConfirmClear(false), 3000)
      return
    }
    clearTimeout(clearTimer.current)
    setConfirmClear(false)
    apiRef.current?.clear()
  }

  // (Re)generate the preview whenever the dialog is open and the chosen
  // format/background changes.
  useEffect(() => {
    if (!open || !apiRef.current) {
      return
    }
    let cancelled = false
    setGenerating(true)
    exportImage({ innerSvg: apiRef.current.getInnerSvg(), config, format, bg })
      .then(({ blob, filename }) => {
        const url = URL.createObjectURL(blob)
        if (cancelled) {
          URL.revokeObjectURL(url)
          return
        }
        setPreview((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev.url)
          }
          return { url, filename }
        })
      })
      .finally(() => {
        if (!cancelled) {
          setGenerating(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [open, format, bg, config])

  function closeDialog() {
    setPreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.url)
      }
      return null
    })
    setOpen(false)
  }

  function handleDownload() {
    if (!preview) {
      return
    }
    const isSocialApp = /weibo|qq/i.test(navigator.userAgent)
    const a = document.createElement('a')
    if (!isSocialApp) {
      a.download = preview.filename
    }
    a.href = preview.url
    a.click()
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* Map area follows the app theme (background + foreground). */}
      <div className="min-h-0 flex-1">
        <DominanceMap config={config} onReady={handleReady} />
      </div>

      <footer
        className="flex flex-col gap-1 p-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" render={<Link to="/" />}>
            <ArrowLeft />
            返回
          </Button>
          <div className="flex items-center gap-2">
            <Button variant={confirmClear ? 'destructive' : 'ghost'} onClick={handleClear}>
              {confirmClear ? '确认清空？' : '清空'}
            </Button>
            <Button onClick={() => setOpen(true)}>保存成图片</Button>
            <ThemeToggle />
          </div>
        </div>
        {config.credit && (
          <p className="text-center text-xs text-muted-foreground">
            原作者{' '}
            <a
              href={config.credit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {config.credit.author}
            </a>
          </p>
        )}
      </footer>

      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="关闭"
            className="absolute inset-0 bg-black/60"
            onClick={closeDialog}
          />
          <div className="relative flex w-full max-w-md flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xl">
            <h2 className="text-lg font-semibold">导出图片</h2>

            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              {preview ? (
                <img
                  src={preview.url}
                  alt={config.title}
                  data-loading={generating ? '' : undefined}
                  className="h-full w-full object-contain transition-opacity data-loading:opacity-50"
                />
              ) : (
                <span className="text-sm text-muted-foreground">生成中…</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 text-sm">
                背景
                <Select value={bg} onValueChange={(v) => setBg(v as ExportBg)}>
                  <SelectTrigger size="sm" aria-label="背景颜色">
                    <SelectValue>{(v) => BGS.find((b) => b.value === v)?.label ?? v}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {BGS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>

              <span className="flex items-center gap-2 text-sm">
                格式
                <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
                  <SelectTrigger size="sm" aria-label="导出格式">
                    <SelectValue>
                      {(v) => FORMATS.find((f) => f.value === v)?.label ?? v}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {FORMATS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              手机端可长按图片 <b>“添加到照片”</b>
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDialog}>
                关闭
              </Button>
              <Button onClick={handleDownload} disabled={!preview || generating}>
                下载
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
