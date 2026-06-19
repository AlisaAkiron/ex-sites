import { createFileRoute } from '@tanstack/react-router'
import { DominanceTool } from '#/features/dominance-map/DominanceTool.tsx'
import { seo } from '#/lib/seo'
import { japanEx } from '#/sites/japan-ex/config.ts'

export const Route = createFileRoute('/japan-ex')({
  head: () =>
    seo({
      title: `${japanEx.title} - ${japanEx.description}`,
      description: japanEx.description,
      path: japanEx.route,
      image: japanEx.coverSrc,
    }),
  component: () => <DominanceTool config={japanEx} />,
})
