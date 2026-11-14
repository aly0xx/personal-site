import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"
import { readDateSortKey } from "@/lib/dates"

// Each project is content/projects/<slug>.md with frontmatter:
//   title: "..."            required
//   description: "..."      optional, one line shown on the /projects list
//   startDate: "M/D/YYYY"   required
//   endDate: "M/D/YYYY"     optional; leave it out while the project is ongoing
// Files starting with "_" (like _template.md) are ignored.
export type ProjectMeta = {
  slug: string
  title: string
  description: string | null
  startDate: string | null
  endDate: string | null
}
export type Project = ProjectMeta & { html: string }

const PROJECTS_PATH = path.join(process.cwd(), "content/projects")

function slugs(): string[] {
  if (!fs.existsSync(PROJECTS_PATH)) return []
  return fs
    .readdirSync(PROJECTS_PATH)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => path.parse(f).name)
}

function read(slug: string): { meta: ProjectMeta; content: string } | null {
  const file = path.join(PROJECTS_PATH, `${slug}.md`)
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, "utf-8"))
  return {
    meta: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
    },
    content,
  }
}

// Ongoing projects first, then by most recent start.
export function getAllProjects(): ProjectMeta[] {
  return slugs()
    .map((slug) => read(slug)!.meta)
    .sort((a, b) => {
      const ongoing = Number(!b.endDate) - Number(!a.endDate)
      return ongoing || readDateSortKey(b.startDate) - readDateSortKey(a.startDate)
    })
}

export function getProjectBySlug(slug: string): Project | null {
  const project = read(slug)
  if (!project) return null
  return { ...project.meta, html: marked.parse(project.content, { async: false }) }
}
