import Link from 'next/link'
import chapters from '../../../data/chapters.json'
import { Chapter } from '../../../types'

export default function Home() {
  return (
    <ul>
      {chapters.map((chapter: Chapter) => {
        return (
          <li key={chapter.name} className="p-1">
            <Link href={`/chapter/${chapter.number}`} className="hover:underline">
              {chapter.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
