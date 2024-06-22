import Link from 'next/link'

export function LinkNoPrefetch(props: React.PropsWithChildren<React.ComponentProps<typeof Link>>) {
  return <Link {...props} prefetch={false} />
}
