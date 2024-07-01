'use client'
import { useEffect, useRef } from 'react'

export function useIntersectionObserver(onIntersecting: (isIntersecting: boolean) => void) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onIntersecting(entry.isIntersecting)
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
  }, [onIntersecting])

  return ref
}
