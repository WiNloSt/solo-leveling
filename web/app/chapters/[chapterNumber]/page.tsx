'use server'
import chapters from '@/../data/chapters.json'
import type { Chapter } from '@/../types'
import type { Metadata } from 'next'
import { ChapterContent } from './ChapterContent'
import { loadPages } from './utils'

interface ChapterParameters {
  chapterNumber: string
}

export interface ChapterPage {
  width: number
  height: number
  type: string
  mime: string
  wUnits: string
  hUnits: string
  length: number
  url: string
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

export const QUALITY = 75

export default async function Chapter({
  params: { chapterNumber },
}: {
  params: ChapterParameters
}) {
  const pages = await loadPages(chapterNumber)
  const { nextPage, previousPage } = await getNavigation(Number(chapterNumber))
  const chapterIndex: number = chapters.findIndex(
    (chapter) => chapter.number === parseFloat(chapterNumber)
  )

  return (
    <ChapterContent
      chapterIndex={chapterIndex}
      nextPage={nextPage}
      previousPage={previousPage}
      pages={pages}
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
