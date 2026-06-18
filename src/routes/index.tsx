import { Link, createFileRoute } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'
import { seo } from '#/lib/seo'
import { SITES } from '#/sites'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: '制霸生成器',
      description: '选择一个制霸生成器开始标记',
      path: '/',
    }),
  component: Landing,
})

function Landing() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between p-4 sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">制霸生成器</h1>
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITES.map((site) => (
            <Link
              key={site.id}
              to={site.route}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary"
            >
              {/* Render the actual map as the thumbnail (scaled to fit) on the
                  brand background, so it's always fully visible in any theme. */}
              <div
                className="aspect-[4/3] w-full p-4 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                style={{ background: site.brandBg }}
                dangerouslySetInnerHTML={{ __html: site.svg }}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{site.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{site.description}</p>
                {site.credit && (
                  <p className="mt-2 text-xs text-muted-foreground">原作者 {site.credit.author}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
