import { useParam } from '@blitzjs/next'
import { useQuery } from '@blitzjs/rpc'
import * as Sentry from '@sentry/react' // https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/
import { parseAsFloat, useQueryState } from 'next-usequerystate'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { ErrorRestartMap } from 'src/core/components/MapInterface/ErrorRestartMap/ErrorRestartMap'
import { Spinner } from 'src/core/components/Spinner/Spinner'
import { LayoutMap } from 'src/core/layouts/LayoutMap'
import { MetaTags } from 'src/core/layouts/MetaTags'
import { customParse, customStringify } from 'src/core/useQueryState/customParseStringify'
import { isDev } from 'src/core/utils'
import getRegion from 'src/regions/queries/getRegion'

export const Region = () => {
  const regionSlug = useParam('regionSlug', 'string')
  const [region] = useQuery(getRegion, { slug: regionSlug! })

  // const { lat, lng, zoom, config } = useSearch<LocationGenerics>()
  useQueryState('lat', parseAsFloat)
  useQueryState('lng', parseAsFloat)
  useQueryState('zoom', parseAsFloat)
  useQueryState('config', {
    parse: (query: string) => customParse(query),
    serialize: (value) => customStringify(value),
  })

  return (
    <>
      <MetaTags noindex title={`Radverkehrsatlas (beta) ${region.name}`} />
      <Sentry.ErrorBoundary
        // TODO MIGRATION
        // onError={() => setResetConfig(true)}
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div>
              <ErrorRestartMap />
              {isDev && (
                <div className="mt-5 rounded bg-pink-300 p-1">
                  Do a reload intead. Changing the config breaks live reloading.
                  <br />
                  But our usecase is page (re)load, so that is fine.
                  <br />
                  See <code>PageRegionMap.tsx</code> for more.
                </div>
              )}
            </div>
          </div>
        }
      >
        {/* TODO MIGRATION */}
        {/* <MapInterface /> */}
      </Sentry.ErrorBoundary>
    </>
  )
}

const ShowRegionPage = () => {
  return (
    <LayoutMap>
      <Suspense fallback={<Spinner />}>
        <Region />
      </Suspense>
    </LayoutMap>
  )
}

ShowRegionPage.authenticate = false
export default ShowRegionPage
