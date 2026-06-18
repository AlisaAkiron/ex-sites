import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
      <p className="text-6xl font-bold">404</p>
      <p className="text-lg text-muted-foreground">页面未找到</p>
      <Button render={<Link to="/" />}>返回首页</Button>
    </div>
  )
}
