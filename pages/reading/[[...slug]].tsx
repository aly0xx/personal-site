import Head from "next/head"
import { GetStaticPaths, GetStaticProps } from "next"
import ReadingClient from "@/components/ReadingClient"
import { getAllBooks, type BookWithSlug } from "@/lib/reading"

// One page serves the list and every book, so the shelf stays mounted and a
// book can swing open when you move between them.
export default function Reading({ books, slug }: { books: BookWithSlug[]; slug: string | null }) {
  const book = slug ? books.find((b) => b.slug === slug) : null

  return (
    <>
      <Head>
        <title>{book ? `${book.title} | Books` : "Books | Aly Hassan Youssef"}</title>
      </Head>
      <ReadingClient books={books} slug={slug} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    { params: { slug: [] as string[] } },
    ...getAllBooks().map((b) => ({ params: { slug: [b.slug] } })),
  ]
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = (ctx.params?.slug as string[] | undefined)?.[0] ?? null
  const books = getAllBooks()
  if (slug && !books.some((b) => b.slug === slug)) return { notFound: true }
  return { props: { books, slug } }
}
