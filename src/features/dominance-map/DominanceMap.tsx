import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { LevelPicker } from './LevelPicker.tsx'
import { type Level, type SiteConfig } from './types.ts'
import { useDominanceState } from './useDominanceState.ts'

export interface DominanceMapApi {
  getInnerSvg: () => string
  clear: () => void
}

interface Props {
  config: SiteConfig
  onReady?: (api: DominanceMapApi) => void
}

const MIN_GAP = 6

// Render the raw SVG once and never re-reconcile it. Without memo, any parent
// re-render reconciles dangerouslySetInnerHTML and resets innerHTML to the
// original markup — wiping the `level` attributes and score text we set
// imperatively in effects.
const SvgLayer = memo(function SvgLayer({ svg }: { svg: string }) {
  return <div className="contents" dangerouslySetInnerHTML={{ __html: svg }} />
})

export function DominanceMap({ config, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [regionIds, setRegionIds] = useState<string[]>([])
  const [picker, setPicker] = useState<{
    id: string
    title: string
    position: { left: number; top: number }
  } | null>(null)

  const { levels, setLevel, clearLevels, score } = useDominanceState(config, regionIds)

  // Keep the latest onReady without making it an effect dependency — a parent
  // passing an inline callback must not retrigger the collect effect (that would
  // loop setRegionIds → re-render → effect → ...).
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  // Collect province ids once the SVG is in the DOM (once per site config).
  useEffect(() => {
    const group = containerRef.current?.querySelector(`#${CSS.escape(config.regionGroupId)}`)
    if (!group) {
      return
    }
    const ids = Array.from(group.children).map((el) => el.id)
    setRegionIds(ids)
    onReadyRef.current?.({
      getInnerSvg: () => containerRef.current?.querySelector('svg')?.innerHTML ?? '',
      clear: clearLevels,
    })
  }, [config.regionGroupId, config.svg, clearLevels])

  // Apply level attributes + score text whenever state changes. Safe because the
  // SVG layer is memoized and won't be re-reconciled out from under us.
  useEffect(() => {
    const root = containerRef.current
    if (!root) {
      return
    }
    const group = root.querySelector(`#${CSS.escape(config.regionGroupId)}`)
    group?.querySelectorAll<SVGElement>('path').forEach((path) => {
      if (path.id) {
        path.setAttribute('level', String(levels[path.id] ?? 0))
      }
    })
    const scoreEl = root.querySelector(`#${CSS.escape(config.scoreElementId)}`)
    if (scoreEl) {
      scoreEl.textContent = `${config.scoreLabel ?? '分数'}: ${score}`
    }
  }, [levels, score, config.regionGroupId, config.scoreElementId, config.scoreLabel])

  // Mark the floating title/score text so page CSS ([data-floating-text]) can
  // tint it with the theme foreground on screen. The export bakes its own
  // concrete color via buildExportSvg, so this is on-screen only.
  useEffect(() => {
    const root = containerRef.current
    if (!root) {
      return
    }
    config.floatingTextIds.forEach((id) => {
      root.querySelector(`#${CSS.escape(id)}`)?.setAttribute('data-floating-text', '')
    })
  }, [config.floatingTextIds])

  const onMapClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as Element
      const group = containerRef.current?.querySelector(`#${CSS.escape(config.regionGroupId)}`)
      if (!group || !group.contains(target) || target.tagName.toLowerCase() !== 'path') {
        return
      }
      const id = target.id
      const rect = target.getBoundingClientRect()
      const pickerW = 140
      const pickerH = 230
      let left = window.scrollX + rect.left + rect.width / 2 - pickerW / 2
      left = Math.min(left, document.body.offsetWidth - pickerW - MIN_GAP)
      left = Math.max(left, MIN_GAP)
      let top = window.scrollY + rect.top + rect.height / 2 - pickerH / 2
      top = Math.min(top, document.body.offsetHeight - pickerH - MIN_GAP)
      top = Math.max(top, MIN_GAP)
      setPicker({ id, title: id, position: { left, top } })
    },
    [config.regionGroupId],
  )

  // Close the picker when clicking anywhere that is neither a province (handled
  // by onMapClick, which re-opens it elsewhere) nor inside the picker itself.
  // React is mounted on `document`, so its delegated click handler and this
  // listener share a node — stopPropagation cannot separate them; we filter by
  // target instead.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (!t) {
        return
      }
      if (t.closest('[data-level-picker]')) {
        return
      }
      const group = containerRef.current?.querySelector(`#${CSS.escape(config.regionGroupId)}`)
      if (group && group.contains(t)) {
        return
      }
      setPicker(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [config.regionGroupId])

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={containerRef}
      role="application"
      tabIndex={-1}
      // - [&_svg]:* makes the injected SVG scale to fit the container (its
      //   viewBox + default preserveAspectRatio letterboxes it) so the whole
      //   map is always visible without overflow.
      // - select-none + [&_text]:pointer-events-none make the province name
      //   labels unselectable and let clicks fall through to the province path
      //   beneath, so clicking a label opens the picker just like the box.
      className="h-full w-full select-none focus:outline-none [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_text]:pointer-events-none"
      onClick={onMapClick}
      onKeyDown={() => undefined}
    >
      <SvgLayer svg={config.svg} />
      <LevelPicker
        title={picker?.title ?? ''}
        levels={config.levels}
        position={picker?.position ?? null}
        onPick={(level: Level) => {
          if (picker) {
            setLevel(picker.id, level)
          }
          setPicker(null)
        }}
      />
    </div>
  )
}
