import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white">
      <nav className="mx-auto flex p-6 px-8" aria-label="Global">
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
