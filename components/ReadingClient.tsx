"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import type { BookWithSlug } from "@/lib/reading"
import { bookFace } from "@/lib/book-colors"
import { formatReadDate } from "@/lib/dates"
import Shelf from "@/components/Shelf"
import TypedCover from "@/components/TypedCover"

function BookEntry({ book, full }: { book: BookWithSlug; full: boolean }) {
  return (
    <div className="book-entry">
      {book.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="book-thumb" src={book.cover} alt={book.title} loading="lazy" />
      ) : (
        <span className="book-thumb typed">
          <TypedCover title={book.title} author={book.author} face={bookFace(book)} />
        </span>
      )}
      <div className="book-text">
        <h2 className="book-title">
          <Link href={`/reading/${book.slug}`} scroll={!full}>{book.title}</Link>
        </h2>
        <p className="book-author">{book.author}</p>
        <p className="book-meta">
          {book.dateRead ? `Read: ${formatReadDate(book.dateRead)} • ` : ""}Rating: {book.rating}/10
        </p>
        <article>
          {full ? (
            <>
              {book.summary.length > 0 ? <h3>Summary</h3> : null}
              {book.summary.length > 0 ? <ul>{book.summary.map((s, i) => <li key={i}>{s}</li>)}</ul> : null}
              {book.notes.length > 0 ? <h3>Notes</h3> : null}
              {book.notes.length > 0 ? <ul>{book.notes.map((n, i) => <li key={i}>{n}</li>)}</ul> : null}
            </>
          ) : (
            (book.notes.length > 0 ? book.notes : book.summary.slice(0, 2)).map((text, i) => <p key={i}>{text}</p>)
          )}
        </article>
      </div>
    </div>
  )
}

export default function ReadingClient({ books, slug }: { books: BookWithSlug[]; slug: string | null }) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return books
    return books.filter((b) => (b.title || "").toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q))
  }, [books, query])

  const selected = slug ? books.find((b) => b.slug === slug) ?? null : null

  function select(next: string) {
    router.push(next === slug ? "/reading" : `/reading/${next}`, undefined, { scroll: false })
  }

  return (
    <>
      <Shelf books={books} selected={slug} onSelect={select} />
      <hr className="rule" />

      {selected ? (
        <BookEntry book={selected} full />
      ) : (
        <>
          <p className="page-note">
            These are the books I found interesting, otherwise checkout my <Link href="/library">library</Link>
          </p>
          <label htmlFor="shelf-search" className="sr-only">Search by title or author</label>
          <input
            id="shelf-search"
            className="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books..."
          />
          {filtered.length === 0 ? (
            <p>No results</p>
          ) : (
            filtered.map((book) => <BookEntry key={book.slug} book={book} full={false} />)
          )}
        </>
      )}
    </>
  )
}
