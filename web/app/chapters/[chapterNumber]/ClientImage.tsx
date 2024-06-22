'use client'
import Image, { type ImageLoaderProps } from 'next/image'

interface ClientImageProps {
  url: string
  pageNumber: number
}

export function ClientImage({ url, pageNumber }: ClientImageProps) {
  return (
    <Image
      loader={customImageLoader}
      key={url}
      src={url}
      alt={`Page ${pageNumber}`}
      width={720}
      height={1000}
      quality={75}
      sizes="(max-width: 1279px) 540px, 100vw"
      className="max-w-lg xl:max-w-[720px] w-full"
      priority
    />
  )
}

function customImageLoader({ src, width, quality }: ImageLoaderProps) {
  return `/api/image?url=${src}&w=${width}&q=${quality || 80}`
}
