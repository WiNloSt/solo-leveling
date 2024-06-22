import chapters from '../../../data/chapters.json'
import { Chapter } from '../../../types'
import { LinkNoPrefetch } from '../components/LinkNoPrefetch'

export default function Chapters() {
  return (
    <ul>
      {chapters.map((chapter: Chapter) => {
        return (
          <li key={chapter.name} className="p-1">
            <LinkNoPrefetch href={`/chapters/${chapter.number}`} className="hover:underline">
              {chapter.name}
            </LinkNoPrefetch>
          </li>
        )
      })}
    </ul>
  )
}
