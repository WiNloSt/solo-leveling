'use client'
import Image from 'next/image'
import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react'
import { QUALITY, createImageUrl } from './utils'

interface ClientImageProps {
  url: string
  width: number | undefined
  height: number | undefined
  pageNumber: number
  onEnterViewport: () => void
  priority: boolean
  setRequestImageWidth: Dispatch<SetStateAction<number>>
}

export function ChapterImage({
  url,
  width = 720,
  height = 2000,
  pageNumber,
  onEnterViewport,
  priority,
  setRequestImageWidth,
}: ClientImageProps) {
  const ref = useIntersectionObserver(onEnterViewport)
  return (
    <Image
      ref={ref}
      loader={createImageUrl}
      onLoad={(e) => {
        const width = new URLSearchParams((e.target as HTMLImageElement).currentSrc).get('w')
        if (width) {
          setRequestImageWidth(Number(width))
        }
      }}
      key={url}
      src={url}
      alt={`Page ${pageNumber}`}
      width={width}
      height={height}
      quality={QUALITY}
      sizes="(max-width: 1279px) 540px, 100vw"
      className="max-w-lg xl:max-w-[720px] w-full"
      priority={priority}
    />
  )
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
