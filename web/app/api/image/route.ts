import type { NextRequest } from 'next/server'
import sharp, { type Metadata, type Sharp } from 'sharp'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  const quality = Number(searchParams.get('q'))
  const width = Number(searchParams.get('w'))
  if (!url) {
    return new Response('No `url` specified.', { status: 400, statusText: 'Bad Request' })
  }

  if (quality < 0 || isNaN(quality)) {
    return new Response('`q` must be a positive integer from 0 to 100.', {
      status: 400,
      statusText: 'Bad Request',
    })
  }

  if (quality < 0 || isNaN(quality)) {
    return new Response('`w` must be a positive integer.', {
      status: 400,
      statusText: 'Bad Request',
    })
  }

  const imageBuffer = await fetch(url)
    .then((response) => response.blob())
    .then((blob) => blob.arrayBuffer())

  const image = sharp(imageBuffer)
  const metadata = await image.metadata()
  console.log({ metadata })

  return new Response(processImage(image, { width, quality, metadata }) as any, {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': `public, max-age=${30 * DAY};`,
    },
  })
}

const DAY = 24 * 60 * 60

function processImage(
  image: Sharp,
  { quality, width, metadata }: { quality: number; width: number; metadata: Metadata }
) {
  return image
    .resize({ width: width > (metadata.width || NaN) ? metadata.width : width })
    .jpeg({ quality: quality })
}
