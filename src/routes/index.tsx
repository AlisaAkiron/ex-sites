import { Link, createFileRoute } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'
import { Button } from '#/components/ui/button'
import { seo } from '#/lib/seo'
import { SITES } from '#/sites'

const REPO_URL = 'https://github.com/AlisaAkiron/ex-sites'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56 0-.28-.01-1.01-.02-1.99-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.34-1.74-1.34-1.74-1.09-.73.08-.72.08-.72 1.21.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.82 0-1.29.47-2.34 1.23-3.16-.12-.3-.53-1.51.12-3.15 0 0 1-.32 3.3 1.21a11.6 11.6 0 0 1 6 0c2.29-1.53 3.29-1.21 3.29-1.21.65 1.64.24 2.85.12 3.15.77.82 1.23 1.87 1.23 3.16 0 4.52-2.81 5.51-5.49 5.81.43.36.81 1.08.81 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z" />
    </svg>
  )
}

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
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            render={
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" />
            }
          >
            <GithubIcon />
          </Button>
          <ThemeToggle />
        </div>
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
