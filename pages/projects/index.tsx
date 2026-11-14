import Head from "next/head"
import Link from "next/link"
import { GetStaticProps } from "next"
import { getAllProjects, type ProjectMeta } from "@/lib/projects"
import { formatDateRange } from "@/lib/dates"

export default function Projects({ projects }: { projects: ProjectMeta[] }) {
  return (
    <>
      <Head>
        <title>Projects | Aly Hassan Youssef</title>
      </Head>
      <h1 className="page-title">Projects</h1>
      {projects.length === 0 ? (
        <p>None up yet, check back soon.</p>
      ) : (
        <ul className="projects">
          {projects.map((p) => (
            <li key={p.slug} className="project-entry">
              <h2 className="book-title">
                <Link href={`/projects/${p.slug}`}>{p.title}</Link>
              </h2>
              <p className="book-meta">{formatDateRange(p.startDate, p.endDate)}</p>
              {p.description ? <p>{p.description}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: { projects: getAllProjects() } }
}
