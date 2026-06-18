import { useEffect, useRef } from 'react'
import { initRybbit } from '#/lib/rybbit/client.ts'

/** Fires Rybbit init once on the client, guarded against StrictMode double-invoke. */
export function RybbitProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) {
      return
    }
    initialized.current = true
    void initRybbit()
  }, [])

  return <>{children}</>
}
