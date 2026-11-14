import Head from "next/head"
import Link from "next/link"
import { GetStaticPaths, GetStaticProps } from "next"
import { getAllProjects, getProjectBySlug, type Project } from "@/lib/projects"
import { formatDateRange } from "@/lib/dates"

export default function ProjectPage({ project }: { project: Project }) {
  return (
    <>
      <Head>
        <title>{`${project.title} | Projects`}</title>
      </Head>
      <p className="back-link">
        <Link href="/projects">← All projects</Link>
      </p>
      <h1 className="page-title">{project.title}</h1>
      <p className="book-meta">{formatDateRange(project.startDate, project.endDate)}</p>
      {/* Rendered at build time from content/projects/<slug>.md, which is our own content. */}
      <article className="markdown" dangerouslySetInnerHTML={{ __html: project.html }} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: getAllProjects().map((p) => ({ params: { slug: p.slug } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const project = getProjectBySlug(ctx.params?.slug as string)
  if (!project) return { notFound: true }
  return { props: { project } }
}
