import type { MouseEvent, ReactNode } from 'react'

function inPageAnchorId(href: string): string | null {
  if (!href.startsWith('#') || href.startsWith('#/')) return null
  const id = href.slice(1)
  return id || null
}

export function SiteLink({
  href,
  className,
  children,
  editing = false,
}: {
  href: string
  className?: string
  children: ReactNode
  editing?: boolean
}) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (editing) {
      event.preventDefault()
      return
    }

    const id = inPageAnchorId(href)
    if (!id) return
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <a className={className} href={href} onClick={onClick}>
      {children}
    </a>
  )
}
