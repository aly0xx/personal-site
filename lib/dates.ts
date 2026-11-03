// Frontmatter dates are written as M/D/YYYY. Only the month and year are shown,
// so read them directly: new Date("2/30/2026") would roll over into March.
function parts(date: string): { month: number; year: number } | null {
  const match = date.match(/^(\d{1,2})\/\d{1,2}\/(\d{4})$/)
  if (!match) return null
  return { month: Number(match[1]), year: Number(match[2]) }
}

export function formatReadDate(date: string): string {
  const parsed = parts(date)
  if (!parsed) return date
  return new Date(Date.UTC(parsed.year, parsed.month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function readDateSortKey(date: string | null): number {
  if (!date) return 0
  const match = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return 0
  return Number(match[3]) * 10000 + Number(match[1]) * 100 + Number(match[2])
}
