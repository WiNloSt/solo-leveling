import chapters from '@/../data/chapters.json'
import { createLock } from './lock'
import type { ChapterPage } from '@/app/chapters/[chapterNumber]/page'
import type { NextURL } from 'next/dist/server/web/next-url'

export async function warmUpCacheForAdjacentChapters(chapterNumber: number, requestUrl: NextURL) {
  const env = process.env.VERCEL_ENV
  const isProduction = env === 'production'
  // Don't do this in development environment because it's calling functions too many times
  if (chapterNumber < 0 || !isProduction) {
    // if (chapterNumber < 0) {
    return
  }
  const key = `chapter:${chapterNumber}`
  const [isLockedAcquired, deleteLock] = await createLock(key)
  if (!isLockedAcquired) {
    return
  }

  warmUpCacheForNextChapter(chapterNumber, requestUrl)
  warmUpCacheForPreviousChapter(chapterNumber, requestUrl)

  await deleteLock()
}

async function warmUpCacheForNextChapter(chapterNumber: number, requestUrl: NextURL) {
  const currentChapterIndex = chapters.findIndex((chapter) => chapter.number === chapterNumber)
  const nextChapter = chapters[currentChapterIndex + 1]
  if (!nextChapter) {
    return
  }

  await warmUpCacheForChapter(nextChapter, requestUrl)
}

async function warmUpCacheForPreviousChapter(chapterNumber: number, requestUrl: NextURL) {
  const currentChapterIndex = chapters.findIndex((chapter) => chapter.number === chapterNumber)
  const previousChapter = chapters[currentChapterIndex - 1]
  if (!previousChapter) {
    return
  }

  await warmUpCacheForChapter(previousChapter, requestUrl)
}

async function warmUpCacheForChapter(
  chapter: { name: string; link: string; number: number },
  requestUrl: NextURL
) {
  const pages: ChapterPage[] = (
    await import(`@/../data/pages/Solo Leveling Chapter ${chapter.number}.json`)
  ).default

  await Promise.all(
    pages.map((page) => {
      const url = constructImageUrl(page.url, chapter.number, requestUrl)
      return fetch(url, {
        headers: {
          'X-Do-Not-Prefetch-Chapters': 'true',
        },
      }).catch((e) => {
        if (e.name !== 'AbortError') {
          throw e
        }
      })
    })
  )
}

function constructImageUrl(url: string, chapterNumber: number, requestUrl: NextURL) {
  const params = new URLSearchParams(requestUrl.searchParams)
  params.set('url', url)
  return new URL(
    `/api/image?url=${url}&w=${params.get('w')}&q=${params.get('q')}&chapter=${chapterNumber}`,
    requestUrl.origin
  )
}
