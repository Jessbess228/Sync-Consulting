import { useEffect, useRef, useState } from 'react'
import { fluidPx } from './fluidPx'

type Frame = {
  src: string
  alt: string
}

function framesPerView(width: number) {
  if (width <= 520) return 1
  if (width <= 900) return 2
  return 3
}

function lastPageIndex(frameCount: number, width: number) {
  return Math.max(0, frameCount - framesPerView(width))
}

function nearestPageIndex(root: HTMLElement, frameCount: number) {
  const figures = [...root.querySelectorAll('figure')]
  const last = lastPageIndex(frameCount, root.clientWidth)
  let closest = 0
  let minDistance = Number.POSITIVE_INFINITY

  figures.slice(0, last + 1).forEach((figure, index) => {
    const distance = Math.abs(figure.offsetLeft - root.scrollLeft)
    if (distance < minDistance) {
      minDistance = distance
      closest = index
    }
  })

  return closest
}

export function Filmstrip({
  images,
  height,
}: {
  images: Frame[]
  height?: number
}) {
  const frames = images.length > 0 ? images : [{ src: '', alt: 'Photo 1' }]
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const heightPx = Math.min(800, Math.max(80, height || 320))

  useEffect(() => {
    const root = scrollerRef.current
    if (!root) return

    const sync = () => {
      const last = lastPageIndex(frames.length, root.clientWidth)
      setPageCount(last + 1)
      const maxLeft = (root.querySelectorAll('figure')[last] as HTMLElement | undefined)?.offsetLeft ?? 0
      if (root.scrollLeft > maxLeft) {
        root.scrollLeft = maxLeft
      }
      setActive(nearestPageIndex(root, frames.length))
    }

    sync()
    root.addEventListener('scroll', sync, { passive: true })
    const observer = new ResizeObserver(sync)
    observer.observe(root)
    return () => {
      root.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [frames])

  const goTo = (index: number) => {
    const root = scrollerRef.current
    const page = Math.min(Math.max(index, 0), lastPageIndex(frames.length, root.clientWidth))
    const figure = root?.querySelectorAll('figure')[page]
    if (!root || !(figure instanceof HTMLElement)) return
    root.scrollTo({
      left: figure.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      className="sc-filmstrip"
      aria-roledescription="carousel"
      aria-label="Photo row"
      style={{
        ['--sc-filmstrip-height' as string]: fluidPx(heightPx, 80, 800),
      }}
    >
      <div
        ref={scrollerRef}
        className="sc-filmstrip__track"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            goTo(active + 1)
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            goTo(active - 1)
          }
        }}
      >
        {frames.map((image, index) => (
          <figure key={`frame-${index}`}>
            {image.src ? (
              <img src={image.src} alt={image.alt} />
            ) : (
              <div className="sc-filmstrip__placeholder">{image.alt || `Photo ${index + 1}`}</div>
            )}
          </figure>
        ))}
      </div>
      {pageCount > 1 ? (
        <div className="sc-filmstrip__dots" role="tablist" aria-label="Photos">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              type="button"
              key={`dot-${index}`}
              role="tab"
              aria-selected={index === active}
              aria-label={frames[index]?.alt || `Photo ${index + 1}`}
              className={index === active ? 'is-active' : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
