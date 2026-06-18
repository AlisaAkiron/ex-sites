import { createFileRoute } from '@tanstack/react-router'
import { DominanceTool } from '#/features/dominance-map/DominanceTool.tsx'
import { seo } from '#/lib/seo'
import { chinaEx } from '#/sites/china-ex/config.ts'

export const Route = createFileRoute('/china-ex')({
  head: () =>
    seo({
      title: `${chinaEx.title} - ${chinaEx.description}`,
      description: chinaEx.description,
      path: chinaEx.route,
      image: chinaEx.coverSrc,
    }),
  component: () => <DominanceTool config={chinaEx} />,
})
