import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '#/lib/seo'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const lines = ['User-agent: *', 'Allow: /']
        if (SITE_URL) lines.push('', `Sitemap: ${SITE_URL}/sitemap.xml`)

        return new Response(`${lines.join('\n')}\n`, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      },
    },
  },
})
