'use client'

import * as Sentry from '@sentry/react' // https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/
import { ErrorRestartMap } from '../ErrorRestartMap/ErrorRestartMap'
import { SelectThemes } from './SelectThemes/SelectThemes'

export const MapSidebar = () => {
  return (
    <section className="absolute left-0 top-0 max-h-[calc(100vh-5.5rem)] w-72 overflow-y-auto overflow-x-visible  bg-white pb-3 pt-1 shadow-md">
      <Sentry.ErrorBoundary fallback={<ErrorRestartMap />}>
        <SelectThemes />
      </Sentry.ErrorBoundary>
    </section>
  )
}
