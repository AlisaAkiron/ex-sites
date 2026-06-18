import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode, origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'theme'

function resolve(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return mode
}

function apply(mode: ThemeMode) {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.classList.toggle('dark', resolve(mode) === 'dark')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system')

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system'
    setMode(stored)
    apply(stored)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) as ThemeMode) === 'system') {
        apply('system')
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const setTheme = useCallback((next: ThemeMode, origin?: { x: number; y: number }) => {
    localStorage.setItem(STORAGE_KEY, next)
    setMode(next)
    const run = () => apply(next)
    // Circular-reveal transition (CSS already defines `theme-change`).
    if (origin && 'startViewTransition' in document) {
      document.documentElement.style.setProperty('--theme-transition-x', `${origin.x}px`)
      document.documentElement.style.setProperty('--theme-transition-y', `${origin.y}px`)
      ;(
        document as Document & {
          startViewTransition: (cb: () => void, opts?: { types: string[] }) => void
        }
      ).startViewTransition(run, { types: ['theme-change'] })
    } else {
      run()
    }
  }, [])

  const themeContextValue = useMemo(() => ({ mode, setMode: setTheme }), [mode, setTheme])

  return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}

// Inline, no-FOUC script string injected into <head> before hydration.
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${STORAGE_KEY}')||'system';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})()`
