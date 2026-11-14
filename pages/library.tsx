import Head from 'next/head'
import React, { JSX, useMemo, useState } from 'react'
import { clothFor } from '@/lib/book-colors'
import TypedCover from '@/components/TypedCover'
import covers from '@/lib/data/library-covers.json'

export default function Library(): JSX.Element {
  const [query, setQuery] = useState('')

  const books = useMemo(() => [
    'Percy Jackson and the Olympians: The Lightning Thief',
    'Percy Jackson and the Olympians: The Sea of Monsters',
    'Percy Jackson and the Olympians: The Titan\'s Curse',
    'Percy Jackson and the Olympians: The Battle of the Labyrinth',
    'Percy Jackson and the Olympians: The Last Olympian',
    'The Heroes of Olympus: The Lost Hero',
    'The Heroes of Olympus: The Son of Neptune',
    'The Heroes of Olympus: The Mark of Athena',
    'The Heroes of Olympus: The House of Hades',
    'The Heroes of Olympus: The Blood of Olympus',
    'The Trials of Apollo: The Hidden Oracle',
    'The Trials of Apollo: The Dark Prophecy',
    'The Trials of Apollo: The Burning Maze',
    'The Trials of Apollo: The Tyrant\'s Tomb',
    'The Trials of Apollo: The Tower of Nero',
    'Magnus Chase and the Gods of Asgard: The Sword of Summer',
    'Magnus Chase and the Gods of Asgard: The Hammer of Thor',
    'Magnus Chase and the Gods of Asgard: The Ship of the Dead',
    'Percy Jackson and the Greek Heroes',
    'Percy Jackson and the Greek Gods',
    'Percy Jackson - The Demigod Files',
    'The Maze Runner',
    'The Scorch Trials',
    'The Death Cure',
    'The Kill Order',
    'The Fever Code',
    'Applied Psychology: Individual and Organizational Effectiveness',
    'Chandra\'s Cosmos',
    'Remembering the Kanji 1',
    'Steve Jobs - Walter Isaacson',
    'iWoz - Steve Wozniak',
    'Einstein: His Life and Universe - Walter Isaacson',
    'Elon Musk - Walter Isaacson',
    'Elon Musk - Ashlee Vance',
    'The Code Breaker - Walter Isaacson',
    'American Prometheus - Kai Bird and Martin J. Sherwin',
    'Shoe Dog - Phil Knight',
    'Prince of Persia - Jordan Mechner',
    'When the Heavens Went on Sale - Ashlee Vance',
    'The Idea Factory - Jon Gertner',
    'A History of Ancient Greece in Fifty Lives - David Stuttard',
    'Sapiens - Yuval Noah Harari',
    'Mother of God - Paul Rosolie',
    'Junglekeeper - Paul Rosolie',
    'The Israel Lobby - John J. Mearsheimer and Stephen M. Walt',
    'Liftoff - Eric Berger',
    'Reentry - Eric Berger',
    'Eat and Run - Scott Jurek',
    'The Penultimate Truth - Philip K. Dick',
    'Non-Stop - Brian Aldiss',
    'The Fountains of Paradise - Arthur C. Clarke',
    'The First Men on the Moon - H.G. Wells',
    'Fundamentals of Thermodynamics - Richard E. Sonntag',
    'Winnetou 1-3 (German) - Karl May',
    'Franz Kafka Gessammelte Werke (German) - Franz Kafka',
    'Die Unendliche Geschichte (German) - Michael Ende',
    'NSA (German) - Andreas Eschbach',
    'Drache und Diamant (German) - Kai Meyer',
    'Das Gesetz (German) - John Grisham',
    'Teufelstor (German) - Oliver Clussler',
    'Die Tore der Welt (German) - Ken Follett',
    'Das Spiel des Alchemisten (German) - Richard Dubbel',
    'The Hobbit - J.R.R. Tolkien',
    'The Lord of the Rings: The Fellowship of the Ring - J.R.R. Tolkien',
    'The Lord of the Rings: The Two Towers - J.R.R. Tolkien',
    'The Lord of the Rings: The Return of the King - J.R.R. Tolkien',
    'The Hunger Games - Suzanne Collins',
    'Catching Fire - Suzanne Collins',
    'Mockingjay - Suzanne Collins',
    'The Ballad of Songbirds and Snakes - Suzanne Collins',
    'Wool - Hugh Howey',
    'Shift - Hugh Howey',
    'Dust - Hugh Howey',
    'The Martian - Andy Weir',
    'Artemis - Andy Weir',
    'Project Hail Mary - Andy Weir',
    'Ready Player One - Ernest Cline',
    'The Moon is a Harsh Mistress - Robert A. Heinlein',
    'Stranger in a Strange Land - Robert A. Heinlein',
    'A Game of Thrones - George R.R. Martin',
    'Harry Potter and the Chamber of Secrets - J.K. Rowling',
    'Harry Potter and the Prisoner of Azkaban - J.K. Rowling',
    'Harry Potter and the Goblet of Fire - J.K. Rowling',
    'Harry Potter and the Order of the Phoenix - J.K. Rowling',
    'Harry Potter and the Half-Blood Prince - J.K. Rowling',
    'Norse Mythology - Neil Gaiman',
    'Assassin\'s Creed: Odyssey - Gordon Doherty',
    'Attack on Titan 1-5 - Hajime Isayama',
    'Fullmetal Alchemist 1-27 - Hiromu Arakawa',
    '1Q84 (Japanese) - Haruki Murakami',
    'Bakuman 1-20 (Japanese) - Tsugumi Ohba and Takeshi Obata',
    'Deep Learning - Andrew Glassner',
    'Competitive Programmer\'s Handbook - Antti Laaksonen',
    'Foundations of Aerodynamics - Arnold M. Kuethe and Chuen-Yen Chow',
    'The C Programming Language - Brian W. Kernighan and Dennis M. Ritchie',
    'Digial Fundamentals - Thomas L. Floyd',
    'Anna Karenina - Leo Tolstoy',
    'War and Peace - Leo Tolstoy',
    'The Brothers Karamazov - Fyodor Dostoevsky',
    'Siddhartha - Hermann Hesse',
    'The Colossus Rises - Peter Lerangis',
    'Murder on the Orient Express - Agatha Christie',
    'Treasure Island - Robert Louis Stevenson',
    'Around the World in Eighty Days - Jules Verne',
    'Adventures of Huckleberry Finn - Mark Twain',
    'Journey to the Center of the Earth - Jules Verne',
    'The Alchemist - Paulo Coelho',
    'A Gentleman in Moscow - Amor Towles',
    'The Republic - Plato',
    'Selected Works - Cicero',
    'Nichomachean Ethics - Aristotle',
    'Meditations - Marcus Aurelius',
    'Can\'t Hurt Me - David Goggins',
    'The First 20 hours - Josh Kaufman',
    'Ikigai - Héctor García and Francesc Miralles',
    'The Illiad - Homer',
    'The Odyssey - Homer',
    'The Diary of a Young Girl - Anne Frank',
    'Life Without Limits - Nick Vujicic',
    'The $100 Startup - Chris Guillebeau',
    'The Lean Startup - Eric Ries',
    'The Personal MBA - Josh Kaufman',
    'Influence - Robert Cialdini',
    'How to Win Friends and Influence People - Dale Carnegie',
    'The Power of Now - Eckhart Tolle',
    'Deep Work - Cal Newport',
    'Zero to One - Peter Thiel',
    'Some Stephen Hawking books',
    'Atomic Habits - James Clear',
    'The Wealth of Nations 1-3 - Adam Smith',
    'The General Theory of Employment, Interest and Money - John Maynard Keynes',
    'Capitalism and Freedom - Milton Friedman',
    'The Road to Serfdom - Friedrich Hayek',
    'Guns, Germs, and Steel - Jared Diamond',
    'The Selfish Gene - Richard Dawkins',
    'Poor Charlie\'s Almanack - Charlie Munger',
    'Endurance - Alfred Lansing',
    'The Wright Brothers - David McCullough',
    'Elementary Linear Algebra - Howard Anton',
    'Mathematical Statistics with Applications - Wackerly, Mendenhall, Scheaffer',
    'Discrete Mathematics and Its Applications - Kenneth H. Rosen',
    'The Feynman Lectures on Physics (Volume 1) - Richard P. Feynman',
    'Computer Organization and Design - David A. Patterson and John L. Hennessy',
  ], [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return books
    return books.filter((b) => b.toLowerCase().includes(q))
  }, [query, books])

  return (
    <>
      <Head>
        <title>Library | Aly Hassan Youssef</title>
      </Head>
      <h1 className="page-title">My Library</h1>

      <label htmlFor="book-search" className="sr-only">Search books</label>
      <input
        id="book-search"
        className="search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books..."
      />

      {filtered.length === 0 ? (
        <p>No results</p>
      ) : (
        <ul className="library">
          {filtered.map((entry) => <LibraryBook key={entry} entry={entry} />)}
        </ul>
      )}
    </>
  )
}

