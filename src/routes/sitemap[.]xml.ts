import { createFileRoute } from '@tanstack/react-router'
import { absoluteUrl } from '#/lib/seo'
import { SITES } from '#/sites'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const paths = ['/', ...SITES.map((site) => site.route)]
        const urls = paths
          .map(
            (path) => `  <url>
    <loc>${absoluteUrl(path)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
          )
          .join('\n')

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

        return new Response(sitemap, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        })
      },
    },
  },
})
