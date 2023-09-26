import { Routes } from '@blitzjs/next'
import { usePaginatedQuery } from '@blitzjs/rpc'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { Spinner } from 'src/core/components/Spinner/Spinner'
import { Layout } from 'src/core/layouts/Layout'
import { isDev, isStaging } from 'src/core/utils'
import { PageRegionsRegionList } from 'src/regions/components/PageRegions/PageRegionsRegionList'
import getPublicRegions from 'src/regions/queries/getPublicRegions'
import { isAdmin } from 'src/users/components/utils'

export const RegionsList = () => {
  const router = useRouter()
  const [regions] = usePaginatedQuery(getPublicRegions, {})

  const { currentUser } = { currentUser: undefined } // TODO useUserStore()

  // TODO MIGRATION: This part can be solved better in Blitz, now…
  if (router.query.regionPathNotFound) {
    return (
      <Layout>
        <p>
          <code>{router.query.regionPathNotFound}</code> konnte nicht gefunden werden.
        </p>
      </Layout>
    )
  }

  // TODO MIGRATION: Re add list of unpublished Regions based on permissions
  const unPublishedRegions = regions?.filter((r) => !r.published)
  const showUnpublishedRegions =
    unPublishedRegions?.length && ((currentUser && isAdmin(currentUser)) || isDev || isStaging)

  return (
    <>
      {/* <PageregionsRegionIntro regions={regions} /> */}
      <PageRegionsRegionList regions={regions} />
      {Boolean(showUnpublishedRegions) && (
        <div className="mt-4 bg-pink-200 py-10">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h2 className="text-bold text-xl">Unpublished Regions </h2>
            <span className="text-xs">
              (Unsichtbar auf Production; Außer für Admins, die sehen es immer)
            </span>
          </div>
          <PageRegionsRegionList regions={unPublishedRegions} />
        </div>
      )}
    </>
  )
}

const RegionsPage = () => {
  return (
    <Layout>
      {/* TODO MIGRATEION: add title tag logi */}
      <Suspense fallback={<Spinner />}>
        <RegionsList />
      </Suspense>
      {/* TODO MIGRATION: Wrap into admin box, copy adminbox from TS to here */}
      <p className="bg-pink-100">
        <Link href={Routes.NewRegionPage()}>Create Region</Link>
      </p>
    </Layout>
  )
}

export default RegionsPage
