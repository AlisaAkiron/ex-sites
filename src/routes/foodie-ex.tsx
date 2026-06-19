import { createFileRoute } from '@tanstack/react-router'
import { DominanceTool } from '#/features/dominance-map/DominanceTool.tsx'
import { seo } from '#/lib/seo'
import { foodieEx } from '#/sites/foodie-ex/config.ts'

export const Route = createFileRoute('/foodie-ex')({
  head: () =>
    seo({
      title: `${foodieEx.title} - ${foodieEx.description}`,
      description: foodieEx.description,
      path: foodieEx.route,
      image: foodieEx.coverSrc,
    }),
  component: () => <DominanceTool config={foodieEx} />,
})
