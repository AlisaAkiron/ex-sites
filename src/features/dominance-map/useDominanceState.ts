import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type Level, type SiteConfig } from './types.ts'

const isLevel = (n: number): n is Level => Number.isInteger(n) && n >= 0 && n <= 5

export function parseLevels(stored: string | null, count: number): Level[] {
  const chars = stored ?? ''
  return Array.from({ length: count }, (_, i) => {
    const n = Number(chars[i])
    return Number.isNaN(n) || !isLevel(n) ? 0 : n
  })
}

export function serializeLevels(levels: Level[]): string {
  return levels.join('')
}

export function computeScore(levels: Level[]): number {
  return levels.reduce<number>((sum, l) => sum + l, 0)
}

export function useDominanceState(config: SiteConfig, regionIds: string[]) {
  // Region ids are discovered from the SVG after mount, so they are empty on the
  // first render — we cannot seed from localStorage in a useState initializer.
  // Load persisted levels in an effect, once, after the ids are known.
  const [levels, setLevels] = useState<Record<string, Level>>({})
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current || regionIds.length === 0) {
      return
    }
    loadedRef.current = true
    const stored =
      typeof localStorage === 'undefined' ? null : localStorage.getItem(config.storageKey)
    const parsed = parseLevels(stored, regionIds.length)
    setLevels(Object.fromEntries(regionIds.map((id, i) => [id, parsed[i]])))
  }, [regionIds, config.storageKey])

  const setLevel = useCallback(
    (id: string, level: Level) => {
      setLevels((prev) => {
        const next = { ...prev, [id]: level }
        const serialized = serializeLevels(regionIds.map((rid) => next[rid] ?? 0))
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(config.storageKey, serialized)
        }
        return next
      })
    },
    [config.storageKey, regionIds],
  )

  const clearLevels = useCallback(() => {
    setLevels({})
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(config.storageKey)
    }
  }, [config.storageKey])

  const score = useMemo(
    () => computeScore(regionIds.map((rid) => levels[rid] ?? 0)),
    [levels, regionIds],
  )

  return { levels, setLevel, clearLevels, score }
}
