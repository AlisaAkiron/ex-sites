import { createFileRoute } from '@tanstack/react-router'
import { DominanceTool } from '#/features/dominance-map/DominanceTool.tsx'
import { seo } from '#/lib/seo'
import { usEx } from '#/sites/us-ex/config.ts'

export const Route = createFileRoute('/us-ex')({
  head: () =>
    seo({
      title: `${usEx.title} - ${usEx.description}`,
      description: usEx.description,
      path: usEx.route,
      image: usEx.coverSrc,
    }),
  component: () => <DominanceTool config={usEx} />,
})
