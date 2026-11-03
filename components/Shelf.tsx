import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { BookWithSlug } from "@/lib/reading"
import { bookFace } from "@/lib/book-colors"
import TypedCover from "@/components/TypedCover"

const SPINE = 42
const COVER = 166
// A selected book swings open on the hinge between its spine and cover.
const SPINE_OPEN_DEG = 60
const COVER_OPEN_DEG = 30
const spineOpen = (spine: number) => spine * Math.cos((SPINE_OPEN_DEG * Math.PI) / 180)
export const openWidth = (spine: number) => spineOpen(spine) + COVER * Math.cos((COVER_OPEN_DEG * Math.PI) / 180)

export function ShelfBook({
  title,
  author,
  cover,
  face,
  spineWidth = SPINE,
  open,
  onSelect,
}: {
  title: string
  author: string
  cover: string | null
  face: { background: string; color: string }
  spineWidth?: number
  open: boolean
  onSelect: () => void
}) {
  const label = author ? `${title} by ${author}` : title

  return (
    <button
      type="button"
      className="shelf-book"
      data-open={open}
      aria-pressed={open}
      aria-label={label}
      title={label}
      onClick={onSelect}
      style={{ width: open ? openWidth(spineWidth) : spineWidth }}
    >
      <span className="shelf-book-hinge" style={{ transform: open ? `translateX(${spineOpen(spineWidth) - spineWidth}px)` : undefined }}>
        <span
          className="shelf-spine"
          style={{ ...face, width: spineWidth, transform: `rotateY(${open ? -SPINE_OPEN_DEG : 0}deg)` }}
        >
          <span className="spine-title">{title.split(":")[0]}</span>
        </span>
        <span
          className="shelf-cover"
          style={{ ...face, width: COVER, transform: `rotateY(${open ? COVER_OPEN_DEG : 90}deg)` }}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" width={COVER} height={220} loading="lazy" />
          ) : (
            <TypedCover title={title} author={author} face={face} />
          )}
        </span>
      </span>
    </button>
  )
}

export default function Shelf({
  books,
  selected,
  onSelect,
}: {
  books: BookWithSlug[]
  selected: string | null
  onSelect: (slug: string) => void
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const holdRef = useRef<number | null>(null)
  const [canScroll, setCanScroll] = useState({ left: false, right: false })

  function updateArrows() {
    const row = rowRef.current
    if (!row) return
    setCanScroll({
      left: row.scrollLeft > 0,
      right: row.scrollLeft + row.clientWidth < row.scrollWidth - 1,
    })
  }

  useEffect(() => {
    updateArrows()
    window.addEventListener("resize", updateArrows)
    return () => window.removeEventListener("resize", updateArrows)
  }, [books.length, selected])

  // Bring the open book to the middle of the shelf.
  useEffect(() => {
    const row = rowRef.current
    const el = row?.querySelector<HTMLElement>('[data-open="true"]')
    if (!row || !el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    row.scrollTo({
      left: el.offsetLeft - row.offsetLeft - (row.clientWidth - openWidth(SPINE)) / 2,
      behavior: reduce ? "auto" : "smooth",
    })
  }, [selected])

  // Holding an arrow keeps the shelf sliding.
  function startSliding(direction: number) {
    stopSliding()
    holdRef.current = window.setInterval(() => rowRef.current?.scrollBy({ left: direction * 4 }), 10)
  }

  function stopSliding() {
    if (holdRef.current !== null) window.clearInterval(holdRef.current)
    holdRef.current = null
  }

  useEffect(() => stopSliding, [])

  function arrowProps(direction: number) {
    return {
      type: "button" as const,
      onPointerDown: () => startSliding(direction),
      onPointerUp: stopSliding,
      onPointerLeave: stopSliding,
      onClick: (e: React.MouseEvent) => {
        // A keyboard press has no pointer events, so step by a few books instead.
        if (e.detail === 0) rowRef.current?.scrollBy({ left: direction * 216, behavior: "smooth" })
      },
    }
  }

  return (
    <div className="shelf">
      {canScroll.left ? (
        <button className="shelf-arrow shelf-arrow-left" aria-label="Scroll the shelf left" {...arrowProps(-1)}>
          <ChevronLeft size={14} />
        </button>
      ) : null}
      <div className="shelf-row" ref={rowRef} onScroll={updateArrows}>
        {books.map((book) => (
          <ShelfBook
            key={book.slug}
            title={book.title}
            author={book.author}
            cover={book.cover}
            face={bookFace(book)}
            open={book.slug === selected}
            onSelect={() => onSelect(book.slug)}
          />
        ))}
      </div>
      {canScroll.right ? (
        <button className="shelf-arrow shelf-arrow-right" aria-label="Scroll the shelf right" {...arrowProps(1)}>
          <ChevronRight size={14} />
        </button>
      ) : null}
    </div>
  )
}
