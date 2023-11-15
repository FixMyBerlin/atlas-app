'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Footer } from './_components/layouts/Footer/Footer'
import { Link } from './_components/links/Link'
import { buttonStyles } from './_components/links/styles'

type Props = {
  error: Error & { digest?: string }
}

export default function ErrorGlobalLayout({ error }: Props) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-full flex-grow flex-col bg-white">
          <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="py-16">
              <div className="text-center">
                <p className="text-base font-semibold text-amber-500">:-(</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Ein Fehler ist aufgetreten
                </h1>
                <p className="mt-2 text-base text-gray-500">Leider ist ein Fehler aufgetreten.</p>
                <div className="mt-6 space-x-5">
                  <Link href="/">
                    Zur Startseite
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
