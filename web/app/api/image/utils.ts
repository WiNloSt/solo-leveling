import chapters from '@/../data/chapters.json'
import { createLock } from './lock'
import type { ChapterPage } from '@/app/chapters/[chapterNumber]/page'
import type { NextURL } from 'next/dist/server/web/next-url'

export async function warmUpCacheForAdjacentChapters(chapterNumber: number, requestUrl: NextURL) {
  const env = process.env.VERCEL_ENV
  console.log({ env })
  const isProduction = env === 'production'
  // Don't do this in development environment because it's calling functions too many times
  if (chapterNumber < 0 || !isProduction) {
    return
  }
  const key = `chapter:${chapterNumber}`
  const [isLockedAcquired, deleteLock] = await createLock(key)
  if (!isLockedAcquired) {
    return
  }

  await warmUpCacheForNextChapter(chapterNumber, requestUrl)
  await warmUpCacheForPreviousChapter(chapterNumber, requestUrl)

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
  nextChapter: { name: string; link: string; number: number },
  requestUrl: NextURL
) {
  const pages: ChapterPage[] = (
    await import(`@/../data/pages/Solo Leveling Chapter ${nextChapter.number}.json`)
  ).default

  await Promise.all(
    pages.map((page) => {
      const url = constructImageUrl(page.url, requestUrl)
      return fetch(url, { method: 'HEAD' }).catch((e) => {
        if (e.name !== 'AbortError') {
          throw e
        }
      })
    })
  )
}

function constructImageUrl(url: string, requestUrl: NextURL) {
  const params = new URLSearchParams(requestUrl.searchParams)
  params.delete('chapter')
  params.set('url', url)
  return new URL(`/api/image?${params.toString()}`, requestUrl.origin)
}
