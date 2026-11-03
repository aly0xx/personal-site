// Stands in for a cover when a book has no image yet.
export default function TypedCover({
  title,
  author,
  face,
}: {
  title: string
  author: string
  face: { background: string; color: string }
}) {
  return (
    <span className="typed-cover" style={face}>
      <span>{title.split(":")[0]}</span>
      <span>{author}</span>
    </span>
  )
}
