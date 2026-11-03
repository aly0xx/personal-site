// Cloth colours for books with no spine colour of their own.
const CLOTH = [
  { background: "#6d2b2b", color: "#f1f1ef" },
  { background: "#27473a", color: "#f1f1ef" },
  { background: "#23395b", color: "#f1f1ef" },
  { background: "#c39a3f", color: "#111111" },
  { background: "#a4552f", color: "#f1f1ef" },
  { background: "#56636b", color: "#f1f1ef" },
  { background: "#d8d2c1", color: "#111111" },
  { background: "#2e2c2a", color: "#f1f1ef" },
  { background: "#1f5a60", color: "#f1f1ef" },
  { background: "#8a8f5c", color: "#111111" },
  { background: "#7c3f58", color: "#f1f1ef" },
  { background: "#b9c3c0", color: "#111111" },
]

export function hash(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function clothFor(key: string) {
  return CLOTH[hash(key) % CLOTH.length]
}

export function bookFace(book: { title: string; spineColor: string | null; textColor: string | null }) {
  if (book.spineColor) return { background: book.spineColor, color: book.textColor ?? "#f1f1ef" }
  return clothFor(book.title)
}
