import { LinkNoPrefetch } from './LinkNoPrefetch'

export function Header() {
  return (
    <header className="bg-slate-100">
      <nav className="mx-auto flex py-3 px-4 max-w-7xl" aria-label="Global">
        <div className="flex gap-x-12">
          <div className="relative">
            <LinkNoPrefetch href="/chapters">
              <button
                type="button"
                className="flex gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                aria-expanded="false">
                Chapters
              </button>
            </LinkNoPrefetch>
          </div>
        </div>
      </nav>
    </header>
  )
}
