import { Fragment, type ReactNode } from "react"

// Renders the inline subset of markdown used in book notes: **bold**,
// *italic* / _italic_, `code` and [links](url). Block-level structure
// (lists, headings) is already handled by lib/reading.ts.
const TOKEN = /(\*\*|__)(.+?)\1|(\*|_)(?!\s)(.+?)(?<!\s)\3(?![A-Za-z0-9])|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g

function parse(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0
    if (start > last) out.push(text.slice(last, start))
    const key = `${keyPrefix}-${i++}`
    if (m[2] !== undefined) out.push(<strong key={key}>{parse(m[2], key)}</strong>)
    else if (m[4] !== undefined) out.push(<em key={key}>{parse(m[4], key)}</em>)
    else if (m[5] !== undefined) out.push(<code key={key}>{m[5]}</code>)
    else if (m[6] !== undefined) {
      const external = /^https?:/.test(m[7])
      out.push(
        <a key={key} href={m[7]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {parse(m[6], key)}
        </a>
      )
    }
    last = start + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export default function InlineMarkdown({ text }: { text: string }) {
  return <Fragment>{parse(text, "md")}</Fragment>
}
