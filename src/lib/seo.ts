// Centralized SEO helpers. The canonical origin comes from the APP_URL env var,
// inlined at build time by Vite (see `envPrefix` in vite.config.ts). When unset
// (e.g. local dev), absolute URLs are omitted and tags fall back to relative.
const base = (import.meta.env.APP_URL ?? '').replace(/\/+$/, '')

export const SITE_URL = base
const SITE_NAME = '制霸生成器'

const DEFAULT_OG_IMAGE = '/cover/china-ex.png'

/** Resolve a path or relative asset against APP_URL. Pass-through for absolute URLs. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path
  if (!base) return path
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

type SeoOptions = {
  title: string
  description?: string
  /** Path of the current route, used for og:url + canonical (e.g. '/china-ex'). */
  path?: string
  /** OG/Twitter image; relative paths are resolved against APP_URL. */
  image?: string
  type?: 'website' | 'article'
}

/** Build the `meta`/`links` head fragment for a route with full OG + Twitter coverage. */
export function seo({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
}: SeoOptions) {
  const url = base ? absoluteUrl(path) : ''
  const img = absoluteUrl(image)

  const meta: Array<Record<string, string>> = [
    { title },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
  ]

  if (description) {
    meta.push(
      { name: 'description', content: description },
      { property: 'og:description', content: description },
      { name: 'twitter:description', content: description },
    )
  }
  if (url) meta.push({ property: 'og:url', content: url })
  if (img) {
    meta.push(
      { property: 'og:image', content: img },
      { name: 'twitter:image', content: img },
    )
  }

  const links = url ? [{ rel: 'canonical', href: url }] : []
  return { meta, links }
}
