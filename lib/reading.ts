import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { readDateSortKey } from "@/lib/dates"

export type BookData = {
  title: string
  author: string
  summary: string[]
  notes: string[]
  rating: number
  dateRead: string | null
  cover: string | null
  spineColor: string | null
  textColor: string | null
}
export type BookWithSlug = BookData & { slug: string }

const READING_PATH = path.join(process.cwd(), "content/reading")

export function getAllBooks(): BookWithSlug[] {
  const files = fs.readdirSync(READING_PATH).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))

  function extractSection(content: string, heading: string): string[] {
    const re = new RegExp(`^##\\s+${heading}\\s*$`, "gim")
    let match: RegExpExecArray | null = re.exec(content)
    if (!match) return []
    const start = match.index + match[0].length
    // find next heading (## ) after start
    const nextHeading = /^(##\s+[^\n]+)\s*$/gim
    nextHeading.lastIndex = start
    const next = nextHeading.exec(content)
    const section = content.slice(start, next ? next.index : undefined).trim()
    if (!section) return []
    // extract list items (lines starting with - or * or numbered) or paragraphs
    const lines = section.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    const items: string[] = []
    let buffer: string[] = []
    for (const line of lines) {
      const listMatch = line.match(/^[-*+]\s+(.*)$/)
      const numMatch = line.match(/^\d+[.)]\s+(.*)$/)
      if (listMatch) {
        if (buffer.length) { items.push(buffer.join(' ')); buffer = [] }
        items.push(listMatch[1].trim())
      } else if (numMatch) {
        if (buffer.length) { items.push(buffer.join(' ')); buffer = [] }
        items.push(numMatch[1].trim())
      } else if (/^<!--/.test(line)) {
        // skip html comments
        continue
      } else if (/^#/ .test(line)) {
        // heading inside section - stop
        break
      } else {
        // paragraph lines: accumulate into buffer until blank or next list
        buffer.push(line)
      }
    }
    if (buffer.length) items.push(buffer.join(' '))
    return items
  }

  return files.map((file) => {
    const filePath = path.join(READING_PATH, file)
    const source = fs.readFileSync(filePath, "utf-8")
    const { data, content } = matter(source)

    const parsedSummary = Array.isArray(data.summary) && data.summary.length > 0 ? data.summary : extractSection(content, "Summary")
    const parsedNotes = Array.isArray(data.notes) && data.notes.length > 0 ? data.notes : extractSection(content, "Notes")

    const slug = path.parse(file).name

    return {
      slug,
      title: data.title,
      author: data.author,
      summary: parsedSummary || [],
      notes: parsedNotes || [],
      rating: data.rating || 0,
      dateRead: data.dateRead || null,
      cover: data.cover || null,
      spineColor: data.spineColor || null,
      textColor: data.textColor || null,
    }
  }).sort((a, b) => readDateSortKey(b.dateRead) - readDateSortKey(a.dateRead))
}

export function getBookBySlug(slug: string): BookWithSlug | null {
  const candidates = [
    path.join(READING_PATH, `${slug}.md`),
    path.join(READING_PATH, `${slug}.mdx`),
  ]
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue
    const source = fs.readFileSync(p, "utf-8")
    const { data, content } = matter(source)

    function extractSection(content: string, heading: string): string[] {
      const re = new RegExp(`^##\\s+${heading}\\s*$`, "gim")
      let match: RegExpExecArray | null = re.exec(content)
      if (!match) return []
      const start = match.index + match[0].length
      const nextHeading = /^(##\s+[^\n]+)\s*$/gim
      nextHeading.lastIndex = start
      const next = nextHeading.exec(content)
      const section = content.slice(start, next ? next.index : undefined).trim()
      if (!section) return []
      const lines = section.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
      const items: string[] = []
      let buffer: string[] = []
      for (const line of lines) {
        const listMatch = line.match(/^[-*+]\s+(.*)$/)
        const numMatch = line.match(/^\d+[.)]\s+(.*)$/)
        if (listMatch) {
          if (buffer.length) { items.push(buffer.join(' ')); buffer = [] }
          items.push(listMatch[1].trim())
        } else if (numMatch) {
          if (buffer.length) { items.push(buffer.join(' ')); buffer = [] }
          items.push(numMatch[1].trim())
        } else if (/^<!--/.test(line)) {
          continue
        } else if (/^#/ .test(line)) {
          break
        } else {
          buffer.push(line)
        }
      }
      if (buffer.length) items.push(buffer.join(' '))
      return items
    }

    const parsedSummary = Array.isArray(data.summary) && data.summary.length > 0 ? data.summary : extractSection(content, "Summary")
    const parsedNotes = Array.isArray(data.notes) && data.notes.length > 0 ? data.notes : extractSection(content, "Notes")

    return {
      slug: slug,
      title: data.title,
      author: data.author,
      summary: parsedSummary || [],
      notes: parsedNotes || [],
      rating: data.rating || 0,
      dateRead: data.dateRead || null,
      cover: data.cover || null,
      spineColor: data.spineColor || null,
      textColor: data.textColor || null,
    }
  }
  return null
}
