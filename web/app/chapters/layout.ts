import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '나 혼자만 레벨업 (영어) %s화',
    default: '나 혼자만 레벨업 (영어)',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
