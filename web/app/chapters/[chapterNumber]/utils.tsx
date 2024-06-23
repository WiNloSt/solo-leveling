import { type ImageLoaderProps } from 'next/image'
import type { ChapterPage } from './page'

export function createImageUrl({ src, width, quality }: ImageLoaderProps) {
  return `/api/image?url=${src}&w=${width}&q=${quality}`
}

export async function loadPages(chapterNumber: number | string): Promise<ChapterPage[]> {
  return (await import(`@/../data/pages/Solo Leveling Chapter ${chapterNumber}.json`)).default
}

export const QUALITY = 75
