import * as Sentry from '@sentry/react' // https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/
import { ErrorRestartMap } from '../ErrorRestartMap/ErrorRestartMap'
import { SelectThemes } from './SelectThemes/SelectThemes'

export const MapSidebar = () => {
  return (
    <section className="absolute top-0 left-0 max-h-[calc(100vh-5.5rem)] w-72 overflow-y-auto overflow-x-visible  bg-white pt-1 pb-3 shadow-md">
      <Sentry.ErrorBoundary fallback={<ErrorRestartMap />}>
        <SelectThemes />
      </Sentry.ErrorBoundary>
    </section>
  )
}
