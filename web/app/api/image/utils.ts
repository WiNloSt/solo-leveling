import chapters from '@/../data/chapters.json'
import { createLock } from './lock'
import type { ChapterPage } from '@/app/chapters/[chapterNumber]/page'
import type { NextURL } from 'next/dist/server/web/next-url'
// @ts-expect-error there's no types for this lib and we don't care
import { makeRe } from 'next/dist/compiled/picomatch'
import type { RemotePattern } from 'next/dist/shared/lib/image-config'

export async function warmUpCacheForAdjacentChapters(chapterNumber: number, requestUrl: NextURL) {
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

export function matchRemotePattern(pattern: RemotePattern, url: URL): boolean {
  if (pattern.protocol !== undefined) {
    const actualProto = url.protocol.slice(0, -1)
    if (pattern.protocol !== actualProto) {
      return false
    }
  }
  if (pattern.port !== undefined) {
    if (pattern.port !== url.port) {
      return false
    }
  }

  if (pattern.hostname === undefined) {
    throw new Error(`Pattern should define hostname but found\n${JSON.stringify(pattern)}`)
  } else {
    if (!makeRe(pattern.hostname).test(url.hostname)) {
      return false
    }
  }

  if (!makeRe(pattern.pathname ?? '**', { dot: true }).test(url.pathname)) {
    return false
  }

  return true
}

export function hasMatch(remotePatterns: RemotePattern[], url: URL): boolean {
  return remotePatterns.some((p) => matchRemotePattern(p, url))
}
