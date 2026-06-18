// oxlint-disable no-console
import rybbit from '@rybbit/js'
import { isRybbitConfigured, rybbitConfig } from '#/lib/rybbit/config.ts'

let started = false

/** Initialize Rybbit analytics exactly once. No-op during local development. */
export async function initRybbit() {
  if (started) {
    return
  }
  started = true

  // Analytics is disabled outside production builds (e.g. `vite dev`).
  if (!import.meta.env.PROD) {
    return
  }

  if (!isRybbitConfigured) {
    console.warn('[Rybbit] Skipping init: VITE_RYBBIT_HOST and VITE_RYBBIT_SITE_ID are not set.')
    return
  }

  try {
    await rybbit.init(rybbitConfig)
  } catch (error) {
    console.error('[Rybbit] Failed to initialize analytics:', error)
  }
}
