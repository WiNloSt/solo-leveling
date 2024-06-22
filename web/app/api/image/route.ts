import type { NextRequest } from 'next/server'
import sharp, { type Metadata, type Sharp } from 'sharp'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  const quality = Number(searchParams.get('q'))
  const width = Number(searchParams.get('w'))
  if (!url) {
    return new Response('`url` must be specified.', { status: 400, statusText: 'Bad Request' })
  }

  if (quality <= 0) {
    return new Response('`q` must be a positive integer from 1 to 100.', {
      status: 400,
      statusText: 'Bad Request',
    })
  }

  if (width <= 0) {
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

  const { data, info } = await processImage(image, { width, quality, metadata })
  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': `public, max-age=${30 * DAY};`,
      'Content-Length': info.size.toString(),
    },
  })
}

const DAY = 24 * 60 * 60

async function processImage(
  image: Sharp,
  { quality, width, metadata }: { quality: number; width: number; metadata: Metadata }
) {
  return image
    .resize({ width: width > (metadata.width || NaN) ? metadata.width : width })
    .jpeg({ quality: quality })
    .toBuffer({ resolveWithObject: true })
}