type LibraryCover = { cover: string; spineColor: string; textColor: string }

// Each book stands face-out, showing its front cover.
function LibraryBook({ entry }: { entry: string }) {
  const { title, author, group } = parseEntry(entry)
  const match = (covers as Record<string, LibraryCover>)[entry]
  const label = author ? `${title} by ${author}` : title

  return (
    <li className="library-book">
      {match ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={match.cover} alt={label} loading="lazy" />
          {/* Shown on hover; the image's alt text already names the book for screen readers. */}
          <span className="library-caption" aria-hidden="true">
            <span className="library-caption-title">{title}</span>
            {author ? <span className="library-caption-author">{author}</span> : null}
          </span>
        </>
      ) : (
        <span className="library-typed" role="img" aria-label={label}>
          <TypedCover title={title} author={author} face={clothFor(group)} />
        </span>
      )}
    </li>
  )
}

// Book series whose entries are written "Series: Title". Any other colon is
// part of the book's own title, as in "Einstein: His Life and Universe".
const SERIES = new Set([
  'Percy Jackson and the Olympians',
  'The Heroes of Olympus',
  'The Trials of Apollo',
  'Magnus Chase and the Gods of Asgard',
  'The Lord of the Rings',
])

// Authors for the entries written without one, by series or by title.
const AUTHORS: Record<string, string> = {
  'Percy Jackson and the Olympians': 'Rick Riordan',
  'The Heroes of Olympus': 'Rick Riordan',
  'The Trials of Apollo': 'Rick Riordan',
  'Magnus Chase and the Gods of Asgard': 'Rick Riordan',
  'Percy Jackson and the Greek Heroes': 'Rick Riordan',
  'Percy Jackson and the Greek Gods': 'Rick Riordan',
  'The Maze Runner': 'James Dashner',
  'The Scorch Trials': 'James Dashner',
  'The Death Cure': 'James Dashner',
  'The Kill Order': 'James Dashner',
  'The Fever Code': 'James Dashner',
  'Chandra\'s Cosmos': 'Wallace H. Tucker',
  'Remembering the Kanji 1': 'James W. Heisig',
  'Some Stephen Hawking books': 'Stephen Hawking',
}

// Entries whose " - " isn't separating the title from the author.
const OVERRIDES: Record<string, { title: string; author: string }> = {
  'Percy Jackson - The Demigod Files': { title: 'The Demigod Files', author: 'Rick Riordan' },
}

// Entries look like "Title - Author" or "Series: Title". Books in a series, or
// by one author, share a cloth colour, the way a set does on a real shelf.
function parseEntry(entry: string) {
  const dash = entry.lastIndexOf(" - ")
  const full = dash > -1 ? entry.slice(0, dash) : entry
  const written = dash > -1 ? entry.slice(dash + 3) : ""
  const colon = full.indexOf(": ")
  const prefix = colon > -1 ? full.slice(0, colon) : ""
  const series = SERIES.has(prefix) ? prefix : ""
  const group = written || prefix || full

  const override = OVERRIDES[entry]
  if (override) return { ...override, group }
  const title = series ? full.slice(colon + 2) : full
  const author = written || AUTHORS[series] || AUTHORS[full] || ""
  return { title, author, group }
}
