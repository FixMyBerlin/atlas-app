import { LayoutPage } from 'src/core/layouts/Layout--TODO-MIGRATE'
import { Link } from 'src/core/components/links'
import { MetaTags } from 'src/core/layouts/MetaTags'

export const NotFoundPage: React.FC = () => {
  return (
    <LayoutPage>
      <MetaTags noindex title="Seite nicht gefunden (Fehler 404)" />

      <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <p className="text-base font-semibold text-yellow-500">404</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Seite nicht gefunden
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Leider konnten wir diese Seite nicht finden.
              </p>
              <div className="mt-6">
                <Link to="/">
                  Zur Startseite
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </LayoutPage>
  )
}
