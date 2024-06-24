import { type ImageLoaderProps } from 'next/image'
import type { ChapterPage } from './page'

export const MAX_IMAGE_WIDTH = 720

export function createImageUrl({ src, width, quality }: ImageLoaderProps) {
  const normalizedWidth = width <= MAX_IMAGE_WIDTH ? width : MAX_IMAGE_WIDTH
  return `/api/image?url=${src}&w=${normalizedWidth}&q=${quality}`
}

export async function loadPages(chapterNumber: number | string): Promise<ChapterPage[]> {
  return (await import(`@/../data/pages/Solo Leveling Chapter ${chapterNumber}.json`)).default
}

export const QUALITY = 75
