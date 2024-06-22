'use server'
import chapters from '@/../data/chapters.json'
import type { Chapter } from '@/../types'
import type { Metadata } from 'next'
import { ChapterContent } from './ChapterContent'

interface ChapterParameters {
  chapterNumber: string
}

export async function generateMetadata({
  params: { chapterNumber },
}: {
  params: ChapterParameters
}) {
  return {
    title: chapterNumber,
  } as Metadata
}

export default async function Chapter({
  params: { chapterNumber },
}: {
  params: ChapterParameters
}) {
  const pageUrls = (
    await import(`../../../../data/pages/Solo Leveling Chapter ${chapterNumber}.json`)
  ).default
  const { nextPage, previousPage } = await getNavigation(parseFloat(chapterNumber))
  const chapter: Chapter = chapters.find(
    (chapter) => chapter.number === parseFloat(chapterNumber)
  ) as Chapter

  return (
    <ChapterContent
      chapter={chapter}
      nextPage={nextPage}
      previousPage={previousPage}
      pageUrls={pageUrls}
    />
  )
}

async function getNavigation(chapterNumber: number) {
  const currentChapterIndex = chapters.findIndex((chapter) => chapter.number === chapterNumber)
  return {
    previousPage: chapters[currentChapterIndex - 1]?.number,
    nextPage: chapters[currentChapterIndex + 1]?.number,
  }
}
