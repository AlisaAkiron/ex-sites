import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // Expose APP_URL (the public origin) to client + prerender code via
  // `import.meta.env.APP_URL`, alongside Vite's default VITE_ vars.
  envPrefix: ['VITE_', 'APP_URL'],
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart({
      // Prerender all routes to static HTML; the app is fully client-interactive.
      prerender: { enabled: true, crawlLinks: true },
      pages: [
        { path: '/' },
        { path: '/china-ex' },
        { path: '/robots.txt' },
        { path: '/sitemap.xml' },
      ],
    }),
    viteReact(),
  ],
})
