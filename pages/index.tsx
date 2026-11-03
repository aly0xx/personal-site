import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Aly Hassan Youssef</title>
      </Head>
      <div className="home">
        <h1 className="page-title">Aly Hassan Youssef</h1>
        <h2>Some things about me:</h2>

        <ul>
          <li>I&apos;m currently a Computer Science student at the American University in Cairo (AUC) <br /> [As of January 2026 I&apos;m in my 2nd semester of junior year]</li>
          <li>I love going on deep dives on topics that interest me and building hands on projects</li>
          <li>I enjoy working long hours, mostly in the morning, to build momentum on the various projects I&apos;m working on</li>
          <li>My most significant project so far is (<a target='blank' rel='noopener noreferrer' href={'https://www.teachmegcse.com'}>Teach Me Gcse</a>) where I developed tools to help parse and extract questions and answers from GCSE exam sheets with wich we built tools to help students and teachers</li>
        </ul>

        <h2>Some of the things I&apos;m interested in:</h2>
        <ul>
          <li>Building intuitive and beatiful products that help people solve difficult problems that take a lot of time</li>
          <li>Understanding how innovation happens and how great products are developed (technological advances just don&apos;t just happen on their own)</li>
          <li>Interior design that makes people more productive on things they care deeply about</li>
        </ul>
        <p>Checkout my <Link href={'/reading'}>reading</Link> and <Link href={'/deep-dives'}>deep dives</Link></p>
      </div >
    </>
  );
}
