import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-slate-100">
      <nav className="mx-auto flex py-3 px-4 max-w-7xl" aria-label="Global">
        <div className="flex gap-x-12">
          <div className="relative">
            <Link href="/chapters">
              <button
                type="button"
                className="flex gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                aria-expanded="false">
                Chapters
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
