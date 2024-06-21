import Image from 'next/image'
import Link from 'next/link'
import chapters from '../../../../data/chapters.json'
import type { Chapter } from '../../../../types'

export default async function Chapter({
  params: { chapterNumber },
}: {
  params: { chapterNumber: string }
}) {
  const pages = (await import(`../../../../data/pages/Solo Leveling Chapter ${chapterNumber}.json`))
    .default
  const { nextPage, previousPage } = await getNavigation(parseFloat(chapterNumber))
  const chapter: Chapter = chapters.find(
    (chapter) => chapter.number === parseFloat(chapterNumber)
  ) as Chapter
  return (
    <>
      <h1 className="text-xl">{chapter.name}</h1>
      <div className="flex flex-col items-center -mx-4">
        <Navigation next={nextPage} previous={previousPage} />
        {pages.map((page: string) => {
          return (
            <Image
              key={page}
              src={page}
              alt={`Page ${page}`}
              width={720}
              height={1000}
              quality={85}
              sizes="(max-width: 1279px) 540px, 100vw"
              className="max-w-full md:max-w-lg xl:max-w-full"
            />
          )
        })}
        <Navigation next={nextPage} previous={previousPage} />
      </div>
    </>
  )
}

function Navigation({ previous, next }: { previous: number; next: number }) {
  return (
    <div className="my-2">
      <Link href={`/chapters/${previous}`}>
        <button className="bg-slate-400 rounded-full p-3">
          <Image
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02LjEzODQ2IDEyLjYzMTJDNi4xNTk4MiAxMi42NTczIDYuMTgyNyAxMi42ODI3IDYuMjA3MTEgMTIuNzA3MUw2LjkxNDIxIDEzLjQxNDJMMTMuMjc4MiAxOS43NzgyQzEzLjY2ODcgMjAuMTY4NyAxNC4zMDE5IDIwLjE2ODcgMTQuNjkyNCAxOS43NzgyQzE1LjA4MjkgMTkuMzg3NyAxNS4wODI5IDE4Ljc1NDUgMTQuNjkyNCAxOC4zNjRMOC4zMjg0MyAxMkwxNC42ODU2IDUuNjQyODhMMTQuNjkyNCA1LjYzNjA3QzE1LjA4MjkgNS4yNDU1NSAxNS4wODI5IDQuNjEyMzggMTQuNjkyNCA0LjIyMTg2QzE0LjMwMTkgMy44MzEzMyAxMy42Njg3IDMuODMxMzMgMTMuMjc4MiA0LjIyMTg2TDEzLjI3ODIgNC4yMjE4M0w2LjkxNDIxIDEwLjU4NThMNi4yMDcxMSAxMS4yOTI5QzUuODQwOTkgMTEuNjU5IDUuODE4MTEgMTIuMjM4NCA2LjEzODQ2IDEyLjYzMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
            width="24"
            height="24"
            alt="prev"
          />
        </button>
      </Link>
      <Link href={`/chapters/${next}`}>
        <button className="bg-slate-400 rounded-full p-3 ml-10">
          <Image
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNy44NjE1IDEyLjYzMTJDMTcuODQwMiAxMi42NTczIDE3LjgxNzMgMTIuNjgyNyAxNy43OTI5IDEyLjcwNzFMMTcuMDg1OCAxMy40MTQyTDEwLjcyMTggMTkuNzc4MkMxMC4zMzEzIDIwLjE2ODcgOS42OTgxNCAyMC4xNjg3IDkuMzA3NjEgMTkuNzc4MkM4LjkxNzA5IDE5LjM4NzcgOC45MTcwOSAxOC43NTQ1IDkuMzA3NjEgMTguMzY0TDE1LjY3MTYgMTJMOS4zMTQ0NSA1LjY0Mjg4TDkuMzA3NTggNS42MzYwN0M4LjkxNzA2IDUuMjQ1NTUgOC45MTcwNiA0LjYxMjM4IDkuMzA3NTggNC4yMjE4NkM5LjY5ODEgMy44MzEzMyAxMC4zMzEzIDMuODMxMzMgMTAuNzIxOCA0LjIyMTg2TDEwLjcyMTggNC4yMjE4M0wxNy4wODU4IDEwLjU4NThMMTcuNzkyOSAxMS4yOTI5QzE4LjE1OSAxMS42NTkgMTguMTgxOSAxMi4yMzg0IDE3Ljg2MTUgMTIuNjMxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="
            width="24"
            height="24"
            alt="prev"
          />
        </button>
      </Link>
    </div>
  )
}

async function getNavigation(chapterNumber: number) {
  const currentChapterIndex = chapters.findIndex((chapter) => chapter.number === chapterNumber)
  return {
    previousPage: chapters[currentChapterIndex - 1]?.number,
    nextPage: chapters[currentChapterIndex + 1]?.number,
  }
}
