import Head from 'next/head'
import { X_URL, YOUTUBE_URL } from '@/components/SocialLinks'

// Add each new timelapse to the end, as { url: "https://x.com/aly0xx/status/..." }
const TIMELAPSES: { url: string }[] = []

export default function Timelapse() {
  return (
    <>
      <Head>
        <title>Timelapse | Aly Hassan Youssef</title>
      </Head>
      <h1 className="page-title">Timelapse</h1>
      <p className="page-note">
        Timelapses of my work, posted on <a target="_blank" rel="noopener noreferrer" href={X_URL}>X</a> and <a target="_blank" rel="noopener noreferrer" href={YOUTUBE_URL}>YouTube</a>.
      </p>
      {TIMELAPSES.length === 0 ? (
        <p>None up yet, check back soon.</p>
      ) : (
        <ol className="timelapses">
          {TIMELAPSES.map((timelapse, index) => (
            <li key={timelapse.url}>
              <a target="_blank" rel="noopener noreferrer" href={timelapse.url}>#{index + 1}</a>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}
