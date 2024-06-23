'use client'
import Image, { type ImageLoaderProps } from 'next/image'
import { useEffect, useRef } from 'react'

interface ClientImageProps {
  url: string
  width: number | undefined
  height: number | undefined
  pageNumber: number
  onEnterViewport: () => void
  priority: boolean
  chapterNumber: number
}

export function ChapterImage({
  url,
  width = 720,
  height = 2000,
  pageNumber,
  onEnterViewport,
  priority,
  chapterNumber,
}: ClientImageProps) {
  const ref = useIntersectionObserver(onEnterViewport)
  return (
    <Image
      ref={ref}
      loader={customImageLoader(chapterNumber)}
      key={url}
      src={url}
      alt={`Page ${pageNumber}`}
      width={width}
      height={height}
      quality={75}
      sizes="(max-width: 1279px) 540px, 100vw"
      className="max-w-lg xl:max-w-[720px] w-full"
      priority={priority}
    />
  )
}

function customImageLoader(chapterNumber: number) {
  return ({ src, width, quality }: ImageLoaderProps) => {
    return `/api/image?url=${src}&w=${width}&q=${quality || 80}&chapter=${chapterNumber}`
  }
}

function useIntersectionObserver(onEnterViewport: () => void) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onEnterViewport()
          }
        })
      },
      {
        threshold: 0,
      }
    )

    if (ref.current) {
      const refNode = ref.current
      observer.observe(ref.current)

      return () => {
        observer.unobserve(refNode)
      }
    }
  }, [onEnterViewport])

  return ref
}
